/**
 * Spaced Repetition System based on the SuperMemo SM-2 algorithm
 * Optimizes learning by scheduling reviews at increasing intervals
 */

export interface SpacedRepetitionCard {
  id: string;
  word: string;
  translation: string;
  easeFactor: number; // E-Factor (2.5 default)
  interval: number; // Days until next review
  repetition: number; // Number of consecutive correct answers
  nextReviewDate: Date;
  lastReviewDate: Date;
  quality: number; // Last quality of response (0-5)
}

export interface ReviewSession {
  cardId: string;
  quality: number; // 0-5 scale
  responseTime: number; // milliseconds
  timestamp: Date;
}

/**
 * Calculate next review date and update card parameters based on quality
 * Quality scale:
 * 5 - perfect response
 * 4 - correct response after hesitation
 * 3 - correct response recalled with difficulty
 * 2 - incorrect response; correct one seemed familiar
 * 1 - incorrect response; correct one remembered
 * 0 - complete blackout
 */
export function updateCardAfterReview(
  card: SpacedRepetitionCard, 
  quality: number, 
  responseTime: number = 0
): SpacedRepetitionCard {
  let { easeFactor, interval, repetition } = card;

  // Update ease factor based on quality
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  if (quality < 3) {
    // Incorrect response - restart
    repetition = 0;
    interval = 1;
  } else {
    // Correct response
    repetition += 1;
    
    if (repetition === 1) {
      interval = 1;
    } else if (repetition === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    ...card,
    easeFactor,
    interval,
    repetition,
    quality,
    nextReviewDate,
    lastReviewDate: new Date(),
  };
}

/**
 * Get cards that are due for review
 */
export function getDueCards(cards: SpacedRepetitionCard[]): SpacedRepetitionCard[] {
  const now = new Date();
  return cards.filter(card => card.nextReviewDate <= now);
}

/**
 * Sort cards by priority (due cards first, then by difficulty)
 */
export function sortCardsByPriority(cards: SpacedRepetitionCard[]): SpacedRepetitionCard[] {
  const now = new Date();
  
  return cards.sort((a, b) => {
    // Due cards first
    const aOverdue = a.nextReviewDate <= now;
    const bOverdue = b.nextReviewDate <= now;
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // If both due or both not due, sort by ease factor (harder cards first)
    if (aOverdue && bOverdue) {
      return a.easeFactor - b.easeFactor;
    }
    
    // For future cards, sort by next review date
    return a.nextReviewDate.getTime() - b.nextReviewDate.getTime();
  });
}

/**
 * Create a new spaced repetition card
 */
export function createNewCard(
  id: string,
  word: string,
  translation: string
): SpacedRepetitionCard {
  const now = new Date();
  
  return {
    id,
    word,
    translation,
    easeFactor: 2.5,
    interval: 1,
    repetition: 0,
    nextReviewDate: now,
    lastReviewDate: now,
    quality: 0,
  };
}

/**
 * Calculate retention rate for a set of cards
 */
export function calculateRetentionRate(
  cards: SpacedRepetitionCard[],
  sessions: ReviewSession[]
): number {
  if (sessions.length === 0) return 0;
  
  const correctSessions = sessions.filter(session => session.quality >= 3);
  return (correctSessions.length / sessions.length) * 100;
}

/**
 * Get study statistics
 */
export function getStudyStatistics(
  cards: SpacedRepetitionCard[],
  sessions: ReviewSession[]
): {
  totalCards: number;
  dueCards: number;
  masteredCards: number; // Cards with repetition >= 3
  averageEaseFactor: number;
  retentionRate: number;
  averageInterval: number;
} {
  const dueCards = getDueCards(cards);
  const masteredCards = cards.filter(card => card.repetition >= 3);
  const averageEaseFactor = cards.reduce((sum, card) => sum + card.easeFactor, 0) / cards.length || 0;
  const averageInterval = cards.reduce((sum, card) => sum + card.interval, 0) / cards.length || 0;
  const retentionRate = calculateRetentionRate(cards, sessions);

  return {
    totalCards: cards.length,
    dueCards: dueCards.length,
    masteredCards: masteredCards.length,
    averageEaseFactor,
    retentionRate,
    averageInterval,
  };
}

/**
 * Estimate study load for upcoming days
 */
export function getUpcomingReviews(
  cards: SpacedRepetitionCard[],
  days: number = 7
): { date: string; count: number }[] {
  const result = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    
    const count = cards.filter(card => {
      const reviewDate = new Date(card.nextReviewDate);
      return (
        reviewDate.getFullYear() === targetDate.getFullYear() &&
        reviewDate.getMonth() === targetDate.getMonth() &&
        reviewDate.getDate() === targetDate.getDate()
      );
    }).length;
    
    result.push({
      date: targetDate.toISOString().split('T')[0],
      count,
    });
  }
  
  return result;
}

/**
 * Adjust difficulty based on response time
 * Faster responses can increase ease factor slightly
 */
export function adjustQualityByResponseTime(
  baseQuality: number,
  responseTime: number,
  averageResponseTime: number = 3000
): number {
  if (baseQuality < 3) return baseQuality; // Don't adjust incorrect answers
  
  const timeRatio = responseTime / averageResponseTime;
  
  if (timeRatio < 0.5) {
    // Very fast response - might be too easy
    return Math.min(5, baseQuality + 0.5);
  } else if (timeRatio > 2) {
    // Slow response - might be difficult
    return Math.max(3, baseQuality - 0.5);
  }
  
  return baseQuality;
}

/**
 * Analyze learning patterns and provide insights
 */
export function analyzeLearningPatterns(
  cards: SpacedRepetitionCard[],
  sessions: ReviewSession[]
): {
  difficultyDistribution: { easy: number; medium: number; hard: number };
  timeOfDayPerformance: { [hour: string]: number };
  weeklyProgress: { correct: number; total: number }[];
  suggestedDailyReviews: number;
} {
  // Difficulty distribution based on ease factors
  const difficultyDistribution = {
    easy: cards.filter(card => card.easeFactor > 2.8).length,
    medium: cards.filter(card => card.easeFactor >= 2.2 && card.easeFactor <= 2.8).length,
    hard: cards.filter(card => card.easeFactor < 2.2).length,
  };

  // Time of day performance
  const timeOfDayPerformance: { [hour: string]: number } = {};
  sessions.forEach(session => {
    const hour = session.timestamp.getHours().toString();
    if (!timeOfDayPerformance[hour]) {
      timeOfDayPerformance[hour] = 0;
    }
    timeOfDayPerformance[hour] += session.quality >= 3 ? 1 : 0;
  });

  // Weekly progress (last 7 days)
  const weeklyProgress = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const daySessions = sessions.filter(session => 
      session.timestamp.toDateString() === date.toDateString()
    );
    
    weeklyProgress.push({
      correct: daySessions.filter(s => s.quality >= 3).length,
      total: daySessions.length,
    });
  }

  // Suggested daily reviews based on current due cards and learning velocity
  const dueCards = getDueCards(cards);
  const avgSessionsPerDay = sessions.length / 7; // Assuming 7 days of data
  const suggestedDailyReviews = Math.max(
    Math.min(dueCards.length, 50), // Cap at 50 cards per day
    Math.round(avgSessionsPerDay * 1.2) // 20% more than current average
  );

  return {
    difficultyDistribution,
    timeOfDayPerformance,
    weeklyProgress,
    suggestedDailyReviews,
  };
}