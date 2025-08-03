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
  getReviewsByCasino: (casinoId: string) => 
    fetch(`/api/reviews/casino/${casinoId}`).then(res => res.json()),

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
};
