# Running and Testing AeroElo API with Swagger

## Quick Start

### 1. Apply Database Migrations

First, make sure your database is up to date:

```bash
cd AeroElo.Api
dotnet ef database update
```

This will create the SQLite database (`aeroelo.db`) with all tables.

### 2. Run the API

Start the development server:

```bash
dotnet run
```

Or from the solution root:

```bash
dotnet run --project AeroElo.Api/AeroElo.Api.csproj
```

The API will start on:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`

### 3. Access Swagger UI

Open your browser and navigate to:

**`http://localhost:5000`** or **`https://localhost:5001`**

Swagger UI will be displayed at the root URL!

---

## Using Swagger UI

### Testing Endpoints

1. **Expand an endpoint** by clicking on it
2. **Click "Try it out"** button
3. **Fill in the required parameters** or request body
4. **Click "Execute"** to send the request
5. **View the response** below

### Example: Create a Player

1. Navigate to **POST /api/player**
2. Click **"Try it out"**
3. Enter JSON:
```json
{
  "username": "JohnDoe"
}
```
4. Click **"Execute"**
5. You should get a `201 Created` response with the player details

### Example: Create a 1v1 Match

1. First create 2 players (see above)
2. Copy their player IDs from the responses
3. Navigate to **POST /api/match**
4. Click **"Try it out"**
5. Enter JSON:
```json
{
  "matchType": "OneVsOne",
  "scoreA": 10,
  "scoreB": 8,
  "participants": [
    {
      "playerId": "PLAYER-1-ID-HERE",
      "side": "A",
      "teamColor": "Red",
      "position": "Offense"
    },
    {
      "playerId": "PLAYER-2-ID-HERE",
      "side": "B",
      "teamColor": "Blue",
      "position": "Defense"
    }
  ]
}
```
6. Click **"Execute"**
7. ELO ratings will be calculated automatically!

### Example: Create a 2v2 Match

```json
{
  "matchType": "TwoVsTwo",
  "scoreA": 10,
  "scoreB": 7,
  "participants": [
    {
      "playerId": "PLAYER-1-ID",
      "side": "A",
      "teamColor": "Red",
      "position": "Offense"
    },
    {
      "playerId": "PLAYER-2-ID",
      "side": "A",
      "teamColor": "Red",
      "position": "Defense"
    },
    {
      "playerId": "PLAYER-3-ID",
      "side": "B",
      "teamColor": "Blue",
      "position": "Offense"
    },
    {
      "playerId": "PLAYER-4-ID",
      "side": "B",
      "teamColor": "Blue",
      "position": "Defense"
    }
  ]
}
```

---

## Available Endpoints

### Player Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/player` | Get all players by ELO |
| GET | `/api/player/{id}` | Get player with match history |
| GET | `/api/player/leaderboard?limit=100` | Get leaderboard |
| POST | `/api/player` | Create new player |
| DELETE | `/api/player/{id}` | Delete player |

### Match Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/match?page=1&pageSize=20` | Get match history (paginated) |
| GET | `/api/match/{id}` | Get match details |
| POST | `/api/match` | Create match and calculate ELO |

---

## Testing Flow

### Complete Test Scenario

1. **Create 4 players**:
   - POST `/api/player` with usernames: "Alice", "Bob", "Charlie", "Diana"

2. **View all players**:
   - GET `/api/player` - All should have ELO 1000

3. **Create a 1v1 match**:
   - POST `/api/match` with Alice vs Bob (Alice wins 10-8)
   - Check ELO changes in the response

4. **View updated leaderboard**:
   - GET `/api/player/leaderboard` - Alice should have higher ELO

5. **Create a 2v2 match**:
   - POST `/api/match` with Alice+Bob (Red) vs Charlie+Diana (Blue)
   - Assign positions (Offense/Defense)
   - Check position-specific ELO changes

6. **View player details**:
   - GET `/api/player/{alice-id}` - See match history and statistics

7. **View match history**:
   - GET `/api/match` - See all matches with pagination

---

## Features to Test

### ELO Calculation
- ? Overall ELO changes after matches
- ? Position-specific ELO (Offense vs Defense)
- ? Win/loss tracking by position
- ? Win/loss tracking by team color

### Statistics
- ? Player rank calculation
- ? Win rates by position
- ? Win rates by team color
- ? Match count tracking

### Validation
- ? Username uniqueness
- ? Username length (2-50 chars)
- ? 1v1 requires 2 participants
- ? 2v2 requires 4 participants (2 per side)
- ? 2v2 requires 1 offense + 1 defense per team
- ? Scores must be non-negative

---

## Troubleshooting

### Database Issues
If you get database errors:
```bash
dotnet ef database drop
dotnet ef database update
```

### Port Already in Use
Change the port in `launchSettings.json` or use:
```bash
dotnet run --urls "http://localhost:5005;https://localhost:5006"
```

### CORS Issues
The API is configured to allow requests from `http://localhost:5173` for React development.

---

## Development Tools

### Swagger UI
- Interactive API documentation
- Test endpoints directly from browser
- See request/response schemas
- View validation rules

### Alternative: Use Postman or cURL

**Create Player (cURL)**:
```bash
curl -X POST http://localhost:5000/api/player \
  -H "Content-Type: application/json" \
  -d '{"username":"TestPlayer"}'
```

**Get Leaderboard (cURL)**:
```bash
curl http://localhost:5000/api/player/leaderboard
```

---

## Next Steps

1. ? Test all endpoints via Swagger UI
2. ? Verify ELO calculations are correct
3. ? Check that statistics are updating properly
4. ? Connect your React frontend (CORS already configured)
5. ?? Deploy to production when ready!

---

## Swagger Configuration

The Swagger UI is configured with:
- **RoutePrefix**: `""` (root path)
- **Title**: "AeroElo API Documentation"
- **Endpoint**: `/swagger/v1/swagger.json`

To change the Swagger route, edit `Program.cs`:
```csharp
options.RoutePrefix = "api-docs"; // Access at /api-docs instead
```

---

## Pro Tips

1. **Use Schemas Tab**: View all DTOs and their properties
2. **Authorization**: If you add auth later, use the "Authorize" button
3. **Copy as cURL**: Use browser dev tools to copy requests as cURL
4. **Save Examples**: Swagger remembers your last requests
5. **Export OpenAPI**: Download the OpenAPI spec from `/swagger/v1/swagger.json`

Happy Testing! ??
