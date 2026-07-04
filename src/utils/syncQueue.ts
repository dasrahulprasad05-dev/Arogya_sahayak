import { supabase } from '../integrations/supabase/client';

export interface SyncItem {
  id: string;
  type: string;
  value: any;
  /** When the event actually happened (client timestamp, preserved across offline) */
  logged_at: string;
  /** When the item was created/enqueued (always set) */
  created_at: string;
  user_id: string;
}

const QUEUE_KEY = 'arogya_sync_queue';
const LOCAL_HISTORY_KEY = 'arogya_local_history';

// --- Backoff state ---
let currentBackoffMs = 0;
const BACKOFF_BASE = 1000;     // 1 second
const BACKOFF_MAX = 60_000;    // 60 seconds cap
let backoffTimer: ReturnType<typeof setTimeout> | null = null;
let syncInProgress = false;

// Get items currently in sync queue
export function getSyncQueue(): SyncItem[] {
  try {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (e) {
    console.error('Error reading sync queue', e);
    return [];
  }
}

// Get local history logs
export function getLocalHistory(): SyncItem[] {
  try {
    const history = localStorage.getItem(LOCAL_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error('Error reading local history', e);
    return [];
  }
}

// Save local history logs
export function saveLocalHistory(history: SyncItem[]) {
  try {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving local history', e);
  }
}

// Add item to queue and history
export function enqueueLog(type: string, value: any, userId: string) {
  const now = new Date().toISOString();
  const item: SyncItem = {
    id: crypto.randomUUID(),
    type,
    value,
    logged_at: now,      // when the event actually happened
    created_at: now,     // backward compat for local history consumers
    user_id: userId
  };

  // 1. Save to local history
  const history = getLocalHistory();
  history.unshift(item); // Newest first
  saveLocalHistory(history);

  // 2. Add to sync queue if it's not a temporary/bypass user
  if (userId !== '00000000-0000-0000-0000-000000000000') {
    const queue = getSyncQueue();
    queue.push(item);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    
    // 3. Attempt sync immediately
    triggerSync();
  }
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event('arogya_local_update'));
}

// Reset backoff on success
function resetBackoff() {
  currentBackoffMs = 0;
  if (backoffTimer) {
    clearTimeout(backoffTimer);
    backoffTimer = null;
  }
}

// Increase backoff on failure (exponential: 1s → 2s → 4s → 8s → 16s → 32s → 60s cap)
function increaseBackoff() {
  if (currentBackoffMs === 0) {
    currentBackoffMs = BACKOFF_BASE;
  } else {
    currentBackoffMs = Math.min(currentBackoffMs * 2, BACKOFF_MAX);
  }
  console.log(`Sync backoff: retrying in ${currentBackoffMs / 1000}s`);
  
  // Schedule retry
  if (backoffTimer) clearTimeout(backoffTimer);
  backoffTimer = setTimeout(() => {
    triggerSync();
  }, currentBackoffMs);
}

// Process the sync queue with idempotency + per-item isolation
export async function triggerSync(): Promise<boolean> {
  if (!navigator.onLine) {
    console.log('App is offline. Sync deferred.');
    return false;
  }

  // Prevent concurrent sync
  if (syncInProgress) return false;
  syncInProgress = true;

  const queue = getSyncQueue();
  if (queue.length === 0) {
    syncInProgress = false;
    return true;
  }

  console.log(`Attempting to sync ${queue.length} logs to Supabase...`);

  try {
    // 🔒 IDEMPOTENT: Use upsert with client-generated UUID as conflict key
    // If insert succeeded but response was lost, re-sending won't create duplicates
    const { error } = await supabase
      .from('health_logs')
      .upsert(
        queue.map(item => ({
          id: item.id,
          user_id: item.user_id,
          type: item.type,
          value: item.value,
          logged_at: item.logged_at || item.created_at  // backward compat
        })),
        { onConflict: 'id', ignoreDuplicates: true }
      );

    if (error) {
      // If table doesn't exist or structural DB error
      if (error.code === '42P01') {
        console.warn('health_logs table does not exist in Supabase database. Please create it.');
        // Clear queue to prevent loop blockages in frontend dev mode
        localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
        window.dispatchEvent(new Event('arogya_sync_status'));
        syncInProgress = false;
        return true;
      }

      // Check constraint violation — isolate bad items
      if (error.code === '23514') {
        console.warn('Some items failed CHECK constraint. Attempting per-item sync...');
        await syncPerItem(queue);
        syncInProgress = false;
        return true;
      }

      console.warn('Supabase sync error:', error.message);
      increaseBackoff();
      syncInProgress = false;
      return false;
    }

    // Success! Empty the queue and reset backoff
    localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
    resetBackoff();
    console.log('Sync completed successfully.');
    window.dispatchEvent(new Event('arogya_sync_status'));
    syncInProgress = false;
    return true;
  } catch (err) {
    console.error('Failed to run database sync', err);
    increaseBackoff();
    syncInProgress = false;
    return false;
  }
}

// Per-item sync fallback — one bad item shouldn't block the whole batch
async function syncPerItem(queue: SyncItem[]) {
  const failedItems: SyncItem[] = [];

  for (const item of queue) {
    try {
      const { error } = await supabase
        .from('health_logs')
        .upsert(
          {
            id: item.id,
            user_id: item.user_id,
            type: item.type,
            value: item.value,
            logged_at: item.logged_at || item.created_at
          },
          { onConflict: 'id', ignoreDuplicates: true }
        );

      if (error) {
        console.warn(`Failed to sync item ${item.id} (type: ${item.type}):`, error.message);
        failedItems.push(item);
      }
    } catch (err) {
      console.error(`Error syncing item ${item.id}:`, err);
      failedItems.push(item);
    }
  }

  // Keep only failed items in queue
  localStorage.setItem(QUEUE_KEY, JSON.stringify(failedItems));
  
  const synced = queue.length - failedItems.length;
  if (synced > 0) {
    console.log(`Per-item sync: ${synced}/${queue.length} synced, ${failedItems.length} failed.`);
  }
  
  window.dispatchEvent(new Event('arogya_sync_status'));
}

// Register global event listeners
if (typeof window !== 'undefined') {
  // Retry sync when coming back online
  window.addEventListener('online', () => {
    resetBackoff();
    triggerSync();
  });

  // Retry sync when tab becomes visible (handles WiFi-without-internet cases)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      const queue = getSyncQueue();
      if (queue.length > 0) {
        triggerSync();
      }
    }
  });

  // Periodic retry every 5 minutes if queue is non-empty
  setInterval(() => {
    const queue = getSyncQueue();
    if (queue.length > 0 && navigator.onLine) {
      triggerSync();
    }
  }, 5 * 60 * 1000);
}
