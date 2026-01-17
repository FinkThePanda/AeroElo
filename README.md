# AeroElo
Table Football Rating System A dedicated ELO rating and match-logging platform for the employees at AeroGuest. This system tracks performance and competitiveness in office table football, ensuring a fair and updated leaderboard.

## Key Features
- **ELO Engine**: Every player starts with a base rating of 1000.
- **Flexible Match** Logging: Support for both 1v1 and 2v2 matches.
- **Data Integrity**: Logs players, team sides, and final scores for every game.
- **Live Leaderboard**: Real-time ranking of the top players at AeroGuest.

## ELO Calculation Logic
The system uses the standard ELO formula to calculate rating changes after each match.
1. Expected ScoreThe expected probability of winning for Player A ($E_A$) against Player B ($E_B$) is calculated as:
$$E_A = \frac{1}{1 + 10^{(R_B - R_A) / 400}}$$
2. Rating UpdateThe new rating ($R'_A$) is updated based on the actual outcome ($S_A$):
$$R'_A = R_A + K \cdot (S_A - E_A)$$
- $K$-factor: Usually set to 32 (determines how much a single game affects the rating).
- $S_A$: 1 for a win, 0.5 for a draw, 0 for a loss.1
3. Handling 2v2 MatchesFor 2v2 matches, the team's average ELO is used for the "Expected Score" calculation:
- Team Average: $R_{Team} = \frac{R_{Player1} + R_{Player2}}{2}$
- Distribution: The resulting points gained or lost by the team are applied equally to both players' individual ratings.

## Technical Setup
1. Initial Rating: All new players are initialized at 1000.
2. Score Impact: The final score (e.g., 10-0 vs 10-9) can optionally be used to scale the $K$-factor if you want "crushing victories" to award more points.

## Implementation Logic

The following logic can be used in your service layer to handle rating updates.

### Elo Service Core
```csharp
public class EloService
{
    private const int KFactor = 32;

    /// <summary>
    /// Calculates the new ratings for two players/teams.
    /// </summary>
    /// <param name="ratingA">Current Elo of Player/Team A</param>
    /// <param name="ratingB">Current Elo of Player/Team B</param>
    /// <param name="wonA">True if Side A won</param>
    public (int newA, int newB) CalculateNewRatings(double ratingA, double ratingB, bool wonA)
    {
        double expectedA = 1.0 / (1.0 + Math.Pow(10, (ratingB - ratingA) / 400.0));
        double expectedB = 1.0 - expectedA;

        double actualA = wonA ? 1.0 : 0.0;
        double actualB = wonA ? 0.0 : 1.0;

        int newA = (int)Math.Round(ratingA + KFactor * (actualA - expectedA));
        int newB = (int)Math.Round(ratingB + KFactor * (actualB - expectedB));

        return (newA, newB);
    }

    /// <summary>
    /// Handles 2v2 matches by calculating team averages and distributing points.
    /// </summary>
    public void Update2v2Match(Player p1, Player p2, Player p3, Player p4, bool team1Won)
    {
        double team1Avg = (p1.Elo + p2.Elo) / 2.0;
        double team2Avg = (p3.Elo + p4.Elo) / 2.0;

        var (newTeam1Elo, newTeam2Elo) = CalculateNewRatings(team1Avg, team2Avg, team1Won);

        int change1 = newTeam1Elo - (int)team1Avg;
        int change2 = newTeam2Elo - (int)team2Avg;

        p1.Elo += change1;
        p2.Elo += change1;
        p3.Elo += change2;
        p4.Elo += change2;
    }
}

public class Player 
{
    public string Name { get; set; }
    public int Elo { get; set; } = 1000;
}
```
