import { useRoute } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play, Star, TrendingUp, Users, ExternalLink, Calendar, Clock, MessageCircle, ThumbsUp, Shield, Award, Gamepad2, Zap, Target, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { HelpfulButton } from "@/components/HelpfulButton";
import { useToast } from "@/hooks/use-toast";
import { GameCasinoModal } from "@/components/game/game-casino-modal";
import type { Game, BlogPost, Review } from "@shared/schema";

export default function GameDetail() {
  const [, params] = useRoute("/game/:id");
  const gameId = params?.id;
  const [showCasinoModal, setShowCasinoModal] = useState(false);

  const { data: game, isLoading: gameLoading, error: gameError } = useQuery<Game>({
    queryKey: ['/api/games', gameId],
    queryFn: async () => {
      const response = await fetch(`/api/games/${gameId}`);
      if (!response.ok) {
        throw new Error('Game not found');
      }
      return response.json();
    },
    enabled: !!gameId,
  });

  const { data: relatedPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: () => api.getBlogPosts(),
  });

  // Real game reviews from API
  const { data: gameReviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews/game', gameId],
    queryFn: () => fetch(`/api/reviews/game/${gameId}`).then(res => res.json()),
    enabled: !!gameId,
  });

  // Get expert rating from API (fixed rating)
  const { data: apiRatingData } = useQuery<{ expertRating: number }>({
    queryKey: ['/api/games/rating', gameId],
    queryFn: () => fetch(`/api/games/${gameId}/rating`).then(res => res.json()),
    enabled: !!gameId,
  });

  const getCombinedRating = () => {
    const expertRating = apiRatingData?.expertRating || 0;
    
    return {
      rating: expertRating.toFixed(1),
      count: gameReviews.length,
      type: 'expert' // Uvek expert rating, ne mijenja se
    };
  };

  const ratingData = getCombinedRating();

  // Game rating criteria (1-10 scale)
  const gameRatings = {
    graphics: 8.8, // Visual quality and design
    gameplay: 8.2, // Mechanics and user experience
    rtp: 7.5, // Return to player percentage
    volatility: 8.0, // Risk/reward balance
    features: 8.6, // Bonus features and special elements
    overall: parseFloat(ratingData.rating) // Combined expert + user rating
  };

  const relatedBlogPosts = relatedPosts.filter(post => 
    post.title.toLowerCase().includes('game') ||
    post.title.toLowerCase().includes('slot') ||
    post.title.toLowerCase().includes(game?.name.toLowerCase() || '') ||
    post.tags?.some(tag => ['game', 'slot', 'casino'].some(keyword => 
      tag.toLowerCase().includes(keyword)
    ))
  ).slice(0, 3);

  if (gameLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">Loading game details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameError || !game) {
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
            {/* Featured badge removed - not in schema */}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Basic Info Card */}
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
                      <CardDescription className="text-lg">
                        {game.description}
                      </CardDescription>
                    </div>
                    <Gamepad2 className="h-12 w-12 text-orange-500" />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Game Image */}
                    <div className="space-y-4">
                      {game.imageUrl && (
                        <img 
                          src={game.imageUrl} 
                          alt={game.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* Game Stats */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-slate-800 rounded-lg">
                          <p className="text-sm text-gray-400">RTP</p>
                          <p className="text-2xl font-bold text-green-500">{game.rtp}%</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800 rounded-lg">
                          <p className="text-sm text-gray-400">Volatility</p>
                          <p className="text-lg font-bold text-orange-500 capitalize">{game.volatility}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Provider:</span>
                          <span className="font-semibold">{game.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <Badge variant="secondary" className="capitalize">
                            {game.type}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <Badge variant={game.isActive ? "default" : "destructive"}>
                            {game.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    {game.demoUrl && (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => game.demoUrl && window.open(game.demoUrl, '_blank')}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Play Demo
                      </Button>
                    )}
                    <Button 
                      className="flex-1 bg-turquoise hover:bg-turquoise/90"
                      onClick={() => setShowCasinoModal(true)}
                      data-testid="button-play-for-real"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Play for Real
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Review Tabs */}
              <Tabs defaultValue="expert-review" className="mb-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="expert-review">Expert Review</TabsTrigger>
                  <TabsTrigger value="user-reviews">User Reviews</TabsTrigger>
                  <TabsTrigger value="related-articles">Related Articles</TabsTrigger>
                </TabsList>

                {/* Expert Review Tab */}
                <TabsContent value="expert-review">
                  <Card className="bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center text-turquoise">
                        <Award className="h-5 w-5 mr-2" />
                        Expert Game Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Overall Rating */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">Overall Rating</h3>
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-yellow-500 mr-1" />
                            <span className="text-2xl font-bold text-yellow-500">
                              {ratingData.rating}
                            </span>
                            <span className="text-muted-foreground">/10</span>
                          </div>
                        </div>
                        <Progress value={parseFloat(ratingData.rating) * 10} className="h-2" />
                      </div>

                      {/* Detailed Ratings */}
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-2 text-purple-500" />
                                <span>Graphics & Design</span>
                              </div>
                              <span className="font-semibold">{gameRatings.graphics.toFixed(1)}/10</span>
                            </div>
                            <Progress value={gameRatings.graphics * 10} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Outstanding visual quality with immersive animations
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Gamepad2 className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Gameplay</span>
                              </div>
                              <span className="font-semibold">{gameRatings.gameplay.toFixed(1)}/10</span>
                            </div>
                            <Progress value={gameRatings.gameplay * 10} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Smooth mechanics with engaging user interface
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                                <span>RTP Value</span>
                              </div>
                              <span className="font-semibold">{gameRatings.rtp.toFixed(1)}/10</span>
                            </div>
                            <Progress value={gameRatings.rtp * 10} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Fair return to player percentage at {game.rtp}%
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Target className="h-4 w-4 mr-2 text-orange-500" />
                                <span>Volatility Balance</span>
                              </div>
                              <span className="font-semibold">{gameRatings.volatility.toFixed(1)}/10</span>
                            </div>
                            <Progress value={gameRatings.volatility * 10} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Well-balanced {game.volatility} volatility for diverse players
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                                <span>Bonus Features</span>
                              </div>
                              <span className="font-semibold">{gameRatings.features.toFixed(1)}/10</span>
                            </div>
                            <Progress value={gameRatings.features * 10} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Exciting bonus rounds and special game features
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Expert Summary</h4>
                        <p className="text-muted-foreground">
                          {game.name} by {game.provider} delivers an excellent gaming experience with {game.rtp}% RTP 
                          and {game.volatility} volatility. The game features impressive graphics, smooth gameplay, 
                          and engaging bonus features that keep players entertained. This {game.type} game is suitable 
                          for both casual and serious players looking for quality entertainment.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* User Reviews Tab */}
                <TabsContent value="user-reviews">
                  <Card className="bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center text-turquoise">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        User Reviews ({gameReviews.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reviewsLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-pulse">
                            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-gray-400">Loading reviews...</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-6">
                            {gameReviews.map((review: Review) => (
                              <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-turquoise to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                                      {review.userName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                      <p className="font-semibold">{review.userName || 'Anonymous'}</p>
                                      <div className="flex items-center">
                                        <span className="text-sm text-muted-foreground">
                                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                    <span className="font-semibold">{review.overallRating}/10</span>
                                  </div>
                                </div>
                                <p className="text-muted-foreground ml-11">{review.content}</p>
                                <div className="flex items-center mt-2 ml-11">
                                  <HelpfulButton 
                                    reviewId={review.id} 
                                    initialHelpfulVotes={review.helpfulVotes || 0}
                                    variant="ghost"
                                    size="sm"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <GameReviewForm gameId={gameId} onReviewSubmitted={() => {
                            // Refresh reviews after submission
                            window.location.reload();
                          }} />
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Related Articles Tab */}
                <TabsContent value="related-articles">
                  <Card className="bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center text-turquoise">
                        <Calendar className="h-5 w-5 mr-2" />
                        Related Articles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {relatedBlogPosts.length > 0 ? (
                        <div className="space-y-4">
                          {relatedBlogPosts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`}>
                              <div className="flex items-start p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                                {post.featuredImage && (
                                  <img 
                                    src={post.featuredImage} 
                                    alt={post.title}
                                    className="w-16 h-16 rounded object-cover mr-4"
                                  />
                                )}
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1">{post.title}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {post.excerpt}
                                  </p>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Unknown date'}
                                    <span className="mx-2">•</span>
                                    <Clock className="h-3 w-3 mr-1" />
                                    {post.readTime || 5} min read
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No related articles found</p>
                          <Link href="/blog">
                            <Button variant="outline" className="mt-4">
                              Browse All Articles
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card 
                className="sticky top-8 mb-6"
                style={{
                  border: '2px solid hsl(173, 58%, 39%, 0.3)',
                  boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.2)',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}
              >
                <CardHeader>
                  <CardTitle className="text-center">Play This Game</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {game.demoUrl && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => game.demoUrl && window.open(game.demoUrl, '_blank')}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Try Demo
                    </Button>
                  )}
                  
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3"
                    onClick={() => setShowCasinoModal(true)}
                    data-testid="button-play-for-real-sidebar"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Play for Real Money
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400 space-y-1">
                    <p>18+ | T&Cs Apply | Play Responsibly</p>
                  </div>
                </CardContent>
              </Card>

              {/* Game Stats Card */}
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-sm">Game Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Provider</span>
                    <span className="text-sm font-medium">{game.provider}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">RTP</span>
                    <span className="text-sm font-medium text-green-500">{game.rtp}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volatility</span>
                    <span className="text-sm font-medium capitalize">{game.volatility}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="text-sm font-medium capitalize">{game.type}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Game Casino Modal */}
      <GameCasinoModal
        isOpen={showCasinoModal}
        onClose={() => setShowCasinoModal(false)}
        gameName={game?.name || ""}
        gameId={game?.id || ""}
      />
    </div>
  );
}

// Game Review Form Component
function GameReviewForm({ gameId, onReviewSubmitted }: { gameId?: string; onReviewSubmitted: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reviewSchema = z.object({
    userName: z.string().min(2, "Username must be at least 2 characters"),
    title: z.string().min(5, "Title must be at least 5 characters"), 
    content: z.string().min(10, "Review must be at least 10 characters").max(450, "Review cannot exceed 450 characters"),
    overallRating: z.string(),
  });

  type GameReviewFormData = z.infer<typeof reviewSchema>;

  const form = useForm<GameReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      userName: "",
      title: "",
      content: "",
      overallRating: "8",
    },
  });

  const onSubmit = async (data: GameReviewFormData) => {
    if (!gameId) return;
    
    setIsSubmitting(true);

    try {
      const reviewData = {
        ...data,
        overallRating: parseInt(data.overallRating),
        gameId: gameId,
      };

      const response = await fetch('/api/reviews/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      toast({
        title: "Review submitted successfully!",
        description: "Thank you for sharing your experience with this game.",
      });

      // Reset form
      form.reset();
      
      // Invalidate cache and refresh
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/game', gameId] });
      onReviewSubmitted();

    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-muted/20 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Share how fair and legitimate this game feels to you. Help other players make informed decisions.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Title</FormLabel>
                <FormControl>
                  <Input placeholder="Summarize your game experience" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overallRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Rating</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="10">10 - Outstanding</SelectItem>
                    <SelectItem value="9">9 - Excellent</SelectItem>
                    <SelectItem value="8">8 - Very Good</SelectItem>
                    <SelectItem value="7">7 - Good</SelectItem>
                    <SelectItem value="6">6 - Above Average</SelectItem>
                    <SelectItem value="5">5 - Average</SelectItem>
                    <SelectItem value="4">4 - Below Average</SelectItem>
                    <SelectItem value="3">3 - Poor</SelectItem>
                    <SelectItem value="2">2 - Very Poor</SelectItem>
                    <SelectItem value="1">1 - Terrible</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your detailed experience with this game - RTP, fairness, graphics, bonus features, etc. (Max 450 characters)"
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <div className="text-right text-sm text-muted-foreground">
                  {field.value?.length || 0}/450
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-turquoise hover:bg-turquoise/90"
            disabled={isSubmitting}
            data-testid="button-submit-game-review"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
}