using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AeroElo.Api.Data;
using AeroElo.Api.DTOs;
using AeroElo.Api.Models;
using AeroElo.Api.Services;

namespace AeroElo.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchController : ControllerBase
    {
        private readonly AeroEloDbContext _context;
        private readonly IEloService _eloService;

        public MatchController(AeroEloDbContext context, IEloService eloService)
        {
            _context = context;
            _eloService = eloService;
        }

        /// <summary>
        /// Get match history with pagination
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedMatchHistoryDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMatchHistory(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 20;

            var totalMatches = await _context.Matches.CountAsync();
            var totalPages = (int)Math.Ceiling(totalMatches / (double)pageSize);

            var matches = await _context.Matches
                .OrderByDescending(m => m.PlayedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var matchDtos = new List<MatchResponseDto>();
            foreach (var match in matches)
            {
                var matchDto = await MapToMatchResponseDto(match);
                matchDtos.Add(matchDto);
            }

            var response = new PaginatedMatchHistoryDto
            {
                Matches = matchDtos,
                CurrentPage = page,
                PageSize = pageSize,
                TotalMatches = totalMatches,
                TotalPages = totalPages
            };

            return Ok(response);
        }

        /// <summary>
        /// Get match details by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(MatchResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMatchDetailsById(Guid id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null)
                return NotFound(new { message = $"Match with ID {id} not found" });

            var matchDto = await MapToMatchResponseDto(match);

            return Ok(matchDto);
        }

        /// <summary>
        /// Create a new match (1v1 or 2v2) and calculate ELO changes
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(MatchResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateMatch([FromBody] CreateMatchDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate match type and participant count
            if (dto.MatchType == MatchTypeEnum.OneVsOne && dto.Participants.Count != 2)
                return BadRequest(new { message = "1v1 match must have exactly 2 participants" });

            if (dto.MatchType == MatchTypeEnum.TwoVsTwo && dto.Participants.Count != 4)
                return BadRequest(new { message = "2v2 match must have exactly 4 participants" });

            // Validate all players exist
            var playerIds = dto.Participants.Select(p => p.PlayerId).ToList();
            var players = await _context.Players
                .Where(p => playerIds.Contains(p.Id))
                .ToListAsync();

            if (players.Count != playerIds.Distinct().Count())
                return BadRequest(new { message = "One or more players not found or duplicate players" });

            // Validate sides
            var sideACount = dto.Participants.Count(p => p.Side == SideEnum.A);
            var sideBCount = dto.Participants.Count(p => p.Side == SideEnum.B);

            if (dto.MatchType == MatchTypeEnum.OneVsOne)
            {
                if (sideACount != 1 || sideBCount != 1)
                    return BadRequest(new { message = "1v1 match must have 1 player per side" });
            }
            else if (dto.MatchType == MatchTypeEnum.TwoVsTwo)
            {
                if (sideACount != 2 || sideBCount != 2)
                    return BadRequest(new { message = "2v2 match must have 2 players per side" });

                // Validate positions for 2v2
                var sideAPositions = dto.Participants
                    .Where(p => p.Side == SideEnum.A)
                    .Select(p => p.Position)
                    .ToList();
                var sideBPositions = dto.Participants
                    .Where(p => p.Side == SideEnum.B)
                    .Select(p => p.Position)
                    .ToList();

                if (!sideAPositions.Contains(PositionEnum.Offense) || 
                    !sideAPositions.Contains(PositionEnum.Defense))
                    return BadRequest(new { message = "Side A must have one offense and one defense player" });

                if (!sideBPositions.Contains(PositionEnum.Offense) || 
                    !sideBPositions.Contains(PositionEnum.Defense))
                    return BadRequest(new { message = "Side B must have one offense and one defense player" });
            }

            // Create match
            var match = new Match
            {
                Id = Guid.NewGuid(),
                MatchType = dto.MatchType,
                ScoreA = dto.ScoreA,
                ScoreB = dto.ScoreB,
                PlayedAt = DateTime.UtcNow
            };

            _context.Matches.Add(match);

            // Create match participants
            foreach (var participantDto in dto.Participants)
            {
                var participant = new MatchParticipant
                {
                    MatchId = match.Id,
                    PlayerId = participantDto.PlayerId,
                    Side = participantDto.Side,
                    TeamColor = participantDto.TeamColor,
                    Position = participantDto.Position,
                    EloChange = 0,
                    OffenseEloChange = 0,
                    DefenseEloChange = 0
                };

                _context.MatchParticipants.Add(participant);
            }

            await _context.SaveChangesAsync();

            // Process ELO calculations
            try
            {
                if (dto.MatchType == MatchTypeEnum.OneVsOne)
                    await _eloService.Process1v1Match(match.Id);
                else
                    await _eloService.Process2v2Match(match.Id);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error processing ELO: {ex.Message}" });
            }

            // Return the created match with updated ELO
            var matchDto = await MapToMatchResponseDto(match);

            return CreatedAtAction(
                nameof(GetMatchDetailsById),
                new { id = match.Id },
                matchDto
            );
        }

        #region Helper Methods

        private async Task<MatchResponseDto> MapToMatchResponseDto(Match match)
        {
            var participants = await _context.MatchParticipants
                .Where(mp => mp.MatchId == match.Id)
                .ToListAsync();

            var participantDtos = new List<MatchParticipantResponseDto>();

            foreach (var participant in participants)
            {
                var player = await _context.Players.FindAsync(participant.PlayerId);
                if (player != null)
                {
                    participantDtos.Add(new MatchParticipantResponseDto
                    {
                        PlayerId = participant.PlayerId,
                        PlayerUsername = player.Username,
                        Side = participant.Side,
                        TeamColor = participant.TeamColor,
                        Position = participant.Position,
                        EloChange = participant.EloChange,
                        OffenseEloChange = participant.OffenseEloChange,
                        DefenseEloChange = participant.DefenseEloChange,
                        CurrentElo = player.EloRating,
                        CurrentOffenseElo = player.OffenseElo,
                        CurrentDefenseElo = player.DefenseElo
                    });
                }
            }

            return new MatchResponseDto
            {
                Id = match.Id,
                MatchType = match.MatchType,
                ScoreA = match.ScoreA,
                ScoreB = match.ScoreB,
                PlayedAt = match.PlayedAt,
                Participants = participantDtos
            };
        }

        #endregion
    }

    public class PaginatedMatchHistoryDto
    {
        public List<MatchResponseDto> Matches { get; set; } = new();
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalMatches { get; set; }
        public int TotalPages { get; set; }
    }
}
