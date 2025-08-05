import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { CasinoCard } from "@/components/casino/casino-card";
import { CasinoFiltersComponent } from "@/components/casino/casino-filters";
import { AIChatbot } from "@/components/ai-chatbot";
import { api } from "@/lib/api";
import type { Casino } from "@shared/schema";
import type { CasinoFilters } from "@/types";

export default function Casinos() {
  const [filters, setFilters] = useState<CasinoFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("safetyIndex-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setLocation] = useLocation();

  const CASINOS_PER_PAGE = 20;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check URL parameters for sorting
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sort = urlParams.get('sort');
    if (sort === 'rating') {
      setSortBy('safetyIndex-desc');
    } else if (sort === 'newest') {
      setSortBy('createdAt-desc');
    }
  }, []);

  const { data: casinos = [], isLoading, error } = useQuery<Casino[]>({
    queryKey: ['/api/casinos', { ...filters, search: searchQuery }],
    queryFn: () => api.getCasinos({ ...filters, search: searchQuery }),
  });

  // Search results for suggestions
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return casinos.filter(casino => 
      casino.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      casino.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      casino.features?.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
      casino.paymentMethods?.some(method => method.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5);
  }, [casinos, searchQuery]);

  const handleFiltersChange = (newFilters: CasinoFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Reset page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  // Apply filters first, then sort
  const filteredCasinos = casinos.filter(casino => {
    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        casino.name.toLowerCase().includes(query) ||
        casino.description?.toLowerCase().includes(query) ||
        casino.features?.some(feature => feature.toLowerCase().includes(query)) ||
        casino.paymentMethods?.some(method => method.toLowerCase().includes(query)) ||
        casino.gameProviders?.some(provider => provider.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Safety Index filter
    if (filters.minSafetyIndex) {
      const casinoSafety = parseFloat(casino.safetyIndex || '0');
      if (casinoSafety < filters.minSafetyIndex) return false;
    }

    // License filter
    if (filters.license && casino.license !== filters.license) {
      return false;
    }

    // Payment Methods filter
    if (filters.paymentMethods && filters.paymentMethods.length > 0) {
      const hasPaymentMethod = filters.paymentMethods.some(method => 
        casino.paymentMethods?.includes(method)
      );
      if (!hasPaymentMethod) return false;
    }

    // Features filter
    if (filters.features && filters.features.length > 0) {
      const hasFeature = filters.features.some(feature => 
        casino.features?.includes(feature)
      );
      if (!hasFeature) return false;
    }

    // Game Providers filter
    if (filters.gameProviders && filters.gameProviders.length > 0) {
      const hasProvider = filters.gameProviders.some(provider => 
        casino.gameProviders?.includes(provider)
      );
      if (!hasProvider) return false;
    }

    // Established Year filter
    if (filters.establishedYear && casino.establishedYear && casino.establishedYear < filters.establishedYear) {
      return false;
    }

    return true;
  });

  const sortedCasinos = [...filteredCasinos].sort((a, b) => {
    const [field, direction] = sortBy.split('-');
    const isDesc = direction === 'desc';
    
    switch (field) {
      case "safetyIndex":
        const diff = parseFloat(b.safetyIndex || '0') - parseFloat(a.safetyIndex || '0');
        return isDesc ? diff : -diff;
      case "userRating":
        const ratingDiff = parseFloat(b.userRating || '0') - parseFloat(a.userRating || '0');
        return isDesc ? ratingDiff : -ratingDiff;
      case "name":
        const nameDiff = a.name.localeCompare(b.name);
        return isDesc ? -nameDiff : nameDiff;
      case "established":
        const estDiff = (b.establishedYear || 0) - (a.establishedYear || 0);
        return isDesc ? estDiff : -estDiff;
      case "createdAt":
        const aDt = new Date(a.createdAt || '1970-01-01').getTime();
        const bDt = new Date(b.createdAt || '1970-01-01').getTime();
        const createdDiff = bDt - aDt;
        return isDesc ? createdDiff : -createdDiff;
      default:
        return 0;
    }
  });

  // Pagination calculations
  const totalCasinos = sortedCasinos.length;
  const totalPages = Math.ceil(totalCasinos / CASINOS_PER_PAGE);
  const startIndex = (currentPage - 1) * CASINOS_PER_PAGE;
  const endIndex = startIndex + CASINOS_PER_PAGE;
  const currentCasinos = sortedCasinos.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

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
              {/* Mobile Search Dialog */}
              {isMobile ? (
                <Dialog open={showSearchSuggestions} onOpenChange={setShowSearchSuggestions}>
                  <DialogTrigger asChild>
                    <div className="relative cursor-pointer">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Search casinos by name, features, or payment methods..."
                        value={searchQuery}
                        readOnly
                        className="pl-12 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/70"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[95vw] h-[85vh] max-h-[85vh] p-0 rounded-lg">
                    <VisuallyHidden>
                      <DialogTitle>Search Casinos</DialogTitle>
                      <DialogDescription>Find casinos by name, features, or payment methods</DialogDescription>
                    </VisuallyHidden>
                    <Command shouldFilter={false} className="h-full rounded-lg border-0">
                      <div className="p-4 border-b">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="text"
                            placeholder="Search casinos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 text-base"
                            autoFocus
                          />
                        </div>
                      </div>
                      <CommandList className="flex-1 overflow-auto p-2">
                        <CommandEmpty className="p-4 text-center">
                          {searchQuery.length >= 2 ? "No casinos found" : "Type to search casinos..."}
                        </CommandEmpty>
                        
                        {/* Real search results */}
                        {searchQuery.length >= 2 && searchResults && searchResults.length > 0 && (
                          <CommandGroup heading="Casino Results" className="mb-4">
                            {searchResults.map((casino: any) => (
                              <CommandItem
                                key={casino.id}
                                value={casino.name}
                                onSelect={() => {
                                  setLocation(`/casino/${casino.id}`);
                                  setShowSearchSuggestions(false);
                                }}
                                className="flex items-center gap-3 cursor-pointer p-4 rounded-md"
                              >
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={casino.logoUrl || '/placeholder-casino.png'} 
                                    alt={casino.name}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                  <div>
                                    <span className="text-base font-medium">{casino.name}</span>
                                    {casino.safetyIndex && (
                                      <div className="text-xs text-muted-foreground">
                                        Safety: {casino.safetyIndex}/10
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                        
                        <div className="p-3 border-t mt-4">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowSearchSuggestions(false)}
                          >
                            Close
                          </Button>
                        </div>
                      </CommandList>
                    </Command>
                  </DialogContent>
                </Dialog>
              ) : (
                /* Desktop Search */
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
              )}
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
              casinos={casinos}
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
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safetyIndex-desc">Highest Safety Index</SelectItem>
                    <SelectItem value="safetyIndex-asc">Lowest Safety Index</SelectItem>
                    <SelectItem value="userRating-desc">Highest User Rating</SelectItem>
                    <SelectItem value="userRating-asc">Lowest User Rating</SelectItem>
                    <SelectItem value="createdAt-desc">Latest Added</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest Added</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="established-desc">Newest Casinos</SelectItem>
                    <SelectItem value="established-asc">Oldest Casinos</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex border border-border rounded-lg">
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
                  casinos={casinos}
                />
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {isLoading ? "Loading..." : `${totalCasinos} Casinos Found`}
                </h2>
                {totalCasinos > 0 && (
                  <p className="text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalCasinos)} of {totalCasinos} casinos
                    {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                  </p>
                )}
                {Object.keys(filters).length > 0 && (
                  <p className="text-sm text-muted-foreground">
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
            ) : totalCasinos === 0 ? (
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
              <>
                <div className={
                  isMobile || viewMode === "list"
                    ? "space-y-6"
                    : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                }>
                  {currentCasinos.map((casino) => (
                    <CasinoCard 
                      key={casino.id} 
                      casino={casino} 
                      showDetails={isMobile || viewMode === "list"}
                      variant={isMobile || viewMode === "list" ? "list" : "grid"}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {/* First page */}
                      {currentPage > 3 && (
                        <>
                          <Button
                            variant={1 === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            className="w-10"
                          >
                            1
                          </Button>
                          {currentPage > 4 && <span className="px-2">...</span>}
                        </>
                      )}

                      {/* Current page and neighbors */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageStart = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                        const pageNum = pageStart + i;
                        
                        if (pageNum > totalPages) return null;
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}

                      {/* Last page */}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                          <Button
                            variant={totalPages === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className="w-10"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
