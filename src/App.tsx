import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import TechniquesPage from "./pages/TechniquesPage";
import ArchitecturesPage from "./pages/ArchitecturesPage";
import ChallengesPage from "./pages/ChallengesPage";
import DatasetsPage from "./pages/DatasetsPage";
import ResultsPage from "./pages/ResultsPage";
import FutureScopePage from "./pages/FutureScopePage";
import ReferencesPage from "./pages/ReferencesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* All pages that share the Navbar live inside Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/techniques" element={<TechniquesPage />} />
            <Route path="/architectures" element={<ArchitecturesPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/datasets" element={<DatasetsPage />} />
            <Route path="/dashboard" element={<ResultsPage />} />
            <Route path="/future-scope" element={<FutureScopePage />} />
            <Route path="/references" element={<ReferencesPage />} />
          </Route>
          {/* 404 — no layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
