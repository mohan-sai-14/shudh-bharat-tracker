import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Map from '@/pages/Map';
import ReportPollution from '@/pages/ReportPollution';
import Leaderboard from '@/pages/Leaderboard';
import Community from '@/pages/Community';
import Trends from '@/pages/Trends';
import News from '@/pages/News';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { PollutionProvider } from '@/contexts/PollutionContext';
import "@/styles/leaflet.css";

function App() {
  return (
    <StrictMode>
      <PollutionProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/map" element={<Map />} />
              <Route path="/report" element={<ReportPollution />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/community" element={<Community />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/news" element={<News />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      </PollutionProvider>
    </StrictMode>
  );
}

export default App;
