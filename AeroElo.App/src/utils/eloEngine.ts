import type { EloCalculation } from '../types';
import { MatchOutcome } from '../types';

// Default K-factor (determines how much ratings change per match)
const DEFAULT_K_FACTOR = 32;

// Starting ELO for new players
export const INITIAL_ELO = 1000;

/**
 * Calculate the expected score for a player based on their rating vs opponent's rating
 * @param playerRating - The player's current ELO rating
 * @param opponentRating - The opponent's current ELO rating
 * @returns Expected score between 0 and 1
 */
export function calculateExpectedScore(playerRating: number, opponentRating: number): number {
  const exponent = (opponentRating - playerRating) / 400;
  return 1 / (1 + Math.pow(10, exponent));
}

/**
 * Calculate the new ELO rating after a match
 * @param currentRating - The player's current ELO rating
 * @param expectedScore - The expected score (0-1)
 * @param actualScore - The actual score (1 for win, 0.5 for draw, 0 for loss)
 * @param kFactor - The K-factor (default: 32)
 * @returns The new ELO rating
 */
export function calculateNewRating(
  currentRating: number,
  expectedScore: number,
  actualScore: MatchOutcome,
  kFactor: number = DEFAULT_K_FACTOR
): number {
  return Math.round(currentRating + kFactor * (actualScore - expectedScore));
}

/**
 * Calculate complete ELO changes for a match between two players
 * @param winnerRating - The winner's current ELO rating
 * @param loserRating - The loser's current ELO rating
 * @param kFactor - The K-factor (default: 32)
 * @returns Object containing new ratings and changes for both players
 */
export function calculateMatchResult(
  winnerRating: number,
  loserRating: number,
  kFactor: number = DEFAULT_K_FACTOR
): { winner: EloCalculation; loser: EloCalculation } {
  const winnerExpected = calculateExpectedScore(winnerRating, loserRating);
  const loserExpected = calculateExpectedScore(loserRating, winnerRating);

  const winnerNewRating = calculateNewRating(winnerRating, winnerExpected, MatchOutcome.WIN, kFactor);
  const loserNewRating = calculateNewRating(loserRating, loserExpected, MatchOutcome.LOSS, kFactor);

  return {
    winner: {
      expectedScore: winnerExpected,
      newRating: winnerNewRating,
      ratingChange: winnerNewRating - winnerRating,
    },
    loser: {
      expectedScore: loserExpected,
      newRating: loserNewRating,
      ratingChange: loserNewRating - loserRating,
    },
  };
}

/**
 * Format ELO change for display (e.g., "+15" or "-12")
 * @param change - The ELO change value
 * @returns Formatted string with sign
 */
export function formatEloChange(change: number): string {
  return change >= 0 ? `+${change}` : `${change}`;
}

/**
 * Get rank tier based on ELO rating
 * @param elo - The player's ELO rating
 * @returns Rank tier name
 */
export function getRankTier(elo: number): string {
  if (elo >= 2000) return 'Grandmaster';
  if (elo >= 1800) return 'Master';
  if (elo >= 1600) return 'Diamond';
  if (elo >= 1400) return 'Platinum';
  if (elo >= 1200) return 'Gold';
  if (elo >= 1000) return 'Silver';
  return 'Bronze';
}
