export interface CasinoFilters {
  minSafetyIndex?: number;
  license?: string;
  paymentMethods?: string[];
  features?: string[];
  search?: string;
}

export interface SearchFilters extends CasinoFilters {
  bonusType?: string;
  category?: string;
}
