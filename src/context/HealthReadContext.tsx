import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getLocalHistory, getSyncQueue } from '../utils/syncQueue';
import type { SyncItem } from '../utils/syncQueue';

interface HealthReadContextProps {
  logs: SyncItem[];
  syncQueueLength: number;
  healthScore: number;
  todaySnapshot: {
    water: number;
    sleep: number;
    mood: string | null;
    temp: number | null;
    vitals: { bp: string; hr: number; spo2: number } | null;
  };
}

const HealthReadContext = createContext<HealthReadContextProps | undefined>(undefined);

export const HealthReadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SyncItem[]>([]);
  const [syncQueueLength, setSyncQueueLength] = useState(0);

  // Load local logs and refresh stats
  const refreshLocalState = useCallback(() => {
    const history = getLocalHistory();
    const queue = getSyncQueue();
    
    // Filter history for the current user
    if (user) {
      const userLogs = history.filter(item => item.user_id === user.id);
      setLogs(userLogs);
    } else {
      setLogs([]);
    }
    setSyncQueueLength(queue.length);
  }, [user]);

  useEffect(() => {
    refreshLocalState();

    // Listen to local log updates or sync status events
    window.addEventListener('arogya_local_update', refreshLocalState);
    window.addEventListener('arogya_sync_status', refreshLocalState);

    return () => {
      window.removeEventListener('arogya_local_update', refreshLocalState);
      window.removeEventListener('arogya_sync_status', refreshLocalState);
    };
  }, [refreshLocalState]);

  // Today's Date helpers in local string format
  const todayStr = useMemo(() => new Date().toDateString(), []);

  // Today's snapshot values
  const todaySnapshot = useMemo(() => {
    let water = 0;
    let sleep = 0;
    let mood: string | null = null;
    let temp: number | null = null;
    let vitals: { bp: string; hr: number; spo2: number } | null = null;

    logs.forEach(log => {
      const logDate = new Date(log.created_at).toDateString();
      if (logDate === todayStr) {
        if (log.type === 'water') {
          water += Number(log.value.glasses || 0);
        } else if (log.type === 'sleep') {
          sleep = Number(log.value.duration || 0);
        } else if (log.type === 'mood') {
          mood = String(log.value.mood || '');
        } else if (log.type === 'temperature') {
          temp = Number(log.value.temperature || 0);
        } else if (log.type === 'vitals') {
          vitals = {
            bp: `${log.value.systolic}/${log.value.diastolic}`,
            hr: Number(log.value.heartRate || 0),
            spo2: Number(log.value.spO2 || 0)
          };
        }
      }
    });

    return { water, sleep, mood, temp, vitals };
  }, [logs, todayStr]);

  // Calculate dynamic health score
  const healthScore = useMemo(() => {
    let score = 50; // Base score

    // 1. Water Intake (up to +15)
    // Goal is 8 glasses
    const waterGlasses = todaySnapshot.water;
    const waterScore = Math.min((waterGlasses / 8) * 15, 15);
    score += waterScore;

    // 2. Sleep Log (up to +20)
    // Look at last sleep entry
    const lastSleep = logs.find(l => l.type === 'sleep');
    if (lastSleep) {
      const hrs = Number(lastSleep.value.duration || 0);
      const quality = Number(lastSleep.value.quality || 0);
      // Sleep hours score (max +10)
      if (hrs >= 7 && hrs <= 9) score += 10;
      else if (hrs >= 6 || hrs <= 10) score += 5;

      // Quality score (max +10)
      score += Math.min((quality / 5) * 10, 10);
    } else {
      score += 10; // Default average sleep contribution if no logs yet
    }

    // 3. Stress Log (up to +15)
    // Look at last stress check
    const lastStress = logs.find(l => l.type === 'stress');
    if (lastStress) {
      const pssScore = Number(lastStress.value.score || 0);
      if (pssScore < 14) score += 15; // Low stress
      else if (pssScore <= 26) score += 8; // Moderate stress
      // High stress gets +0
    } else {
      score += 10; // Default average stress contribution if no logs yet
    }

    // 4. Body Temperature Penalty
    const lastTemp = logs.find(l => l.type === 'temperature');
    if (lastTemp) {
      const t = Number(lastTemp.value.temperature || 36.8);
      if (t > 38.5) {
        score -= 20; // High Fever penalty
      } else if (t >= 37.5) {
        score -= 10; // Low grade Fever penalty
      }
    }

    // 5. Exercise Log (up to +10)
    const exerciseLoggedToday = logs.some(l => l.type === 'exercise' && new Date(l.created_at).toDateString() === todayStr);
    if (exerciseLoggedToday) {
      score += 10;
    }

    // Clip score between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [logs, todaySnapshot, todayStr]);

  const value = useMemo(() => ({
    logs,
    syncQueueLength,
    healthScore,
    todaySnapshot
  }), [logs, syncQueueLength, healthScore, todaySnapshot]);

  return (
    <HealthReadContext.Provider value={value}>
      {children}
    </HealthReadContext.Provider>
  );
};

export const useHealthRead = () => {
  const context = useContext(HealthReadContext);
  if (!context) {
    throw new Error('useHealthRead must be used within a HealthReadProvider');
  }
  return context;
};
