import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MusicProvider } from "@/context/MusicContext";
import MusicPlayer from "@/components/MusicPlayer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import OurStory from "@/pages/our-story";
import Letter from "@/pages/letter";
import Reasons from "@/pages/reasons";
import Surprise from "@/pages/surprise";
import Future from "@/pages/future";
import Games from "@/pages/games";
import Gallery from "@/pages/gallery";
import Special from "@/pages/special";
import Days from "@/pages/days";
import Ending from "@/pages/ending";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/our-story" component={OurStory} />
      <Route path="/letter" component={Letter} />
      <Route path="/reasons" component={Reasons} />
      <Route path="/surprise" component={Surprise} />
      <Route path="/future" component={Future} />
      <Route path="/games" component={Games} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/special" component={Special} />
      <Route path="/days" component={Days} />
      <Route path="/ending" component={Ending} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MusicProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <MusicPlayer />
          <Toaster />
        </MusicProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
