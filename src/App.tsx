import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CitizenDashboard from "./pages/CitizenDashboard";
import CollectorDashboard from "./pages/CollectorDashboard";
import NGODashboard from "./pages/NGODashboard";
import BookPickup from "./pages/BookPickup";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import EcoScore from "./pages/EcoScore";
import CollectorRequests from "./pages/CollectorRequests";
import CollectorRoute from "./pages/CollectorRoute";
import CollectorEarnings from "./pages/CollectorEarnings";
import NGOSponsor from "./pages/NGOSponsor";
import NGOImpact from "./pages/NGOImpact";
import TrashGenerator from "./pages/TrashGenerator";
import NGOBusiness from "./pages/NGOBusiness";
import DIYMarketplace from "./pages/DIYMarketplace";
import CollectorVerification from "./pages/CollectorVerification";
import EcoStore from "./pages/EcoStore";
import AdminPanel from "./pages/AdminPanel";
import UserProfile from "./pages/UserProfile";
import RoleSpecificDashboard from "./pages/RoleSpecificDashboard";
import AboutUs from "./pages/AboutUs";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* User Routes - Trash Generator */}
          <Route path="/trash-generator" element={<TrashGenerator />} />
          
          {/* User Routes - NGO/Business */}
          <Route path="/ngo-business" element={<NGOBusiness />} />
          
          {/* User Routes - DIY Marketplace */}
          <Route path="/diy-marketplace" element={<DIYMarketplace />} />
          
          {/* Role-Specific Dashboards */}
          <Route path="/dashboard" element={<RoleSpecificDashboard />} />
          
          {/* Eco Store */}
          <Route path="/eco-store" element={<EcoStore />} />
          
          {/* Admin Panel */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* About Us */}
          <Route path="/about" element={<AboutUs />} />
          
          {/* Legacy Citizen Routes (for backward compatibility) */}
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/book-pickup" element={<BookPickup />} />
          <Route path="/citizen/rewards" element={<Rewards />} />
          <Route path="/citizen/eco-score" element={<EcoScore />} />
          
          {/* Collector Routes */}
          <Route path="/collector" element={<CollectorDashboard />} />
          <Route path="/collector/verification" element={<CollectorVerification />} />
          <Route path="/collector/requests" element={<CollectorRequests />} />
          <Route path="/collector/active" element={<CollectorRoute />} />
          <Route path="/collector/earnings" element={<CollectorEarnings />} />
          
          {/* Legacy NGO Routes (for backward compatibility) */}
          <Route path="/ngo" element={<NGODashboard />} />
          <Route path="/ngo/sponsor" element={<NGOSponsor />} />
          <Route path="/ngo/impact" element={<NGOImpact />} />
          
          {/* Profile */}
          <Route path="/profile" element={<UserProfile />} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!user && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
