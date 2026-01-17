using Microsoft.EntityFrameworkCore;
using AeroElo.Api.Models;

namespace AeroElo.Api.Data
{
    public class AeroEloDbContext : DbContext
    {
        public AeroEloDbContext(DbContextOptions<AeroEloDbContext> options)
            : base(options)
        {
        }

        public DbSet<Player> Players { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<MatchParticipant> MatchParticipants { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure composite primary key for MatchParticipant
            modelBuilder.Entity<MatchParticipant>()
                .HasKey(mp => new { mp.MatchId, mp.PlayerId });

            // Configure relationships
            modelBuilder.Entity<MatchParticipant>()
                .HasOne<Match>()
                .WithMany()
                .HasForeignKey(mp => mp.MatchId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MatchParticipant>()
                .HasOne<Player>()
                .WithMany()
                .HasForeignKey(mp => mp.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
