import { useState } from 'react';
import { PageWrapper } from '../components/layout';
import { Card } from '../components/common';
import { MatchForm, MatchHistoryCard } from '../components/matches';
import type { Player, Match, MatchFormData } from '../types';

// TODO: Replace with actual data fetching
const mockPlayers: Player[] = [
  { id: '1', name: 'Alice', elo: 1250, wins: 15, losses: 8, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Bob', elo: 1180, wins: 12, losses: 10, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Charlie', elo: 1050, wins: 8, losses: 12, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: 'Diana', elo: 980, wins: 5, losses: 10, createdAt: new Date(), updatedAt: new Date() },
];

const mockMatches: Match[] = [
  {
    id: '1',
    player1Id: '1',
    player2Id: '2',
    winnerId: '1',
    player1EloChange: 12,
    player2EloChange: -12,
    playedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '2',
    player1Id: '3',
    player2Id: '4',
    winnerId: '3',
    player1EloChange: 16,
    player2EloChange: -16,
    playedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

export function LogMatch() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: MatchFormData) => {
    setIsSubmitting(true);
    
    // TODO: Implement actual match logging
    console.log('Logging match:', data);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  return (
    <PageWrapper
      title="Log Match"
      subtitle="Record a new match result"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="New Match">
          <MatchForm
            players={mockPlayers}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </Card>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Matches</h2>
          <div className="space-y-3">
            {mockMatches.map((match) => (
              <MatchHistoryCard key={match.id} match={match} players={mockPlayers} />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
