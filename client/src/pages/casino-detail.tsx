import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
  ChevronDown
} from "lucide-react";
import type { Casino, Bonus, Review, ExpertReview, BlogPost, Game } from "@shared/schema";

export default function CasinoDetailPage() {
  const { id } = useParams();
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

  // Mock data for demonstration - in real app these would come from API
  const expertReview: ExpertReview = {
    id: "expert-1",
    casinoId: id || "",
    authorId: "admin-1",
    bonusesRating: "8.5",
    bonusesExplanation: "Excellent welcome bonus package with reasonable wagering requirements. Regular promotions for existing players.",
    designRating: "9.2",
    designExplanation: "Modern, intuitive interface with excellent mobile optimization. Clean layout makes navigation effortless.",
    payoutsRating: "8.8",
    payoutsExplanation: "Fast crypto withdrawals usually processed within 2-4 hours. Good variety of payment methods.",
    customerSupportRating: "7.5",
    customerSupportExplanation: "24/7 live chat available but response times can vary. Email support is thorough but slower.",
    gameSelectionRating: "9.0",
    gameSelectionExplanation: "Impressive selection of 2000+ games from top providers including NetEnt, Pragmatic Play, and Evolution.",
    mobileExperienceRating: "8.7",
    mobileExperienceExplanation: "Fully responsive design works flawlessly on all devices. Dedicated mobile app available.",
    overallRating: "8.6",
    summary: "A solid choice for crypto enthusiasts with excellent game variety and fast payouts.",
    createdAt: new Date(),
    updatedAt: new Date()
  };

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

  const userReviews: Review[] = [
    {
      id: "review-1",
      casinoId: id || "",
      userId: "user-1",
      title: "Great crypto casino!",
      content: "Been playing here for 6 months, withdrawals are super fast and games are fair.",
      userName: "CryptoPlayer88",
      overallRating: 9,
      bonusesRating: 8,
      designRating: 9,
      payoutsRating: 10,
      customerSupportRating: 7,
      gameSelectionRating: 9,
      mobileExperienceRating: 8,
      ...generateProsAndCons({
        bonusesRating: 8,
        designRating: 9,
        payoutsRating: 10,
        customerSupportRating: 7,
        gameSelectionRating: 9,
        mobileExperienceRating: 8
      }),
      isVerified: true,
      isPublished: true,
      createdAt: new Date("2024-12-01"),
      updatedAt: new Date("2024-12-01")
    },
    {
      id: "review-2", 
      casinoId: id || "",
      userId: "user-2",
      title: "Mixed experience",
      content: "Good games but had some issues with verification process.",
      userName: "SlotsFan",
      overallRating: 6,
      bonusesRating: 7,
      designRating: 8,
      payoutsRating: 5,
      customerSupportRating: 6,
      gameSelectionRating: 8,
      mobileExperienceRating: 7,
      ...generateProsAndCons({
        bonusesRating: 7,
        designRating: 8,
        payoutsRating: 5,
        customerSupportRating: 6,
        gameSelectionRating: 8,
        mobileExperienceRating: 7
      }),
      isVerified: false,
      isPublished: true,
      createdAt: new Date("2024-11-15"),
      updatedAt: new Date("2024-11-15")
    },
    {
      id: "review-3",
      casinoId: id || "",
      userId: "user-3", 
      title: "Amazing live casino!",
      content: "Love the live dealer games, especially Evolution Gaming tables. Professional dealers and smooth streaming.",
      userName: "LiveDealer21",
      overallRating: 9,
      bonusesRating: 7,
      designRating: 9,
      payoutsRating: 8,
      customerSupportRating: 9,
      gameSelectionRating: 10,
      mobileExperienceRating: 8,
      ...generateProsAndCons({
        bonusesRating: 7,
        designRating: 9,
        payoutsRating: 8,
        customerSupportRating: 9,
        gameSelectionRating: 10,
        mobileExperienceRating: 8
      }),
      isVerified: true,
      isPublished: true,
      createdAt: new Date("2024-11-20"),
      updatedAt: new Date("2024-11-20")
    },
    {
      id: "review-4",
      casinoId: id || "",
      userId: "user-4",
      title: "Good but slow withdrawals",
      content: "Games are great and bonuses are decent, but withdrawal process takes too long. Customer support is helpful though.",
      userName: "PatientPlayer",
      overallRating: 6,
      bonusesRating: 7,
      designRating: 8,
      payoutsRating: 3,
      customerSupportRating: 8,
      gameSelectionRating: 8,
      mobileExperienceRating: 7,
      ...generateProsAndCons({
        bonusesRating: 7,
        designRating: 8,
        payoutsRating: 3,
        customerSupportRating: 8,
        gameSelectionRating: 8,
        mobileExperienceRating: 7
      }),
      isVerified: false,
      isPublished: true,
      createdAt: new Date("2024-11-10"),
      updatedAt: new Date("2024-11-10")
    },
    {
      id: "review-5",
      casinoId: id || "",
      userId: "user-5",
      title: "Perfect mobile experience",
      content: "Using this casino mainly on mobile and it's fantastic. Apps works smoothly, games load fast, deposits are instant.",
      userName: "MobileGamer",
      overallRating: 8,
      bonusesRating: 8,
      designRating: 9,
      payoutsRating: 7,
      customerSupportRating: 7,
      gameSelectionRating: 8,
      mobileExperienceRating: 10,
      ...generateProsAndCons({
        bonusesRating: 8,
        designRating: 9,
        payoutsRating: 7,
        customerSupportRating: 7,
        gameSelectionRating: 8,
        mobileExperienceRating: 10
      }),
      isVerified: true,
      isPublished: true,
      createdAt: new Date("2024-12-05"),
      updatedAt: new Date("2024-12-05")
    },
    {
      id: "review-6",
      casinoId: id || "",
      userId: "user-6",
      title: "Great slots selection",
      content: "Huge variety of slot machines from top providers. Found all my favorite games here. RTP seems fair too.",
      userName: "SlotMaster99",
      overallRating: 8,
      bonusesRating: 6,
      designRating: 8,
      payoutsRating: 8,
      customerSupportRating: 6,
      gameSelectionRating: 9,
      mobileExperienceRating: 7,
      ...generateProsAndCons({
        bonusesRating: 6,
        designRating: 8,
        payoutsRating: 8,
        customerSupportRating: 6,
        gameSelectionRating: 9,
        mobileExperienceRating: 7
      }),
      isVerified: true,
      isPublished: true,
      createdAt: new Date("2024-11-25"),
      updatedAt: new Date("2024-11-25")
    },
    {
      id: "review-7",
      casinoId: id || "",
      userId: "user-7",
      title: "Disappointing experience",
      content: "Had high expectations but was let down. Bonus terms are confusing, support is slow to respond, and some games feel rigged.",
      userName: "DisappointedUser",
      overallRating: 4,
      bonusesRating: 3,
      designRating: 6,
      payoutsRating: 4,
      customerSupportRating: 3,
      gameSelectionRating: 5,
      mobileExperienceRating: 5,
      ...generateProsAndCons({
        bonusesRating: 3,
        designRating: 6,
        payoutsRating: 4,
        customerSupportRating: 3,
        gameSelectionRating: 5,
        mobileExperienceRating: 5
      }),
      isVerified: false,
      isPublished: true,
      createdAt: new Date("2024-11-08"),
      updatedAt: new Date("2024-11-08")
    }
  ];
  
  const [reviewsToShow, setReviewsToShow] = useState(5);
  
  // Calculate average user ratings
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
      totals.bonuses += review.bonusesRating;
      totals.design += review.designRating;
      totals.payouts += review.payoutsRating;
      totals.customerSupport += review.customerSupportRating;
      totals.gameSelection += review.gameSelectionRating;
      totals.mobileExperience += review.mobileExperienceRating;
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

  const relatedArticles: BlogPost[] = [
    {
      id: "article-1",
      title: "Complete Guide to Crypto Casino Bonuses",
      slug: "crypto-casino-bonuses-guide",
      excerpt: "Learn how to maximize your crypto casino bonuses and understand wagering requirements.",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1621752411083-bb1b8c0e0300?w=400&h=200&fit=crop",
      authorId: "admin-1",
      category: "Guides",
      tags: ["bonuses", "crypto", "strategy"],
      readTime: 8,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "article-2",
      title: "Best Crypto Payment Methods for Online Casinos",
      slug: "best-crypto-payment-methods",
      excerpt: "Discover the fastest and most secure crypto payment options for online gambling.",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1640170298593-a16197bd04dc?w=400&h=200&fit=crop",
      authorId: "admin-1",
      category: "Crypto",
      tags: ["crypto", "payments", "security"],
      readTime: 6,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "article-3",
      title: "How to Choose a Safe Crypto Casino",
      slug: "safe-crypto-casino-guide",
      excerpt: "Essential tips for identifying trustworthy crypto casinos and avoiding scams.",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      authorId: "admin-1",
      category: "Safety",
      tags: ["safety", "crypto", "tips"],
      readTime: 10,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "article-4",
      title: "Crypto Casino vs Traditional Casino: Pros and Cons",
      slug: "crypto-vs-traditional-casinos",
      excerpt: "Compare the advantages and disadvantages of crypto casinos versus traditional online casinos.",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1620335527347-9bd4b27e9658?w=400&h=200&fit=crop",
      authorId: "admin-1",
      category: "Comparison",
      tags: ["comparison", "crypto", "traditional"],
      readTime: 7,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const casinoGames: Game[] = [
    {
      id: "game-1",
      name: "Book of Dead",
      description: "Adventure-themed slot with expanding symbols",
      provider: "Play'n GO",
      type: "slot",
      rtp: "96.21",
      volatility: "High",
      minBet: "0.01",
      maxBet: "100.00",
      imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=200&fit=crop",
      demoUrl: "#",
      tags: ["adventure", "egypt", "expanding wilds"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "game-2",
      name: "Lightning Roulette", 
      description: "Live roulette with random multipliers",
      provider: "Evolution Gaming",
      type: "live",
      rtp: "97.30",
      volatility: "Medium",
      minBet: "0.20",
      maxBet: "5000.00",
      imageUrl: "https://images.unsplash.com/photo-1521130726557-5e7e0c665fd3?w=300&h=200&fit=crop",
      demoUrl: "#",
      tags: ["roulette", "live", "multipliers"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "game-3",
      name: "Sweet Bonanza",
      description: "Colorful fruit slot with tumbling reels",
      provider: "Pragmatic Play",
      type: "slot",
      rtp: "96.51",
      volatility: "High",
      minBet: "0.20",
      maxBet: "125.00",
      imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=200&fit=crop",
      demoUrl: "#",
      tags: ["fruit", "tumbling", "high volatility"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "game-4",
      name: "Crazy Time",
      description: "Live game show with bonus rounds",
      provider: "Evolution Gaming", 
      type: "live",
      rtp: "96.08",
      volatility: "Medium",
      minBet: "0.10",
      maxBet: "2500.00",
      imageUrl: "https://images.unsplash.com/photo-1594736797933-d0d9770d1a15?w=300&h=200&fit=crop",
      demoUrl: "#",
      tags: ["game show", "bonus rounds", "live"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "game-5",
      name: "Gates of Olympus",
      description: "Greek mythology themed slot with multipliers",
      provider: "Pragmatic Play",
      type: "slot", 
      rtp: "96.50",
      volatility: "High",
      minBet: "0.20",
      maxBet: "125.00",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      demoUrl: "#",
      tags: ["mythology", "multipliers", "zeus"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "game-6",
      name: "Blackjack Premium",
      description: "Classic blackjack with perfect strategy guide",
      provider: "NetEnt",
      type: "table",
      rtp: "99.50",
      volatility: "Low",
      minBet: "1.00",
      maxBet: "1000.00",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      demoUrl: "#",
      tags: ["blackjack", "strategy", "classic"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

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
                    src={casino.logoUrl}
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
                        <span className="font-semibold">Safety: {casino.safetyIndex}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold">{casino.userRating} ({casino.totalReviews} reviews)</span>
                      </div>
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
                    className="w-full mb-4 bg-gradient-to-r from-turquoise to-orange hover:from-turquoise/90 hover:to-orange/90"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rating Categories */}
              <div className="space-y-4">
                {ratingCategories.map((category) => {
                  const rating = parseFloat(expertReview[category.key as keyof ExpertReview] as string);
                  const explanation = expertReview[`${category.key.replace('Rating', 'Explanation')}` as keyof ExpertReview] as string;
                  
                  return (
                    <div key={category.key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.label}
                        </span>
                        <span className="font-bold text-lg text-turquoise">{rating}</span>
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
                    {expertReview.overallRating}
                  </div>
                  <div className="text-lg font-semibold mb-2">Overall Rating</div>
                  <div className="flex justify-center">
                    <Progress value={parseFloat(expertReview.overallRating) * 10} className="w-32" />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-orange">Expert Summary</h4>
                  <p className="text-muted-foreground">{expertReview.summary}</p>
                </div>
              </div>
            </div>
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
                    {averageUserRatings.overall}
                  </div>
                  <div className="text-sm font-medium">Overall Rating</div>
                  <Progress value={parseFloat(averageUserRatings.overall) * 10} className="mt-2" />
                </div>
                
                {ratingCategories.map((category) => {
                  const avgRating = averageUserRatings[category.key as keyof typeof averageUserRatings] as string;
                  return (
                    <div key={category.key} className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg">{category.icon}</span>
                        <div className="text-2xl font-bold text-turquoise">
                          {avgRating}
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
                        <h4 className="font-semibold text-xl text-turquoise mb-2">{review.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{review.userName}</span>
                            {review.isVerified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{review.createdAt.toLocaleDateString()}</span>
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
                      <p className="text-muted-foreground leading-relaxed">{review.content}</p>
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
                      <div className="text-xs text-muted-foreground">
                        <span className="italic">Pros & cons automatically generated based on rating scores</span>
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
                          onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Summarize your experience"
                        />
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
                        onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Share your detailed experience..."
                        rows={4}
                      />
                    </div>

                    <Button className="w-full bg-turquoise hover:bg-turquoise/90">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Submit Review
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
              <Button variant="outline" className="text-orange border-orange hover:bg-orange hover:text-white">
                View All Articles
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {relatedArticles.map((article) => (
                  <Card key={article.id} className="flex-shrink-0 w-80 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={article.featuredImage}
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
                      <Button variant="ghost" className="mt-3 p-0 h-auto text-turquoise hover:text-turquoise/80">
                        Read More <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
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
              <Button variant="outline" className="text-turquoise border-turquoise hover:bg-turquoise hover:text-white">
                View All Games
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {[...casinoGames, ...casinoGames.slice(0, 8)].slice(0, 10).map((game, index) => (
                  <Card key={`${game.id}-${index}`} className="flex-shrink-0 w-72 hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={game.imageUrl}
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
                        <Button size="sm" className="flex-1 bg-turquoise hover:bg-turquoise/90">
                          Play
                        </Button>
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