export interface CasinoFilters {
  minSafetyIndex?: number;
  license?: string;
  paymentMethods?: string[];
  features?: string[];
  gameProviders?: string[];
  bonusType?: string;
  establishedYear?: number;
  search?: string;
}

export interface SearchFilters extends CasinoFilters {
  bonusType?: string;
  category?: string;
}
