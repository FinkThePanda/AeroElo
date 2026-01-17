# Swagger UI Setup Complete! ??

## ? What Was Done

### 1. **Installed Swagger/OpenAPI Support**
   - Added `Swashbuckle.AspNetCore` package (v10.1.0)
   - Removed conflicting `Microsoft.AspNetCore.OpenApi` package
   - Clean build successful

### 2. **Configured Swagger in Program.cs**
   - `AddEndpointsApiExplorer()` - Enables endpoint discovery
   - `AddSwaggerGen()` - Generates OpenAPI specification
   - `UseSwagger()` - Serves the OpenAPI JSON
   - `UseSwaggerUI()` - Provides interactive UI

### 3. **Swagger UI Configuration**
   - **Root URL Access**: Swagger UI is at `http://localhost:5000/` (the app root)
   - **Document Title**: "AeroElo API Documentation"
   - **Only in Development**: Swagger is only enabled in development mode for security

---

## ?? How to Run and Test

### Step 1: Apply Database Migrations
```bash
cd AeroElo.Api
dotnet ef database update
```

### Step 2: Start the API
```bash
dotnet run
```

### Step 3: Open Browser
Navigate to:
- **`http://localhost:5000`** (HTTP)
- **`https://localhost:5001`** (HTTPS)

You'll see the Swagger UI with all your endpoints!

---

## ?? What You'll See

### Swagger UI Interface

```
????????????????????????????????????????????????????????????????
?              AeroElo API Documentation                       ?
????????????????????????????????????????????????????????????????
?                                                              ?
?  Player                                                      ?
?    GET    /api/player              Get all players by ELO   ?
?    GET    /api/player/{id}         Get player with history  ?
?    GET    /api/player/leaderboard  Get leaderboard          ?
?    POST   /api/player              Create new player        ?
?    DELETE /api/player/{id}         Delete player            ?
?                                                              ?
?  Match                                                       ?
?    GET    /api/match               Get match history        ?
?    GET    /api/match/{id}          Get match details        ?
?    POST   /api/match               Create match             ?
?                                                              ?
?  Schemas                                                     ?
?    - CreatePlayerDto                                         ?
?    - CreateMatchDto                                          ?
?    - PlayerResponseDto                                       ?
?    - MatchResponseDto                                        ?
?    - ... and more                                            ?
?                                                              ?
????????????????????????????????????????????????????????????????
```

---

## ?? Quick Test Scenario

### Test 1: Create Players
1. Click **POST /api/player**
2. Click **"Try it out"**
3. Enter:
```json
{
  "username": "Alice"
}
```
4. Click **"Execute"**
5. Copy the returned `id`
6. Repeat for "Bob", "Charlie", "Diana"

### Test 2: Create a 1v1 Match
1. Click **POST /api/match**
2. Click **"Try it out"**
3. Paste player IDs into the JSON template
4. Execute
5. See ELO changes in the response!

### Test 3: View Leaderboard
1. Click **GET /api/player/leaderboard**
2. Click **"Try it out"**
3. Click **"Execute"**
4. See ranked players with statistics

---

## ?? Features Available via Swagger

### For Each Endpoint:
- ? **Interactive Testing** - Try it directly in the browser
- ? **Request Body Templates** - Pre-filled JSON examples
- ? **Response Codes** - See all possible HTTP status codes
- ? **Response Schemas** - View the structure of responses
- ? **Validation Rules** - See what's required for each field
- ? **cURL Export** - Copy as cURL command
- ? **Request URL** - See the exact endpoint being called

---

## ?? Configuration Details

### Current Settings (Program.cs)

```csharp
// Swagger is enabled in Development mode only
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "AeroElo API v1");
        options.RoutePrefix = string.Empty; // Swagger UI at root URL
        options.DocumentTitle = "AeroElo API Documentation";
    });
}
```

### Important URLs
- **Swagger UI**: `http://localhost:5000/`
- **OpenAPI JSON**: `http://localhost:5000/swagger/v1/swagger.json`
- **API Base**: `http://localhost:5000/api/`

---

## ?? Customization Options

Want to customize Swagger? Edit `Program.cs`:

### Change Swagger URL
```csharp
options.RoutePrefix = "api-docs"; // Access at /api-docs
```

### Add API Information
Install `Microsoft.OpenApi` separately and add:
```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AeroElo API",
        Version = "v1",
        Description = "Elo rating system for players"
    });
});
```

### Enable XML Comments
1. Enable XML docs in project file
2. Add to Swagger config:
```csharp
var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
c.IncludeXmlComments(xmlPath);
```

---

## ?? Documentation Files Created

1. **`RUNNING_AND_TESTING.md`** - Complete testing guide
2. **`API_ENDPOINTS.md`** - Detailed API documentation
3. **`DTOs/README.md`** - DTO documentation with examples

---

## ? Ready to Go!

Your API is now fully configured with Swagger UI! 

**Next Steps:**
1. Run `dotnet ef database update`
2. Run `dotnet run`
3. Open `http://localhost:5000`
4. Start testing your endpoints!

**Features to Test:**
- ? Create players
- ? Create 1v1 and 2v2 matches
- ? View leaderboards
- ? Check ELO calculations
- ? View player statistics (offense/defense, team colors)
- ? View match history with pagination

**Production Note:**
Swagger is only enabled in Development mode. To enable in production, remove the `if (app.Environment.IsDevelopment())` check.

---

## ?? Troubleshooting

### Swagger Not Showing?
- Check you're in Development environment
- Verify URL is correct (root path by default)
- Check browser console for errors

### Build Errors?
- Run `dotnet clean`
- Run `dotnet restore`
- Run `dotnet build`

### Database Errors?
- Run `dotnet ef database update`
- Check SQLite file permissions

---

Happy Testing! ??
