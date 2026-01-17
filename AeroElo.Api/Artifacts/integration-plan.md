# AeroElo Integration Plan

> Table Football ELO Rating System for AeroGuest

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | ASP.NET Core 8 Web API |
| Database | SQLite + Entity Framework Core |
| Frontend | React 18 + Vite |
| Styling | CSS Modules (or Tailwind CSS) |

---

## Phase 1: Backend Foundation

### 1.1 Project Setup
- [✅] Create ASP.NET Core Web API project (`dotnet new webapi -n AeroElo.Api`)
- [✅] Add NuGet packages: `Microsoft.EntityFrameworkCore.Sqlite`, `Microsoft.EntityFrameworkCore.Design`
- [✅] Configure folder structure: `/Controllers`, `/Services`, `/Models`, `/Data`
- [✅] Set up CORS policy for React dev server (localhost:5173)

### 1.2 Database & Models
- [✅] Create `Player` entity
  - `Id` (int, PK)
  - `Name` (string, required)
  - `Elo` (int, default 1000)
  - `CreatedAt` (DateTime)
- [✅] Create `Match` entity
  - `Id` (int, PK)
  - `MatchType` (enum: OneVsOne, TwoVsTwo)
  - `ScoreA`, `ScoreB` (int)
  - `PlayedAt` (DateTime)
- [✅] Create `MatchParticipant` entity
  - `MatchId`, `PlayerId` (composite key)
  - `Side` (enum: A, B)
  - `EloChange` (int)
- [✅] Create `AeroEloDbContext` with DbSets
- [✅] Generate initial migration (`dotnet ef migrations add InitialCreate`)

### 1.3 ELO Service
- [✅] Implement `IEloService` interface
- [✅] Implement `EloService.CalculateNewRatings()` (from README)
- [✅] Implement `EloService.Process1v1Match()`
- [✅] Implement `EloService.Process2v2Match()`
- [✅] Register service in DI container

### 1.4 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players` | List all players (sorted by ELO) |
| POST | `/api/players` | Create new player |
| GET | `/api/players/{id}` | Get player with match history |
| DELETE | `/api/players/{id}` | Remove player |
| GET | `/api/leaderboard` | Top players with rank |
| POST | `/api/matches` | Log new match (1v1 or 2v2) |
| GET | `/api/matches` | Match history (paginated) |
| GET | `/api/matches/{id}` | Match details |

### 1.5 DTOs & Validation
- [✅] `CreatePlayerDto` (Name required, 2-50 chars)
- [✅] `CreateMatchDto` (PlayerIds, Scores, MatchType)
- [✅] `PlayerResponseDto` (Id, Name, Elo, Rank, MatchCount)
- [✅] `MatchResponseDto` (Id, Players, Scores, EloChanges, PlayedAt)

---

## Phase 2: React Frontend

### 2.1 Project Setup
- [ ] Create React app with Vite (`npm create vite@latest aeroelo-client -- --template react`)
- [ ] Install dependencies: `axios`, `react-router-dom`
- [ ] Configure API base URL (environment variable)
- [ ] Set up folder structure: `/components`, `/pages`, `/hooks`, `/api`

### 2.2 API Layer
- [ ] Create `apiClient.js` with Axios instance
- [ ] Create `playerApi.js` (getAll, create, getById)
- [ ] Create `matchApi.js` (getAll, create)

### 2.3 Pages & Routing
- [ ] **Home/Leaderboard** (`/`) – Main view with ranked players
- [ ] **Log Match** (`/match/new`) – Form for match submission
- [ ] **Player Profile** (`/players/:id`) – Stats and match history
- [ ] **Add Player** (`/players/new`) – Registration form

### 2.4 Components
- [ ] `Leaderboard` – Table with rank, name, ELO, +/- indicator
- [ ] `LeaderboardRow` – Single player row with rank change animation
- [ ] `MatchForm` – Toggle 1v1/2v2, player dropdowns, score inputs
- [ ] `PlayerSelector` – Dropdown/search for picking players
- [ ] `MatchHistory` – List of recent matches
- [ ] `MatchCard` – Single match display (players, scores, ELO changes)
- [ ] `PlayerForm` – Name input for new player
- [ ] `Navbar` – Navigation links

### 2.5 State & Hooks
- [ ] `usePlayers()` – Fetch and cache player list
- [ ] `useLeaderboard()` – Fetch ranked leaderboard
- [ ] `useMatches()` – Fetch match history
- [ ] `usePlayer(id)` – Fetch single player details

### 2.6 UX Polish
- [ ] Loading spinners during API calls
- [ ] Error toast notifications
- [ ] ELO change animations (+16 ↑ in green, -16 ↓ in red)
- [ ] Mobile-responsive layout
- [ ] Form validation feedback

---

## Phase 3: Integration & Deployment

### 3.1 Connect Frontend to Backend
- [ ] Test all API endpoints with React app
- [ ] Handle API errors gracefully in UI
- [ ] Add optimistic updates for better UX

### 3.2 Production Build
- [ ] Backend: Publish as self-contained app or Docker container
- [ ] Frontend: Build with `npm run build`, serve static files
- [ ] Option A: Serve React from ASP.NET (`wwwroot`)
- [ ] Option B: Separate hosting (Vercel/Netlify for React)

### 3.3 Database
- [ ] SQLite file location: `/data/aeroelo.db`
- [ ] Backup strategy: Copy `.db` file periodically

---

## Future Enhancements (Post-MVP)
- [ ] Real-time updates with SignalR
- [ ] ELO history graph per player
- [ ] Season/reset functionality
- [ ] Head-to-head statistics
- [ ] Match undo/correction feature
- [ ] Dark mode toggle