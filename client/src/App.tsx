import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Pages
import Home from "@/pages/home";
import Casinos from "@/pages/casinos";
import Bonuses from "@/pages/bonuses";
import Games from "@/pages/games";
import Reviews from "@/pages/reviews";
import Compare from "@/pages/compare";
import Blog from "@/pages/blog";
import Login from "@/pages/login";
import AdminPanel from "@/pages/admin-panel";
import CasinoDetail from "@/pages/casino-detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/casinos" component={Casinos} />
          <Route path="/casino/:id" component={CasinoDetail} />
          <Route path="/bonuses" component={Bonuses} />
          <Route path="/games" component={Games} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/compare" component={Compare} />
          <Route path="/blog" component={Blog} />
          <Route path="/admin" component={Login} />
          <Route path="/admin-panel" component={AdminPanel} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="casino-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
