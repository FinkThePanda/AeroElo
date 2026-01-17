# AeroElo React Frontend Implementation Plan

## Overview

Build a React frontend for the AeroElo Table Football Rating System. The frontend will display leaderboards, allow logging of 1v1 and 2v2 matches, and show detailed player profiles with ELO statistics.

**API Base URL:** `http://localhost:5000`  
**Frontend URL:** `http://localhost:5173` (Vite default, already configured in CORS)

---

## Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS (or CSS Modules)
- **Language:** TypeScript

---

## Project Structure

```
AeroElo.Web/
├── src/
│   ├── api/
│   │   ├── client.ts          # Axios instance with base URL
│   │   ├── players.ts         # Player API functions
│   │   └── matches.ts         # Match API functions
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── MatchForm.tsx
│   │   ├── MatchCard.tsx
│   │   ├── MatchHistory.tsx
│   │   ├── PlayerSelector.tsx
│   │   └── PlayerForm.tsx
│   ├── pages/
│   │   ├── HomePage.tsx       # Leaderboard view
│   │   ├── LogMatchPage.tsx   # Match submission form
│   │   ├── PlayerPage.tsx     # Player profile + history
│   │   └── AddPlayerPage.tsx  # New player registration
│   ├── types/
│   │   ├── player.ts
│   │   ├── match.ts
│   │   └── enums.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Step 1: Project Initialization

1. Create new Vite project in repository root:
   ```bash
   npm create vite@latest AeroElo.Web -- --template react-ts
   cd AeroElo.Web
   ```

2. Install dependencies:
   ```bash
   npm install axios react-router-dom
   npm install -D tailwindcss postcss autoprefixer @types/react-router-dom
   npx tailwindcss init -p
   ```

3. Configure Tailwind in `tailwind.config.js` and add directives to `index.css`

---

## Step 2: TypeScript Types

### `src/types/enums.ts`
```typescript
export type MatchType = "OneVsOne" | "TwoVsTwo";
export type Side = "A" | "B";
export type TeamColor = "Red" | "Blue";
export type Position = "Offense" | "Defense";
```

### `src/types/player.ts`
```typescript
export interface PositionStatsDto {
  wins: number;
  losses: number;
  totalMatches: number;
  winRate: number;
}

export interface TeamColorStatsDto {
  wins: number;
  losses: number;
  totalMatches: number;
  winRate: number;
}

export interface PlayerResponseDto {
  id: string;
  username: string;
  eloRating: number;
  rank: number;
  matchCount: number;
  offenseElo: number;
  defenseElo: number;
  offenseStats: PositionStatsDto;
  defenseStats: PositionStatsDto;
  redTeamStats: TeamColorStatsDto;
  blueTeamStats: TeamColorStatsDto;
  createdAt: string;
}

export interface CreatePlayerDto {
  username: string;
}
```

### `src/types/match.ts`
```typescript
import { MatchType, Side, TeamColor, Position } from "./enums";

export interface MatchParticipantDto {
  playerId: string;
  side: Side;
  teamColor: TeamColor;
  position: Position;
}

export interface CreateMatchDto {
  matchType: MatchType;
  scoreA: number;
  scoreB: number;
  participants: MatchParticipantDto[];
}

export interface MatchParticipantResponseDto {
  playerId: string;
  playerUsername: string;
  side: Side;
  teamColor: TeamColor;
  position: Position;
  eloChange: number;
  offenseEloChange: number;
  defenseEloChange: number;
  currentElo: number;
  currentOffenseElo: number;
  currentDefenseElo: number;
}

export interface MatchResponseDto {
  id: string;
  matchType: MatchType;
  scoreA: number;
  scoreB: number;
  playedAt: string;
  participants: MatchParticipantResponseDto[];
}

export interface PaginatedMatchHistoryDto {
  matches: MatchResponseDto[];
  currentPage: number;
  pageSize: number;
  totalMatches: number;
  totalPages: number;
}
```

---

## Step 3: API Client Layer

### `src/api/client.ts`
```typescript
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});
```

### `src/api/players.ts`
```typescript
import { apiClient } from "./client";
import { PlayerResponseDto, CreatePlayerDto } from "../types/player";
import { MatchResponseDto } from "../types/match";

export const getPlayers = () => 
  apiClient.get<PlayerResponseDto[]>("/player");

export const getPlayer = (id: string) => 
  apiClient.get<{ player: PlayerResponseDto; recentMatches: MatchResponseDto[] }>(`/player/${id}`);

export const getLeaderboard = (limit = 100) => 
  apiClient.get<PlayerResponseDto[]>(`/player/leaderboard?limit=${limit}`);

export const createPlayer = (data: CreatePlayerDto) => 
  apiClient.post<PlayerResponseDto>("/player", data);

