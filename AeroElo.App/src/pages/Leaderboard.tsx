import { PageWrapper } from '../components/layout';
import { Card } from '../components/common';
import { useEloCalculator, useLeaderboard } from '../hooks/useEloCalculator';
import type { Player } from '../types';

// TODO: Replace with actual data fetching
const mockPlayers: Player[] = [
  { id: '1', name: 'Alice', elo: 1250, wins: 15, losses: 8, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Bob', elo: 1180, wins: 12, losses: 10, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Charlie', elo: 1050, wins: 8, losses: 12, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: 'Diana', elo: 980, wins: 5, losses: 10, createdAt: new Date(), updatedAt: new Date() },
];

export function Leaderboard() {
  const { getTier } = useEloCalculator();
  const rankedPlayers = useLeaderboard(mockPlayers);

  return (
    <PageWrapper
      title="Leaderboard"
      subtitle="Current rankings based on ELO ratings"
    >
      <div className="w-full">
        <Card>
          <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-20">Rank</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Player</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-24">Tier</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600 w-24">ELO</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600 w-24">W/L</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600 w-28">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {rankedPlayers.map((player, index) => {
                const winRate = player.wins + player.losses > 0
                  ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
                  : '0.0';
                const tier = getTier(player.elo);
                
                return (
                  <tr
                    key={player.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className={`
                        inline-flex items-center justify-center w-8 h-8 rounded-full font-bold
                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${index === 1 ? 'bg-gray-100 text-gray-700' : ''}
                        ${index === 2 ? 'bg-orange-100 text-orange-700' : ''}
                        ${index > 2 ? 'text-gray-500' : ''}
                      `}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{player.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {tier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">{player.elo}</td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      <span className="text-green-600">{player.wins}</span>
                      {' / '}
                      <span className="text-red-600">{player.losses}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">{winRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      </div>
    </PageWrapper>
  );
}
