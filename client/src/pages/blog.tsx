import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, TrendingUp } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { AIChatbot } from "@/components/ai-chatbot";
import { api } from "@/lib/api";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: () => api.getBlogPosts(),
  });

  const categories = [
    { value: "all", label: "All Posts", count: blogPosts.length },
    { value: "Review", label: "Reviews", count: blogPosts.filter(p => p.category === "Review").length },
    { value: "Guide", label: "Guides", count: blogPosts.filter(p => p.category === "Guide").length },
    { value: "Strategy", label: "Strategy", count: blogPosts.filter(p => p.category === "Strategy").length },
    { value: "News", label: "News", count: blogPosts.filter(p => p.category === "News").length },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory && post.isPublished;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        const bDate = new Date(b.publishedAt || b.createdAt || '1970-01-01').getTime();
        const aDate = new Date(a.publishedAt || a.createdAt || '1970-01-01').getTime();
        return bDate - aDate;
      case "oldest":
        const aDateOld = new Date(a.publishedAt || a.createdAt || '1970-01-01').getTime();
        const bDateOld = new Date(b.publishedAt || b.createdAt || '1970-01-01').getTime();
        return aDateOld - bDateOld;
      case "title":
        return a.title.localeCompare(b.title);
      case "readTime":
        return (b.readTime || 0) - (a.readTime || 0);
      default:
        return 0;
    }
  });

  const featuredPost = blogPosts.find(post => post.isPublished) || blogPosts[0];
  const trendingPosts = blogPosts.filter(post => post.isPublished).slice(0, 3);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              📰 Casino News & Expert Guides
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Stay informed with the latest industry news, strategy guides, and casino reviews
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles, guides, and reviews..."
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
        {/* Featured Article */}
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">⭐ Featured Article</h2>
            <div className="bg-gradient-to-r from-turquoise to-blue-600 text-white rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                <div>
                  <Badge className="bg-white/20 text-white mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                  <p className="text-blue-100 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-blue-200 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}
                    </div>
                    {featuredPost.readTime && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {featuredPost.readTime} min read
                      </div>
                    )}
                  </div>
                  <Button size="lg" className="bg-white text-turquoise hover:bg-gray-100">
                    Read Full Article
                  </Button>
                </div>
                {featuredPost.featuredImage && (
                  <div className="hidden lg:block">
                    <img 
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Trending Articles */}
        {trendingPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-orange" />
              Trending This Week
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingPosts.map((post, index) => (
                <div key={post.id} className="relative">
                  <Badge className="absolute top-4 left-4 z-10 bg-orange text-white">
                    #{index + 1}
                  </Badge>
                  <BlogCard post={post} showExcerpt={false} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className={selectedCategory === category.value ? "bg-turquoise hover:bg-turquoise/90" : ""}
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Alphabetical</SelectItem>
              <SelectItem value="readTime">Read Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Articles Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {isLoading ? "Loading..." : `${sortedPosts.length} Articles`}
              {selectedCategory !== "all" && (
                <span className="text-muted-foreground ml-2">
                  in {categories.find(c => c.value === selectedCategory)?.label}
                </span>
              )}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-6 animate-pulse border">
                  <div className="h-48 bg-muted rounded mb-4"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Articles Found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or category filter
              </p>
              <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                Show All Articles
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-gradient-to-r from-turquoise to-blue-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated with Our Newsletter</h2>
          <p className="text-blue-100 mb-6">
            Get the latest casino news, expert guides, and exclusive bonuses delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input 
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder-white/70"
            />
            <Button className="bg-white text-turquoise hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </section>

        {/* Popular Tags */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Popular Tags</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(blogPosts.flatMap(post => post.tags))).slice(0, 15).map((tag) => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-muted">
                {tag}
              </Badge>
            ))}
          </div>
        </section>
      </div>

      <AIChatbot />
    </div>
  );
}
