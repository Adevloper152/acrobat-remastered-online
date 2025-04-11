
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Editor from "./pages/Editor";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Set up cookies consent logic
const setupCookieConsent = () => {
  // Check if user has already consented
  const hasConsented = document.cookie.split(';').some((cookie) => 
    cookie.trim().startsWith('cookie_consent=')
  );
  
  if (!hasConsented) {
    // Set a default cookie for essential functionality
    document.cookie = "cookie_consent=essential; max-age=31536000; path=/";
  }
};

const App = () => {
  useEffect(() => {
    // Update document title
    document.title = "PDF-Edit - Professional PDF Editor";
    
    // Set up cookie consent
    setupCookieConsent();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route 
                path="/editor" 
                element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
