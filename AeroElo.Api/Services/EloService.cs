using AeroElo.Api.Data;
using AeroElo.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AeroElo.Api.Services
{
    public class EloService : IEloService
    {
        private const int KFactor = 32;
        private readonly AeroEloDbContext _context;

        public EloService(AeroEloDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Calculates the new ratings for two players/teams.
        /// </summary>
        /// <param name="ratingA">Current Elo of Player/Team A</param>
        /// <param name="ratingB">Current Elo of Player/Team B</param>
        /// <param name="wonA">True if Side A won</param>
        public (int newA, int newB) CalculateNewRatings(double ratingA, double ratingB, bool wonA)
        {
            double expectedA = 1.0 / (1.0 + Math.Pow(10, (ratingB - ratingA) / 400.0));
            double expectedB = 1.0 - expectedA;

            double actualA = wonA ? 1.0 : 0.0;
            double actualB = wonA ? 0.0 : 1.0;

            int newA = (int)Math.Round(ratingA + KFactor * (actualA - expectedA));
            int newB = (int)Math.Round(ratingB + KFactor * (actualB - expectedB));

            return (newA, newB);
        }

        /// <summary>
        /// Updates position-specific ELO for a player based on their position.
        /// </summary>
        private void UpdatePositionSpecificElo(Player player, MatchParticipant participant, bool won, Player opponent)
        {
            if (participant.Position == PositionEnum.Offense)
            {
                var (newPlayerElo, _) = CalculateNewRatings(player.OffenseElo, opponent.OffenseElo, won);
                participant.OffenseEloChange = newPlayerElo - player.OffenseElo;
                player.OffenseElo = newPlayerElo;

                if (won)
                    player.OffenseWins++;
                else
                    player.OffenseLosses++;
            }
            else if (participant.Position == PositionEnum.Defense)
            {
                var (newPlayerElo, _) = CalculateNewRatings(player.DefenseElo, opponent.DefenseElo, won);
                participant.DefenseEloChange = newPlayerElo - player.DefenseElo;
                player.DefenseElo = newPlayerElo;

                if (won)
                    player.DefenseWins++;
                else
                    player.DefenseLosses++;
            }
        }

        /// <summary>
        /// Updates win/loss statistics based on team color.
        /// </summary>
        private void UpdateTeamColorStats(Player player, TeamColorEnum teamColor, bool won)
        {
            if (teamColor == TeamColorEnum.Red)
            {
                if (won)
                    player.RedTeamWins++;
                else
                    player.RedTeamLosses++;
            }
            else if (teamColor == TeamColorEnum.Blue)
            {
                if (won)
                    player.BlueTeamWins++;
                else
                    player.BlueTeamLosses++;
            }
        }

        /// <summary>
        /// Processes a 1v1 match and updates player ratings.
        /// </summary>
        public async Task Process1v1Match(Guid matchId)
        {
            var match = await _context.Matches
                .FirstOrDefaultAsync(m => m.Id == matchId);

            if (match == null)
                throw new InvalidOperationException($"Match {matchId} not found");

            if (match.MatchType != MatchTypeEnum.OneVsOne)
                throw new InvalidOperationException($"Match {matchId} is not a 1v1 match");

            var participants = await _context.MatchParticipants
                .Where(mp => mp.MatchId == matchId)
                .ToListAsync();

            if (participants.Count != 2)
                throw new InvalidOperationException($"1v1 match must have exactly 2 participants");

            var playerA = participants.First(p => p.Side == SideEnum.A);
            var playerB = participants.First(p => p.Side == SideEnum.B);

            var playerAEntity = await _context.Players.FindAsync(playerA.PlayerId);
            var playerBEntity = await _context.Players.FindAsync(playerB.PlayerId);

            if (playerAEntity == null || playerBEntity == null)
                throw new InvalidOperationException("One or more players not found");

            bool sideAWon = match.ScoreA > match.ScoreB;

            // Update overall ELO
            var (newRatingA, newRatingB) = CalculateNewRatings(
                playerAEntity.EloRating,
                playerBEntity.EloRating,
                sideAWon
            );

            playerA.EloChange = newRatingA - playerAEntity.EloRating;
            playerB.EloChange = newRatingB - playerBEntity.EloRating;

            playerAEntity.EloRating = newRatingA;
            playerBEntity.EloRating = newRatingB;

            // Update position-specific ELO
            UpdatePositionSpecificElo(playerAEntity, playerA, sideAWon, playerBEntity);
            UpdatePositionSpecificElo(playerBEntity, playerB, !sideAWon, playerAEntity);

            // Update team color win/loss tracking
            UpdateTeamColorStats(playerAEntity, playerA.TeamColor, sideAWon);
            UpdateTeamColorStats(playerBEntity, playerB.TeamColor, !sideAWon);

            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Processes a 2v2 match by calculating team averages and distributing points.
        /// </summary>
        public async Task Process2v2Match(Guid matchId)
        {
            var match = await _context.Matches
                .FirstOrDefaultAsync(m => m.Id == matchId);

            if (match == null)
                throw new InvalidOperationException($"Match {matchId} not found");

            if (match.MatchType != MatchTypeEnum.TwoVsTwo)
                throw new InvalidOperationException($"Match {matchId} is not a 2v2 match");

            var participants = await _context.MatchParticipants
                .Where(mp => mp.MatchId == matchId)
                .ToListAsync();

            if (participants.Count != 4)
                throw new InvalidOperationException($"2v2 match must have exactly 4 participants");

            var teamA = participants.Where(p => p.Side == SideEnum.A).ToList();
            var teamB = participants.Where(p => p.Side == SideEnum.B).ToList();

            if (teamA.Count != 2 || teamB.Count != 2)
                throw new InvalidOperationException("Each team must have exactly 2 players");

            var playersA = await _context.Players
                .Where(p => teamA.Select(t => t.PlayerId).Contains(p.Id))
                .ToListAsync();

            var playersB = await _context.Players
                .Where(p => teamB.Select(t => t.PlayerId).Contains(p.Id))
                .ToListAsync();

            double team1Avg = playersA.Average(p => p.EloRating);
            double team2Avg = playersB.Average(p => p.EloRating);

            bool team1Won = match.ScoreA > match.ScoreB;

            var (newTeam1Elo, newTeam2Elo) = CalculateNewRatings(team1Avg, team2Avg, team1Won);

            int change1 = newTeam1Elo - (int)team1Avg;
            int change2 = newTeam2Elo - (int)team2Avg;

            // Calculate position-specific team averages
            var offenseA = playersA.Where(p => teamA.First(t => t.PlayerId == p.Id).Position == PositionEnum.Offense).ToList();
            var defenseA = playersA.Where(p => teamA.First(t => t.PlayerId == p.Id).Position == PositionEnum.Defense).ToList();
            var offenseB = playersB.Where(p => teamB.First(t => t.PlayerId == p.Id).Position == PositionEnum.Offense).ToList();
            var defenseB = playersB.Where(p => teamB.First(t => t.PlayerId == p.Id).Position == PositionEnum.Defense).ToList();

            // Update Team A players
            foreach (var player in playersA)
            {
                player.EloRating += change1;
                var participant = teamA.First(t => t.PlayerId == player.Id);
                participant.EloChange = change1;

                // Find opponent for position-specific ELO calculation
                Player opponent;
                if (participant.Position == PositionEnum.Offense && offenseB.Any())
                    opponent = offenseB.First();
                else if (participant.Position == PositionEnum.Defense && defenseB.Any())
                    opponent = defenseB.First();
                else
                    opponent = playersB.First(); // Fallback

                UpdatePositionSpecificElo(player, participant, team1Won, opponent);
                UpdateTeamColorStats(player, participant.TeamColor, team1Won);
            }

            // Update Team B players
            foreach (var player in playersB)
            {
                player.EloRating += change2;
                var participant = teamB.First(t => t.PlayerId == player.Id);
                participant.EloChange = change2;

                // Find opponent for position-specific ELO calculation
                Player opponent;
                if (participant.Position == PositionEnum.Offense && offenseA.Any())
                    opponent = offenseA.First();
                else if (participant.Position == PositionEnum.Defense && defenseA.Any())
                    opponent = defenseA.First();
                else
                    opponent = playersA.First(); // Fallback

                UpdatePositionSpecificElo(player, participant, !team1Won, opponent);
                UpdateTeamColorStats(player, participant.TeamColor, !team1Won);
            }

            await _context.SaveChangesAsync();
        }
    }
}
