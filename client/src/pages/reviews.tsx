import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Star, ThumbsUp, ThumbsDown, User, Calendar } from "lucide-react";
import { AIChatbot } from "@/components/ai-chatbot";
import { api } from "@/lib/api";
import type { Review, Casino } from "@shared/schema";

export default function Reviews() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterRating, setFilterRating] = useState("all");

  const { data: casinos = [] } = useQuery<Casino[]>({
    queryKey: ['/api/casinos'],
    queryFn: () => api.getCasinos(),
  });

  // For now, we'll simulate reviews since the storage doesn't have sample reviews
  const mockReviews: (Review & { casinoName: string })[] = casinos.slice(0, 10).map((casino, index) => ({
    id: `review-${index}`,
    casinoId: casino.id,
    casinoName: casino.name,
    userId: `user-${index}`,
    title: `Great experience at ${casino.name}`,
    content: `I've been playing at ${casino.name} for several months now and I'm impressed with their service. The games are fair, withdrawals are quick, and customer support is responsive. The bonus offers are generous and the wagering requirements are reasonable compared to other casinos.`,
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    pros: ["Fast withdrawals", "Great game selection", "Responsive support"],
    cons: index % 3 === 0 ? ["Limited live chat hours"] : [],
    isVerified: Math.random() > 0.3,
    isPublished: true,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
    updatedAt: new Date(),
  }));

  const getCasinoInfo = (casinoId: string) => {
    return casinos.find(c => c.id === casinoId);
  };

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = searchQuery === "" || 
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.casinoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating;
    
    return matchesSearch && matchesRating && review.isPublished;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "rating_high":
        return b.rating - a.rating;
      case "rating_low":
        return a.rating - b.rating;
      case "casino":
        return a.casinoName.localeCompare(b.casinoName);
      default:
        return 0;
    }
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ⭐ Casino Reviews & Ratings
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Real player reviews and expert analysis of online casinos
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search reviews by casino or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-turquoise">{mockReviews.length}</div>
                <div className="text-muted-foreground">Total Reviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-500">
                  {(mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1)}
                </div>
                <div className="text-muted-foreground">Average Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {mockReviews.filter(r => r.isVerified).length}
                </div>
                <div className="text-muted-foreground">Verified Reviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange">
                  {casinos.length}
                </div>
                <div className="text-muted-foreground">Casinos Reviewed</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="rating_high">Highest Rated</SelectItem>
              <SelectItem value="rating_low">Lowest Rated</SelectItem>
              <SelectItem value="casino">Casino Name</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Reviews Found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => { setSearchQuery(""); setFilterRating("all"); }}>
                Show All Reviews
              </Button>
            </div>
          ) : (
            sortedReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{review.title}</CardTitle>
                          {review.isVerified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Casino: {review.casinoName}</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <div className="text-sm text-muted-foreground mt-1">
                        {review.rating}/5
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">{review.content}</p>
                  
                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {review.pros.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2 flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Pros
                        </h4>
                        <ul className="space-y-1">
                          {review.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {review.cons.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2 flex items-center">
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Cons
                        </h4>
                        <ul className="space-y-1">
                          {review.cons.map((con, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-4 border-t">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful ({Math.floor(Math.random() * 20) + 1})
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Not Helpful
                    </Button>
                    <Button variant="outline" size="sm">
                      Visit Casino
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Write Review CTA */}
        <section className="mt-16 bg-gradient-to-r from-turquoise to-blue-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Share Your Casino Experience</h2>
          <p className="text-blue-100 mb-6">
            Help other players by writing an honest review of your casino experience
          </p>
          <Button size="lg" className="bg-white text-turquoise hover:bg-gray-100">
            Write a Review
          </Button>
        </section>
      </div>

      <AIChatbot />
    </div>
  );
}
