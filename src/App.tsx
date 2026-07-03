import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import MissionControl from './pages/MissionControl';
import LiveOperations from './pages/LiveOperations';
import SmartMap from './pages/SmartMap';
import AIDecisionEngine from './pages/AIDecisionEngine';
import HistoricalReplay from './pages/HistoricalReplay';
import ImpactAnalytics from './pages/ImpactAnalytics';
import RoleDashboards from './pages/RoleDashboards';
import Layout from './layouts/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DemoModeProvider } from './context/DemoModeContext';
import DemoModeSelector from './components/DemoModeSelector';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <ErrorBoundary>
        <AuthProvider>
          <DemoModeProvider>
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
            
            {/* Global Demo Mode UI */}
            <DemoModeSelector />
          </DemoModeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
