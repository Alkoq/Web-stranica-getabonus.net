import { apiRequest } from "./queryClient";

export const api = {
  // Casinos
  getCasinos: (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    const queryString = params.toString();
    return fetch(`/api/casinos${queryString ? '?' + queryString : ''}`).then(res => res.json());
  },

  getFeaturedCasinos: () => 
    fetch('/api/casinos/featured').then(res => res.json()),

  getCasino: (id: string) => 
    fetch(`/api/casinos/${id}`).then(res => res.json()),

  // Bonuses
  getBonuses: (casinoId?: string) => {
    const params = casinoId ? `?casinoId=${casinoId}` : '';
    return fetch(`/api/bonuses${params}`).then(res => res.json());
  },

  getFeaturedBonuses: () => 
    fetch('/api/bonuses/featured').then(res => res.json()),

  // Reviews
  getReviews: (casinoId?: string, bonusId?: string, gameId?: string) => {
    if (casinoId) return fetch(`/api/reviews/casino/${casinoId}`).then(res => res.json());
    if (bonusId) return fetch(`/api/reviews/bonus/${bonusId}`).then(res => res.json());
    if (gameId) return fetch(`/api/reviews/game/${gameId}`).then(res => res.json());
    return fetch('/api/reviews').then(res => res.json());
  },

  getReviewsByCasino: (casinoId: string) => 
    fetch(`/api/reviews/casino/${casinoId}`).then(res => res.json()),

  createReview: (reviewData: any) => 
    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    }).then(res => res.json()),

  // Expert Reviews
  getExpertReviews: (casinoId: string) => 
    fetch(`/api/expert-reviews/casino/${casinoId}`).then(res => res.json()),

  // Games
  getGames: (filters?: { type?: string; provider?: string; minRtp?: number; volatility?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.provider) params.append('provider', filters.provider);
    if (filters?.minRtp) params.append('minRtp', filters.minRtp.toString());
    if (filters?.volatility) params.append('volatility', filters.volatility);
    if (filters?.search) params.append('search', filters.search);
    return fetch(`/api/games${params.toString() ? `?${params.toString()}` : ''}`).then(res => res.json());
  },

  getGame: (id: string) => 
    fetch(`/api/games/${id}`).then(res => res.json()),

  // Blog
  getBlogPosts: (published = true) => 
    fetch(`/api/blog?published=${published}`).then(res => res.json()),

  getBlogPost: (slug: string) => 
    fetch(`/api/blog/${slug}`).then(res => res.json()),

  // Newsletter
  subscribeNewsletter: (email: string) => 
    apiRequest('POST', '/api/newsletter/subscribe', { email }),

  // Comparisons
  createComparison: (casinoIds: string[], userId?: string) => 
    apiRequest('POST', '/api/comparisons', { casinoIds, userId }),

  getComparison: (id: string) => 
    fetch(`/api/comparisons/${id}`).then(res => res.json()),

  // Statistics
  getStats: () => 
    fetch('/api/stats').then(res => res.json()),
};
