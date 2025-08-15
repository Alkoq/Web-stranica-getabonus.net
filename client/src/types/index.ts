export interface CasinoFilters {
  minSafetyIndex?: number;
  minExpertRating?: number;
  minUserRating?: number;
  license?: string;
  paymentMethods?: string[];
  features?: string[];
  gameProviders?: string[];
  bonusType?: string;
  establishedYear?: number;
  search?: string;
  country?: string; // User's country to check availability
}

export interface SearchFilters extends CasinoFilters {
  bonusType?: string;
  category?: string;
}
