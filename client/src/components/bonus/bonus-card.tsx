import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, Gift, Star } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { tracker } from "@/lib/interaction-tracker";
import type { Bonus } from "@shared/schema";

interface BonusCardProps {
  bonus: Bonus;
  casinoName?: string;
  casinoLogo?: string;
  affiliateUrl?: string;
}

export function BonusCard({ bonus, casinoName, casinoLogo, affiliateUrl }: BonusCardProps) {
  // Fetch bonus reviews to calculate average rating
  const { data: bonusReviews = [] } = useQuery({
    queryKey: ['/api/reviews/bonus', bonus.id],
    queryFn: () => fetch(`/api/reviews/bonus/${bonus.id}`).then(res => res.json()),
  });

  // Fetch bonus ratings from API (same as in bonus detail page)
  const { data: bonusRatings } = useQuery({
    queryKey: ['/api/bonuses', bonus.id, 'ratings'],
    queryFn: () => fetch(`/api/bonuses/${bonus.id}/ratings`).then(res => res.json()),
  });
  const getBonusTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'no_deposit':
        return 'from-orange to-red-500';
      case 'welcome':
        return 'from-purple-500 to-blue-500';
      case 'free_spins':
        return 'from-green-500 to-teal-500';
      case 'cashback':
        return 'from-green-500 to-teal-500';
      case 'reload':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getBonusTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'no_deposit':
        return '🆓';
      case 'welcome':
        return '💎';
      case 'free_spins':
        return '🎰';
      case 'cashback':
        return '🔄';
      case 'reload':
        return '💰';
      default:
        return '🎁';
    }
  };

  const getBonusTypeName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'no_deposit':
        return 'No Deposit';
      case 'welcome':
        return 'Welcome';
      case 'free_spins':
        return 'Free Spins';
      case 'cashback':
        return 'Cashback';
      case 'reload':
        return 'Reload';
      default:
        return type;
    }
  };

  const formatTimeRemaining = (validUntil: Date | string | null) => {
    if (!validUntil) return null;
    
    const validUntilDate = typeof validUntil === 'string' ? new Date(validUntil) : validUntil;
    const now = new Date();
    const timeLeft = validUntilDate.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Ending soon';
  };

  // Calculate user rating from real API data
  const getCombinedRating = () => {
    const userAvg = Number(bonusRatings?.userReviewsAverage) || 0;
    const totalReviews = Number(bonusRatings?.totalReviews) || 0;
    
    return {
      rating: userAvg.toFixed(1),
      count: totalReviews,
      type: totalReviews > 0 ? 'user' : 'no_rating'
    };
  };

  return (
    <Link href={`/bonus/${bonus.id}`} onClick={() => tracker.track('bonus_details_view', bonus.id, 'bonus')}>
      <div 
        className="text-white rounded-xl p-6 transition-all duration-300 h-full flex flex-col relative overflow-hidden group cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${bonus.type === 'no_deposit' ? 'hsl(24, 95%, 53%)' : bonus.type === 'welcome' ? 'hsl(173, 58%, 39%)' : 'hsl(173, 58%, 39%)'}, ${bonus.type === 'no_deposit' ? 'hsl(24, 95%, 43%)' : bonus.type === 'welcome' ? 'hsl(173, 58%, 29%)' : 'hsl(173, 58%, 29%)'})`,
        border: `2px solid ${bonus.type === 'no_deposit' ? 'hsl(24, 95%, 53%)' : 'hsl(173, 58%, 39%)'}`,
        boxShadow: `0 0 15px ${bonus.type === 'no_deposit' ? 'hsl(24, 95%, 53%, 0.3)' : 'hsl(173, 58%, 39%, 0.3)'}, 0 0 30px ${bonus.type === 'no_deposit' ? 'hsl(24, 95%, 53%, 0.1)' : 'hsl(173, 58%, 39%, 0.1)'}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 0 25px ${bonus.type === 'no_deposit' ? 'hsl(24, 95%, 53%, 0.5)' : 'hsl(173, 58%, 39%, 0.5)'}, 0 0 50px ${bonus.type === 'no_deposit' ? 'hsl(24, 95%, 53%, 0.2)' : 'hsl(173, 58%, 39%, 0.2)'}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = `0 0 15px ${bonus.type === 'no_deposit' ? 'hsl(24, 95%, 53%, 0.3)' : 'hsl(173, 58%, 39%, 0.3)'}, 0 0 30px ${bonus.type === 'no_deposit' ? 'hsl(24, 95%, 53%, 0.1)' : 'hsl(173, 58%, 39%, 0.1)'}`;
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <Badge className="bg-white bg-opacity-20 text-white border-white/20 hover:bg-white/30">
          {getBonusTypeName(bonus.type)}
        </Badge>
        <div className="flex items-center gap-2">
          {(() => {
            const ratingData = getCombinedRating();
            return (
              <div className="flex items-center bg-white/20 rounded-full px-2 py-1">
                <Star className="h-3 w-3 text-yellow-300 mr-1" />
                <span className="text-sm font-semibold">{ratingData.rating}/10</span>
                {ratingData.count > 0 && (
                  <span className="text-xs ml-1 opacity-75">({ratingData.count})</span>
                )}
              </div>
            );
          })()}
          <span className="text-2xl">{getBonusTypeIcon(bonus.type)}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">{bonus.title}</h3>
      <p className="text-white/90 mb-4">{bonus.description}</p>

      {/* Bonus Details */}
      <div className="space-y-2 mb-4">
        {bonus.amount && (
          <div className="flex items-center text-sm">
            <Gift className="h-4 w-4 mr-2" />
            <span>Amount: {bonus.amount}</span>
          </div>
        )}
        {bonus.wageringRequirement && (
          <div className="flex items-center text-sm">
            <span className="mr-2">📋</span>
            <span>Wagering: {bonus.wageringRequirement}</span>
          </div>
        )}
        {bonus.minDeposit && (
          <div className="flex items-center text-sm">
            <span className="mr-2">💰</span>
            <span>Min Deposit: {bonus.minDeposit}</span>
          </div>
        )}
        {bonus.maxWin && (
          <div className="flex items-center text-sm">
            <span className="mr-2">🎯</span>
            <span>Max Win: {bonus.maxWin}</span>
          </div>
        )}
        {bonus.validUntil && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatTimeRemaining(bonus.validUntil)}</span>
          </div>
        )}
        {bonus.code && (
          <div className="flex items-center text-sm">
            <span className="mr-2">🎫</span>
            <span>Code: <code className="bg-white/20 px-1 rounded">{bonus.code}</code></span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div>
          {casinoName && (
            <div className="text-sm opacity-75">Casino:</div>
          )}
          <div className="font-semibold flex items-center">
            {casinoLogo && (
              <img 
                src={casinoLogo} 
                alt={`${casinoName} Logo`} 
                className="w-6 h-6 rounded mr-2"
              />
            )}
            {casinoName || 'Casino'}
          </div>
        </div>
        <Button 
          className="bg-white text-current hover:bg-gray-100 transition-colors"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            tracker.trackBonusClick(bonus.id);
            window.open(affiliateUrl || '#', '_blank');
          }}
        >
          Claim Now
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {bonus.terms && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-white/80">{bonus.terms}</p>
        </div>
      )}
      </div>
    </Link>
  );
}
