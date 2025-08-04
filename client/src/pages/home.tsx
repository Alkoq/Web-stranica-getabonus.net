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
import { api } from "@/lib/api";
import type { Casino, Bonus, BlogPost } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

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
                  <BonusCard bonus={bonus} />
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
                  <BonusCard bonus={bonus} />
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
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
                        <Gamepad2 className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{game.provider}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">RTP: {game.rtp}</Badge>
                        <Button size="sm" variant="outline">Play Demo</Button>
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
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gradient-to-br from-blue-400 to-green-400 rounded-lg mb-4 flex items-center justify-center">
                        <Gamepad2 className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{game.provider}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">RTP: {game.rtp}</Badge>
                        <Button size="sm" variant="outline">Play Demo</Button>
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

        {/* AI Chatbot and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AIChatbot />
          <Newsletter />
        </div>
      </div>
    </div>
  );
}