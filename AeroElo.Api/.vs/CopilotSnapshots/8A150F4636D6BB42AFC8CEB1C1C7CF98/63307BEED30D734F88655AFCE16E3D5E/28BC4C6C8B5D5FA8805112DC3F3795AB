namespace AeroElo.Api.Models
{
    public class MatchParticipant
    {
        public Guid MatchId { get; set; } // Composite Key Part 1
        public Guid PlayerId { get; set; } // Composite Key Part 2
        public SideEnum Side { get; set; }
        public TeamColorEnum TeamColor { get; set; }
        public PositionEnum Position { get; set; }
        public int EloChange { get; set; }
        public int OffenseEloChange { get; set; }
        public int DefenseEloChange { get; set; }
    }

    public enum SideEnum
    {
        A,
        B,
    }

    public enum TeamColorEnum
    {
        Red,
        Blue,
    }

    public enum PositionEnum
    {
        Offense,
        Defense,
    }
}
