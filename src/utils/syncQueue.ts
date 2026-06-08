import { supabase } from '../integrations/supabase/client';

export interface SyncItem {
  id: string;
  type: string;
  value: any;
  created_at: string;
  user_id: string;
}

const QUEUE_KEY = 'arogya_sync_queue';
const LOCAL_HISTORY_KEY = 'arogya_local_history';

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
  const item: SyncItem = {
    id: crypto.randomUUID(),
    type,
    value,
    created_at: new Date().toISOString(),
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

// Process the sync queue
export async function triggerSync(): Promise<boolean> {
  if (!navigator.onLine) {
    console.log('App is offline. Sync deferred.');
    return false;
  }

  const queue = getSyncQueue();
  if (queue.length === 0) return true;

  console.log(`Attempting to sync ${queue.length} logs to Supabase...`);

  try {
    // Sync items to supabase table `health_logs`
    const { error } = await supabase
      .from('health_logs')
      .insert(
        queue.map(item => ({
          id: item.id,
          user_id: item.user_id,
          type: item.type,
          value: item.value,
          created_at: item.created_at
        }))
      );

    if (error) {
      // If table doesn't exist or RLS issue, log it but let's not fail client state
      console.warn('Supabase sync error, check tables/permissions:', error.message);
      // If it's a structural DB error, we don't want to block user experience,
      // but if it's a network/auth error, we retry.
      if (error.code === '42P01') {
        // Table doesn't exist yet, we'll keep in queue or let it slide
        console.warn('health_logs table does not exist in Supabase database. Please create it.');
        // We will clear the queue to prevent loop blockages in frontend dev mode
        localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
        window.dispatchEvent(new Event('arogya_sync_status'));
        return true;
      }
      return false;
    }

    // Success! Empty the queue
    localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
    console.log('Sync completed successfully.');
    window.dispatchEvent(new Event('arogya_sync_status'));
    return true;
  } catch (err) {
    console.error('Failed to run database sync', err);
    return false;
  }
}

// Register global connection event listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    triggerSync();
  });
}
