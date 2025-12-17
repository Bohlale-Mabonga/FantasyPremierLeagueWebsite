import { useEffect, useState, useMemo } from "react";
import "../styles/Fixtures.css";
import {
  Calendar,
  Trophy,
  TrendingUp,
  Clock,
  Home,
  BarChart2,
  Users,
  Settings,
  ChevronRight,
  AlertCircle
} from "lucide-react";

// Helper: difficulty color classes
const getDifficultyClass = (difficulty) => {
  if (difficulty <= 2) return "difficulty-easy";
  if (difficulty === 3) return "difficulty-medium";
  return "difficulty-hard";
};

const getDifficultyLabel = (difficulty) => {
  if (difficulty <= 2) return "Easy";
  if (difficulty === 3) return "Medium";
  return "Hard";
};

function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGW, setSelectedGW] = useState(1);
  const [gameweeks, setGameweeks] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [activeNav, setActiveNav] = useState('fixtures');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fixturesRes, teamsRes] = await Promise.all([
          fetch("https://corsproxy.io/?https://fantasy.premierleague.com/api/fixtures/"),
          fetch("https://corsproxy.io/?https://fantasy.premierleague.com/api/bootstrap-static/")
        ]);

        const fixturesData = await fixturesRes.json();
        const teamsData = await teamsRes.json();

        const teamMap = {};
        teamsData.teams.forEach((team) => {
          teamMap[team.id] = { 
            name: team.name, 
            code: team.code,
            short_name: team.short_name,
            strength: team.strength,
            strength_overall_home: team.strength_overall_home,
            strength_overall_away: team.strength_overall_away
          };
        });

        const gws = Array.from(new Set(fixturesData.map((f) => f.event)))
          .filter(gw => gw && gw > 0)
          .sort((a, b) => a - b);

        // Calculate statistics
        const currentTime = new Date();
        const upcoming = fixturesData.filter(f => new Date(f.kickoff_time) > currentTime && !f.finished);
        const live = fixturesData.filter(f => !f.finished && f.started);
        const finished = fixturesData.filter(f => f.finished);
        
        setStats({
          total: fixturesData.length,
          upcoming: upcoming.length,
          live: live.length,
          finished: finished.length,
          avgDifficulty: fixturesData.reduce((acc, f) => acc + f.team_h_difficulty + f.team_a_difficulty, 0) / (fixturesData.length * 2)
        });

        setFixtures(fixturesData);
        setTeams(teamMap);
        setGameweeks(gws);
        
        if (gws.length > 0) {
          const currentGW = fixturesData.find(f => 
            new Date(f.kickoff_time) > currentTime && !f.finished
          )?.event || gws[0];
          setSelectedGW(currentGW);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load fixtures data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFixtures = useMemo(() => 
    fixtures
      .filter((f) => f.event === selectedGW)
      .sort((a, b) => new Date(a.kickoff_time) - new Date(b.kickoff_time)),
    [fixtures, selectedGW]
  );

  const currentTime = useMemo(() => new Date(), []);
  const upcomingFixtures = useMemo(() => 
    filteredFixtures.filter(f => new Date(f.kickoff_time) > currentTime && !f.finished),
    [filteredFixtures, currentTime]
  );
  const liveFixtures = useMemo(() => 
    filteredFixtures.filter(f => !f.finished && f.started),
    [filteredFixtures]
  );
  const finishedFixtures = useMemo(() => 
    filteredFixtures.filter(f => f.finished),
    [filteredFixtures]
  );
  const nextFixture = upcomingFixtures.length > 0 ? upcomingFixtures[0] : null;

  const navigationItems = [
    { id: 'fixtures', label: 'Fixtures', icon: <Calendar size={20} /> },
    { id: 'standings', label: 'Standings', icon: <Trophy size={20} /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart2 size={20} /> },
    { id: 'teams', label: 'My Team', icon: <Users size={20} /> },
    { id: 'transfers', label: 'Transfers', icon: <TrendingUp size={20} /> },
  ];

 // Replace the entire return statement in Fixtures.jsx with this:

  if (loading) return (
    <div className="page-wrapper">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading fixtures...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="page-wrapper">
      <div className="error-container">
        <AlertCircle size={48} className="error-icon" />
        <p className="error-text">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <h1 className="page-title">Premier League Fixtures</h1>
          <div className="breadcrumb">
            <Home size={14} />
            <ChevronRight size={14} />
            <span>Fixtures</span>
            <ChevronRight size={14} />
            <span>Gameweek {selectedGW}</span>
          </div>
        </div>
        <div className="top-bar-right">
          <div className="chip">
            <Clock size={14} />
            <span>Updated: Today</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <Calendar size={20} />
            <span className="stat-label">Total Fixtures</span>
          </div>
          <div className="stat-value">{stats?.total || 0}</div>
          <div className="stat-trend">All Season</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="live-indicator"></div>
            <span className="stat-label">Live Now</span>
          </div>
          <div className="stat-value highlight">{stats?.live || 0}</div>
          <div className="stat-trend">GW{selectedGW}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <Clock size={20} />
            <span className="stat-label">Upcoming</span>
          </div>
          <div className="stat-value">{stats?.upcoming || 0}</div>
          <div className="stat-trend">Next 7 days</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <TrendingUp size={20} />
            <span className="stat-label">Avg Difficulty</span>
          </div>
          <div className="stat-value">{stats?.avgDifficulty?.toFixed(1) || '-'}</div>
          <div className="stat-trend">This GW</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="content-grid">
        {/* Left Column - Fixtures & Gameweek Selector */}
        <div className="left-column">
          <div className="section-card">
            <div className="section-header">
              <h2>Gameweek {selectedGW} Fixtures</h2>
              <div className="view-controls">
                <button 
                  className={`view-btn ${isGridView ? 'active' : ''}`}
                  onClick={() => setIsGridView(true)}
                >
                  Grid
                </button>
                <button 
                  className={`view-btn ${!isGridView ? 'active' : ''}`}
                  onClick={() => setIsGridView(false)}
                >
                  List
                </button>
              </div>
            </div>
            
            {/* Gameweek Tabs */}
            <div className="gameweek-scroller">
              <div className="gameweek-tabs">
                {gameweeks.map((gw) => (
                  <button
                    key={gw}
                    className={`gw-tab ${selectedGW === gw ? 'active' : ''} ${
                      gw < selectedGW ? 'past' : 'future'
                    }`}
                    onClick={() => setSelectedGW(gw)}
                  >
                    <span className="gw-number">GW{gw}</span>
                    {selectedGW === gw && (
                      <span className="active-dot"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Fixtures Display */}
            <div className={isGridView ? "fixtures-grid-view" : "fixtures-list-view"}>
              {filteredFixtures.map((fixture) => {
                const isNext = nextFixture && fixture.id === nextFixture.id;
                const isLive = liveFixtures.some(f => f.id === fixture.id);
                const status = fixture.finished ? 'finished' : 
                              isLive ? 'live' : 
                              new Date(fixture.kickoff_time) > currentTime ? 'upcoming' : 'started';

                return (
                  <div
                    key={fixture.id}
                    className={`fixture-card ${status} ${isNext ? 'next-fixture' : ''}`}
                  >
                    {isNext && (
                      <div className="fixture-badge next">
                        <ChevronRight size={12} />
                        Next Match
                      </div>
                    )}

                    {isLive && (
                      <div className="fixture-badge live">
                        <div className="pulse-dot"></div>
                        LIVE
                      </div>
                    )}

                    <div className="fixture-header">
                      <div className="fixture-meta">
                        <span className="gw-badge">GW{fixture.event}</span>
                        <span className="kickoff-time">
                          {new Date(fixture.kickoff_time).toLocaleString(undefined, {
                            weekday: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="venue-info">
                        <Home size={12} />
                        <span>{teams[fixture.team_h]?.name}</span>
                      </div>
                    </div>

                    <div className="fixture-teams">
                      {/* Home Team */}
                      <div className="team-wrapper home">
                        <div className="team-logo">
                          <img
                            src={`https://resources.premierleague.com/premierleague/badges/t${teams[fixture.team_h]?.code}.png`}
                            alt={teams[fixture.team_h]?.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = 
                                `<div class="logo-fallback">${teams[fixture.team_h]?.short_name?.charAt(0) || 'H'}</div>`;
                            }}
                          />
                        </div>
                        <div className="team-details">
                          <h3 className="team-name">{teams[fixture.team_h]?.name}</h3>
                          <div className="team-stats">
                            <div className={`difficulty-tag ${getDifficultyClass(fixture.team_h_difficulty)}`}>
                              {getDifficultyLabel(fixture.team_h_difficulty)}
                            </div>
                            {fixture.finished && (
                              <div className="score-display">
                                <span className="score">{fixture.team_h_score}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* VS Separator */}
                      <div className="vs-divider">
                        <div className="divider-line"></div>
                        <span className="vs-label">VS</span>
                        <div className="divider-line"></div>
                      </div>

                      {/* Away Team */}
                      <div className="team-wrapper away">
                        <div className="team-details">
                          <h3 className="team-name">{teams[fixture.team_a]?.name}</h3>
                          <div className="team-stats">
                            <div className={`difficulty-tag ${getDifficultyClass(fixture.team_a_difficulty)}`}>
                              {getDifficultyLabel(fixture.team_a_difficulty)}
                            </div>
                            {fixture.finished && (
                              <div className="score-display">
                                <span className="score">{fixture.team_a_score}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="team-logo">
                          <img
                            src={`https://resources.premierleague.com/premierleague/badges/t${teams[fixture.team_a]?.code}.png`}
                            alt={teams[fixture.team_a]?.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = 
                                `<div class="logo-fallback">${teams[fixture.team_a]?.short_name?.charAt(0) || 'A'}</div>`;
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="fixture-footer">
                      <div className="match-info">
                        <span className="info-item">
                          <Clock size={12} />
                          {status === 'upcoming' ? (
                            `In ${Math.ceil((new Date(fixture.kickoff_time) - currentTime) / (1000 * 60 * 60))}h`
                          ) : status === 'live' ? (
                            'Live Now'
                          ) : (
                            'Full Time'
                          )}
                        </span>
                        <span className="info-item">
                          ⚽ {fixture.finished ? 'Completed' : 'Scheduled'}
                        </span>
                      </div>
                      {status === 'upcoming' && (
                        <button className="reminder-btn">
                          <Clock size={12} />
                          Remind
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredFixtures.length === 0 && (
              <div className="empty-state">
                <Calendar size={48} className="empty-icon" />
                <h3>No fixtures for Gameweek {selectedGW}</h3>
                <p>Select another gameweek to view fixtures</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats & Info */}
        <div className="right-column">
          {/* Upcoming Matches */}
          <div className="section-card">
            <h3>Upcoming Matches</h3>
            <div className="upcoming-list">
              {upcomingFixtures.slice(0, 3).map((fixture, index) => (
                <div key={fixture.id} className="upcoming-item">
                  <div className="upcoming-time">
                    {new Date(fixture.kickoff_time).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="upcoming-teams">
                    <span className="team-abbr">{teams[fixture.team_h]?.short_name}</span>
                    <span className="vs">vs</span>
                    <span className="team-abbr">{teams[fixture.team_a]?.short_name}</span>
                  </div>
                  <div className="upcoming-meta">
                    <span className={`difficulty-indicator ${getDifficultyClass(fixture.team_h_difficulty)}`}>
                      H
                    </span>
                    <span className={`difficulty-indicator ${getDifficultyClass(fixture.team_a_difficulty)}`}>
                      A
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {upcomingFixtures.length > 3 && (
              <button className="view-all-btn">
                View all upcoming matches
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* Top Teams */}
          <div className="section-card">
            <h3>Top Teams This Season</h3>
            <div className="teams-ranking">
              {Object.values(teams)
                .sort((a, b) => b.strength - a.strength)
                .slice(0, 5)
                .map((team, index) => (
                  <div key={team.code} className="team-ranking-item">
                    <div className="rank-position">
                      <span className="position-number">{index + 1}</span>
                    </div>
                    <div className="team-logo-sm">
                      <img
                        src={`https://resources.premierleague.com/premierleague/badges/t${team.code}.png`}
                        alt={team.name}
                      />
                    </div>
                    <div className="team-info-sm">
                      <span className="team-name-sm">{team.short_name}</span>
                      <span className="team-strength">Strength: {team.strength}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="section-card">
            <h3>Gameweek Stats</h3>
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-label-sm">Live Matches</span>
                <span className="stat-value-sm">{liveFixtures.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label-sm">Goals Scored</span>
                <span className="stat-value-sm">
                  {finishedFixtures.reduce((acc, f) => acc + f.team_h_score + f.team_a_score, 0)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label-sm">Avg. Goals</span>
                <span className="stat-value-sm">
                  {finishedFixtures.length > 0 
                    ? ((finishedFixtures.reduce((acc, f) => acc + f.team_h_score + f.team_a_score, 0) / finishedFixtures.length).toFixed(1))
                    : '0.0'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fixtures;