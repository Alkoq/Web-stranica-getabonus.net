import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Gift, Calendar, Shield, ExternalLink, Star, MessageCircle, ThumbsUp, Clock, Percent, Award, DollarSign, Users, Info } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { HelpfulButton } from "@/components/HelpfulButton";
import type { Bonus, Casino, Review, BlogPost } from "@shared/schema";

export default function BonusDetail() {
  const [, params] = useRoute("/bonus/:id");
  const bonusId = params?.id;

  const { data: bonuses = [] } = useQuery<Bonus[]>({
    queryKey: ['/api/bonuses'],
    queryFn: () => api.getBonuses(),
  });

  const { data: casinos = [] } = useQuery<Casino[]>({
    queryKey: ['/api/casinos'],
    queryFn: () => api.getCasinos(),
  });

  const { data: relatedPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: () => api.getBlogPosts(),
  });

  // Fetch real bonus reviews from API
  const { data: bonusReviews = [] } = useQuery<Review[]>({
    queryKey: ['/api/reviews/bonus', bonusId],
    queryFn: () => bonusId ? fetch(`/api/reviews/bonus/${bonusId}`).then(res => res.json()) : Promise.resolve([]),
    enabled: !!bonusId,
  });

  // Fetch bonus ratings
  const { data: bonusRatings } = useQuery({
    queryKey: ['/api/bonuses', bonusId, 'ratings'],
    queryFn: () => bonusId ? fetch(`/api/bonuses/${bonusId}/ratings`).then(res => res.json()) : Promise.resolve({ userReviewsAverage: 0, totalReviews: 0 }),
    enabled: !!bonusId,
  });

  const bonus = bonuses.find(b => b.id === bonusId);
  const casino = bonus ? casinos.find(c => c.id === bonus.casinoId) : null;

  // Calculate real ratings from reviews - use dynamic data
  const calculateRatings = () => {
    const userAvg = bonusRatings?.userReviewsAverage || 0;
    
    if (userAvg === 0) {
      return {
        value: 0,
        terms: 0, 
        wagering: 0,
        games: 0,
        cashout: 0,
        overall: 0
      };
    }

    // For detailed breakdown, use overall rating as base
    return {
      value: userAvg,
      terms: Math.max(0, userAvg - 0.5),
      wagering: Math.max(0, userAvg - 1.2),
      games: Math.min(10, userAvg + 0.4),
      cashout: Math.min(10, userAvg + 0.2),
      overall: userAvg
    };
  };

  const bonusCalculatedRatings = calculateRatings();

  const relatedBlogPosts = relatedPosts.filter(post => 
    post.title.toLowerCase().includes('bonus') ||
    post.title.toLowerCase().includes(casino?.name.toLowerCase() || '') ||
    post.tags?.some(tag => tag.toLowerCase().includes('bonus'))
  ).slice(0, 3);

  if (!bonus || !casino) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Bonus Not Found</h1>
            <p className="text-gray-400 mb-8">The bonus you're looking for doesn't exist.</p>
            <Link href="/bonuses">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bonuses
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
            <Link href="/bonuses">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bonuses
              </Button>
            </Link>
            {bonus.isFeatured && (
              <Badge className="bg-orange-500">Featured</Badge>
            )}
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
                        {bonus.title}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {bonus.description}
                      </CardDescription>
                    </div>
                    <Gift className="h-12 w-12 text-orange-500" />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bonus Amount:</span>
                        <span className="font-bold text-orange-500 text-xl">
                          {bonus.amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bonus Type:</span>
                        <Badge variant="secondary">
                          {bonus.type.charAt(0).toUpperCase() + bonus.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge variant={bonus.isActive ? "default" : "destructive"}>
                          {bonus.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-center">
                        <Link href={`/casino/${casino.id}`}>
                          <div className="flex items-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                            {casino.logoUrl && (
                              <img 
                                src={casino.logoUrl} 
                                alt={casino.name}
                                className="w-12 h-12 rounded mr-4"
                              />
                            )}
                            <div className="text-left">
                              <p className="font-semibold">{casino.name}</p>
                              <p className="text-sm text-gray-400">View Casino Details</p>
                            </div>
                            <ExternalLink className="h-4 w-4 ml-auto" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-orange-500" />
                      Terms & Conditions
                    </h3>
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <p className="text-gray-300">{bonus.terms}</p>
                    </div>
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
                        Expert Bonus Analysis
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
                              {bonusCalculatedRatings.overall.toFixed(1)}
                            </span>
                            <span className="text-muted-foreground">/10</span>
                          </div>
                        </div>
                        <Progress value={bonusCalculatedRatings.overall * 10} className="h-2" />
                      </div>

                      {/* Detailed Ratings */}
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                <span>Bonus Value</span>
                              </div>
                              <span className="font-semibold">{bonusCalculatedRatings.value.toFixed(1)}/10</span>
                            </div>
                            <Progress value={bonusCalculatedRatings.value * 10} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Excellent bonus amount compared to wagering requirements
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Info className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Terms Clarity</span>
                              </div>
                              <span className="font-semibold">{bonusCalculatedRatings.terms.toFixed(1)}/10</span>
                            </div>
                            <Progress value={bonusCalculatedRatings.terms * 10} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Terms are mostly clear but could be more detailed
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Percent className="h-4 w-4 mr-2 text-orange-500" />
                                <span>Wagering Requirements</span>
                              </div>
                              <span className="font-semibold">{bonusCalculatedRatings.wagering.toFixed(1)}/10</span>
                            </div>
                            <Progress value={bonusCalculatedRatings.wagering * 10} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Moderate wagering requirements, could be lower
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-purple-500" />
                                <span>Game Selection</span>
                              </div>
                              <span className="font-semibold">{bonusCalculatedRatings.games.toFixed(1)}/10</span>
                            </div>
                            <Progress value={bonusCalculatedRatings.games * 10} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Good variety of games available for bonus play
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-red-500" />
                                <span>Cashout Speed</span>
                              </div>
                              <span className="font-semibold">{bonusCalculatedRatings.cashout.toFixed(1)}/10</span>
                            </div>
                            <Progress value={bonusCalculatedRatings.cashout * 10} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Reasonable withdrawal limits and processing time
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Expert Summary</h4>
                        <p className="text-muted-foreground">
                          This {bonus.type} bonus offers solid value with {bonus.amount} and reasonable terms. 
                          The wagering requirements are within industry standards, and the game selection is diverse. 
                          Players should be aware of any time limitations and ensure they understand the withdrawal conditions 
                          before claiming this bonus.
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
                        User Reviews ({bonusReviews.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {bonusReviews.map((review) => (
                          <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-turquoise to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                                  {review.userName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="font-semibold">{review.userName}</p>
                                  <div className="flex items-center">
                                    {review.isVerified && (
                                      <Badge variant="secondary" className="text-xs mr-2">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
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

                      <ReviewForm bonusId={bonusId} onReviewSubmitted={() => {
                        // Refresh reviews after submission
                        window.location.reload();
                      }} />
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
                className="sticky top-8"
                style={{
                  border: '2px solid hsl(173, 58%, 39%, 0.3)',
                  boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.2)',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}
              >
                <CardHeader>
                  <CardTitle className="text-center">Claim This Bonus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3"
                    onClick={() => casino.affiliateUrl && window.open(casino.affiliateUrl, '_blank')}
                  >
                    <Gift className="h-5 w-5 mr-2" />
                    Claim Bonus Now
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400 space-y-1">
                    <p className="flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created: {bonus.createdAt ? new Date(bonus.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                    <p>18+ | T&Cs Apply | Play Responsibly</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Review Form Component
function ReviewForm({ bonusId, onReviewSubmitted }: { bonusId?: string; onReviewSubmitted: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reviewSchema = z.object({
    userName: z.string().min(2, "Username must be at least 2 characters"),
    title: z.string().min(5, "Title must be at least 5 characters"), 
    content: z.string().min(10, "Review must be at least 10 characters").max(500, "Review cannot exceed 500 characters"),
    overallRating: z.string(),
  });

  type ReviewFormData = z.infer<typeof reviewSchema>;

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      userName: "",
      title: "",
      content: "",
      overallRating: "8",
    },
  });

  const submitReview = async (values: ReviewFormData) => {
    if (!bonusId) return;
    
    setIsSubmitting(true);
    try {
      const reviewData = {
        ...values,
        overallRating: parseInt(values.overallRating),
        bonusId,
        isPublished: true,
        isVerified: false,
      };

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your experience.",
      });

      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/bonus', bonusId] });
      onReviewSubmitted();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-muted/20 rounded-lg">
      <h4 className="font-semibold mb-4 text-turquoise">Write a Review</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitReview)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="overallRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}/10 {i + 1 >= 8 ? '⭐' : i + 1 >= 6 ? '⚡' : '⚠️'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Title</FormLabel>
                <FormControl>
                  <Input placeholder="Summarize your experience" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your detailed experience with this bonus. What worked well? Any issues? Tips for other players? (Max 500 characters)"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <FormMessage />
                  <span>{field.value?.length || 0}/500</span>
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-turquoise hover:bg-turquoise/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
}