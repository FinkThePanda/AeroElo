import { useState } from 'react';
import { PageWrapper } from '../components/layout';
import { Card, Button, Input } from '../components/common';
import { useEloCalculator } from '../hooks/useEloCalculator';
import type { Player } from '../types';

// TODO: Replace with actual data fetching
const mockPlayers: Player[] = [
  { id: '1', name: 'Alice', elo: 1250, wins: 15, losses: 8, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Bob', elo: 1180, wins: 12, losses: 10, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Charlie', elo: 1050, wins: 8, losses: 12, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: 'Diana', elo: 980, wins: 5, losses: 10, createdAt: new Date(), updatedAt: new Date() },
];

export function Players() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const { getTier, initialElo } = useEloCalculator();

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    
    // TODO: Implement actual player creation
    console.log('Adding player:', newPlayerName);
    setNewPlayerName('');
    setShowAddForm(false);
  };

  return (
    <PageWrapper
      title="Players"
      subtitle="Manage players in the ELO system"
    >
      <div className="w-full space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add Player'}
          </Button>
        </div>

        {showAddForm && (
          <Card title="Add New Player">
            <form onSubmit={handleAddPlayer} className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter player name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  helperText={`New players start with ${initialElo} ELO`}
                />
              </div>
              <Button type="submit" disabled={!newPlayerName.trim()}>
                Add
              </Button>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPlayers.map((player) => {
            const tier = getTier(player.elo);
            const totalGames = player.wins + player.losses;
            
            return (
              <Card key={player.id} variant="outlined">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{player.name}</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      {tier}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{player.elo}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-gray-500">Games</div>
                    <div className="font-semibold">{totalGames}</div>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-gray-500">Wins</div>
                    <div className="font-semibold text-green-600">{player.wins}</div>
                  </div>
                  <div className="bg-red-50 rounded p-2">
                    <div className="text-gray-500">Losses</div>
                    <div className="font-semibold text-red-600">{player.losses}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
