
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Accounting from "./pages/Accounting";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import CRM from "./pages/CRM";
import Whiteboard from "./pages/Whiteboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/app/dashboard" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/app/projects" element={
            <MainLayout>
              <Projects />
            </MainLayout>
          } />
          <Route path="/app/projects/:id" element={
            <MainLayout>
              <ProjectDetail />
            </MainLayout>
          } />
          <Route path="/app/accounting" element={
            <MainLayout>
              <Accounting />
            </MainLayout>
          } />
          <Route path="/app/accounting/chart-of-accounts" element={
            <MainLayout>
              <ChartOfAccounts />
            </MainLayout>
          } />
          <Route path="/app/crm" element={
            <MainLayout>
              <CRM />
            </MainLayout>
          } />
          <Route path="/app/whiteboard" element={
            <MainLayout>
              <Whiteboard />
            </MainLayout>
          } />
          <Route path="/app/settings" element={
            <MainLayout>
              <Settings />
            </MainLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
