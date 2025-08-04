import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Info } from "lucide-react";
import { Link } from "wouter";
import type { Casino } from "@shared/schema";

interface CasinoCardProps {
  casino: Casino;
  showDetails?: boolean;
  variant?: "list" | "grid";
}

export function CasinoCard({ casino, showDetails = true, variant = "list" }: CasinoCardProps) {
  const renderStars = (rating: string | null) => {
    const numRating = parseFloat(rating || '0');
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

  const getSafetyColor = (index: string | null) => {
    const numIndex = parseFloat(index || '0');
    if (numIndex >= 9.0) return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    if (numIndex >= 8.0) return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    if (numIndex >= 7.0) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
  };

  return (
    <div 
      className={`rounded-xl transition-all duration-300 border relative overflow-hidden group ${
        variant === "grid" ? "h-full" : ""
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))',
        border: '2px solid hsl(173, 58%, 39%, 0.3)',
        boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.2), 0 0 30px hsl(173, 58%, 39%, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
        e.currentTarget.style.border = '2px solid hsl(173, 58%, 39%, 0.6)';
        e.currentTarget.style.boxShadow = '0 0 25px hsl(173, 58%, 39%, 0.4), 0 0 50px hsl(173, 58%, 39%, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.border = '2px solid hsl(173, 58%, 39%, 0.3)';
        e.currentTarget.style.boxShadow = '0 0 15px hsl(173, 58%, 39%, 0.2), 0 0 30px hsl(173, 58%, 39%, 0.1)';
      }}
    >
      <div className="p-3 sm:p-6 h-full">
        <div className={`${
          variant === "grid" 
            ? "flex flex-col gap-4 h-full"
            : "flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6"
        }`}>
          {/* Casino Logo & Info */}
          <div className={`flex items-center space-x-3 sm:space-x-4 ${variant === "grid" ? "justify-center text-center" : ""}`}>
            <img 
              src={casino.logoUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"} 
              alt={`${casino.name} Logo`} 
              className={`${variant === "grid" ? "w-20 h-20 mx-auto" : "w-12 h-12 sm:w-16 sm:h-16"} rounded-lg object-cover flex-shrink-0`}
            />
            <div className={`min-w-0 flex-1 ${variant === "grid" ? "text-center" : ""}`}>
              <h3 
                className={`font-bold truncate ${variant === "grid" ? "text-lg" : "text-lg sm:text-xl"}`}
                style={{
                  color: 'hsl(173, 58%, 39%)',
                  textShadow: '0 0 10px hsl(173, 58%, 39%, 0.5)'
                }}
              >
                {casino.name}
              </h3>
              {variant === "list" && <p className="text-gray-600 dark:text-gray-300">{casino.description}</p>}
              {casino.establishedYear && (
                <p className="text-sm text-gray-500 dark:text-gray-400">Est. {casino.establishedYear}</p>
              )}
            </div>
          </div>

          {/* Safety Rating */}
          <div className={`flex ${variant === "grid" ? "justify-center" : "items-center"} space-x-4`}>
            <div className="text-center">
              <div className={`px-4 py-2 rounded-lg ${getSafetyColor(casino.safetyIndex)}`}>
                <div className="text-2xl font-bold">{casino.safetyIndex || '0'}</div>
                <div className="text-xs">Safety Index</div>
              </div>
            </div>
            <div className="text-center">
              {renderStars(casino.userRating)}
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {casino.userRating || '0'}/5 ({casino.totalReviews} reviews)
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex ${variant === "grid" ? "flex-col" : "flex-col"} space-y-2 ${variant === "list" ? "ml-auto" : ""}`}>
            <Button asChild className="bg-turquoise hover:bg-turquoise/90">
              <a href={casino.affiliateUrl || casino.websiteUrl} target="_blank" rel="noopener noreferrer">
                🎁 Visit Casino
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Link href={`/casino/${casino.id}`}>
              <Button variant="outline" data-testid="button-casino-details">
                <Info className="mr-2 h-4 w-4" />
                Više Informacija
              </Button>
            </Link>
          </div>
        </div>

        {/* Casino Features */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {casino.features?.slice(0, 4).map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              )) || null}
              {casino.license && (
                <Badge variant="outline">
                  Licensed: {casino.license}
                </Badge>
              )}
            </div>
            
            {casino.paymentMethods && casino.paymentMethods.length > 0 && (
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
