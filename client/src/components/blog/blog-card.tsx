import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
  showExcerpt?: boolean;
}

export function BlogCard({ post, showExcerpt = true }: BlogCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    // Handle invalid dates
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'review':
        return 'bg-turquoise text-white';
      case 'guide':
        return 'bg-orange text-white';
      case 'strategy':
        return 'bg-purple-500 text-white';
      case 'news':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <article className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-border">
      {post.featuredImage && (
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={getCategoryColor(post.category)}>
            {post.category}
          </Badge>
          {post.readTime && (
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime} min read
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
          {post.title}
        </h3>

        {showExcerpt && post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">
                {formatDate(post.publishedAt || post.createdAt)}
              </div>
            </div>
          </div>
          <Button variant="ghost" className="text-turquoise hover:text-turquoise/80">
            Read More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
