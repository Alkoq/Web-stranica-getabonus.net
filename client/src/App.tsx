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

import Compare from "@/pages/compare";
import Blog from "@/pages/blog";
import Login from "@/pages/login";
import AdminPanel from "@/pages/admin-panel";
import AdminLogin from "@/pages/admin-login";
import CasinoDetail from "@/pages/casino-detail";
import BonusDetail from "@/pages/bonus-detail";
import GameDetail from "@/pages/game-detail";
import BlogPostDetail from "@/pages/blog-post";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Admin routes without header/footer */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminPanel} />
      
      {/* Regular site routes with header/footer */}
      <Route>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/casinos" component={Casinos} />
              <Route path="/casino/:id" component={CasinoDetail} />
              <Route path="/bonuses" component={Bonuses} />
              <Route path="/bonus/:id" component={BonusDetail} />
              <Route path="/games" component={Games} />
              <Route path="/game/:id" component={GameDetail} />
              <Route path="/compare" component={Compare} />
              <Route path="/blog" component={Blog} />
              <Route path="/blog/:slug" component={BlogPostDetail} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
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
