import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, ExternalLink } from "lucide-react";
import type { Casino } from "@shared/schema";

interface GameCasinoModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName: string;
  casinos: Casino[];
}

export function GameCasinoModal({ isOpen, onClose, gameName, casinos }: GameCasinoModalProps) {
  // Mock casinos that have this game - in real app, this would come from API
  const mockCasinos = [
    {
      id: "1",
      name: "Crypto Palace",
      safetyIndex: "9.2",
      userRating: "4.5",
      logo: "/logos/crypto-palace.png",
      welcomeBonus: "100% up to $500 + 50 Free Spins",
      features: ["Instant Play", "Crypto Friendly", "Live Chat"],
      license: "Curacao eGaming"
    },
    {
      id: "2", 
      name: "Bitcoin Slots Pro",
      safetyIndex: "8.8",
      userRating: "4.3",
      logo: "/logos/bitcoin-slots.png",
      welcomeBonus: "150% up to 1 BTC",
      features: ["No KYC", "Fast Withdrawals", "Mobile Optimized"],
      license: "Costa Rica Gaming"
    },
    {
      id: "3",
      name: "Elite Casino",
      safetyIndex: "9.5",
      userRating: "4.7",
      logo: "/logos/elite-casino.png", 
      welcomeBonus: "200% up to $1000 + 100 Free Spins",
      features: ["VIP Program", "24/7 Support", "High Limits"],
      license: "Malta Gaming Authority"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Play {gameName} for Real Money
          </DialogTitle>
          <DialogDescription>
            Choose a trusted casino to play this game with real money and claim exclusive bonuses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {mockCasinos.map((casino) => (
            <Card key={casino.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Casino Logo and Basic Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {casino.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{casino.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{casino.safetyIndex}/10</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{casino.userRating}/5</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Licensed by {casino.license}
                      </p>
                    </div>
                  </div>

                  {/* Bonus Info */}
                  <div className="flex-1">
                    <div className="bg-orange/10 border border-orange/20 rounded-lg p-4 mb-3">
                      <h4 className="font-semibold text-orange mb-1">Welcome Bonus</h4>
                      <p className="text-sm">{casino.welcomeBonus}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {casino.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <Button 
                      className="bg-orange hover:bg-orange/90 text-white"
                      data-testid={`button-play-at-${casino.id}`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Play Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      data-testid={`button-review-${casino.id}`}
                    >
                      Read Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onClose} data-testid="button-close-modal">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}