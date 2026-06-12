import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { MusicProvider } from "@/context/MusicContext";
import MusicPlayer from "@/components/MusicPlayer";

const NotFound  = lazy(() => import("@/pages/not-found"));
const Home      = lazy(() => import("@/pages/home"));
const OurStory  = lazy(() => import("@/pages/our-story"));
const Letter    = lazy(() => import("@/pages/letter"));
const Reasons   = lazy(() => import("@/pages/reasons"));
const Surprise  = lazy(() => import("@/pages/surprise"));
const Future    = lazy(() => import("@/pages/future"));
const Games     = lazy(() => import("@/pages/games"));
const Gallery   = lazy(() => import("@/pages/gallery"));
const Special   = lazy(() => import("@/pages/special"));
const Days      = lazy(() => import("@/pages/days"));
const Ending    = lazy(() => import("@/pages/ending"));
const Scrapbook = lazy(() => import("@/pages/scrapbook"));

const queryClient = new QueryClient();

const Loader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="font-script text-3xl text-primary/60 animate-pulse">Loading…</div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path="/"           component={Home} />
        <Route path="/our-story"  component={OurStory} />
        <Route path="/letter"     component={Letter} />
        <Route path="/reasons"    component={Reasons} />
        <Route path="/surprise"   component={Surprise} />
        <Route path="/future"     component={Future} />
        <Route path="/games"      component={Games} />
        <Route path="/gallery"    component={Gallery} />
        <Route path="/special"    component={Special} />
        <Route path="/days"       component={Days} />
        <Route path="/ending"     component={Ending} />
        <Route path="/scrapbook"  component={Scrapbook} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <MusicProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <MusicPlayer />
          <Toaster />
        </MusicProvider>
    </QueryClientProvider>
  );
}
