import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ExternalLink, 
  Star, 
  Shield, 
  Calendar, 
  CreditCard, 
  Gamepad2,
  ArrowLeft,
  Award,
  Users,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  ChevronDown,
  Gift,
  ThumbsUp
} from "lucide-react";
import { HelpfulButton } from "@/components/HelpfulButton";
import type { Casino, Bonus, Review, ExpertReview, BlogPost, Game } from "@shared/schema";
import { api } from "@/lib/api";

export default function CasinoDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [newReview, setNewReview] = useState({
    title: "",
    content: "",
    userName: "",
    overallRating: 5,
    bonusesRating: 5,
    designRating: 5,
    payoutsRating: 5,
    customerSupportRating: 5,
    gameSelectionRating: 5,
    mobileExperienceRating: 5
  });
  
  const { data: casino, isLoading: casinoLoading } = useQuery<Casino>({
    queryKey: ['/api/casinos', id],
    enabled: !!id
  });

  // Fetch expert reviews for this casino
  const { data: expertReviews = [] } = useQuery<ExpertReview[]>({
    queryKey: ['/api/expert-reviews', id],
    queryFn: () => api.getExpertReviews(id!),
    enabled: !!id
  });

  // Fetch user reviews for this casino
  const { data: userReviews = [] } = useQuery<Review[]>({
    queryKey: ['/api/reviews', id],
    queryFn: () => api.getReviews(id!),
    enabled: !!id
  });

  // Fetch bonuses for this casino
  const { data: casinoBonuses = [] } = useQuery<Bonus[]>({
    queryKey: ['/api/bonuses', id],
    queryFn: () => fetch(`/api/bonuses?casinoId=${id}`).then(res => res.json()),
    enabled: !!id
  });

  // Fetch games for this casino
  const { data: casinoGames = [] } = useQuery<Game[]>({
    queryKey: ['/api/casino-games', id],
    queryFn: () => fetch(`/api/casino-games/${id}`).then(res => res.json()),
    enabled: !!id
  });

  // Fetch real blog posts (instead of mock)
  const { data: allBlogPosts = [] } = useQuery({
    queryKey: ['/api/blog'],
    queryFn: () => fetch('/api/blog').then(res => res.json()),
    enabled: !!id
  });

  // Calculate ratings from real data
  const calculateRatings = () => {
    const expertRating = expertReviews.length > 0 
      ? expertReviews.reduce((acc, review) => acc + parseFloat(review.overallRating), 0) / expertReviews.length 
      : 0;

    const userRating = userReviews.length > 0 
      ? userReviews.reduce((acc, review) => acc + review.overallRating, 0) / userReviews.length 
      : 0;

    const safetyIndex = () => {
      if (expertRating > 0 && userRating > 0) {
        return ((expertRating + userRating) / 2).toFixed(1);
      } else if (expertRating > 0) {
        return expertRating.toFixed(1);
      } else if (userRating > 0) {
        return userRating.toFixed(1);
      }
      return casino?.safetyIndex || '0';
    };

    return { expertRating, userRating, safetyIndex };
  };

  const { expertRating, userRating, safetyIndex } = calculateRatings();

  // Function to auto-generate pros and cons based on ratings
  const generateProsAndCons = (ratings: {
    bonusesRating: number;
    designRating: number; 
    payoutsRating: number;
    customerSupportRating: number;
    gameSelectionRating: number;
    mobileExperienceRating: number;
  }) => {
    const pros: string[] = [];
    const cons: string[] = [];
    
    if (ratings.bonusesRating >= 8) pros.push("Excellent bonus offers");
    else if (ratings.bonusesRating <= 4) cons.push("Limited bonus options");
    
    if (ratings.designRating >= 8) pros.push("Great user interface");
    else if (ratings.designRating <= 4) cons.push("Poor website design");
    
    if (ratings.payoutsRating >= 8) pros.push("Fast withdrawals");
    else if (ratings.payoutsRating <= 4) cons.push("Slow payout process");
    
    if (ratings.customerSupportRating >= 8) pros.push("Responsive customer support");
    else if (ratings.customerSupportRating <= 4) cons.push("Poor customer service");
    
    if (ratings.gameSelectionRating >= 8) pros.push("Wide game selection");
    else if (ratings.gameSelectionRating <= 4) cons.push("Limited game variety");
    
    if (ratings.mobileExperienceRating >= 8) pros.push("Great mobile experience");
    else if (ratings.mobileExperienceRating <= 4) cons.push("Poor mobile optimization");

    return { pros, cons };
  };

  // Using real user reviews from database now
  // Mock data removed - using dynamic data from storage
  
  const [reviewsToShow, setReviewsToShow] = useState(5);
  
  // Calculate average user ratings from real data
  const averageUserRatings = useMemo(() => {
    if (userReviews.length === 0) return null;
    
    const totals = {
      overall: 0,
      bonuses: 0,
      design: 0,
      payouts: 0,
      customerSupport: 0,
      gameSelection: 0,
      mobileExperience: 0
    };
    
    userReviews.forEach(review => {
      totals.overall += review.overallRating;
      totals.bonuses += review.bonusesRating || 0;
      totals.design += review.designRating || 0;
      totals.payouts += review.payoutsRating || 0;
      totals.customerSupport += review.customerSupportRating || 0;
      totals.gameSelection += review.gameSelectionRating || 0;
      totals.mobileExperience += review.mobileExperienceRating || 0;
    });
    
    const count = userReviews.length;
    return {
      overall: (totals.overall / count).toFixed(1),
      bonuses: (totals.bonuses / count).toFixed(1),
      design: (totals.design / count).toFixed(1),
      payouts: (totals.payouts / count).toFixed(1),
      customerSupport: (totals.customerSupport / count).toFixed(1),
      gameSelection: (totals.gameSelection / count).toFixed(1),
      mobileExperience: (totals.mobileExperience / count).toFixed(1)
    };
  }, [userReviews]);

  // Use real blog posts instead of mock data
  const relatedArticles = allBlogPosts.slice(0, 3); // Show first 3 blog posts



  const handleRatingChange = (category: string, value: number) => {
    setNewReview(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const ratingCategories = [
    { key: 'bonusesRating', label: 'Bonuses', icon: '🎁' },
    { key: 'designRating', label: 'Design', icon: '🎨' },
    { key: 'payoutsRating', label: 'Payouts', icon: '💰' },
    { key: 'customerSupportRating', label: 'Support', icon: '🎧' },
    { key: 'gameSelectionRating', label: 'Games', icon: '🎮' },
    { key: 'mobileExperienceRating', label: 'Mobile', icon: '📱' }
  ];

  // Mutation for creating reviews
  const createReviewMutation = useMutation({
    mutationFn: (reviewData: any) => api.createReview(reviewData),
    onSuccess: () => {
      // Reset form
      setNewReview({
        title: "",
        content: "",
        userName: "",
        overallRating: 5,
        bonusesRating: 5,
        designRating: 5,
        payoutsRating: 5,
        customerSupportRating: 5,
        gameSelectionRating: 5,
        mobileExperienceRating: 5
      });
      // Show success message
      toast({
        title: "Review Submitted!",
        description: "Your review has been successfully submitted and will appear shortly.",
        variant: "default",
      });
      // Refresh reviews
      queryClient.invalidateQueries({ queryKey: ['/api/reviews', id] });
    },
    onError: (error: any) => {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmitReview = () => {
    if (!id || !newReview.userName.trim() || !newReview.title.trim() || !newReview.content.trim()) {
      return;
    }

    // Calculate overall rating as average of all ratings
    const overallRating = Math.round((
      newReview.bonusesRating +
      newReview.designRating +
      newReview.payoutsRating +
      newReview.customerSupportRating +
      newReview.gameSelectionRating +
      newReview.mobileExperienceRating
    ) / 6);

    // Generate pros and cons based on ratings
    const { pros, cons } = generateProsAndCons(newReview);

    const reviewData = {
      casinoId: id,
      title: newReview.title,
      content: newReview.content,
      userName: newReview.userName,
      overallRating: overallRating,
      bonusesRating: newReview.bonusesRating,
      designRating: newReview.designRating,
      payoutsRating: newReview.payoutsRating,
      customerSupportRating: newReview.customerSupportRating,
      gameSelectionRating: newReview.gameSelectionRating,
      mobileExperienceRating: newReview.mobileExperienceRating,
      pros: pros,
      cons: cons,
      isVerified: false,
      isPublished: true
    };

    createReviewMutation.mutate(reviewData);
  };

  if (casinoLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!casino) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Casino not found</h1>
          <Link href="/casinos">
            <Button>Back to Casinos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/casinos">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Casinos
          </Button>
        </Link>

        {/* Casino Header */}
        <Card className="mb-8" style={{
          border: '2px solid hsl(173, 58%, 39%, 0.3)',
          boxShadow: '0 0 20px hsl(173, 58%, 39%, 0.2)',
        }}>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Casino Logo & Basic Info */}
              <div className="flex-1">
                <div className="flex items-start gap-6 mb-6">
                  <img
                    src={casino.logoUrl || 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=80&h=80&fit=crop'}
                    alt={`${casino.name} logo`}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h1 
                      className="text-4xl font-bold mb-2"
                      style={{
                        color: 'hsl(173, 58%, 39%)',
                        textShadow: '0 0 15px hsl(173, 58%, 39%, 0.4)'
                      }}
                    >
                      {casino.name}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">
                      {casino.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <span className="font-semibold">Safety: {safetyIndex()}</span>
                      </div>
                      {expertRating > 0 && (
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-turquoise" />
                          <span className="font-semibold">Expert: {expertRating.toFixed(1)}/10</span>
                        </div>
                      )}
                      {userRating > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-yellow-500" />
                          <span className="font-semibold">Users: {userRating.toFixed(1)}/10 ({userReviews.length})</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span>Est. {casino.establishedYear}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Casino Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-turquoise">Payment Methods</h3>
                    <div className="flex flex-wrap gap-2">
                      {casino.paymentMethods?.map((method, index) => (
                        <Badge key={index} variant="secondary">{method}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 text-turquoise">Supported Currencies</h3>
                    <div className="flex flex-wrap gap-2">
                      {casino.supportedCurrencies?.map((currency, index) => (
                        <Badge key={index} variant="outline">{currency}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 text-turquoise">Game Providers</h3>
                    <div className="flex flex-wrap gap-2">
                      {casino.gameProviders?.slice(0, 5).map((provider, index) => (
                        <Badge key={index}>{provider}</Badge>
                      ))}
                      {casino.gameProviders && casino.gameProviders.length > 5 && (
                        <Badge variant="secondary">+{casino.gameProviders.length - 5} more</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 text-turquoise">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {casino.features?.map((feature, index) => (
                        <Badge key={index} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Play Now Button */}
              <div className="lg:w-64 flex-shrink-0">
                <Card className="p-6 text-center bg-gradient-to-br from-turquoise/10 to-orange/10">
                  <Button 
                    size="lg" 
                    className="w-full mb-4 bg-gradient-to-r from-turquoise to-orange hover:from-turquoise/90 hover:to-orange/90 text-white border-2 border-white/30 hover:border-white/50 font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                    style={{
                      boxShadow: '0 0 30px hsl(173, 58%, 39%, 0.3), 0 0 40px hsl(24, 95%, 53%, 0.2)'
                    }}
                    onClick={() => window.open(casino.affiliateUrl || casino.websiteUrl, '_blank')}
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Play Now
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Click to visit official website
                  </p>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Casino Bonuses Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-turquoise">
              <Gift className="h-6 w-6" />
              Available Bonuses
            </CardTitle>
            <CardDescription>
              Exclusive bonus offers for this casino
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {casinoBonuses.length > 0 ? casinoBonuses.map((bonus) => (
                <Link key={bonus.id} href={`/bonus/${bonus.id}`}>
                  <Card className="flex-shrink-0 w-80 border-turquoise/30 hover:border-turquoise/60 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg text-turquoise">{bonus.title}</h4>
                          <p className="text-2xl font-bold text-orange">{bonus.amount}</p>
                        </div>
                        <Badge variant="secondary" className="bg-turquoise/10 text-turquoise">
                          {bonus.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {bonus.description}
                      </p>
                      
                      <div className="space-y-2">
                        {bonus.code ? (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Code:</span>
                            <Badge variant="outline" className="font-mono">
                              {bonus.code}
                            </Badge>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No code required - automatic bonus
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Valid until: {bonus.validUntil ? new Date(bonus.validUntil).toLocaleDateString() : 'No expiration'}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full btn-neon-turquoise" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(casino?.affiliateUrl || casino?.websiteUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {bonus.code ? 'Claim with Code' : 'Claim Bonus'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No bonuses available for this casino at the moment.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expert Review Section */}
        <Card className="mb-8" style={{
          border: '2px solid hsl(24, 95%, 53%, 0.3)',
          boxShadow: '0 0 20px hsl(24, 95%, 53%, 0.2)',
        }}>
          <CardHeader>
            <CardTitle 
              className="text-2xl flex items-center gap-2"
              style={{
                color: 'hsl(24, 95%, 53%)',
                textShadow: '0 0 10px hsl(24, 95%, 53%, 0.3)'
              }}
            >
              <Award className="h-6 w-6" />
              Expert Review
            </CardTitle>
            <CardDescription>
              Professional analysis by GetABonus.net experts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expertReviews.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rating Categories */}
                <div className="space-y-4">
                  {expertReviews[0] && Object.entries(expertReviews[0]).filter(([key]) => 
                    key.endsWith('Rating') && key !== 'overallRating'
                  ).map(([key, value]) => {
                    const rating = parseFloat(value as string);
                    const explanationKey = key.replace('Rating', 'Explanation');
                    const explanation = expertReviews[0][explanationKey as keyof ExpertReview] as string;
                    const categoryName = key.replace('Rating', '').replace(/([A-Z])/g, ' $1').trim();
                    
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                          </span>
                          <span className="font-bold text-lg text-turquoise">{rating.toFixed(1)}/10</span>
                        </div>
                        <Progress value={rating * 10} className="mb-2" />
                        <p className="text-sm text-muted-foreground">{explanation}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Rating & Summary */}
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-turquoise/10 to-orange/10 rounded-lg">
                    <div className="text-4xl font-bold text-turquoise mb-2">
                      {parseFloat(expertReviews[0].overallRating).toFixed(1)}/10
                    </div>
                    <div className="text-lg font-semibold mb-2">Overall Rating</div>
                    <div className="flex justify-center">
                      <Progress value={parseFloat(expertReviews[0].overallRating) * 10} className="w-32" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-orange">Expert Summary</h4>
                    <p className="text-muted-foreground">{expertReviews[0].summary}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No expert review available for this casino yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Average User Ratings Section */}
        {averageUserRatings && (
          <Card className="mb-8" style={{
            border: '2px solid hsl(24, 95%, 53%, 0.3)',
            boxShadow: '0 0 15px hsl(24, 95%, 53%, 0.1)',
          }}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-orange">
                <TrendingUp className="h-6 w-6" />
                Average User Ratings
              </CardTitle>
              <CardDescription>
                Based on {userReviews.length} player reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange mb-2">
                    {averageUserRatings.overall}/10
                  </div>
                  <div className="text-sm font-medium">Overall Rating</div>
                  <Progress value={parseFloat(averageUserRatings.overall) * 10} className="mt-2" />
                </div>
                
                {[
                  { key: 'bonuses', label: 'Bonuses', icon: '🎁' },
                  { key: 'design', label: 'Design', icon: '🎨' },
                  { key: 'payouts', label: 'Payouts', icon: '💰' },
                  { key: 'customerSupport', label: 'Support', icon: '🎧' },
                  { key: 'gameSelection', label: 'Games', icon: '🎮' },
                  { key: 'mobileExperience', label: 'Mobile', icon: '📱' }
                ].map((category) => {
                  const avgRating = averageUserRatings[category.key as keyof typeof averageUserRatings] as string;
                  return (
                    <div key={category.key} className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg">{category.icon}</span>
                        <div className="text-2xl font-bold text-turquoise">
                          {avgRating}/10
                        </div>
                      </div>
                      <div className="text-sm font-medium">{category.label}</div>
                      <Progress value={parseFloat(avgRating) * 10} className="mt-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Reviews Section */}
        <Card className="mb-8" style={{
          border: '2px solid hsl(173, 58%, 39%, 0.3)',
          boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.1)',
        }}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-turquoise">
              <Users className="h-6 w-6" />
              User Reviews ({userReviews.length})
            </CardTitle>
            <CardDescription>
              Real player experiences and detailed ratings from our community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Existing Reviews - Show limited amount */}
              {userReviews.slice(0, reviewsToShow).map((review) => (
                <Card key={review.id} className="border-l-4 border-l-turquoise bg-gradient-to-r from-turquoise/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-xl text-turquoise mb-2">
                          {review.title.length > 50 ? `${review.title.substring(0, 50)}...` : review.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{review.userName}</span>
                            {review.isVerified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-3xl font-bold text-turquoise mb-1">{review.overallRating}/10</div>
                        <div className="text-sm font-medium text-muted-foreground">Overall Rating</div>
                      </div>
                    </div>
                    
                    {/* User's Written Review */}
                    <div className="mb-6 p-4 bg-muted/30 rounded-lg border-l-2 border-l-orange">
                      <h5 className="font-semibold text-orange mb-2">Player's Experience:</h5>
                      <p className="text-muted-foreground leading-relaxed">
                        {review.content.length > 300 ? `${review.content.substring(0, 300)}...` : review.content}
                      </p>
                    </div>
                    
                    {/* Category Ratings */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-lg mb-4 text-turquoise">Detailed Ratings (1-10 scale):</h5>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {ratingCategories.map((category) => {
                          const rating = review[category.key as keyof Review] as number;
                          return (
                            <div key={category.key} className="bg-background/50 p-3 rounded-lg border">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{category.icon}</span>
                                  <span className="text-sm font-medium">{category.label}</span>
                                </div>
                                <span className="text-lg font-bold text-turquoise">{rating}/10</span>
                              </div>
                              <Progress value={rating * 10} className="h-2" />
                              <div className="mt-1 text-xs text-muted-foreground">
                                {rating >= 8 ? 'Excellent' : rating >= 6 ? 'Good' : rating >= 4 ? 'Average' : 'Poor'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Auto-Generated Pros & Cons */}
                    {(review.pros?.length || review.cons?.length) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {review.pros && review.pros.length > 0 && (
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                            <h5 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5" />
                              What Players Loved
                            </h5>
                            <ul className="space-y-2">
                              {review.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-green-700 dark:text-green-300">{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {review.cons && review.cons.length > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                            <h5 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                              <span className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                                <span className="text-white text-xs">✕</span>
                              </span>
                              Areas for Improvement
                            </h5>
                            <ul className="space-y-2">
                              {review.cons.map((con, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <span className="h-4 w-4 rounded-full bg-red-500 mt-0.5 flex-shrink-0"></span>
                                  <span className="text-red-700 dark:text-red-300">{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Review Summary */}
                    <div className="mt-4 pt-4 border-t border-muted-foreground/20">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <span className="italic">Pros & cons automatically generated based on rating scores</span>
                        </div>
                        <HelpfulButton 
                          reviewId={review.id} 
                          initialHelpfulVotes={review.helpfulVotes || 0}
                          variant="ghost"
                          size="sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More Reviews Button */}
              {reviewsToShow < userReviews.length && (
                <div className="text-center py-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setReviewsToShow(prev => Math.min(prev + 5, userReviews.length))}
                    className="border-turquoise text-turquoise hover:bg-turquoise hover:text-white"
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    View More Reviews ({userReviews.length - reviewsToShow} remaining)
                  </Button>
                </div>
              )}

              {/* Add Review Form */}
              <Card className="border-2 border-dashed border-turquoise/30">
                <CardHeader>
                  <CardTitle className="text-lg">Write Your Review</CardTitle>
                  <CardDescription>
                    Share your experience with other players
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userName">Your Name</Label>
                        <Input
                          id="userName"
                          value={newReview.userName}
                          onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Review Title</Label>
                        <Input
                          id="title"
                          value={newReview.title}
                          onChange={(e) => {
                            if (e.target.value.length <= 50) {
                              setNewReview(prev => ({ ...prev, title: e.target.value }))
                            }
                          }}
                          placeholder="Summarize your experience (max 50 characters)"
                          maxLength={50}
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {newReview.title.length}/50 characters
                        </div>
                      </div>
                    </div>

                    {/* Rating Categories */}
                    <div>
                      <Label className="text-base font-semibold">Rate Your Experience (1-10)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {ratingCategories.map((category) => (
                          <div key={category.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                {category.label}
                              </Label>
                              <span className="font-bold text-turquoise">
                                {newReview[category.key as keyof typeof newReview]}
                              </span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={newReview[category.key as keyof typeof newReview]}
                              onChange={(e) => handleRatingChange(category.key, parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="content">Your Review</Label>
                      <Textarea
                        id="content"
                        value={newReview.content}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            setNewReview(prev => ({ ...prev, content: e.target.value }))
                          }
                        }}
                        placeholder="Share your detailed casino experience - include specifics about gameplay, bonuses, withdrawals, and customer service (max 500 characters)..."
                        rows={6}
                        maxLength={500}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {newReview.content.length}/500 characters - Be detailed to help other players
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-turquoise hover:bg-turquoise/90"
                      onClick={handleSubmitReview}
                      disabled={createReviewMutation.isPending || !newReview.userName.trim() || !newReview.title.trim() || !newReview.content.trim()}
                      data-testid="button-submit-review"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-orange">
                  <TrendingUp className="h-6 w-6" />
                  Related Articles
                </CardTitle>
                <CardDescription>
                  Learn more about crypto casino strategies and tips
                </CardDescription>
              </div>
              <Link href="/blog">
                <Button variant="outline" className="text-orange border-orange hover:bg-orange hover:text-white">
                  View All Articles
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {relatedArticles.map((article) => (
                  <Card key={article.id} className="flex-shrink-0 w-80 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={article.featuredImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop'}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground">{article.readTime} min read</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                      <Link href={`/blog/${article.slug}`}>
                        <Button variant="ghost" className="mt-3 p-0 h-auto text-turquoise hover:text-turquoise/80">
                          Read More <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Casino Games */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-turquoise">
                  <Gamepad2 className="h-6 w-6" />
                  Popular Games at {casino.name}
                </CardTitle>
                <CardDescription>
                  Top games available at this casino
                </CardDescription>
              </div>
              <Link href="/games">
                <Button variant="outline" className="text-turquoise border-turquoise hover:bg-turquoise hover:text-white">
                  View All Games
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {casinoGames.slice(0, 10).map((game, index) => (
                  <Card key={`${game.id}-${index}`} className="flex-shrink-0 w-72 hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={game.imageUrl || 'https://images.unsplash.com/photo-1594736797933-d0d9770d1a15?w=300&h=200&fit=crop'}
                        alt={game.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{game.provider}</Badge>
                        <Badge variant={game.volatility === "High" ? "destructive" : game.volatility === "Medium" ? "default" : "secondary"}>
                          {game.volatility}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{game.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {game.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>RTP: <span className="font-semibold text-green-600">{game.rtp}%</span></span>
                        <span>Max Win: ${game.maxBet}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Demo
                        </Button>
                        <Link href={`/game/${game.id}`} className="flex-1">
                          <Button size="sm" className="w-full bg-turquoise hover:bg-turquoise/90">
                            Play
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}