# API Endpoints Documentation

## Player Controller

Base URL: `/api/player`

### 1. Get All Players (Sorted by ELO)
**GET** `/api/player`

Returns all players sorted by ELO rating in descending order.

**Response:** `200 OK`
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "username": "JohnDoe",
    "eloRating": 1050,
    "rank": 1,
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
]
```

---

### 2. Get Player with Match History
**GET** `/api/player/{id}`

Returns player details with recent match history (last 50 matches).

**Parameters:**
- `id` (Guid) - Player ID

**Response:** `200 OK`
```json
{
  "player": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "username": "JohnDoe",
    "eloRating": 1050,
    "rank": 5,
    "matchCount": 25,
    "offenseElo": 1080,
    "defenseElo": 1020,
    "offenseStats": { ... },
    "defenseStats": { ... },
    "redTeamStats": { ... },
    "blueTeamStats": { ... },
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "recentMatches": [
    {
      "id": "2fa85f64-5717-4562-b3fc-2c963f66afa5",
      "matchType": "OneVsOne",
      "scoreA": 10,
      "scoreB": 8,
      "playedAt": "2024-01-15T14:30:00Z",
      "participants": [ ... ]
    }
  ]
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Player with ID {id} not found"
}
```

---

### 3. Get Leaderboard
**GET** `/api/player/leaderboard`

Returns top players sorted by ELO.

**Query Parameters:**
- `limit` (int, optional) - Number of players to return (default: 100, max: 100)

**Response:** `200 OK`
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "username": "JohnDoe",
    "eloRating": 1150,
    "rank": 1,
    "matchCount": 50,
    ...
  }
]
```

---

### 4. Create Player
**POST** `/api/player`

Creates a new player.

**Request Body:**
```json
{
  "username": "JohnDoe"
}
```

**Validation:**
- Username: Required, 2-50 characters

**Response:** `201 Created`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "username": "JohnDoe",
  "eloRating": 1000,
  "rank": 0,
  "matchCount": 0,
  "offenseElo": 1000,
  "defenseElo": 1000,
  "offenseStats": {
    "wins": 0,
    "losses": 0,
    "totalMatches": 0,
    "winRate": 0
  },
  "defenseStats": {
    "wins": 0,
    "losses": 0,
    "totalMatches": 0,
    "winRate": 0
  },
  "redTeamStats": {
    "wins": 0,
    "losses": 0,
    "totalMatches": 0,
    "winRate": 0
  },
  "blueTeamStats": {
    "wins": 0,
    "losses": 0,
    "totalMatches": 0,
    "winRate": 0
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed or username already exists
```json
{
  "message": "Username already exists"
}
```

---

### 5. Delete Player
**DELETE** `/api/player/{id}`

Deletes a player.

**Parameters:**
- `id` (Guid) - Player ID

**Response:** `204 No Content`

**Error Response:** `404 Not Found`
```json
{
  "message": "Player with ID {id} not found"
}
```

---

## Match Controller

Base URL: `/api/match`

### 1. Get Match History (Paginated)
**GET** `/api/match`

Returns paginated match history.

**Query Parameters:**
- `page` (int, optional) - Page number (default: 1)
- `pageSize` (int, optional) - Items per page (default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "matches": [
    {
      "id": "2fa85f64-5717-4562-b3fc-2c963f66afa5",
      "matchType": "TwoVsTwo",
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
        }
      ]
    }
  ],
  "currentPage": 1,
  "pageSize": 20,
  "totalMatches": 150,
  "totalPages": 8
}
```

---

### 2. Get Match Details
**GET** `/api/match/{id}`

Returns detailed information about a specific match.

**Parameters:**
- `id` (Guid) - Match ID

**Response:** `200 OK`
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

**Error Response:** `404 Not Found`
```json
{
  "message": "Match with ID {id} not found"
}
```

---

### 3. Create Match
**POST** `/api/match`

Creates a new match (1v1 or 2v2) and calculates ELO changes automatically.

**Request Body (1v1):**
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

**Request Body (2v2):**
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

**Validation Rules:**
- 1v1 matches must have exactly 2 participants (1 per side)
- 2v2 matches must have exactly 4 participants (2 per side)
- Each side in 2v2 must have one Offense and one Defense player
- All player IDs must exist
- Scores must be non-negative
- No duplicate players allowed

**Response:** `201 Created`
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

**Error Responses:**
- `400 Bad Request` - Validation errors
```json
{
  "message": "1v1 match must have exactly 2 participants"
}
```
```json
{
  "message": "One or more players not found or duplicate players"
}
```
```json
{
  "message": "Side A must have one offense and one defense player"
}
```
```json
{
  "message": "Error processing ELO: ..."
}
```

---

## Common Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Resource deleted successfully
- `400 Bad Request` - Validation error or invalid request
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Notes

### ELO Calculation
- Matches automatically calculate ELO changes for all participants
- Position-specific ELO is tracked separately (Offense vs Defense)
- Team color statistics are tracked (Red vs Blue)
- Win/loss records are updated automatically

### Match Types
- **OneVsOne**: 1 player per side
- **TwoVsTwo**: 2 players per side (1 offense, 1 defense per team)

### Positions
- **Offense**: Forward/attacking position
- **Defense**: Defensive/goalkeeper position

### Team Colors
- **Red**: Red team color
- **Blue**: Blue team color
