import { useState } from 'react';
import { Button } from '../common/Button';
import { useEloCalculator } from '../../hooks/useEloCalculator';
import type { Player, MatchFormData } from '../../types';

interface MatchFormProps {
  players: Player[];
  onSubmit: (data: MatchFormData) => void;
  isLoading?: boolean;
}

export function MatchForm({ players, onSubmit, isLoading = false }: MatchFormProps) {
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [winnerId, setWinnerId] = useState('');
  
  const { previewMatch, formatChange } = useEloCalculator();

  const player1 = players.find((p) => p.id === player1Id);
  const player2 = players.find((p) => p.id === player2Id);

  const canPreview = player1 && player2 && winnerId;
  const preview = canPreview
    ? previewMatch(
        winnerId === player1Id ? player1.elo : player2.elo,
        winnerId === player1Id ? player2.elo : player1.elo
      )
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!player1Id || !player2Id || !winnerId) return;
    onSubmit({ player1Id, player2Id, winnerId });
  };

  const availableOpponents = players.filter((p) => p.id !== player1Id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Player 1
          </label>
          <select
            value={player1Id}
            onChange={(e) => {
              setPlayer1Id(e.target.value);
              setWinnerId('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select player...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.elo})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Player 2
          </label>
          <select
            value={player2Id}
            onChange={(e) => {
              setPlayer2Id(e.target.value);
              setWinnerId('');
            }}
            disabled={!player1Id}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select player...</option>
            {availableOpponents.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.elo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {player1 && player2 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who won?
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setWinnerId(player1.id)}
              className={`flex-1 py-3 px-4 rounded-md border-2 transition-colors ${
                winnerId === player1.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {player1.name}
            </button>
            <button
              type="button"
              onClick={() => setWinnerId(player2.id)}
              className={`flex-1 py-3 px-4 rounded-md border-2 transition-colors ${
                winnerId === player2.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {player2.name}
            </button>
          </div>
        </div>
      )}

      {preview && player1 && player2 && (
        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">ELO Preview</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">
                {winnerId === player1.id ? player1.name : player2.name}:
              </span>
              <span className="ml-2 text-green-600 font-medium">
                {formatChange(preview.winner.ratingChange)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                {winnerId === player1.id ? player2.name : player1.name}:
              </span>
              <span className="ml-2 text-red-600 font-medium">
                {formatChange(preview.loser.ratingChange)}
              </span>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={!player1Id || !player2Id || !winnerId}
        isLoading={isLoading}
        className="w-full"
      >
        Log Match
      </Button>
    </form>
  );
}
