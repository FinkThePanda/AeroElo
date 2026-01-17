# DTOs Overview

This document describes the Data Transfer Objects (DTOs) for the AeroElo API.

## Request DTOs

### CreatePlayerDto
Used for creating new players.

**Properties:**
- `Username` (string, required, 2-50 characters)

**Validation:**
- Username is required
- Username must be between 2 and 50 characters

**Example:**
```json
{
  "username": "JohnDoe"
}
```

---

### CreateMatchDto
Used for creating new matches.

**Properties:**
- `MatchType` (MatchTypeEnum, required) - OneVsOne or TwoVsTwo
- `ScoreA` (int, required, >= 0) - Score for Side A
- `ScoreB` (int, required, >= 0) - Score for Side B
- `Participants` (List<MatchParticipantDto>, required, min 2)

**MatchParticipantDto Properties:**
- `PlayerId` (Guid, required)
- `Side` (SideEnum, required) - A or B
- `TeamColor` (TeamColorEnum, required) - Red or Blue
- `Position` (PositionEnum, required) - Offense or Defense

**Validation:**
- All fields are required
- Scores must be non-negative
- At least 2 participants required
- For 1v1: Exactly 2 participants
- For 2v2: Exactly 4 participants (2 per side)

**Example (1v1):**
```json
{
  "matchType": "OneVsOne",
  "scoreA": 10,
  "scoreB": 8,
  "participants": [
    {
      "playerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "side": "A",
      "teamColor": "Red",
      "position": "Offense"
    },
    {
      "playerId": "7ca85f64-5717-4562-b3fc-2c963f66afa7",
      "side": "B",
      "teamColor": "Blue",
      "position": "Defense"
    }
  ]
}
```

**Example (2v2):**
```json
{
  "matchType": "TwoVsTwo",
  "scoreA": 10,
  "scoreB": 8,
  "participants": [
    {
      "playerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "side": "A",
      "teamColor": "Red",
      "position": "Offense"
    },
    {
      "playerId": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
      "side": "A",
      "teamColor": "Red",
      "position": "Defense"
    },
    {
      "playerId": "5fa85f64-5717-4562-b3fc-2c963f66afa8",
      "side": "B",
      "teamColor": "Blue",
      "position": "Offense"
    },
    {
      "playerId": "6fa85f64-5717-4562-b3fc-2c963f66afa9",
      "side": "B",
      "teamColor": "Blue",
      "position": "Defense"
    }
  ]
}
```

---

## Response DTOs

### PlayerResponseDto
Used for returning player information.

**Properties:**
- `Id` (Guid) - Player unique identifier
- `Username` (string) - Player username
- `EloRating` (int) - Overall ELO rating
- `Rank` (int) - Player rank among all players
- `MatchCount` (int) - Total matches played
- `OffenseElo` (int) - Position-specific ELO for offense
- `DefenseElo` (int) - Position-specific ELO for defense
- `OffenseStats` (PositionStatsDto) - Offense statistics
- `DefenseStats` (PositionStatsDto) - Defense statistics
- `RedTeamStats` (TeamColorStatsDto) - Red team statistics
- `BlueTeamStats` (TeamColorStatsDto) - Blue team statistics
- `CreatedAt` (DateTime) - Account creation date

**PositionStatsDto Properties:**
- `Wins` (int) - Number of wins
- `Losses` (int) - Number of losses
- `TotalMatches` (int) - Total matches (computed)
- `WinRate` (double) - Win rate percentage (computed)

**TeamColorStatsDto Properties:**
- `Wins` (int) - Number of wins
- `Losses` (int) - Number of losses
- `TotalMatches` (int) - Total matches (computed)
- `WinRate` (double) - Win rate percentage (computed)

**Example:**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "username": "JohnDoe",
  "eloRating": 1050,
  "rank": 5,
  "matchCount": 25,
  "offenseElo": 1080,
  "defenseElo": 1020,
  "offenseStats": {
    "wins": 8,
    "losses": 4,
    "totalMatches": 12,
    "winRate": 66.67
  },
  "defenseStats": {
    "wins": 7,
    "losses": 6,
    "totalMatches": 13,
    "winRate": 53.85
  },
  "redTeamStats": {
    "wins": 8,
    "losses": 5,
    "totalMatches": 13,
    "winRate": 61.54
  },
  "blueTeamStats": {
    "wins": 7,
    "losses": 5,
    "totalMatches": 12,
    "winRate": 58.33
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### MatchResponseDto
Used for returning match information.

**Properties:**
- `Id` (Guid) - Match unique identifier
- `MatchType` (MatchTypeEnum) - OneVsOne or TwoVsTwo
- `ScoreA` (int) - Score for Side A
- `ScoreB` (int) - Score for Side B
- `PlayedAt` (DateTime) - Match date/time
- `Participants` (List<MatchParticipantResponseDto>) - Match participants

**MatchParticipantResponseDto Properties:**
- `PlayerId` (Guid) - Player identifier
- `PlayerUsername` (string) - Player username
- `Side` (SideEnum) - A or B
- `TeamColor` (TeamColorEnum) - Red or Blue
- `Position` (PositionEnum) - Offense or Defense
- `EloChange` (int) - Overall ELO change
- `OffenseEloChange` (int) - Offense ELO change
- `DefenseEloChange` (int) - Defense ELO change
- `CurrentElo` (int) - Current overall ELO (after match)
- `CurrentOffenseElo` (int) - Current offense ELO (after match)
- `CurrentDefenseElo` (int) - Current defense ELO (after match)

**Example:**
```json
{
  "id": "2fa85f64-5717-4562-b3fc-2c963f66afa5",
  "matchType": "OneVsOne",
  "scoreA": 10,
  "scoreB": 8,
  "playedAt": "2024-01-15T14:30:00Z",
  "participants": [
    {
      "playerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "playerUsername": "JohnDoe",
      "side": "A",
      "teamColor": "Red",
      "position": "Offense",
      "eloChange": 15,
      "offenseEloChange": 18,
      "defenseEloChange": 0,
      "currentElo": 1050,
      "currentOffenseElo": 1080,
      "currentDefenseElo": 1020
    },
    {
      "playerId": "7ca85f64-5717-4562-b3fc-2c963f66afa7",
      "playerUsername": "JaneDoe",
      "side": "B",
      "teamColor": "Blue",
      "position": "Defense",
      "eloChange": -15,
      "offenseEloChange": 0,
      "defenseEloChange": -18,
      "currentElo": 985,
      "currentOffenseElo": 990,
      "currentDefenseElo": 980
    }
  ]
}
```

## Enums Reference

### MatchTypeEnum
- `OneVsOne` - 1v1 match
- `TwoVsTwo` - 2v2 match

### SideEnum
- `A` - Side A (Team 1)
- `B` - Side B (Team 2)

### TeamColorEnum
- `Red` - Red team
- `Blue` - Blue team

### PositionEnum
- `Offense` - Offensive position
- `Defense` - Defensive position
