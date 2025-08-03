import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink } from "lucide-react";
import type { Casino } from "@shared/schema";

interface CasinoCardProps {
  casino: Casino;
  showDetails?: boolean;
}

export function CasinoCard({ casino, showDetails = true }: CasinoCardProps) {
  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars
                ? "text-yellow-400 fill-current"
                : i === fullStars && hasHalfStar
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getSafetyColor = (index: string) => {
    const numIndex = parseFloat(index);
    if (numIndex >= 9.0) return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    if (numIndex >= 8.0) return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    if (numIndex >= 7.0) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
  };

  return (
    <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Casino Logo & Info */}
          <div className="flex items-center space-x-4">
            <img 
              src={casino.logoUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"} 
              alt={`${casino.name} Logo`} 
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-foreground">{casino.name}</h3>
              <p className="text-muted-foreground">{casino.description}</p>
              {casino.establishedYear && (
                <p className="text-sm text-muted-foreground">Est. {casino.establishedYear}</p>
              )}
            </div>
          </div>

          {/* Safety Rating */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`px-4 py-2 rounded-lg ${getSafetyColor(casino.safetyIndex)}`}>
                <div className="text-2xl font-bold">{casino.safetyIndex}</div>
                <div className="text-xs">Safety Index</div>
              </div>
            </div>
            <div className="text-center">
              {renderStars(casino.userRating)}
              <div className="text-xs text-muted-foreground mt-1">
                {casino.userRating}/5 ({casino.totalReviews} reviews)
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2 ml-auto">
            <Button asChild className="bg-turquoise hover:bg-turquoise/90">
              <a href={casino.affiliateUrl || casino.websiteUrl} target="_blank" rel="noopener noreferrer">
                🎁 Visit Casino
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline">
              Read Review
            </Button>
          </div>
        </div>

        {/* Casino Features */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {casino.features.slice(0, 4).map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
              {casino.license && (
                <Badge variant="outline">
                  Licensed: {casino.license}
                </Badge>
              )}
            </div>
            
            {casino.paymentMethods.length > 0 && (
              <div className="mt-2">
                <span className="text-sm text-muted-foreground">Payment Methods: </span>
                <span className="text-sm">{casino.paymentMethods.slice(0, 3).join(", ")}</span>
                {casino.paymentMethods.length > 3 && (
                  <span className="text-sm text-muted-foreground"> +{casino.paymentMethods.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
