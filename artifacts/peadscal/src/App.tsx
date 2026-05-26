import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";

import Home from "@/pages/Home";
import DrugDosing from "@/pages/DrugDosing";
import Airway from "@/pages/Airway";
import Growth from "@/pages/Growth";
import CodeBlue from "@/pages/CodeBlue";
import Cardiac from "@/pages/Cardiac";
import Checklists from "@/pages/Checklists";
import Fluids from "@/pages/Fluids";
import PedsGCS from "@/pages/PedsGCS";
import RenalHepatic from "@/pages/RenalHepatic";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/drugs" component={DrugDosing} />
      <Route path="/airway" component={Airway} />
      <Route path="/growth" component={Growth} />
      <Route path="/code-blue" component={CodeBlue} />
      <Route path="/cardiac" component={Cardiac} />
      <Route path="/checklists" component={Checklists} />
      <Route path="/fluids" component={Fluids} />
      <Route path="/gcs" component={PedsGCS} />
      <Route path="/renal" component={RenalHepatic} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <BottomNav />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
