namespace AeroElo.Api.DTOs
{
    public class PlayerResponseDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        
        // Overall Stats
        public int EloRating { get; set; }
        public int Rank { get; set; }
        public int MatchCount { get; set; }
        
        // Position-Specific ELO
        public int OffenseElo { get; set; }
        public int DefenseElo { get; set; }
        
        // Position-Specific Stats
        public PositionStatsDto OffenseStats { get; set; } = new();
        public PositionStatsDto DefenseStats { get; set; } = new();
        
        // Team Color Stats
        public TeamColorStatsDto RedTeamStats { get; set; } = new();
        public TeamColorStatsDto BlueTeamStats { get; set; } = new();
        
        public DateTime CreatedAt { get; set; }
    }

    public class PositionStatsDto
    {
        public int Wins { get; set; }
        public int Losses { get; set; }
        public int TotalMatches => Wins + Losses;
        public double WinRate => TotalMatches > 0 ? (double)Wins / TotalMatches * 100 : 0;
    }

    public class TeamColorStatsDto
    {
        public int Wins { get; set; }
        public int Losses { get; set; }
        public int TotalMatches => Wins + Losses;
        public double WinRate => TotalMatches > 0 ? (double)Wins / TotalMatches * 100 : 0;
    }
}
