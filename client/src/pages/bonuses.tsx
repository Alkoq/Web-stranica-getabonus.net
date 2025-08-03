import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock } from "lucide-react";
import { BonusCard } from "@/components/bonus/bonus-card";
import { AIChatbot } from "@/components/ai-chatbot";
import { api } from "@/lib/api";
import type { Bonus, Casino } from "@shared/schema";

export default function Bonuses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const { data: bonuses = [], isLoading: loadingBonuses } = useQuery<Bonus[]>({
    queryKey: ['/api/bonuses'],
    queryFn: () => api.getBonuses(),
  });

  const { data: casinos = [] } = useQuery<Casino[]>({
    queryKey: ['/api/casinos'],
    queryFn: () => api.getCasinos(),
  });

  const getCasinoInfo = (casinoId: string) => {
    return casinos.find(c => c.id === casinoId);
  };

  const bonusTypes = [
    { value: "all", label: "All Bonuses", count: bonuses.length },
    { value: "welcome", label: "Welcome", count: bonuses.filter(b => b.type === "welcome").length },
    { value: "no_deposit", label: "No Deposit", count: bonuses.filter(b => b.type === "no_deposit").length },
    { value: "free_spins", label: "Free Spins", count: bonuses.filter(b => b.type === "free_spins").length },
    { value: "cashback", label: "Cashback", count: bonuses.filter(b => b.type === "cashback").length },
    { value: "reload", label: "Reload", count: bonuses.filter(b => b.type === "reload").length },
  ];

  const filteredBonuses = bonuses.filter(bonus => {
    const matchesSearch = searchQuery === "" || 
      bonus.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bonus.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === "all" || bonus.type === selectedType;
    
    return matchesSearch && matchesType && bonus.isActive;
  });

  const sortedBonuses = [...filteredBonuses].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "expiring":
        if (!a.validUntil && !b.validUntil) return 0;
        if (!a.validUntil) return 1;
        if (!b.validUntil) return -1;
        return a.validUntil.getTime() - b.validUntil.getTime();
      case "amount":
        return bonus => bonus.amount ? -1 : 1;
      default:
        return 0;
    }
  });

  const featuredBonuses = bonuses.filter(bonus => bonus.isFeatured && bonus.isActive);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange to-red-500 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎁 Casino Bonuses & Promotions
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Discover the best casino bonuses, free spins, and exclusive offers
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search bonuses by casino, type, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Bonuses */}
        {featuredBonuses.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">⭐ Featured Bonuses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBonuses.slice(0, 3).map((bonus) => {
                const casino = getCasinoInfo(bonus.casinoId);
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
          </section>
        )}

        {/* Filter Tabs */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:grid-cols-6">
              {bonusTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value} className="text-xs lg:text-sm">
                  {type.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {type.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex gap-4 w-full lg:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="amount">Bonus Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={selectedType} className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {loadingBonuses ? "Loading..." : `${sortedBonuses.length} Bonuses Available`}
                </h3>
                {selectedType !== "all" && (
                  <p className="text-muted-foreground">
                    Showing {bonusTypes.find(t => t.value === selectedType)?.label} bonuses
                  </p>
                )}
              </div>
            </div>

            {/* Bonus Grid */}
            {loadingBonuses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl p-6 animate-pulse border">
                    <div className="h-32 bg-muted rounded mb-4"></div>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : sortedBonuses.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Bonuses Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={() => { setSearchQuery(""); setSelectedType("all"); }}>
                  Show All Bonuses
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedBonuses.map((bonus) => {
                  const casino = getCasinoInfo(bonus.casinoId);
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
          </TabsContent>
        </Tabs>

        {/* Bonus Guide */}
        <section className="mt-16 bg-muted/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">📚 Bonus Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Welcome Bonuses",
                description: "First deposit bonuses for new players",
                icon: "🎉"
              },
              {
                title: "No Deposit Bonuses", 
                description: "Free bonuses without deposit required",
                icon: "🆓"
              },
              {
                title: "Free Spins",
                description: "Complimentary spins on slot games",
                icon: "🎰"
              },
              {
                title: "Cashback Offers",
                description: "Get back a percentage of your losses",
                icon: "🔄"
              }
            ].map((guide, index) => (
              <div key={index} className="bg-background rounded-lg p-6 border">
                <div className="text-3xl mb-3">{guide.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{guide.title}</h3>
                <p className="text-sm text-muted-foreground">{guide.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AIChatbot />
    </div>
  );
}
