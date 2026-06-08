import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { enqueueLog, triggerSync } from '../utils/syncQueue';

interface HealthDispatchContextProps {
  logWater: (glasses: number) => void;
  logSleep: (duration: number, quality: number) => void;
  logMood: (mood: string, notes?: string) => void;
  logTemperature: (temperature: number) => void;
  logVitals: (vitals: { systolic: number; diastolic: number; heartRate: number; spO2: number; weight?: number }) => void;
  logStress: (score: number, answers: number[]) => void;
  logSymptom: (symptoms: string[], triageResult: any) => void;
  logMedicine: (medicine: { title: string; dosage: string; frequency: string; time: string }) => void;
  logExercise: (exercise: { routine: string; duration: number }) => void;
  logVaccine: (vaccineId: string, checked: boolean) => void;
  logDiet: (weight: number, height: number, bmi: number) => void;
  logPrediction: (predictorId: string, inputs: any, result: any) => void;
  logScan: (scanType: string, localLabel: string, localScore: number, result: any) => void;
  triggerManualSync: () => Promise<boolean>;
}

const HealthDispatchContext = createContext<HealthDispatchContextProps | undefined>(undefined);

export const HealthDispatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const logWater = useCallback((glasses: number) => {
    if (!user) return;
    enqueueLog('water', { glasses }, user.id);
  }, [user]);

  const logSleep = useCallback((duration: number, quality: number) => {
    if (!user) return;
    enqueueLog('sleep', { duration, quality }, user.id);
  }, [user]);

  const logMood = useCallback((mood: string, notes?: string) => {
    if (!user) return;
    enqueueLog('mood', { mood, notes: notes || '' }, user.id);
  }, [user]);

  const logTemperature = useCallback((temperature: number) => {
    if (!user) return;
    enqueueLog('temperature', { temperature }, user.id);
  }, [user]);

  const logVitals = useCallback((vitals: { systolic: number; diastolic: number; heartRate: number; spO2: number; weight?: number }) => {
    if (!user) return;
    enqueueLog('vitals', vitals, user.id);
  }, [user]);

  const logStress = useCallback((score: number, answers: number[]) => {
    if (!user) return;
    enqueueLog('stress', { score, answers }, user.id);
  }, [user]);

  const logSymptom = useCallback((symptoms: string[], triageResult: any) => {
    if (!user) return;
    enqueueLog('symptom', { symptoms, triageResult }, user.id);
  }, [user]);

  const logMedicine = useCallback((medicine: { title: string; dosage: string; frequency: string; time: string }) => {
    if (!user) return;
    enqueueLog('medicine', medicine, user.id);
  }, [user]);

  const logExercise = useCallback((exercise: { routine: string; duration: number }) => {
    if (!user) return;
    enqueueLog('exercise', exercise, user.id);
  }, [user]);

  const logVaccine = useCallback((vaccineId: string, checked: boolean) => {
    if (!user) return;
    enqueueLog('vaccine', { vaccineId, checked }, user.id);
  }, [user]);

  const logDiet = useCallback((weight: number, height: number, bmi: number) => {
    if (!user) return;
    enqueueLog('diet', { weight, height, bmi }, user.id);
  }, [user]);

  const logPrediction = useCallback((predictorId: string, inputs: any, result: any) => {
    if (!user) return;
    enqueueLog('prediction', { predictorId, inputs, result }, user.id);
  }, [user]);

  const logScan = useCallback((scanType: string, localLabel: string, localScore: number, result: any) => {
    if (!user) return;
    enqueueLog('scan', { scanType, localLabel, localScore, result }, user.id);
  }, [user]);

  const triggerManualSync = useCallback(async () => {
    return await triggerSync();
  }, []);

  const value = useMemo(() => ({
    logWater,
    logSleep,
    logMood,
    logTemperature,
    logVitals,
    logStress,
    logSymptom,
    logMedicine,
    logExercise,
    logVaccine,
    logDiet,
    logPrediction,
    logScan,
    triggerManualSync
  }), [
    logWater,
    logSleep,
    logMood,
    logTemperature,
    logVitals,
    logStress,
    logSymptom,
    logMedicine,
    logExercise,
    logVaccine,
    logDiet,
    logPrediction,
    logScan,
    triggerManualSync
  ]);

  return (
    <HealthDispatchContext.Provider value={value}>
      {children}
    </HealthDispatchContext.Provider>
  );
};

export const useHealthDispatch = () => {
  const context = useContext(HealthDispatchContext);
  if (!context) {
    throw new Error('useHealthDispatch must be used within a HealthDispatchProvider');
  }
  return context;
};
