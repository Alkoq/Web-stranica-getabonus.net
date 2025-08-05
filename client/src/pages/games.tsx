import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, Play, TrendingUp, Clock, Gamepad2 } from "lucide-react";
import { GameCard } from "@/components/game/game-card";
import { GameCasinoModal } from "@/components/game/game-casino-modal";

import { api } from "@/lib/api";
import type { Game } from "@shared/schema";

export default function Games() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<{name: string, id: string} | null>(null);
  const [showCasinoModal, setShowCasinoModal] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [filterBy, setFilterBy] = useState("all");

  // Fetch games from API
  const { data: games = [], isLoading: loadingGames } = useQuery<Game[]>({
    queryKey: ['/api/games', { type: filterBy !== 'all' ? filterBy : undefined, search: searchQuery }],
    queryFn: () => api.getGames({ 
      type: filterBy !== 'all' ? filterBy : undefined, 
      search: searchQuery || undefined 
    }),
  });

  const filteredGames = games.filter(game => {
    const matchesSearch = searchQuery === "" || 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === "all" || game.type.toLowerCase() === filterBy;
    return matchesSearch && matchesFilter && game.isActive;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case "rtp":
        return parseFloat(b.rtp || '0') - parseFloat(a.rtp || '0');
      case "name":
        return a.name.localeCompare(b.name);
      case "popularity":
      default:
        return a.name.localeCompare(b.name);
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

          {loadingGames ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-turquoise"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedGames.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onPlayGame={handlePlayGame} 
                />
              ))}
            </div>
          )}
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
        casinos={[]}
      />
    </div>
  );
}