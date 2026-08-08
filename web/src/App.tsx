import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { StoreProvider } from "@/lib/store";

import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import ListingDetail from "@/pages/ListingDetail";
import Sell from "@/pages/Sell";
import MarketSetup from "@/pages/MarketSetup";
import MyMarket from "@/pages/MyMarket";
import CreateListing from "@/pages/CreateListing";
import GardenPlanner from "@/pages/GardenPlanner";
import SeedDrop from "@/pages/SeedDrop";
import Plots from "@/pages/Plots";
import Pricing from "@/pages/Pricing";
import TrustAndSafety from "@/pages/TrustAndSafety";
import HowItWorks from "@/pages/HowItWorks";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import MarketDetail from "@/pages/MarketDetail";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/market/:slug" element={<MarketDetail />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/my-market" element={<MyMarket />} />
              <Route path="/my-market/setup" element={<MarketSetup />} />
              <Route path="/my-market/new-listing" element={<CreateListing />} />
              <Route path="/garden-planner" element={<GardenPlanner />} />
              <Route path="/seed-drop" element={<SeedDrop />} />
              <Route path="/plots" element={<Plots />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/trust-and-safety" element={<TrustAndSafety />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  </QueryClientProvider>
);

export default App;
