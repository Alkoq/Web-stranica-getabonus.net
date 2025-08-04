import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, Play, TrendingUp, Clock, Gamepad2 } from "lucide-react";
import { GameCasinoModal } from "@/components/game/game-casino-modal";

export default function Games() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<{name: string, id: string} | null>(null);
  const [showCasinoModal, setShowCasinoModal] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [filterBy, setFilterBy] = useState("all");

  // Mock games data - in real app this would come from API
  const games = [
    {
      id: "1",
      name: "Book of Dead",
      provider: "Play'n GO",
      category: "Slots",
      rtp: "96.21%",
      volatility: "High",
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=200&fit=crop",
      demoUrl: "#",
      description: "Adventure-themed slot with expanding symbols and free spins."
    },
    {
      id: "2", 
      name: "Starburst",
      provider: "NetEnt",
      category: "Slots",
      rtp: "96.09%",
      volatility: "Low",
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=300&h=200&fit=crop",
      demoUrl: "#",
      description: "Classic arcade-style slot with expanding wilds."
    },
    {
      id: "3",
      name: "Lightning Roulette",
      provider: "Evolution Gaming",
      category: "Live Casino",
      rtp: "97.30%", 
      volatility: "Medium",
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1521130726557-5e7e0c665fd3?w=300&h=200&fit=crop",
      demoUrl: "#",
      description: "Live roulette with random lightning multipliers up to 500x."
    },
    {
      id: "4",
      name: "Blackjack Classic",
      provider: "NetEnt",
      category: "Table Games",
      rtp: "99.28%",
      volatility: "Low",
      rating: 4.7,
      imageUrl: "https://images.unsplash.com/photo-1569819563721-99d144ffa9b1?w=300&h=200&fit=crop",
      demoUrl: "#",
      description: "Classic blackjack with optimal strategy hints."
    },
  ];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === "all" || game.category.toLowerCase() === filterBy;
    return matchesSearch && matchesFilter;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "rtp":
        return parseFloat(b.rtp) - parseFloat(a.rtp);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handlePlayGame = (game: any) => {
    setSelectedGame({ name: game.name, id: game.id });
    setShowCasinoModal(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-turquoise to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              🎮 Casino Games
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
              Discover thousands of casino games from top providers. Play for free or find the best casinos.
            </p>
            
            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games by name or provider..."
                  className="pl-12 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="slots">Slots</SelectItem>
                    <SelectItem value="table games">Table Games</SelectItem>
                    <SelectItem value="live casino">Live Casino</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="rtp">RTP</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Found {sortedGames.length} games
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedGames.map((game) => (
              <Card 
                key={game.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                style={{
                  border: '2px solid hsl(173, 58%, 39%, 0.3)',
                  boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.2)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.border = '2px solid hsl(173, 58%, 39%, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 25px hsl(173, 58%, 39%, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = '2px solid hsl(173, 58%, 39%, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 15px hsl(173, 58%, 39%, 0.2)';
                }}
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={game.imageUrl} 
                      alt={game.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {game.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center space-x-1 bg-black/70 rounded px-2 py-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">{game.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <CardTitle 
                    className="text-lg mb-2"
                    style={{
                      color: 'hsl(173, 58%, 39%)',
                      textShadow: '0 0 10px hsl(173, 58%, 39%, 0.3)'
                    }}
                  >
                    {game.name}
                  </CardTitle>
                  <CardDescription className="mb-3 text-sm">
                    {game.description}
                  </CardDescription>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Provider:</span>
                      <span className="font-medium">{game.provider}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">RTP:</span>
                      <span className="font-medium text-green-600">{game.rtp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Volatility:</span>
                      <Badge variant={game.volatility === "High" ? "destructive" : game.volatility === "Medium" ? "default" : "secondary"}>
                        {game.volatility}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(game.demoUrl, '_blank')}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Demo
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-turquoise hover:bg-turquoise/90"
                      onClick={() => handlePlayGame(game)}
                    >
                      <Gamepad2 className="h-4 w-4 mr-1" />
                      Play
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Game Casino Modal */}
      <GameCasinoModal
        isOpen={showCasinoModal}
        onClose={() => {
          setShowCasinoModal(false);
          setSelectedGame(null);
        }}
        gameName={selectedGame?.name || ""}
      />
    </div>
  );
}