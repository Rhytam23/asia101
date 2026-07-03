import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MissionControl from './pages/MissionControl';
import LiveOperations from './pages/LiveOperations';
import SmartMap from './pages/SmartMap';
import AIDecisionEngine from './pages/AIDecisionEngine';
import HistoricalReplay from './pages/HistoricalReplay';
import ImpactAnalytics from './pages/ImpactAnalytics';
import Architecture from './pages/Architecture';
import Documentation from './pages/Documentation';
import RoleDashboards from './pages/RoleDashboards';
import Layout from './layouts/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DemoModeProvider } from './context/DemoModeContext';
import DemoModeSelector from './components/DemoModeSelector';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <ErrorBoundary>
        <DemoModeProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/mission-control" element={<Layout><MissionControl /></Layout>} />
            <Route path="/live-ops" element={<Layout><LiveOperations /></Layout>} />
            <Route path="/gis-map" element={<Layout><SmartMap /></Layout>} />
            <Route path="/ai-engine" element={<Layout><AIDecisionEngine /></Layout>} />
            <Route path="/historical" element={<Layout><HistoricalReplay /></Layout>} />
            <Route path="/analytics" element={<Layout><ImpactAnalytics /></Layout>} />
            <Route path="/architecture" element={<Layout><Architecture /></Layout>} />
            <Route path="/docs" element={<Layout><Documentation /></Layout>} />
            
            {/* Unified Role Dashboards - switch without reload */}
            <Route path="/dashboards" element={<Layout><RoleDashboards /></Layout>} />
            <Route path="/dashboards/farmer" element={<Layout><RoleDashboards /></Layout>} />
            <Route path="/dashboards/cooperative" element={<Layout><RoleDashboards /></Layout>} />
            <Route path="/dashboards/government" element={<Layout><RoleDashboards /></Layout>} />
            <Route path="/dashboards/researcher" element={<Layout><RoleDashboards /></Layout>} />
          </Routes>
          
          {/* Global Demo Mode UI - non-intrusive, always available for presentations */}
          <DemoModeSelector />
        </DemoModeProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
