namespace AeroElo.Api.Models
{
    public class Match
    {
        public Guid Id { get; set; } // Primary Key
        public MatchTypeEnum MatchType { get; set; }
        public int ScoreA { get; set; }
        public int ScoreB { get; set; }
        public DateTime PlayedAt { get; set; }
    }

    public enum MatchTypeEnum
    {
        OneVsOne,
        TwoVsTwo,
    }
}