export const deletePlayer = (id: string) => 
  apiClient.delete(`/player/${id}`);
```

### `src/api/matches.ts`
```typescript
import { apiClient } from "./client";
import { MatchResponseDto, CreateMatchDto, PaginatedMatchHistoryDto } from "../types/match";

export const getMatches = (page = 1, pageSize = 20) => 
  apiClient.get<PaginatedMatchHistoryDto>(`/match?page=${page}&pageSize=${pageSize}`);

export const getMatch = (id: string) => 
  apiClient.get<MatchResponseDto>(`/match/${id}`);

export const createMatch = (data: CreateMatchDto) => 
  apiClient.post<MatchResponseDto>("/match", data);
```

---

## Step 4: Pages Implementation

### 4.1 HomePage (Leaderboard)
- Fetch players via `getLeaderboard()`
- Display sortable table: Rank, Username, ELO Rating, Matches Played
- Click row to navigate to player profile

### 4.2 LogMatchPage
- Toggle between 1v1 and 2v2 mode
- Player selector dropdowns (Side A / Side B)
- For 2v2: additional position (Offense/Defense) and team color selectors
- Score inputs for both sides
- Submit button calls `createMatch()`
- Show success with ELO changes or validation errors

### 4.3 PlayerPage
- Fetch player data via `getPlayer(id)`
- Display stats cards: Overall ELO, Offense ELO, Defense ELO
- Win/Loss breakdown by position and team color
- Recent matches list with ELO change indicators

### 4.4 AddPlayerPage
- Simple form with username input (2-50 chars)
- Submit calls `createPlayer()`
- Redirect to leaderboard on success

---

## Step 5: Components Implementation

| Component | Purpose |
|-----------|---------|
| `Navbar` | Navigation links: Home, Log Match, Add Player |
| `Leaderboard` | Reusable table displaying ranked players |
| `MatchForm` | Form with 1v1/2v2 toggle, player selectors, score inputs |
| `PlayerSelector` | Searchable dropdown for selecting players |
| `MatchCard` | Displays single match result with participants and scores |
| `MatchHistory` | Paginated list of MatchCards |
| `PlayerForm` | Username input form for creating players |

---

## Step 6: Routing Setup

### `src/App.tsx`
```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LogMatchPage from "./pages/LogMatchPage";
import PlayerPage from "./pages/PlayerPage";
import AddPlayerPage from "./pages/AddPlayerPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/log-match" element={<LogMatchPage />} />
          <Route path="/player/:id" element={<PlayerPage />} />
          <Route path="/add-player" element={<AddPlayerPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
```

---

## Implementation Order

### Phase 1 - Foundation
- [ ] Initialize Vite project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Create type definitions
- [ ] Set up API client and functions
- [ ] Implement routing structure

### Phase 2 - Core Features
- [ ] Build Navbar component
- [ ] Implement HomePage with Leaderboard
- [ ] Create AddPlayerPage with PlayerForm
- [ ] Test player creation flow

### Phase 3 - Match Logging
- [ ] Build PlayerSelector component
- [ ] Implement MatchForm with 1v1/2v2 modes
- [ ] Create LogMatchPage
- [ ] Handle validation and error display

### Phase 4 - Player Profiles
- [ ] Build MatchCard component
- [ ] Implement MatchHistory with pagination
- [ ] Create PlayerPage with stats and history
- [ ] Add navigation from leaderboard to profiles

### Phase 5 - Polish
- [ ] Add loading states and error handling
- [ ] Responsive design adjustments
- [ ] Form validation feedback
- [ ] Optional: Add toast notifications for actions

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/player` | Get all players (sorted by ELO) |
| GET | `/api/player/{id}` | Get player with match history |
| GET | `/api/player/leaderboard?limit=100` | Get top players |
| POST | `/api/player` | Create new player |
| DELETE | `/api/player/{id}` | Delete player |
| GET | `/api/match?page=1&pageSize=20` | Get paginated matches |
| GET | `/api/match/{id}` | Get match details |
| POST | `/api/match` | Create match (auto ELO calc) |

---

## Validation Rules

### CreatePlayerDto
- `username`: Required, 2-50 characters

### CreateMatchDto
- `matchType`: "OneVsOne" or "TwoVsTwo"
- `scoreA`: >= 0
- `scoreB`: >= 0
- `participants`: 
  - 1v1: Exactly 2 participants (1 per side)
  - 2v2: Exactly 4 participants (2 per side: 1 Offense + 1 Defense each)
  - No duplicate players allowed

---

## Error Handling

All API errors return JSON with `message` property:
```typescript
interface ErrorResponse {
  message: string;
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content (delete)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error
