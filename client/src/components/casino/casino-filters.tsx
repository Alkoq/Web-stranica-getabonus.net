import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { CasinoFilters } from "@/types";

interface CasinoFiltersProps {
  filters: CasinoFilters;
  onFiltersChange: (filters: CasinoFilters) => void;
  onClearFilters: () => void;
  casinos?: any[]; // For counting filter options
  expertReviews?: any[];
  userReviews?: any[];
}

export function CasinoFiltersComponent({ filters, onFiltersChange, onClearFilters, casinos = [], expertReviews = [], userReviews = [] }: CasinoFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CasinoFilters>(filters);

  const handleFilterChange = (key: keyof CasinoFilters, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleArrayFilterChange = (key: keyof CasinoFilters, value: string, checked: boolean) => {
    const currentArray = (localFilters[key] as string[]) || [];
    const updatedArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFilterChange(key, updatedArray.length > 0 ? updatedArray : undefined);
  };

  const safetyIndexOptions = [
    { 
      label: "Very High (9.0+)", 
      value: 9.0, 
      count: casinos.filter(c => parseFloat(c.safetyIndex || '0') >= 9.0).length 
    },
    { 
      label: "High (8.0-8.9)", 
      value: 8.0, 
      count: casinos.filter(c => {
        const safety = parseFloat(c.safetyIndex || '0');
        return safety >= 8.0 && safety < 9.0;
      }).length 
    },
    { 
      label: "Above Average (7.0-7.9)", 
      value: 7.0, 
      count: casinos.filter(c => {
        const safety = parseFloat(c.safetyIndex || '0');
        return safety >= 7.0 && safety < 8.0;
      }).length 
    },
  ];

  const licenseOptions = [
    "Malta Gaming Authority",
    "Curacao eGaming", 
    "UK Gambling Commission",
    "Gibraltar Gambling Commission",
  ];

  const paymentOptions = [
    "Bitcoin",
    "Ethereum", 
    "Litecoin",
    "Dogecoin",
    "Credit Cards",
    "PayPal",
    "Skrill",
    "Neteller",
    "Bank Transfer",
    "Crypto",
  ];

  const featureOptions = [
    "Crypto Casino",
    "Provably Fair",
    "Mobile Optimized",
    "VIP Program",
    "Live Casino",
    "Sports Betting",
    "24/7 Support",
    "Fast Withdrawal",
    "No KYC",
  ];

  const gameProviderOptions = [
    "NetEnt",
    "Microgaming", 
    "Pragmatic Play",
    "Evolution Gaming",
    "Play'n GO",
    "Quickspin",
    "Yggdrasil",
    "Red Tiger",
    "Push Gaming",
  ];

  const bonusTypeOptions = [
    "Welcome Bonus",
    "No Deposit",
    "Free Spins",
    "Reload Bonus",
    "Cashback",
    "VIP Bonus",
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.minSafetyIndex) count++;
    if (localFilters.minExpertRating) count++;
    if (localFilters.minUserRating) count++;
    if (localFilters.license) count++;
    if (localFilters.paymentMethods?.length) count++;
    if (localFilters.features?.length) count++;
    if (localFilters.gameProviders?.length) count++;
    if (localFilters.bonusType) count++;
    if (localFilters.establishedYear) count++;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Advanced Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear ({getActiveFiltersCount()})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Safety Index Filter */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Safety Index (Overall)</h4>
          <div className="space-y-2">
            {safetyIndexOptions.map((option) => (
              <label key={option.value} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={localFilters.minSafetyIndex === option.value}
                    onCheckedChange={(checked) => {
                      handleFilterChange('minSafetyIndex', checked ? option.value : undefined);
                    }}
                  />
                  <span className="text-sm">{option.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {option.count}
                </Badge>
              </label>
            ))}
          </div>
        </div>

        {/* Expert Rating Filter */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Expert Rating</h4>
          <div className="space-y-2">
            {[
              { 
                label: "Excellent (9.0+)", 
                value: 9.0, 
                count: casinos.filter(c => {
                  const casinoExpertReviews = expertReviews.filter((r: any) => r.casinoId === c.id);
                  if (casinoExpertReviews.length === 0) return false;
                  const avgRating = casinoExpertReviews.reduce((acc: number, r: any) => acc + parseFloat(r.overallRating), 0) / casinoExpertReviews.length;
                  return avgRating >= 9.0;
                }).length 
              },
              { 
                label: "Very Good (8.0+)", 
                value: 8.0, 
                count: casinos.filter(c => {
                  const casinoExpertReviews = expertReviews.filter((r: any) => r.casinoId === c.id);
                  if (casinoExpertReviews.length === 0) return false;
                  const avgRating = casinoExpertReviews.reduce((acc: number, r: any) => acc + parseFloat(r.overallRating), 0) / casinoExpertReviews.length;
                  return avgRating >= 8.0;
                }).length 
              },
              { 
                label: "Good (7.0+)", 
                value: 7.0, 
                count: casinos.filter(c => {
                  const casinoExpertReviews = expertReviews.filter((r: any) => r.casinoId === c.id);
                  if (casinoExpertReviews.length === 0) return false;
                  const avgRating = casinoExpertReviews.reduce((acc: number, r: any) => acc + parseFloat(r.overallRating), 0) / casinoExpertReviews.length;
                  return avgRating >= 7.0;
                }).length 
              },
            ].map((option) => (
              <label key={option.value} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={localFilters.minExpertRating === option.value}
                    onCheckedChange={(checked) => {
                      handleFilterChange('minExpertRating', checked ? option.value : undefined);
                    }}
                  />
                  <span className="text-sm">{option.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {option.count}
                </Badge>
              </label>
            ))}
          </div>
        </div>

        {/* User Rating Filter */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">User Rating</h4>
          <div className="space-y-2">
            {[
              { 
                label: "Excellent (9.0+)", 
                value: 9.0, 
                count: casinos.filter(c => {
                  const casinoUserReviews = userReviews.filter((r: any) => r.casinoId === c.id);
                  if (casinoUserReviews.length === 0) return false;
                  const avgRating = casinoUserReviews.reduce((acc: number, r: any) => acc + r.overallRating, 0) / casinoUserReviews.length;
                  return avgRating >= 9.0;
                }).length 
              },
              { 
                label: "Very Good (8.0+)", 
                value: 8.0, 
                count: casinos.filter(c => {
                  const casinoUserReviews = userReviews.filter((r: any) => r.casinoId === c.id);
                  if (casinoUserReviews.length === 0) return false;
                  const avgRating = casinoUserReviews.reduce((acc: number, r: any) => acc + r.overallRating, 0) / casinoUserReviews.length;
                  return avgRating >= 8.0;
                }).length 
              },
              { 
                label: "Good (7.0+)", 
                value: 7.0, 
                count: casinos.filter(c => {
                  const casinoUserReviews = userReviews.filter((r: any) => r.casinoId === c.id);
                  if (casinoUserReviews.length === 0) return false;
                  const avgRating = casinoUserReviews.reduce((acc: number, r: any) => acc + r.overallRating, 0) / casinoUserReviews.length;
                  return avgRating >= 7.0;
                }).length 
              },
            ].map((option) => (
              <label key={option.value} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={localFilters.minUserRating === option.value}
                    onCheckedChange={(checked) => {
                      handleFilterChange('minUserRating', checked ? option.value : undefined);
                    }}
                  />
                  <span className="text-sm">{option.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {option.count}
                </Badge>
              </label>
            ))}
          </div>
        </div>

        {/* License Filter */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">License</h4>
          <div className="space-y-2">
            {licenseOptions.map((license) => (
              <label key={license} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={localFilters.license === license}
                  onCheckedChange={(checked) => {
                    handleFilterChange('license', checked ? license : undefined);
                  }}
                />
                <span className="text-sm">{license}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Payment Methods</h4>
          <div className="space-y-2">
            {paymentOptions.map((method) => (
              <label key={method} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={localFilters.paymentMethods?.includes(method) || false}
                  onCheckedChange={(checked) => {
                    handleArrayFilterChange('paymentMethods', method, !!checked);
                  }}
                />
                <span className="text-sm">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Features</h4>
          <div className="space-y-2">
            {featureOptions.map((feature) => (
              <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={localFilters.features?.includes(feature) || false}
                  onCheckedChange={(checked) => {
                    handleArrayFilterChange('features', feature, !!checked);
                  }}
                />
                <span className="text-sm">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Game Providers */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Game Providers</h4>
          <div className="space-y-2">
            {gameProviderOptions.map((provider) => (
              <label key={provider} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={localFilters.gameProviders?.includes(provider) || false}
                  onCheckedChange={(checked) => {
                    handleArrayFilterChange('gameProviders', provider, !!checked);
                  }}
                />
                <span className="text-sm">{provider}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bonus Type */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Bonus Type</h4>
          <div className="space-y-2">
            {bonusTypeOptions.map((bonusType) => (
              <label key={bonusType} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={localFilters.bonusType === bonusType}
                  onCheckedChange={(checked) => {
                    handleFilterChange('bonusType', checked ? bonusType : undefined);
                  }}
                />
                <span className="text-sm">{bonusType}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Established Year */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Established</h4>
          <div className="space-y-2">
            {[2020, 2015, 2010, 2005].map((year) => (
              <label key={year} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={localFilters.establishedYear === year}
                  onCheckedChange={(checked) => {
                    handleFilterChange('establishedYear', checked ? year : undefined);
                  }}
                />
                <span className="text-sm">{year}+ and newer</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
