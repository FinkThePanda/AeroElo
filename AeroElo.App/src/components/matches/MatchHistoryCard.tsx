import { Card } from '../common/Card';
import { useEloCalculator } from '../../hooks/useEloCalculator';
import type { Match, Player } from '../../types';

interface MatchHistoryCardProps {
  match: Match;
  players: Player[];
}

export function MatchHistoryCard({ match, players }: MatchHistoryCardProps) {
  const { formatChange } = useEloCalculator();
  
  const player1 = players.find((p) => p.id === match.player1Id);
  const player2 = players.find((p) => p.id === match.player2Id);
  const winner = players.find((p) => p.id === match.winnerId);

  if (!player1 || !player2 || !winner) {
    return null;
  }

  const loser = winner.id === player1.id ? player2 : player1;
  const winnerEloChange = winner.id === player1.id ? match.player1EloChange : match.player2EloChange;
  const loserEloChange = winner.id === player1.id ? match.player2EloChange : match.player1EloChange;

  const formattedDate = new Date(match.playedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card variant="outlined" className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{winner.name}</div>
            <div className="text-sm text-green-600 font-medium">
              {formatChange(winnerEloChange)}
            </div>
          </div>
          
          <div className="text-gray-400 font-medium">vs</div>
          
          <div className="text-center">
            <div className="font-semibold text-gray-500">{loser.name}</div>
            <div className="text-sm text-red-600 font-medium">
              {formatChange(loserEloChange)}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">{formattedDate}</div>
      </div>
    </Card>
  );
}
