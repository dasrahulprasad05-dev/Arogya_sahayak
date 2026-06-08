import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { HealthReadProvider } from './context/HealthReadContext';
import { HealthDispatchProvider } from './context/HealthDispatchContext';

// Error Boundary & Layout
import RouteErrorBoundary from './components/layout/RouteErrorBoundary';
import DashboardLayout from './components/layout/DashboardLayout';

// React.lazy imports for all routes
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const HealthHistory = lazy(() => import('./pages/HealthHistory'));
const WeeklyReport = lazy(() => import('./pages/WeeklyReport'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Wellness Trackers
const TrackersHub = lazy(() => import('./pages/trackers/TrackersHub'));
const SymptomChecker = lazy(() => import('./pages/trackers/SymptomChecker'));
const StressChecker = lazy(() => import('./pages/trackers/StressChecker'));
const SleepTracker = lazy(() => import('./pages/trackers/SleepTracker'));
const MoodJournal = lazy(() => import('./pages/trackers/MoodJournal'));
const WaterTracker = lazy(() => import('./pages/trackers/WaterTracker'));
const MedicineReminder = lazy(() => import('./pages/trackers/MedicineReminder'));
const BodyTemperature = lazy(() => import('./pages/trackers/BodyTemperature'));
const MorningCheckIn = lazy(() => import('./pages/trackers/MorningCheckIn'));
const BreathingExercise = lazy(() => import('./pages/trackers/BreathingExercise'));
const DietSuggestion = lazy(() => import('./pages/trackers/DietSuggestion'));
const ExercisePage = lazy(() => import('./pages/trackers/ExercisePage'));
const FirstAidGuide = lazy(() => import('./pages/trackers/FirstAidGuide'));
const VaccinationTracker = lazy(() => import('./pages/trackers/VaccinationTracker'));

// AI Predictors
const PredictorsHub = lazy(() => import('./pages/predictors/PredictorsHub'));
const DiabetesPredictor = lazy(() => import('./pages/predictors/DiabetesPredictor'));
const HeartAttackPredictor = lazy(() => import('./pages/predictors/HeartAttackPredictor'));
const ECGAnalysis = lazy(() => import('./pages/predictors/ECGAnalysis'));
const CancerScreener = lazy(() => import('./pages/predictors/CancerScreener'));
const KidneyHealth = lazy(() => import('./pages/predictors/KidneyHealth'));
const LiverHealth = lazy(() => import('./pages/predictors/LiverHealth'));
const AnemiaChecker = lazy(() => import('./pages/predictors/AnemiaChecker'));
const ThyroidAssessment = lazy(() => import('./pages/predictors/ThyroidAssessment'));
const GenericPredictor = lazy(() => import('./pages/predictors/GenericPredictor'));

// CNN Scan Route
const ScanPage = lazy(() => import('./pages/scan/ScanPage'));

// Setup react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary font-heading font-bold text-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Health Companion...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

// Skeleton Loader fallback for routing
const PageSkeleton: React.FC = () => (
  <div className="w-full space-y-6 animate-pulse p-4">
    <div className="h-10 bg-muted rounded-xl w-1/3"></div>
    <div className="h-4 bg-muted rounded-lg w-1/2"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-48 bg-muted rounded-2xl"></div>
      <div className="h-48 bg-muted rounded-2xl"></div>
      <div className="h-48 bg-muted rounded-2xl"></div>
    </div>
    <div className="h-96 bg-muted rounded-2xl"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <HealthReadProvider>
              <HealthDispatchProvider>
                <BrowserRouter>
                  <Suspense fallback={<div className="p-8 text-center text-primary font-bold">Initializing Router...</div>}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />

                      {/* Protected routes */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><Dashboard /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />

                      {/* Trackers Hub & Individual pages */}
                      <Route path="/trackers" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><TrackersHub /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/symptom" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><SymptomChecker /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/stress" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><StressChecker /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/sleep" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><SleepTracker /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/mood" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><MoodJournal /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/water" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><WaterTracker /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/medicine" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><MedicineReminder /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/temperature" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><BodyTemperature /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/vitals" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><MorningCheckIn /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/breathing" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><BreathingExercise /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/diet" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><DietSuggestion /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/exercise" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><ExercisePage /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/firstaid" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><FirstAidGuide /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/trackers/vaccine" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><VaccinationTracker /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />

                      {/* Predictors Hub & Pages */}
                      <Route path="/predictors" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><PredictorsHub /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/predictors/diabetes" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><DiabetesPredictor /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/predictors/heart-attack" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><HeartAttackPredictor /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/predictors/ecg" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><ECGAnalysis /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/predictors/cancer" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><CancerScreener /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/predictors/kidney" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><KidneyHealth /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/predictors/liver" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><LiverHealth /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/predictors/anemia" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><AnemiaChecker /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/predictors/thyroid" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><ThyroidAssessment /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      
                      {/* 10 Generic Predictors routed dynamically */}
                      <Route path="/predictors/generic/:predictorId" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><GenericPredictor /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />

                      {/* On-device ML Scans */}
                      <Route path="/scan" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><ScanPage /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />

                      {/* Shell views */}
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><ProfilePage /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/history" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><HealthHistory /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/report" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><WeeklyReport /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />

                      {/* Catch-all 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </HealthDispatchProvider>
            </HealthReadProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
