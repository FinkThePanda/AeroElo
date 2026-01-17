using System.ComponentModel.DataAnnotations;
using AeroElo.Api.Models;

namespace AeroElo.Api.DTOs
{
    public class CreateMatchDto
    {
        [Required(ErrorMessage = "Match type is required")]
        public MatchTypeEnum MatchType { get; set; }

        [Required(ErrorMessage = "Score A is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Score A must be a non-negative number")]
        public int ScoreA { get; set; }

        [Required(ErrorMessage = "Score B is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Score B must be a non-negative number")]
        public int ScoreB { get; set; }

        [Required(ErrorMessage = "Participants are required")]
        [MinLength(2, ErrorMessage = "At least 2 participants are required")]
        public List<MatchParticipantDto> Participants { get; set; } = new();
    }

    public class MatchParticipantDto
    {
        [Required(ErrorMessage = "Player ID is required")]
        public Guid PlayerId { get; set; }

        [Required(ErrorMessage = "Side is required")]
        public SideEnum Side { get; set; }

        [Required(ErrorMessage = "Team color is required")]
        public TeamColorEnum TeamColor { get; set; }

        [Required(ErrorMessage = "Position is required")]
        public PositionEnum Position { get; set; }
    }
}
