import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Gift, Calendar, Shield, ExternalLink, Star, MessageCircle, ThumbsUp, Clock, Percent, Award, DollarSign, Users, Info } from "lucide-react";
import { Link } from "wouter";
import { api } from "@/lib/api";
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

  // Simulated related blog posts and reviews for bonus
  const { data: relatedPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: () => api.getBlogPosts(),
  });

  // Mock reviews data - in real app would come from API
  const mockReviews = [
    {
      id: "1",
      username: "BonusHunter88",
      rating: 8,
      comment: "Great bonus with reasonable wagering requirements. Managed to withdraw after meeting the playthrough.",
      createdAt: new Date('2024-01-15'),
      verified: true
    },
    {
      id: "2", 
      username: "SlotMaster",
      rating: 6,
      comment: "Bonus is okay but the terms could be clearer. Game restrictions are a bit limiting.",
      createdAt: new Date('2024-01-10'),
      verified: false
    }
  ];

  const bonus = bonuses.find(b => b.id === bonusId);
  const casino = bonus ? casinos.find(c => c.id === bonus.casinoId) : null;

  // Bonus rating criteria (1-10 scale)
  const bonusRatings = {
    value: 8.5, // Bonus amount vs wagering requirements 
    terms: 7.2, // Clarity and fairness of terms
    wagering: 6.8, // Wagering requirements reasonableness
    games: 8.1, // Game selection for bonus use
    cashout: 7.9, // Withdrawal limits and speed
    overall: 7.7 // Overall bonus rating
  };

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
                      <div>
                        <span className="text-gray-400 block mb-2">Available at:</span>
                        <Link href={`/casino/${casino.id}`}>
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                            <img 
                              src={casino.logoUrl} 
                              alt={casino.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold">{casino.name}</h4>
                              <p className="text-sm text-gray-400">Rating: {casino.overallRating}/10</p>
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
                    onClick={() => window.open(casino.affiliateUrl, '_blank')}
                  >
                    <Gift className="h-5 w-5 mr-2" />
                    Claim Bonus Now
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400 space-y-1">
                    <p className="flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created: {new Date(bonus.createdAt).toLocaleDateString()}
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