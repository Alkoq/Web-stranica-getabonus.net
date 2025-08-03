import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, Gift } from "lucide-react";
import type { Bonus } from "@shared/schema";

interface BonusCardProps {
  bonus: Bonus;
  casinoName?: string;
  casinoLogo?: string;
  affiliateUrl?: string;
}

export function BonusCard({ bonus, casinoName, casinoLogo, affiliateUrl }: BonusCardProps) {
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

  const formatTimeRemaining = (validUntil: Date | null) => {
    if (!validUntil) return null;
    
    const now = new Date();
    const timeLeft = validUntil.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Ending soon';
  };

  return (
    <div className={`bg-gradient-to-br ${getBonusTypeColor(bonus.type)} text-white rounded-xl p-6 hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <Badge className="bg-white bg-opacity-20 text-white border-white/20 hover:bg-white/30">
          {getBonusTypeName(bonus.type)}
        </Badge>
        <span className="text-2xl">{getBonusTypeIcon(bonus.type)}</span>
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
        {bonus.validUntil && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatTimeRemaining(bonus.validUntil)}</span>
          </div>
        )}
        {bonus.code && (
          <div className="flex items-center text-sm">
            <span className="mr-2">🎫</span>
            <span>Code: <strong>{bonus.code}</strong></span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
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
          asChild
          className="bg-white text-current hover:bg-gray-100 transition-colors"
        >
          <a href={affiliateUrl || '#'} target="_blank" rel="noopener noreferrer">
            Claim Now
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      {bonus.terms && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-white/80">{bonus.terms}</p>
        </div>
      )}
    </div>
  );
}
