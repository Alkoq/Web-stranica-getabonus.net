import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List } from "lucide-react";
import { CasinoCard } from "@/components/casino/casino-card";
import { CasinoFiltersComponent } from "@/components/casino/casino-filters";
import { AIChatbot } from "@/components/ai-chatbot";
import { api } from "@/lib/api";
import type { Casino } from "@shared/schema";
import type { CasinoFilters } from "@/types";

export default function Casinos() {
  const [filters, setFilters] = useState<CasinoFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("safetyIndex");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);

  const { data: casinos = [], isLoading, error } = useQuery<Casino[]>({
    queryKey: ['/api/casinos', { ...filters, search: searchQuery }],
    queryFn: () => api.getCasinos({ ...filters, search: searchQuery }),
  });

  const handleFiltersChange = (newFilters: CasinoFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const sortedCasinos = [...casinos].sort((a, b) => {
    switch (sortBy) {
      case "safetyIndex":
        return parseFloat(b.safetyIndex) - parseFloat(a.safetyIndex);
      case "userRating":
        return parseFloat(b.userRating) - parseFloat(a.userRating);
      case "name":
        return a.name.localeCompare(b.name);
      case "established":
        return (b.establishedYear || 0) - (a.establishedYear || 0);
      default:
        return 0;
    }
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Failed to Load Casinos</h1>
        <p className="text-muted-foreground">Please try again later or check your connection.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-turquoise to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🏆 Top Online Casinos 2025
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover safe, trusted casinos with the best bonuses and games
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search casinos by name, features, or payment methods..."
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-80">
            <CasinoFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>

              <div className="flex flex-1 gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safetyIndex">Safety Index</SelectItem>
                    <SelectItem value="userRating">User Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="established">Year Established</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-border rounded-lg">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-l-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <CasinoFiltersComponent
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {isLoading ? "Loading..." : `${sortedCasinos.length} Casinos Found`}
                </h2>
                {Object.keys(filters).length > 0 && (
                  <p className="text-muted-foreground">
                    Filtered results based on your criteria
                  </p>
                )}
              </div>
            </div>

            {/* Casino List/Grid */}
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl p-6 animate-pulse border">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </div>
                      <div className="w-24 h-10 bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedCasinos.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Casinos Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={handleClearFilters} className="bg-turquoise hover:bg-turquoise/90">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                  : "space-y-6"
              }>
                {sortedCasinos.map((casino) => (
                  <CasinoCard 
                    key={casino.id} 
                    casino={casino} 
                    showDetails={viewMode === "list"}
                  />
                ))}
              </div>
            )}

            {/* Load More - Future Enhancement */}
            {sortedCasinos.length >= 20 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Casinos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
