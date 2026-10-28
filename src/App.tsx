import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import LandingPage from './pages/LandingPage';
const SignUp = lazy(() => import('./pages/SignUp'));
const Profile = lazy(() => import('./pages/Profile'));
const MissionControl = lazy(() => import('./pages/MissionControl'));
const LiveOperations = lazy(() => import('./pages/LiveOperations'));
const SmartMap = lazy(() => import('./pages/SmartMap'));
const AIDecisionEngine = lazy(() => import('./pages/AIDecisionEngine'));
const HistoricalReplay = lazy(() => import('./pages/HistoricalReplay'));
const ImpactAnalytics = lazy(() => import('./pages/ImpactAnalytics'));
const MarketIntelligence = lazy(() => import('./pages/MarketIntelligence'));
const RoleDashboards = lazy(() => import('./pages/RoleDashboards'));
import Layout from './layouts/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DemoModeProvider } from './context/DemoModeContext';
import DemoModeSelector from './components/DemoModeSelector';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-emerald-700">
        <div className="animate-spin w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full" />
        <span className="text-sm font-medium">Loading…</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <ErrorBoundary>
        <AuthProvider>
          <DemoModeProvider>
            <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected Routes for All Authenticated Users */}
              <Route path="/mission-control" element={
                <ProtectedRoute>
                  <Layout><MissionControl /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/live-ops" element={
                <ProtectedRoute>
                  <Layout><LiveOperations /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/ai-engine" element={
                <ProtectedRoute>
                  <Layout><AIDecisionEngine /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/market-intelligence" element={
                <ProtectedRoute>
                  <Layout><MarketIntelligence /></Layout>
                </ProtectedRoute>
              } />

              {/* Protected Routes (Hidden from Farmers) */}
              <Route path="/gis-map" element={
                <ProtectedRoute allowedRoles={['Cooperative', 'Government', 'Research']}>
                  <Layout><SmartMap /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/historical" element={
                <ProtectedRoute allowedRoles={['Cooperative', 'Government', 'Research']}>
                  <Layout><HistoricalReplay /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute allowedRoles={['Cooperative', 'Government', 'Research']}>
                  <Layout><ImpactAnalytics /></Layout>
                </ProtectedRoute>
              } />
              
              {/* Legacy Dashboards / Catch-all */}
              <Route path="/dashboards/*" element={
                <ProtectedRoute>
                  <Layout><RoleDashboards /></Layout>
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Suspense>
            
            {/* Global Demo Mode UI */}
            <DemoModeSelector />
          </DemoModeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
