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
}

export function CasinoFiltersComponent({ filters, onFiltersChange, onClearFilters }: CasinoFiltersProps) {
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
    { label: "Very High (9.0+)", value: 9.0, count: 127 },
    { label: "High (8.0-8.9)", value: 8.0, count: 234 },
    { label: "Above Average (7.0-7.9)", value: 7.0, count: 156 },
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
    "Credit Cards",
    "PayPal",
    "Skrill",
    "Neteller",
  ];

  const featureOptions = [
    "Crypto Casino",
    "Provably Fair",
    "Mobile Optimized",
    "VIP Program",
    "Live Casino",
    "Sports Betting",
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.minSafetyIndex) count++;
    if (localFilters.license) count++;
    if (localFilters.paymentMethods?.length) count++;
    if (localFilters.features?.length) count++;
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
          <h4 className="font-semibold text-foreground mb-3">Safety Index</h4>
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
      </CardContent>
    </Card>
  );
}
