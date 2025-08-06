// Utility for tracking user interactions
export class InteractionTracker {
  private sessionId: string;

  constructor() {
    // Generate or retrieve session ID
    this.sessionId = this.getSessionId();
  }

  private getSessionId(): string {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  async track(interactionType: string, targetId?: string, targetType?: string) {
    try {
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          interactionType,
          targetId,
          targetType
        })
      });

      if (!response.ok) {
        console.warn('Failed to track interaction:', response.statusText);
      }
    } catch (error) {
      console.warn('Error tracking interaction:', error);
    }
  }

  // Convenience methods for common interactions
  trackCasinoClick(casinoId: string) {
    return this.track('casino_click', casinoId, 'casino');
  }

  trackBonusClick(bonusId: string) {
    return this.track('bonus_click', bonusId, 'bonus');
  }

  trackGameClick(gameId: string) {
    return this.track('game_click', gameId, 'game');
  }

  trackReviewSubmit(targetId: string, targetType: string) {
    return this.track('review_submit', targetId, targetType);
  }

  trackHelpfulVote(reviewId: string) {
    return this.track('helpful_vote', reviewId, 'review');
  }

  trackGameModal(gameId: string) {
    return this.track('game_modal', gameId, 'game');
  }

  trackSearchQuery(query: string) {
    return this.track('search', query, 'query');
  }
}

// Export singleton instance
export const tracker = new InteractionTracker();