import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Gamepad2, TrendingUp, Clock, Users, Star } from "lucide-react";
import { Link } from "wouter";
import { api } from "@/lib/api";
import type { Game } from "@shared/schema";

export default function GameDetail() {
  const [, params] = useRoute("/game/:id");
  const gameId = params?.id;

  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ['/api/games'],
    queryFn: () => api.getGames(),
  });

  const game = games.find(g => g.id === gameId);

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Game Not Found</h1>
            <p className="text-gray-400 mb-8">The game you're looking for doesn't exist.</p>
            <Link href="/games">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/games">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card 
                className="mb-8"
                style={{
                  border: '2px solid hsl(173, 58%, 39%, 0.3)',
                  boxShadow: '0 0 20px hsl(173, 58%, 39%, 0.2)',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle 
                        className="text-3xl mb-2"
                        style={{
                          color: 'hsl(173, 58%, 39%)',
                          textShadow: '0 0 10px hsl(173, 58%, 39%, 0.3)'
                        }}
                      >
                        {game.name}
                      </CardTitle>
                      <CardDescription className="text-lg mb-4">
                        {game.description}
                      </CardDescription>
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">
                          {game.type.charAt(0).toUpperCase() + game.type.slice(1)}
                        </Badge>
                        <span className="text-gray-400">by {game.provider}</span>
                      </div>
                    </div>
                    <Gamepad2 className="h-12 w-12 text-orange-500" />
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Game Image */}
                  <div className="mb-8">
                    <img 
                      src={game.imageUrl} 
                      alt={game.name}
                      className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                  </div>

                  {/* Game Stats */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-500">{game.rtp}%</div>
                      <div className="text-sm text-gray-400">RTP</div>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{game.volatility}</div>
                      <div className="text-sm text-gray-400">Volatility</div>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">${game.minBet}</div>
                      <div className="text-sm text-gray-400">Min Bet</div>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">${game.maxBet}</div>
                      <div className="text-sm text-gray-400">Max Bet</div>
                    </div>
                  </div>

                  {/* Game Tags */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {game.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Game Details */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-xl font-semibold mb-4">Game Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Provider:</span>
                          <span className="font-medium">{game.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Game Type:</span>
                          <span className="font-medium">{game.type.charAt(0).toUpperCase() + game.type.slice(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">RTP:</span>
                          <span className="font-medium text-green-500">{game.rtp}%</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Volatility:</span>
                          <Badge variant={game.volatility === "High" ? "destructive" : game.volatility === "Medium" ? "default" : "secondary"}>
                            {game.volatility}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Min Bet:</span>
                          <span className="font-medium">${game.minBet}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Max Bet:</span>
                          <span className="font-medium">${game.maxBet}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card 
                className="sticky top-8"
                style={{
                  border: '2px solid hsl(173, 58%, 39%, 0.3)',
                  boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.2)',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}
              >
                <CardHeader>
                  <CardTitle className="text-center">Play {game.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(game.demoUrl, '_blank')}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Try Demo
                  </Button>
                  
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3"
                  >
                    <Gamepad2 className="h-5 w-5 mr-2" />
                    Play for Real
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400 space-y-1">
                    <p>Available at top crypto casinos</p>
                    <p>18+ | T&Cs Apply | Play Responsibly</p>
                  </div>
                </CardContent>
              </Card>

              {/* Game Provider Info */}
              <Card 
                className="mt-6"
                style={{
                  border: '2px solid hsl(173, 58%, 39%, 0.3)',
                  boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.2)',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">About {game.provider}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {game.provider} is a leading game provider in the online casino industry, 
                    known for creating high-quality, innovative games with excellent graphics 
                    and engaging gameplay.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}