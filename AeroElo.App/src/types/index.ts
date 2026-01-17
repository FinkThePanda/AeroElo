// Player types
export interface Player {
  id: string;
  name: string;
  elo: number;
  wins: number;
  losses: number;
  createdAt: Date;
  updatedAt: Date;
}

// Match types
export interface Match {
  id: string;
  player1Id: string;
  player2Id: string;
  winnerId: string;
  player1EloChange: number;
  player2EloChange: number;
  playedAt: Date;
}

export interface MatchResult {
  winner: Player;
  loser: Player;
  winnerEloChange: number;
  loserEloChange: number;
}

// ELO calculation types
export interface EloCalculation {
  expectedScore: number;
  newRating: number;
  ratingChange: number;
}

// Form types
export interface MatchFormData {
  player1Id: string;
  player2Id: string;
  winnerId: string;
}

// Match outcome constants
export const MatchOutcome = {
  WIN: 1,
  LOSS: 0,
  DRAW: 0.5,
} as const;

export type MatchOutcome = (typeof MatchOutcome)[keyof typeof MatchOutcome];
