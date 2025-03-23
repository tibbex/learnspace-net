
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthContext";
import Navigation from "@/components/Navigation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import VideosPage from "./pages/VideosPage";
import MessagesPage from "./pages/MessagesPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import CreatePost from "./pages/CreatePost";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/"
              element={
                <>
                  <Navigation />
                  <HomePage />
                </>
              }
            />
            <Route
              path="/home"
              element={
                <>
                  <Navigation />
                  <HomePage />
                </>
              }
            />
            <Route
              path="/videos"
              element={
                <>
                  <Navigation />
                  <VideosPage />
                </>
              }
            />
            <Route
              path="/messages"
              element={
                <>
                  <Navigation />
                  <MessagesPage />
                </>
              }
            />
            <Route
              path="/resources"
              element={
                <>
                  <Navigation />
                  <ResourcesPage />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Navigation />
                  <ProfilePage />
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <Navigation />
                  <SettingsPage />
                </>
              }
            />
            <Route
              path="/create-post"
              element={
                <>
                  <Navigation />
                  <CreatePost />
                </>
              }
            />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
