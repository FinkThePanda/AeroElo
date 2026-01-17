using AeroElo.Api.Models;

namespace AeroElo.Api.DTOs
{
    public class MatchResponseDto
    {
        public Guid Id { get; set; }
        public MatchTypeEnum MatchType { get; set; }
        public int ScoreA { get; set; }
        public int ScoreB { get; set; }
        public DateTime PlayedAt { get; set; }
        public List<MatchParticipantResponseDto> Participants { get; set; } = new();
    }

    public class MatchParticipantResponseDto
    {
        public Guid PlayerId { get; set; }
        public string PlayerUsername { get; set; } = string.Empty;
        public SideEnum Side { get; set; }
        public TeamColorEnum TeamColor { get; set; }
        public PositionEnum Position { get; set; }
        
        // ELO Changes
        public int EloChange { get; set; }
        public int OffenseEloChange { get; set; }
        public int DefenseEloChange { get; set; }
        
        // Current ELO (after match)
        public int CurrentElo { get; set; }
        public int CurrentOffenseElo { get; set; }
        public int CurrentDefenseElo { get; set; }
    }
}
