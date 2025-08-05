import { useState, useEffect } from "react";
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
  bonuses?: any[];
}

export function CasinoFiltersComponent({ filters, onFiltersChange, onClearFilters, casinos = [], expertReviews = [], userReviews = [], bonuses = [] }: CasinoFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CasinoFilters>(filters);

  // Update local filters when external filters change (e.g., when cleared)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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

  // Helper function to calculate safety index for filter counting
  const calculateSafetyIndex = (casino: any) => {
    const casinoExpertReviews = expertReviews.filter((r: any) => r.casinoId === casino.id);
    const casinoUserReviews = userReviews.filter((r: any) => r.casinoId === casino.id);
    
    const expertRating = casinoExpertReviews.length > 0 
      ? casinoExpertReviews.reduce((acc: number, r: any) => acc + parseFloat(r.overallRating), 0) / casinoExpertReviews.length 
      : 0;
    
    const userRating = casinoUserReviews.length > 0 
      ? casinoUserReviews.reduce((acc: number, r: any) => acc + r.overallRating, 0) / casinoUserReviews.length 
      : 0;
    
    if (expertRating > 0 && userRating > 0) {
      return (expertRating + userRating) / 2;
    } else if (expertRating > 0) {
      return expertRating;
    } else if (userRating > 0) {
      return userRating;
    }
    return parseFloat(casino.safetyIndex || '0');
  };

  const safetyIndexOptions = [
    { 
      label: "Very High (9.0+)", 
      value: 9.0, 
      count: casinos.filter(c => calculateSafetyIndex(c) >= 9.0).length 
    },
    { 
      label: "High (8.0-8.9)", 
      value: 8.0, 
      count: casinos.filter(c => {
        const safety = calculateSafetyIndex(c);
        return safety >= 8.0 && safety < 9.0;
      }).length 
    },
    { 
      label: "Above Average (7.0-7.9)", 
      value: 7.0, 
      count: casinos.filter(c => {
        const safety = calculateSafetyIndex(c);
        return safety >= 7.0 && safety < 8.0;
      }).length 
    },
  ];

  // Generate dynamic filter options from actual casino data
  const licenseOptions = Array.from(new Set(
    casinos.map(c => c.license).filter(Boolean)
  )).sort();

  const paymentOptions = Array.from(new Set(
    casinos.flatMap(c => c.paymentMethods || [])
  )).sort();

  const featureOptions = Array.from(new Set(
    casinos.flatMap(c => c.features || [])
  )).sort();

  const gameProviderOptions = Array.from(new Set(
    casinos.flatMap(c => c.gameProviders || [])
  )).sort();

  // Get bonus types from available bonuses
  const bonusTypeOptions = Array.from(new Set(
    bonuses?.map((b: any) => b.type).filter(Boolean) || []
  )).sort();

  // Generate dynamic established year options from actual casino data
  const establishedYearOptions = Array.from(new Set(
    casinos.map(c => c.establishedYear).filter(Boolean)
  )).sort((a, b) => b - a); // Sort in descending order (newest first)

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
        {licenseOptions.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-3">License</h4>
            <div className="space-y-2">
              {licenseOptions.map((license) => (
                <label key={license} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={localFilters.license === license}
                      onCheckedChange={(checked) => {
                        handleFilterChange('license', checked ? license : undefined);
                      }}
                    />
                    <span className="text-sm">{license}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {casinos.filter(c => c.license === license).length}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {paymentOptions.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-3">Payment Methods</h4>
            <div className="space-y-2">
              {paymentOptions.map((method) => (
                <label key={method} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={localFilters.paymentMethods?.includes(method) || false}
                      onCheckedChange={(checked) => {
                        handleArrayFilterChange('paymentMethods', method, !!checked);
                      }}
                    />
                    <span className="text-sm">{method}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {casinos.filter(c => c.paymentMethods?.includes(method)).length}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {featureOptions.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-3">Features</h4>
            <div className="space-y-2">
              {featureOptions.map((feature) => (
                <label key={feature} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={localFilters.features?.includes(feature) || false}
                      onCheckedChange={(checked) => {
                        handleArrayFilterChange('features', feature, !!checked);
                      }}
                    />
                    <span className="text-sm">{feature}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {casinos.filter(c => c.features?.includes(feature)).length}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Game Providers */}
        {gameProviderOptions.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-3">Game Providers</h4>
            <div className="space-y-2">
              {gameProviderOptions.map((provider) => (
                <label key={provider} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={localFilters.gameProviders?.includes(provider) || false}
                      onCheckedChange={(checked) => {
                        handleArrayFilterChange('gameProviders', provider, !!checked);
                      }}
                    />
                    <span className="text-sm">{provider}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {casinos.filter(c => c.gameProviders?.includes(provider)).length}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Bonus Type */}
        {bonusTypeOptions.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-3">Bonus Type</h4>
            <div className="space-y-2">
              {bonusTypeOptions.map((bonusType) => (
                <label key={String(bonusType)} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={localFilters.bonusType === bonusType}
                      onCheckedChange={(checked) => {
                        handleFilterChange('bonusType', checked ? bonusType : undefined);
                      }}
                    />
                    <span className="text-sm">{String(bonusType)}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {bonuses.filter((b: any) => b.type === bonusType).length}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Established Year */}
        {establishedYearOptions.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-3">Established</h4>
            <div className="space-y-2">
              {establishedYearOptions.map((year) => (
                <label key={year} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={localFilters.establishedYear === year}
                      onCheckedChange={(checked) => {
                        handleFilterChange('establishedYear', checked ? year : undefined);
                      }}
                    />
                    <span className="text-sm">{year}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {casinos.filter(c => c.establishedYear === year).length}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
