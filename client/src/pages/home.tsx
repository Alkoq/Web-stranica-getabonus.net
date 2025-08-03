import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, TrendingUp, Users, Award } from "lucide-react";
import { CasinoCard } from "@/components/casino/casino-card";
import { BonusCard } from "@/components/bonus/bonus-card";
import { BlogCard } from "@/components/blog/blog-card";
import { CasinoComparison } from "@/components/casino/casino-comparison";
import { Newsletter } from "@/components/newsletter";
import { AIChatbot } from "@/components/ai-chatbot";
import { api } from "@/lib/api";
import type { Casino, Bonus, BlogPost } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch featured data
  const { data: featuredCasinos = [], isLoading: loadingCasinos } = useQuery<Casino[]>({
    queryKey: ['/api/casinos/featured'],
    queryFn: () => api.getFeaturedCasinos(),
  });

  const { data: featuredBonuses = [], isLoading: loadingBonuses } = useQuery<Bonus[]>({
    queryKey: ['/api/bonuses/featured'],
    queryFn: () => api.getFeaturedBonuses(),
  });

  const { data: blogPosts = [], isLoading: loadingBlog } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: () => api.getBlogPosts(),
  });

  const { data: allCasinos = [] } = useQuery<Casino[]>({
    queryKey: ['/api/casinos'],
    queryFn: () => api.getCasinos(),
  });

  const quickFilters = [
    { label: "Top Rated", icon: Star, active: true },
    { label: "No Deposit", icon: TrendingUp },
    { label: "Crypto", icon: Award },
    { label: "Mobile", icon: Users },
  ];

  const stats = [
    { label: "Casinos Reviewed", value: "2,100+", icon: Award },
    { label: "Bonuses Listed", value: "18,500+", icon: TrendingUp },
    { label: "Happy Users", value: "375K+", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-turquoise to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Ultimate Casino Bonus!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Explore top-rated casinos, unlock exclusive bonuses, and start your winning journey today!
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-orange hover:bg-orange/90 text-white px-8 py-4 text-lg shadow-lg"
              >
                Discover Top Casinos
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 px-8 py-4 text-lg backdrop-blur-sm"
              >
                Compare Bonuses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search casinos, bonuses, or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-3 text-lg"
                />
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              {quickFilters.map((filter, index) => (
                <Button
                  key={index}
                  variant={filter.active ? "default" : "outline"}
                  className={filter.active ? "bg-turquoise hover:bg-turquoise/90" : ""}
                >
                  <filter.icon className="mr-2 h-4 w-4" />
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top 5 Featured Casinos */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">🏆 Top 5 Casinos in 2025</h2>
          </div>

          {loadingCasinos ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {featuredCasinos.map((casino) => (
                <CasinoCard key={casino.id} casino={casino} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="border-turquoise text-turquoise hover:bg-turquoise hover:text-white">
              View All 2,100+ Casinos
            </Button>
          </div>
        </section>

        {/* Casino Comparison Tool */}
        <section className="mb-16">
          <CasinoComparison availableCasinos={allCasinos} />
        </section>

        {/* Latest Bonuses */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">🎁 Latest Casino Bonuses</h2>
          
          {loadingBonuses ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
                  <div className="h-40 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBonuses.map((bonus) => {
                const casino = featuredCasinos.find(c => c.id === bonus.casinoId);
                return (
                  <BonusCard
                    key={bonus.id}
                    bonus={bonus}
                    casinoName={casino?.name}
                    casinoLogo={casino?.logoUrl}
                    affiliateUrl={casino?.affiliateUrl}
                  />
                );
              })}
            </div>
          )}

          <div className="text-center mt-8">
            <Button className="bg-orange hover:bg-orange/90" size="lg">
              View All 18,500+ Bonuses
            </Button>
          </div>
        </section>
      </main>

      {/* Blog Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">📰 Latest Casino News & Reviews</h2>
            <p className="text-muted-foreground text-lg">
              Stay updated with the latest casino industry news, reviews, and strategies
            </p>
          </div>

          {loadingBlog ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
                  <div className="h-48 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button className="bg-turquoise hover:bg-turquoise/90" size="lg">
              🔎 Browse All News & Guides
            </Button>
          </div>
        </div>
      </section>

      {/* AI Chatbot Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
                <Users className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Your Personal AI Casino Assistant</h2>
              <p className="text-xl text-blue-100">
                Unlock the full potential of your casino experience with our intelligent AI chatbot! 
                Get personalized recommendations, strategy tips, and instant answers to all your questions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: "🎮", title: "Expert Game Strategies", desc: "Get personalized tips for Blackjack, Roulette, Poker, and Slots" },
                { icon: "❓", title: "Game Rules & Mechanics", desc: "Learn rules, odds, and mechanics for any casino game" },
                { icon: "ℹ️", title: "Casino Insights & FAQs", desc: "Get instant answers about bonuses, payments, and features" },
                { icon: "🛡️", title: "Responsible Gambling", desc: "Tips on setting limits and safe gambling practices" }
              ].map((feature, index) => (
                <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-blue-100">{feature.desc}</p>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-orange hover:bg-orange/90 text-white px-8 py-4 text-lg shadow-lg">
              💬 Chat with AI Assistant
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* AI Chatbot Component */}
      <AIChatbot />
    </div>
  );
}
