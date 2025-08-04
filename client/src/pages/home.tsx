import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Search, Star, TrendingUp, Users, Award, ChevronRight, Gift, Gamepad2, Clock, FileText, Filter, Bitcoin, CreditCard } from "lucide-react";
import { CasinoCard } from "@/components/casino/casino-card";
import { BonusCard } from "@/components/bonus/bonus-card";
import { BlogCard } from "@/components/blog/blog-card";
import { CasinoComparison } from "@/components/casino/casino-comparison";
import { Newsletter } from "@/components/newsletter";
import { AIChatbot } from "@/components/ai-chatbot";
import { GameCasinoModal } from "@/components/game/game-casino-modal";
import { api } from "@/lib/api";
import type { Casino, Bonus, BlogPost } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<{name: string, id: string} | null>(null);
  const [showCasinoModal, setShowCasinoModal] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [, setLocation] = useLocation();

  // Fetch stats and data
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => api.getStats(),
  });

  const { data: featuredCasinos = [], isLoading: loadingCasinos } = useQuery<Casino[]>({
    queryKey: ['/api/casinos/featured'],
    queryFn: () => api.getFeaturedCasinos(),
  });

  const { data: allCasinos = [] } = useQuery<Casino[]>({
    queryKey: ['/api/casinos'],
    queryFn: () => api.getCasinos(),
  });

  const { data: featuredBonuses = [], isLoading: loadingBonuses } = useQuery<Bonus[]>({
    queryKey: ['/api/bonuses/featured'],
    queryFn: () => api.getFeaturedBonuses(),
  });

  const { data: blogPosts = [], isLoading: loadingBlog } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: () => api.getBlogPosts(),
  });

  // Get latest casinos (mock sorting by newest)
  const latestCasinos = [...allCasinos].slice(0, 15);

  // Mock games data
  const hotGames = [
    { id: '1', name: 'Book of Dead', provider: "Play'n GO", rtp: '96.21%', image: '/games/book-of-dead.jpg' },
    { id: '2', name: 'Starburst', provider: 'NetEnt', rtp: '96.09%', image: '/games/starburst.jpg' },
    { id: '3', name: 'Gonzo\'s Quest', provider: 'NetEnt', rtp: '95.97%', image: '/games/gonzos-quest.jpg' },
  ];

  const quickFilters = [
    { label: "Top Rated", icon: Star, active: true, filter: "safetyIndex" },
    { label: "No Deposit", icon: TrendingUp, filter: "bonusType:no_deposit" },
    { label: "Crypto", icon: Bitcoin, filter: "paymentMethods:Bitcoin" },
    { label: "Mobile", icon: Users, filter: "features:Mobile" },
  ];

  // Search suggestions by category
  const searchSuggestions = {
    "Payment Methods": [
      { label: "Bitcoin Casinos", icon: Bitcoin, query: "Bitcoin" },
      { label: "Ethereum Casinos", icon: Award, query: "Ethereum" },
      { label: "Credit Card Casinos", icon: CreditCard, query: "Credit Cards" },
      { label: "PayPal Casinos", icon: Award, query: "PayPal" },
    ],
    "Casino Types": [
      { label: "Crypto Casinos", icon: Bitcoin, query: "Crypto Casino" },
      { label: "Live Casinos", icon: Users, query: "Live Casino" },
      { label: "VIP Casinos", icon: Award, query: "VIP Program" },
      { label: "Mobile Casinos", icon: Users, query: "Mobile Optimized" },
    ],
    "Bonus Types": [
      { label: "Welcome Bonuses", icon: Gift, query: "Welcome Bonus" },
      { label: "No Deposit Bonuses", icon: TrendingUp, query: "No Deposit" },
      { label: "Free Spins", icon: Star, query: "Free Spins" },
      { label: "Reload Bonuses", icon: Gift, query: "Reload Bonus" },
    ],
    "Game Providers": [
      { label: "NetEnt Games", icon: Gamepad2, query: "NetEnt" },
      { label: "Microgaming", icon: Gamepad2, query: "Microgaming" },
      { label: "Pragmatic Play", icon: Gamepad2, query: "Pragmatic Play" },
      { label: "Evolution Gaming", icon: Gamepad2, query: "Evolution Gaming" },
    ]
  };

  const handleQuickFilter = (filter: string) => {
    if (filter.includes(":")) {
      const [type, value] = filter.split(":");
      setLocation(`/casinos?${type}=${value}`);
    } else {
      setLocation(`/casinos?sort=${filter}`);
    }
  };

  const handleSearchSuggestion = (query: string) => {
    setSearchQuery(query);
    setLocation(`/casinos?search=${encodeURIComponent(query)}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/casinos?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Search results query for real-time search
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['/api/casinos'],
    select: (data: any[]) => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const filtered = data.filter(casino => 
        casino.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        casino.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('Search query:', searchQuery, 'Found casinos:', filtered.length);
      return filtered.slice(0, 5); // Limit to 5 results
    }
  });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section with Dynamic Stats */}
      <section className="bg-gradient-to-br from-turquoise to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Ultimate Casino Bonus!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Explore top-rated casinos, unlock exclusive bonuses, and start your winning journey today!
            </p>
            
            {/* Dynamic Trust Indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats?.totalCasinos || 0}+</div>
                <div className="text-sm text-blue-200">Casinos Reviewed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats?.totalBonuses || 0}+</div>
                <div className="text-sm text-blue-200">Bonuses Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats?.totalGames || 0}+</div>
                <div className="text-sm text-blue-200">Games Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats?.totalUsers || 0}+</div>
                <div className="text-sm text-blue-200">Happy Users</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-orange hover:bg-orange/90 text-white px-8 py-4 text-lg shadow-lg"
                data-testid="button-discover-casinos"
              >
                Discover Top Casinos
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 px-8 py-4 text-lg backdrop-blur-sm"
                data-testid="button-compare-bonuses"
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
            {/* Search Bar with Suggestions */}
            <div className="flex-1">
              <div className="relative">
                {isMobile ? (
                  /* Mobile Dialog */
                  <Dialog open={showSearchSuggestions} onOpenChange={setShowSearchSuggestions}>
                    <DialogTrigger asChild>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          type="text"
                          placeholder="Search casinos, bonuses, providers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setShowSearchSuggestions(true)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch();
                              setShowSearchSuggestions(false);
                            }
                            if (e.key === 'Escape') {
                              setShowSearchSuggestions(false);
                            }
                          }}
                          className="pl-12 pr-20 py-3 text-base"
                          data-testid="input-search"
                        />
                        <Button
                          onClick={handleSearch}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2 bg-turquoise hover:bg-turquoise/90 text-xs"
                          size="sm"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md max-h-[80vh] p-0 gap-0">
                      <VisuallyHidden>
                        <DialogTitle>Search Suggestions</DialogTitle>
                        <DialogDescription>Browse search suggestions by category</DialogDescription>
                      </VisuallyHidden>
                      <Command className="rounded-lg border-none">
                        <CommandInput 
                          placeholder="Search suggestions..." 
                          className="h-12 text-base border-b"
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList className="max-h-[60vh] overflow-y-auto p-2">
                          <CommandEmpty className="py-6 text-center text-muted-foreground">
                            {searchQuery.length >= 2 ? "No casinos found." : "Type to search casinos..."}
                          </CommandEmpty>
                          
                          {/* Real search results */}
                          {searchQuery.length >= 2 && searchResults && searchResults.length > 0 && (
                            <CommandGroup heading="Casino Results" className="mb-4">
                              {searchResults.map((casino: any) => (
                                <CommandItem
                                  key={casino.id}
                                  onSelect={() => {
                                    setLocation(`/casino/${casino.id}`);
                                    setShowSearchSuggestions(false);
                                  }}
                                  className="flex items-center gap-3 cursor-pointer p-4 rounded-md touch-manipulation"
                                >
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={casino.logo || '/placeholder-casino.png'} 
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
                          
                          {/* Suggestions only show when no search query or no results */}
                          {(!searchQuery || searchQuery.length < 2 || (searchResults && searchResults.length === 0)) && Object.entries(searchSuggestions).map(([category, suggestions]) => (
                            <CommandGroup key={category} heading={category} className="mb-4">
                              {suggestions.map((suggestion, index) => (
                                <CommandItem
                                  key={index}
                                  onSelect={() => {
                                    handleSearchSuggestion(suggestion.query);
                                    setShowSearchSuggestions(false);
                                  }}
                                  className="flex items-center gap-3 cursor-pointer p-4 rounded-md touch-manipulation"
                                >
                                  <suggestion.icon className="h-5 w-5 flex-shrink-0 text-turquoise" />
                                  <span className="text-base font-medium">{suggestion.label}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                          
                          {/* Close button */}
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
                  /* Desktop Popover */
                  <Popover open={showSearchSuggestions} onOpenChange={setShowSearchSuggestions}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          type="text"
                          placeholder="Search casinos, bonuses, providers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setShowSearchSuggestions(true)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch();
                              setShowSearchSuggestions(false);
                            }
                            if (e.key === 'Escape') {
                              setShowSearchSuggestions(false);
                            }
                          }}
                          className="pl-12 pr-24 py-3 text-lg"
                          data-testid="input-search"
                        />
                        <Button
                          onClick={handleSearch}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3 bg-turquoise hover:bg-turquoise/90 text-sm"
                          size="sm"
                        >
                          Search
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-[700px] p-0 max-h-[80vh] overflow-hidden border shadow-lg" 
                      side="bottom" 
                      align="start"
                      sideOffset={8}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <Command className="rounded-lg border-none">
                        <CommandInput 
                          placeholder="Search suggestions..." 
                          className="h-12 text-base"
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted">
                          <CommandEmpty className="py-6 text-center text-muted-foreground">
                            {searchQuery.length >= 2 ? "No casinos found." : "Type to search casinos..."}
                          </CommandEmpty>
                          
                          {/* Real search results for desktop */}
                          {searchQuery.length >= 2 && searchResults && searchResults.length > 0 && (
                            <CommandGroup heading="Casino Results" className="p-2">
                              {searchResults.map((casino: any) => (
                                <CommandItem
                                  key={casino.id}
                                  onSelect={() => {
                                    setLocation(`/casino/${casino.id}`);
                                    setShowSearchSuggestions(false);
                                  }}
                                  className="flex items-center gap-3 cursor-pointer p-3 rounded-md hover:bg-accent/50"
                                >
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={casino.logo || '/placeholder-casino.png'} 
                                      alt={casino.name}
                                      className="w-6 h-6 rounded object-cover"
                                    />
                                    <div>
                                      <span className="text-sm font-medium">{casino.name}</span>
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
                          
                          {/* Suggestions only show when no search query or no results */}
                          {(!searchQuery || searchQuery.length < 2 || (searchResults && searchResults.length === 0)) && Object.entries(searchSuggestions).map(([category, suggestions]) => (
                            <CommandGroup key={category} heading={category} className="p-2">
                              {suggestions.map((suggestion, index) => (
                                <CommandItem
                                  key={index}
                                  onSelect={() => {
                                    handleSearchSuggestion(suggestion.query);
                                    setShowSearchSuggestions(false);
                                  }}
                                  className="flex items-center gap-3 cursor-pointer p-3 rounded-md hover:bg-accent/50"
                                >
                                  <suggestion.icon className="h-5 w-5 flex-shrink-0 text-turquoise" />
                                  <span className="text-sm font-medium">{suggestion.label}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              {quickFilters.map((filter, index) => (
                <Button
                  key={index}
                  variant={filter.active ? "default" : "outline"}
                  className={filter.active ? "bg-turquoise hover:bg-turquoise/90" : ""}
                  onClick={() => handleQuickFilter(filter.filter)}
                  data-testid={`filter-${filter.label.toLowerCase().replace(' ', '-')}`}
                >
                  <filter.icon className="mr-2 h-4 w-4" />
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 max-w-full overflow-hidden">
        
        {/* Top Casinos Carousel */}
        <section className="relative p-3 sm:p-6 rounded-xl overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(173, 58, 39, 0.05))',
          border: '1px solid hsl(173, 58%, 39%, 0.2)',
          boxShadow: '0 0 20px hsl(173, 58%, 39%, 0.1)',
        }}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <div>
              <h2 
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{
                  color: 'hsl(173, 58%, 39%)',
                  textShadow: '0 0 10px hsl(173, 58%, 39%, 0.3)'
                }}
              >
                Top Rated Casinos 🎰
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Best casinos based on our expert reviews</p>
            </div>
            <Link href="/casinos?sort=rating">
              <Button variant="outline" className="flex items-center gap-2 text-sm whitespace-nowrap" data-testid="link-see-all-top-casinos">
                <span className="hidden sm:inline">See All Top Casinos</span>
                <span className="sm:hidden">See All</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
              {featuredCasinos.map((casino) => (
                <CarouselItem key={casino.id} className="pl-1 sm:pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="casino-card-enhanced h-full">
                    <CasinoCard casino={casino} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Latest Casinos */}
        <section className="relative p-6 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(24, 95, 53, 0.05))',
          border: '1px solid hsl(24, 95%, 53%, 0.2)',
          boxShadow: '0 0 20px hsl(24, 95%, 53%, 0.1)',
        }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{
                  color: 'hsl(24, 95%, 53%)',
                  textShadow: '0 0 10px hsl(24, 95%, 53%, 0.3)'
                }}
              >
                Latest Casinos 🆕
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Newest additions to our platform</p>
            </div>
            <Link href="/casinos?sort=newest">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-latest-casinos">
                See All Latest Casinos
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {latestCasinos.map((casino) => (
                <CarouselItem key={casino.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="casino-card-enhanced h-full">
                    <CasinoCard casino={casino} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Top Bonuses */}
        <section className="relative p-6 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(173, 58, 39, 0.1), rgba(24, 95, 53, 0.05))',
          border: '1px solid hsl(173, 58%, 39%, 0.2)',
          boxShadow: '0 0 20px hsl(173, 58%, 39%, 0.1), 0 0 40px hsl(24, 95%, 53%, 0.05)',
        }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(45deg, hsl(173, 58%, 39%), hsl(24, 95%, 53%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 10px hsl(173, 58%, 39%, 0.3))'
                }}
              >
                Top Bonuses 🎁
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Best bonus offers available right now</p>
            </div>
            <Link href="/bonuses?sort=value">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-top-bonuses">
                See All Top Bonuses
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredBonuses.map((bonus) => (
                <CarouselItem key={bonus.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <BonusCard bonus={bonus} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Latest Bonuses */}
        <section className="relative p-6 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(24, 95, 53, 0.1), rgba(173, 58, 39, 0.05))',
          border: '1px solid hsl(24, 95%, 53%, 0.2)',
          boxShadow: '0 0 20px hsl(24, 95%, 53%, 0.1)',
        }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{
                  color: 'hsl(24, 95%, 53%)',
                  textShadow: '0 0 10px hsl(24, 95%, 53%, 0.3)'
                }}
              >
                Latest Bonuses 🆕
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Newest bonus offers just added</p>
            </div>
            <Link href="/bonuses?sort=newest">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-latest-bonuses">
                See All Latest Bonuses
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredBonuses.slice().reverse().map((bonus) => (
                <CarouselItem key={bonus.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <BonusCard bonus={bonus} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Hot Games */}
        <section className="relative p-6 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(24, 95, 53, 0.05), rgba(173, 58, 39, 0.1))',
          border: '1px solid hsl(24, 95%, 53%, 0.2)',
          boxShadow: '0 0 20px hsl(24, 95%, 53%, 0.1), 0 0 40px hsl(173, 58%, 39%, 0.05)',
        }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(45deg, hsl(24, 95%, 53%), hsl(173, 58%, 39%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 10px hsl(24, 95%, 53%, 0.3))'
                }}
              >
                Hot Games Right Now 🔥
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Most popular games this week</p>
            </div>
            <Link href="/games">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-hot-games">
                See All Games
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {hotGames.map((game) => (
                <CarouselItem key={game.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card 
                    className="transition-all duration-300 h-full carousel-card relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))',
                      border: '2px solid hsl(173, 58%, 39%, 0.3)',
                      boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
                      e.currentTarget.style.border = '2px solid hsl(173, 58%, 39%, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 25px hsl(173, 58%, 39%, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.border = '2px solid hsl(173, 58%, 39%, 0.3)';
                      e.currentTarget.style.boxShadow = '0 0 15px hsl(173, 58%, 39%, 0.2)';
                    }}
                  >
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
                        <Gamepad2 className="h-8 w-8 md:h-12 md:w-12 text-white" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{game.provider}</p>
                      <div className="mt-auto space-y-2">
                        <Badge variant="secondary" className="text-xs">RTP: {game.rtp}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs" data-testid={`button-play-demo-${game.id}`}>
                            Play Demo
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-orange hover:bg-orange/90 text-xs"
                            data-testid={`button-play-real-${game.id}`}
                            onClick={() => {
                              setSelectedGame({ name: game.name, id: game.id });
                              setShowCasinoModal(true);
                            }}
                          >
                            Play Real
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Latest Games */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest Games</h2>
              <p className="text-gray-600 dark:text-gray-300">Newest game releases</p>
            </div>
            <Link href="/games?sort=newest">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-latest-games">
                See All Latest Games
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {hotGames.slice().reverse().map((game) => (
                <CarouselItem key={game.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="hover:shadow-lg transition-shadow h-full carousel-card">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-green-400 rounded-lg mb-4 flex items-center justify-center">
                        <Gamepad2 className="h-8 w-8 md:h-12 md:w-12 text-white" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{game.provider}</p>
                      <div className="mt-auto space-y-2">
                        <Badge variant="secondary" className="text-xs">RTP: {game.rtp}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs" data-testid={`button-play-demo-latest-${game.id}`}>
                            Play Demo
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-orange hover:bg-orange/90 text-xs"
                            data-testid={`button-play-real-latest-${game.id}`}
                            onClick={() => {
                              setSelectedGame({ name: game.name, id: game.id });
                              setShowCasinoModal(true);
                            }}
                          >
                            Play Real
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Comparison Tool */}
        <section className="bg-card rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Compare Your Options</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/compare?type=casinos">
              <Button size="lg" variant="outline" className="flex items-center gap-2" data-testid="button-compare-casinos">
                <Award className="h-5 w-5" />
                Compare Casinos
              </Button>
            </Link>
            <Link href="/compare?type=bonuses">
              <Button size="lg" variant="outline" className="flex items-center gap-2" data-testid="button-compare-bonuses">
                <Gift className="h-5 w-5" />
                Compare Bonuses
              </Button>
            </Link>
            <Link href="/compare?type=games">
              <Button size="lg" variant="outline" className="flex items-center gap-2" data-testid="button-compare-games">
                <Gamepad2 className="h-5 w-5" />
                Compare Games
              </Button>
            </Link>
          </div>
        </section>

        {/* Latest News */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest News</h2>
              <p className="text-gray-600 dark:text-gray-300">Stay updated with casino industry news</p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-news">
                See All News
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {blogPosts.slice(0, 6).map((post) => (
                <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <BlogCard post={post} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* About Our AI Bot - Casino Neon Style */}
        <section className="relative bg-black rounded-xl p-8 overflow-hidden" style={{
          border: '2px solid transparent',
          background: 'linear-gradient(black, black) padding-box, linear-gradient(45deg, hsl(173, 58%, 39%), hsl(24, 95%, 53%), hsl(173, 58%, 39%)) border-box',
          boxShadow: '0 0 20px hsl(173, 58%, 39%, 0.3), 0 0 40px hsl(173, 58%, 39%, 0.2)',
          animation: 'neon-border-pulse 3s ease-in-out infinite alternate'
        }}>
          {/* Neon border effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-turquoise-500 via-orange-500 to-turquoise-500 opacity-20 blur-sm"></div>
          <div className="absolute inset-[2px] bg-black rounded-xl"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="mb-6">
              {/* Neon AI Bot Icon */}
              <div className="w-24 h-24 mx-auto relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-turquoise to-orange rounded-full blur-md opacity-75"></div>
                <div className="relative w-full h-full bg-black border-2 border-turquoise rounded-full flex items-center justify-center shadow-turquoise">
                  <svg className="w-12 h-12 text-turquoise drop-shadow-turquoise-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold mb-4" style={{
                color: 'hsl(173, 58%, 39%)',
                textShadow: '0 0 5px hsl(173, 58%, 39%), 0 0 10px hsl(173, 58%, 39%), 0 0 15px hsl(173, 58%, 39%), 0 0 20px hsl(173, 58%, 39%)'
              }}>
                🎰 Your Personal Casino Assistant 🎲
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
                Our advanced AI bot is here to help you find the perfect casino, bonus, or game. 
                Ask questions, get personalized recommendations, and discover the best gambling opportunities tailored just for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Smart Recommendations */}
              <div className="casino-neon-card">
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <div className="absolute inset-0 bg-turquoise rounded-full blur-sm opacity-50"></div>
                  <div className="relative w-full h-full bg-black border-2 border-turquoise rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-turquoise mb-2 text-lg">🎯 Smart Recommendations</h3>
                <p className="text-sm text-gray-300">Get personalized casino and bonus suggestions based on your preferences</p>
              </div>
              
              {/* 24/7 Support */}
              <div className="casino-neon-card">
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <div className="absolute inset-0 bg-orange rounded-full blur-sm opacity-50"></div>
                  <div className="relative w-full h-full bg-black border-2 border-orange rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-orange mb-2 text-lg">⏰ 24/7 Support</h3>
                <p className="text-sm text-gray-300">Available anytime to answer your gambling questions and concerns</p>
              </div>
              
              {/* Expert Knowledge */}
              <div className="casino-neon-card">
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <div className="absolute inset-0 bg-turquoise rounded-full blur-sm opacity-50"></div>
                  <div className="relative w-full h-full bg-black border-2 border-turquoise rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-turquoise mb-2 text-lg">🧠 Expert Knowledge</h3>
                <p className="text-sm text-gray-300">Access to comprehensive casino data and industry expertise</p>
              </div>
            </div>

            {/* Neon Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="font-bold text-lg px-7 py-3 rounded-lg cursor-pointer transition-all duration-300"
                style={{
                  background: 'linear-gradient(45deg, hsl(173, 58%, 39%), hsl(173, 58%, 39%, 0.8))',
                  border: '2px solid hsl(173, 58%, 39%)',
                  color: 'black',
                  boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.4)',
                }}
                data-testid="button-start-chat"
              >
                🚀 Start Chat with AI Bot
              </button>
              <button 
                className="font-bold text-lg px-7 py-3 rounded-lg cursor-pointer transition-all duration-300"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: '2px solid hsl(24, 95%, 53%)',
                  color: 'hsl(24, 95%, 53%)',
                  backdropFilter: 'blur(10px)',
                }}
                data-testid="button-learn-more-bot"
              >
                📚 Learn More About Our Bot
              </button>
            </div>
          </div>
        </section>

        {/* AI Chatbot and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AIChatbot />
          <Newsletter />
        </div>
      </div>

      {/* Game Casino Modal */}
      <GameCasinoModal 
        isOpen={showCasinoModal}
        onClose={() => {
          setShowCasinoModal(false);
          setSelectedGame(null);
        }}
        gameName={selectedGame?.name || ""}
        casinos={allCasinos}
      />
    </div>
  );
}