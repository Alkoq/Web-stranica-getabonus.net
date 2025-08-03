import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ExternalLink } from "lucide-react";
import type { Casino } from "@shared/schema";

interface CasinoComparisonProps {
  availableCasinos: Casino[];
}

export function CasinoComparison({ availableCasinos }: CasinoComparisonProps) {
  const [selectedCasinos, setSelectedCasinos] = useState<Casino[]>([]);
  const [showSelector, setShowSelector] = useState(false);

  const addCasino = (casino: Casino) => {
    if (selectedCasinos.length < 3 && !selectedCasinos.find(c => c.id === casino.id)) {
      setSelectedCasinos([...selectedCasinos, casino]);
      setShowSelector(false);
    }
  };

  const removeCasino = (casinoId: string) => {
    setSelectedCasinos(selectedCasinos.filter(c => c.id !== casinoId));
  };

  const ComparisonSlot = ({ index }: { index: number }) => {
    const casino = selectedCasinos[index];

    if (!casino) {
      return (
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardContent className="p-6 text-center">
            <div className="text-4xl text-muted-foreground mb-4">+</div>
            <p className="text-muted-foreground mb-4">
              Select {index === 0 ? 'first' : index === 1 ? 'second' : 'third'} casino to compare
            </p>
            <Button 
              onClick={() => setShowSelector(true)}
              className="bg-turquoise hover:bg-turquoise/90"
            >
              Choose Casino
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removeCasino(casino.id)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <img 
              src={casino.logoUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"} 
              alt={`${casino.name} Logo`} 
              className="w-16 h-16 rounded-lg object-cover mx-auto mb-2"
            />
            <CardTitle className="text-lg">{casino.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-turquoise">{casino.safetyIndex}</div>
            <div className="text-sm text-muted-foreground">Safety Index</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold">{casino.userRating}/5</div>
            <div className="text-sm text-muted-foreground">{casino.totalReviews} reviews</div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">License</div>
            <Badge variant="outline">{casino.license}</Badge>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Established</div>
            <div className="text-sm">{casino.establishedYear}</div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Payment Methods</div>
            <div className="flex flex-wrap gap-1">
              {casino.paymentMethods.slice(0, 2).map((method, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {method}
                </Badge>
              ))}
              {casino.paymentMethods.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{casino.paymentMethods.length - 2}
                </Badge>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Features</div>
            <div className="flex flex-wrap gap-1">
              {casino.features.slice(0, 3).map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Button asChild className="w-full bg-turquoise hover:bg-turquoise/90">
            <a href={casino.affiliateUrl || casino.websiteUrl} target="_blank" rel="noopener noreferrer">
              Visit Casino
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🔍 Compare Casinos Side-by-Side</h2>
        <p className="text-muted-foreground">
          Select up to 3 casinos to compare their features, safety ratings, and offerings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ComparisonSlot index={0} />
        <ComparisonSlot index={1} />
        <ComparisonSlot index={2} />
      </div>

      {/* Casino Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Select a Casino to Compare</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSelector(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {availableCasinos
                  .filter(casino => !selectedCasinos.find(c => c.id === casino.id))
                  .map((casino) => (
                    <div 
                      key={casino.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
                      onClick={() => addCasino(casino)}
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={casino.logoUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"} 
                          alt={`${casino.name} Logo`} 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-semibold">{casino.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Safety Index: {casino.safetyIndex}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-turquoise hover:bg-turquoise/90">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
