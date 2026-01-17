import { useMemo, useCallback } from 'react';
import { calculateMatchResult, formatEloChange, getRankTier, INITIAL_ELO } from '../utils/eloEngine';
import type { Player, EloCalculation } from '../types';

interface MatchPreview {
  winner: EloCalculation;
  loser: EloCalculation;
}

interface UseEloCalculatorReturn {
  /**
   * Preview the ELO changes for a potential match
   */
  previewMatch: (winnerElo: number, loserElo: number) => MatchPreview;
  
  /**
   * Format an ELO change value for display
   */
  formatChange: (change: number) => string;
  
  /**
   * Get the rank tier for a given ELO
   */
  getTier: (elo: number) => string;
  
  /**
   * Get the initial ELO rating for new players
   */
  initialElo: number;
}

/**
 * Custom hook for ELO calculations and formatting
 */
export function useEloCalculator(): UseEloCalculatorReturn {
  const previewMatch = useCallback((winnerElo: number, loserElo: number): MatchPreview => {
    return calculateMatchResult(winnerElo, loserElo);
  }, []);

  const formatChange = useCallback((change: number): string => {
    return formatEloChange(change);
  }, []);

  const getTier = useCallback((elo: number): string => {
    return getRankTier(elo);
  }, []);

  return useMemo(() => ({
    previewMatch,
    formatChange,
    getTier,
    initialElo: INITIAL_ELO,
  }), [previewMatch, formatChange, getTier]);
}

/**
 * Hook to get sorted players by ELO (for leaderboard)
 */
export function useLeaderboard(players: Player[]): Player[] {
  return useMemo(() => {
    return [...players].sort((a, b) => b.elo - a.elo);
  }, [players]);
}
