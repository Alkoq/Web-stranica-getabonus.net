import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Play, Gamepad2, TrendingUp, Clock, Star } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Game, Review } from "@shared/schema";

interface GameCardProps {
  game: Game;
  onPlayGame?: (game: Game) => void;
}

export function GameCard({ game, onPlayGame }: GameCardProps) {
  console.log('GameCard rendering for:', game.name);
  
  // Expert rating (mock for now)
  const expertRating = 8.2;
  
  // For testing, just use mock rating first
  const userRating = 0;

  // Calculate combined rating
  const getCombinedRating = () => {
    if (userRating > 0 && expertRating > 0) {
      const combined = (expertRating + userRating) / 2;
      return {
        rating: combined.toFixed(1),
        count: gameReviews.length,
      };
    } else if (expertRating > 0) {
      return {
        rating: expertRating.toFixed(1),
        count: 0,
      };
    } else if (userRating > 0) {
      return {
        rating: userRating.toFixed(1),
        count: gameReviews.length,
      };
    }
    return {
      rating: "8.2",
      count: 0,
    };
  };

  const ratingData = getCombinedRating();

  return (
    <Link href={`/game/${game.id}`}>
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer group h-full"
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
          <div className="relative" style={{position: 'relative'}}>
            <img 
              src={game.imageUrl || 'https://images.unsplash.com/photo-1594736797933-d0d9770d1a15?w=300&h=200&fit=crop'} 
              alt={game.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/70 text-white">
                {game.type.charAt(0).toUpperCase() + game.type.slice(1)}
              </Badge>
            </div>
            <div className="absolute top-2 left-2" style={{zIndex: 999, backgroundColor: 'red', padding: '8px', borderRadius: '4px'}}>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span className="text-white text-sm font-bold">8.2/10</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2">
              <div className="flex items-center space-x-1 bg-black/70 rounded px-2 py-1">
                <span className="text-white text-sm">RTP: {game.rtp}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 flex flex-col h-full">
          <CardTitle 
            className="text-lg mb-2"
            style={{
              color: 'hsl(173, 58%, 39%)',
              textShadow: '0 0 10px hsl(173, 58%, 39%, 0.3)'
            }}
          >
            {game.name}
          </CardTitle>
          <CardDescription className="mb-3 text-sm line-clamp-2">
            {game.description}
          </CardDescription>
          
          <div className="space-y-2 mb-4 flex-grow">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Provider:</span>
              <span className="font-medium">{game.provider}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">RTP:</span>
              <span className={`font-medium ${parseFloat(game.rtp || '0') >= 97 ? 'text-green-600' : parseFloat(game.rtp || '0') >= 95 ? 'text-orange-500' : 'text-red-500'}`}>
                {game.rtp}%
              </span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground">Volatility:</span>
              <Badge variant={game.volatility === "High" ? "destructive" : game.volatility === "Medium" ? "default" : "secondary"} className="text-xs">
                {game.volatility || "N/A"}
              </Badge>
            </div>
            {game.minBet && game.maxBet && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bet Range:</span>
                <span className="font-medium text-xs">
                  ${game.minBet} - ${game.maxBet}
                </span>
              </div>
            )}
            {game.tags && game.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {game.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {game.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{game.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 mt-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(game.demoUrl || '#', '_blank');
              }}
              data-testid={`button-demo-${game.id}`}
            >
              <Play className="h-4 w-4 mr-1" />
              Demo
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-turquoise hover:bg-turquoise/90"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (onPlayGame) onPlayGame(game);
              }}
              data-testid={`button-play-${game.id}`}
            >
              <Gamepad2 className="h-4 w-4 mr-1" />
              Play
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}