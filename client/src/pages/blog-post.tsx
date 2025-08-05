import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Tag, Share2, Eye } from "lucide-react";
import { Link } from "wouter";
import { api } from "@/lib/api";
import type { BlogPost } from "@shared/schema";

export default function BlogPostDetail() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: () => api.getBlogPosts(),
  });

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
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
            <Link href="/blog">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center items-center space-x-4 mb-6">
                <Badge className="bg-orange-500">{post.category}</Badge>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readTime} min read
                </div>
              </div>

              <h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                  color: 'hsl(173, 58%, 39%)',
                  textShadow: '0 0 10px hsl(173, 58%, 39%, 0.3)'
                }}
              >
                {post.title}
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                {post.excerpt}
              </p>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="mb-8">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card 
                  className="mb-8"
                  style={{
                    border: '2px solid hsl(173, 58%, 39%, 0.3)',
                    boxShadow: '0 0 20px hsl(173, 58%, 39%, 0.2)',
                    background: 'rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <CardContent className="p-8">
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 leading-relaxed text-lg">
                        {post.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <Card 
                    className="mb-8"
                    style={{
                      border: '2px solid hsl(173, 58%, 39%, 0.3)',
                      boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.2)',
                      background: 'rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Tag className="h-5 w-5 mr-2 text-orange-500" />
                        Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Share */}
                <Card 
                  className="mb-6 sticky top-8"
                  style={{
                    border: '2px solid hsl(173, 58%, 39%, 0.3)',
                    boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.2)',
                    background: 'rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Share2 className="h-5 w-5 mr-2 text-orange-500" />
                      Share Article
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                      }}
                    >
                      Copy Link
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const text = `Check out this article: ${post.title}`;
                        const url = window.location.href;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                      }}
                    >
                      Share on Twitter
                    </Button>
                  </CardContent>
                </Card>

                {/* Article Info */}
                <Card 
                  style={{
                    border: '2px solid hsl(173, 58%, 39%, 0.3)',
                    boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.2)',
                    background: 'rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-orange-500" />
                      Article Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Category:</span>
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Published:</span>
                      <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Reading Time:</span>
                      <span>{post.readTime} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status:</span>
                      <Badge variant={post.isPublished ? "default" : "secondary"}>
                        {post.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}