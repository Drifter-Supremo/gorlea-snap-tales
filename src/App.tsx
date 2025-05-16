
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import MainPage from "./pages/MainPage";
import StoryPage from "./pages/StoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || 
                    location.pathname === '/login' || 
                    location.pathname === '/signup' ||
                    location.pathname === '/reset-password';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className={`flex-1 ${!isAuthPage ? 'pt-16' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage initialView="login" />} />
          <Route path="/signup" element={<AuthPage initialView="signup" />} />
          <Route path="/reset-password" element={<AuthPage initialView="reset" />} />

          {/* Public story view route */}
          <Route path="/story/public/:id" element={<StoryPage isPublicView={true} />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<MainPage />} />
            <Route path="/story/:id" element={<StoryPage isPublicView={false} />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
