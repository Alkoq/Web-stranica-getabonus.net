import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Search, Star, TrendingUp, Users, Award, ChevronRight, Gift, Gamepad2, Clock, FileText } from "lucide-react";
import { CasinoCard } from "@/components/casino/casino-card";
import { BonusCard } from "@/components/bonus/bonus-card";
import { BlogCard } from "@/components/blog/blog-card";
import { CasinoComparison } from "@/components/casino/casino-comparison";
import { Newsletter } from "@/components/newsletter";
import { AIChatbot } from "@/components/ai-chatbot";
import { GameCasinoModal } from "@/components/game/game-casino-modal";
import { api } from "@/lib/api";
import type { Casino, Bonus, BlogPost } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<{name: string, id: string} | null>(null);
  const [showCasinoModal, setShowCasinoModal] = useState(false);

  // Fetch stats and data
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => api.getStats(),
  });

  const { data: featuredCasinos = [], isLoading: loadingCasinos } = useQuery<Casino[]>({
    queryKey: ['/api/casinos/featured'],
    queryFn: () => api.getFeaturedCasinos(),
  });

  const { data: allCasinos = [] } = useQuery<Casino[]>({
    queryKey: ['/api/casinos'],
    queryFn: () => api.getCasinos(),
  });

  const { data: featuredBonuses = [], isLoading: loadingBonuses } = useQuery<Bonus[]>({
    queryKey: ['/api/bonuses/featured'],
    queryFn: () => api.getFeaturedBonuses(),
  });

  const { data: blogPosts = [], isLoading: loadingBlog } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: () => api.getBlogPosts(),
  });

  // Get latest casinos (mock sorting by newest)
  const latestCasinos = [...allCasinos].slice(0, 15);

  // Mock games data
  const hotGames = [
    { id: '1', name: 'Book of Dead', provider: "Play'n GO", rtp: '96.21%', image: '/games/book-of-dead.jpg' },
    { id: '2', name: 'Starburst', provider: 'NetEnt', rtp: '96.09%', image: '/games/starburst.jpg' },
    { id: '3', name: 'Gonzo\'s Quest', provider: 'NetEnt', rtp: '95.97%', image: '/games/gonzos-quest.jpg' },
  ];

  const quickFilters = [
    { label: "Top Rated", icon: Star, active: true },
    { label: "No Deposit", icon: TrendingUp },
    { label: "Crypto", icon: Award },
    { label: "Mobile", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Dynamic Stats */}
      <section className="bg-gradient-to-br from-turquoise to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Ultimate Casino Bonus!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Explore top-rated casinos, unlock exclusive bonuses, and start your winning journey today!
            </p>
            
            {/* Dynamic Trust Indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats?.totalCasinos || 0}+</div>
                <div className="text-sm text-blue-200">Casinos Reviewed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats?.totalBonuses || 0}+</div>
                <div className="text-sm text-blue-200">Bonuses Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats?.totalGames || 0}+</div>
                <div className="text-sm text-blue-200">Games Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats?.totalUsers || 0}+</div>
                <div className="text-sm text-blue-200">Happy Users</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-orange hover:bg-orange/90 text-white px-8 py-4 text-lg shadow-lg"
                data-testid="button-discover-casinos"
              >
                Discover Top Casinos
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 px-8 py-4 text-lg backdrop-blur-sm"
                data-testid="button-compare-bonuses"
              >
                Compare Bonuses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search casinos, bonuses, or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-3 text-lg"
                  data-testid="input-search"
                />
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              {quickFilters.map((filter, index) => (
                <Button
                  key={index}
                  variant={filter.active ? "default" : "outline"}
                  className={filter.active ? "bg-turquoise hover:bg-turquoise/90" : ""}
                  data-testid={`filter-${filter.label.toLowerCase().replace(' ', '-')}`}
                >
                  <filter.icon className="mr-2 h-4 w-4" />
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Top Casinos Carousel */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Top Rated Casinos</h2>
              <p className="text-gray-600 dark:text-gray-300">Best casinos based on our expert reviews</p>
            </div>
            <Link href="/casinos?sort=rating">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-top-casinos">
                See All Top Casinos
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredCasinos.map((casino) => (
                <CarouselItem key={casino.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <CasinoCard casino={casino} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Latest Casinos */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest Casinos</h2>
              <p className="text-gray-600 dark:text-gray-300">Newest additions to our platform</p>
            </div>
            <Link href="/casinos?sort=newest">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-latest-casinos">
                See All Latest Casinos
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {latestCasinos.map((casino) => (
                <CarouselItem key={casino.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <CasinoCard casino={casino} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Top Bonuses */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Top Bonuses</h2>
              <p className="text-gray-600 dark:text-gray-300">Best bonus offers available right now</p>
            </div>
            <Link href="/bonuses?sort=value">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-top-bonuses">
                See All Top Bonuses
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredBonuses.map((bonus) => (
                <CarouselItem key={bonus.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <BonusCard bonus={bonus} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Latest Bonuses */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest Bonuses</h2>
              <p className="text-gray-600 dark:text-gray-300">Newest bonus offers just added</p>
            </div>
            <Link href="/bonuses?sort=newest">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-latest-bonuses">
                See All Latest Bonuses
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredBonuses.slice().reverse().map((bonus) => (
                <CarouselItem key={bonus.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <BonusCard bonus={bonus} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Hot Games */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hot Games Right Now</h2>
              <p className="text-gray-600 dark:text-gray-300">Most popular games this week</p>
            </div>
            <Link href="/games">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-hot-games">
                See All Games
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {hotGames.map((game) => (
                <CarouselItem key={game.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="hover:shadow-lg transition-shadow h-full carousel-card">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
                        <Gamepad2 className="h-8 w-8 md:h-12 md:w-12 text-white" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{game.provider}</p>
                      <div className="mt-auto space-y-2">
                        <Badge variant="secondary" className="text-xs">RTP: {game.rtp}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs" data-testid={`button-play-demo-${game.id}`}>
                            Play Demo
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-orange hover:bg-orange/90 text-xs"
                            data-testid={`button-play-real-${game.id}`}
                            onClick={() => {
                              setSelectedGame({ name: game.name, id: game.id });
                              setShowCasinoModal(true);
                            }}
                          >
                            Play Real
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Latest Games */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest Games</h2>
              <p className="text-gray-600 dark:text-gray-300">Newest game releases</p>
            </div>
            <Link href="/games?sort=newest">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-latest-games">
                See All Latest Games
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {hotGames.slice().reverse().map((game) => (
                <CarouselItem key={game.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="hover:shadow-lg transition-shadow h-full carousel-card">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-green-400 rounded-lg mb-4 flex items-center justify-center">
                        <Gamepad2 className="h-8 w-8 md:h-12 md:w-12 text-white" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{game.provider}</p>
                      <div className="mt-auto space-y-2">
                        <Badge variant="secondary" className="text-xs">RTP: {game.rtp}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs" data-testid={`button-play-demo-latest-${game.id}`}>
                            Play Demo
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-orange hover:bg-orange/90 text-xs"
                            data-testid={`button-play-real-latest-${game.id}`}
                            onClick={() => {
                              setSelectedGame({ name: game.name, id: game.id });
                              setShowCasinoModal(true);
                            }}
                          >
                            Play Real
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Comparison Tool */}
        <section className="bg-card rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Compare Your Options</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/compare?type=casinos">
              <Button size="lg" variant="outline" className="flex items-center gap-2" data-testid="button-compare-casinos">
                <Award className="h-5 w-5" />
                Compare Casinos
              </Button>
            </Link>
            <Link href="/compare?type=bonuses">
              <Button size="lg" variant="outline" className="flex items-center gap-2" data-testid="button-compare-bonuses">
                <Gift className="h-5 w-5" />
                Compare Bonuses
              </Button>
            </Link>
            <Link href="/compare?type=games">
              <Button size="lg" variant="outline" className="flex items-center gap-2" data-testid="button-compare-games">
                <Gamepad2 className="h-5 w-5" />
                Compare Games
              </Button>
            </Link>
          </div>
        </section>

        {/* Latest News */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest News</h2>
              <p className="text-gray-600 dark:text-gray-300">Stay updated with casino industry news</p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="flex items-center gap-2" data-testid="link-see-all-news">
                See All News
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {blogPosts.slice(0, 6).map((post) => (
                <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <BlogCard post={post} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* About Our AI Bot */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Meet Your Personal Casino Assistant
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Our advanced AI bot is here to help you find the perfect casino, bonus, or game. 
                Ask questions, get personalized recommendations, and discover the best gambling opportunities tailored just for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Recommendations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get personalized casino and bonus suggestions based on your preferences</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Available anytime to answer your gambling questions and concerns</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Expert Knowledge</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Access to comprehensive casino data and industry expertise</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-start-chat">
                Start Chat with AI Bot
              </Button>
              <Button size="lg" variant="outline" data-testid="button-learn-more-bot">
                Learn More About Our Bot
              </Button>
            </div>
          </div>
        </section>

        {/* AI Chatbot and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AIChatbot />
          <Newsletter />
        </div>
      </div>

      {/* Game Casino Modal */}
      <GameCasinoModal 
        isOpen={showCasinoModal}
        onClose={() => {
          setShowCasinoModal(false);
          setSelectedGame(null);
        }}
        gameName={selectedGame?.name || ""}
        casinos={allCasinos}
      />
    </div>
  );
}