import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { HealthReadProvider } from './context/HealthReadContext';
import { HealthDispatchProvider } from './context/HealthDispatchContext';
import { FamilyProvider } from './context/FamilyContext';

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

// CNN Scan & OCR Routes
const ScanPage = lazy(() => import('./pages/scan/ScanPage'));
const PrescriptionScanner = lazy(() => import('./pages/scan/PrescriptionScanner'));

// AI Medical Assistant & RAG Chat
const HealthChat = lazy(() => import('./pages/chat/HealthChat'));
import FloatingChatButton from './components/chat/FloatingChatButton';

// Doctor System
const DoctorRegister = lazy(() => import('./pages/auth/DoctorRegister'));
const DoctorLogin = lazy(() => import('./pages/auth/DoctorLogin'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DoctorDirectory = lazy(() => import('./pages/doctors/DoctorDirectory'));
const DoctorProfile = lazy(() => import('./pages/doctors/DoctorProfile'));
const BookAppointment = lazy(() => import('./pages/doctors/BookAppointment'));
const TicketStatus = lazy(() => import('./pages/doctors/TicketStatus'));
const BookingHistory = lazy(() => import('./pages/doctors/BookingHistory'));
const ReviewForm = lazy(() => import('./pages/doctors/ReviewForm'));
const DoctorDashboard = lazy(() => import('./pages/doctor-dashboard/DoctorDashboard'));
const QRScanner = lazy(() => import('./pages/doctor-dashboard/QRScanner'));

// Setup react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// Protected Route wrapper component — redirects to /login if not authenticated
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

// Browsable Route wrapper — renders DashboardLayout for ALL users (guests included)
// Auth is enforced at the action level (form submit, etc.) not at the route level.
const BrowsableRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();

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
                <FamilyProvider>
                <BrowserRouter>
                  <Suspense fallback={<div className="p-8 text-center text-primary font-bold">Initializing Router...</div>}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />

                      {/* Doctor & Admin public routes */}
                      <Route path="/doctor-register" element={<Suspense fallback={<PageSkeleton />}><DoctorRegister /></Suspense>} />
                      <Route path="/doctor-login" element={<Suspense fallback={<PageSkeleton />}><DoctorLogin /></Suspense>} />
                      <Route path="/admin-login" element={<Suspense fallback={<PageSkeleton />}><AdminLogin /></Suspense>} />

                      {/* Admin dashboard (standalone, no sidebar) */}
                      <Route path="/admin" element={<Suspense fallback={<PageSkeleton />}><AdminDashboard /></Suspense>} />

                      {/* Doctor dashboard (standalone, no sidebar) */}
                      <Route path="/doctor-dashboard" element={<Suspense fallback={<PageSkeleton />}><DoctorDashboard /></Suspense>} />
                      <Route path="/doctor-scanner" element={<Suspense fallback={<PageSkeleton />}><QRScanner /></Suspense>} />

                      {/* Browsable routes — guests can view these pages */}
                      <Route path="/dashboard" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><Dashboard /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />

                      {/* Trackers Hub & Individual pages */}
                      <Route path="/trackers" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><TrackersHub /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/symptom" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><SymptomChecker /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/stress" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><StressChecker /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/sleep" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><SleepTracker /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/mood" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><MoodJournal /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/water" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><WaterTracker /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/medicine" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><MedicineReminder /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/temperature" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><BodyTemperature /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/vitals" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><MorningCheckIn /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/breathing" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><BreathingExercise /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/diet" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><DietSuggestion /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/exercise" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><ExercisePage /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/firstaid" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><FirstAidGuide /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/trackers/vaccine" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><VaccinationTracker /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />

                      {/* Predictors Hub & Pages */}
                      <Route path="/predictors" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><PredictorsHub /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/predictors/diabetes" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><DiabetesPredictor /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/predictors/heart-attack" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><HeartAttackPredictor /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/predictors/ecg" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><ECGAnalysis /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/predictors/cancer" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><CancerScreener /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/predictors/kidney" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><KidneyHealth /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/predictors/liver" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><LiverHealth /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/predictors/anemia" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><AnemiaChecker /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/predictors/thyroid" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><ThyroidAssessment /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      
                      {/* 10 Generic Predictors routed dynamically */}
                      <Route path="/predictors/generic/:predictorId" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><GenericPredictor /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />

                      {/* Doctor Directory & Profile — browsable by guests */}
                      <Route path="/doctors" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><DoctorDirectory /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/doctors/:doctorId" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><DoctorProfile /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/doctors/:doctorId/book" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><BookAppointment /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/doctors/:doctorId/review/:appointmentId" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><ReviewForm /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/ticket/:ticketId" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><TicketStatus /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />
                      <Route path="/booking-history" element={
                        <ProtectedRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><BookingHistory /></Suspense></RouteErrorBoundary>
                        </ProtectedRoute>
                      } />

                      {/* On-device ML Scans & OCR — browsable */}
                      <Route path="/scan" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><ScanPage /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />
                      <Route path="/scan/prescription" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><PrescriptionScanner /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
                      } />

                      {/* AI Multilingual Health Assistant & Chatbot */}
                      <Route path="/chat" element={
                        <BrowsableRoute>
                          <RouteErrorBoundary><Suspense fallback={<PageSkeleton />}><HealthChat /></Suspense></RouteErrorBoundary>
                        </BrowsableRoute>
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
                  <FloatingChatButton />
                </BrowserRouter>
                </FamilyProvider>
              </HealthDispatchProvider>
            </HealthReadProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
