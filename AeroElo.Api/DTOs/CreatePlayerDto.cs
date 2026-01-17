using System.ComponentModel.DataAnnotations;

namespace AeroElo.Api.DTOs
{
    public class CreatePlayerDto
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Username must be between 2 and 50 characters")]
        public string Username { get; set; } = string.Empty;
    }
}
