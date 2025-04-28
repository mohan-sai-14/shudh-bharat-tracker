import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PollutionMap from "./pages/PollutionMap";
import ReportPollution from "./pages/ReportPollution";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/Leaderboard";
import Trends from "./pages/Trends";
import News from "./pages/News";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { PollutionProvider } from "./contexts/PollutionContext";
import Community from "./pages/Community"; // Import the Community page component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PollutionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="map" element={<PollutionMap />} />
                <Route path="report" element={<ReportPollution />} />
                <Route path="community" element={<Community />} /> {/* Added Community route */}
                <Route path="challenges" element={<Challenges />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="trends" element={<Trends />} />
                <Route path="news" element={<News />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </PollutionProvider>
  </QueryClientProvider>
);

export default App;