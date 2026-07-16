import { Suspense } from "react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazyWithReload } from "@/lib/lazyWithReload";
import { RouteMeta } from "@/components/RouteMeta";
import Index from "./pages/Index";

// Code-split secondary routes so the landing page ships less JS up front.
// lazyWithReload auto-recovers when a deploy invalidates the previous build's
// hashed chunks — otherwise the page would sit broken until a manual refresh.
const TechnicalReport = lazyWithReload(() => import("./pages/TechnicalReport"));
const HowItWorks = lazyWithReload(() => import("./pages/HowItWorks"));
const Safety = lazyWithReload(() => import("./pages/Safety"));
const ShadowAudit = lazyWithReload(() => import("./pages/ShadowAudit"));
const Docs = lazyWithReload(() => import("./pages/Docs"));
const Contact = lazyWithReload(() => import("./pages/Contact"));
const Privacy = lazyWithReload(() => import("./pages/Privacy"));
const NotFound = lazyWithReload(() => import("./pages/NotFound"));

// Private, unlisted company research memos (/{company-slug}-FH37X). These are
// noindex,nofollow, kept out of the sitemap, and never linked from public nav.
// One thin wrapper per company; see src/pages/research/ + PRIVATE_ROUTES.
const FireworksResearch = lazyWithReload(() => import("./pages/research/FireworksResearch"));

const queryClient = new QueryClient();

const RouteFallback = () => <div className="min-h-[100dvh] bg-background" aria-hidden />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteMeta />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/technical-report" element={<TechnicalReport />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/shadow-audit" element={<ShadowAudit />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Private company research memos — unlisted, noindex,nofollow.
                  The template demo and the Fireworks per-company URL render the
                  same data-driven page. Add future companies the same way. */}
              <Route path="/company-template-FH37X" element={<FireworksResearch />} />
              <Route path="/fireworks-ai-FH37X" element={<FireworksResearch />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
