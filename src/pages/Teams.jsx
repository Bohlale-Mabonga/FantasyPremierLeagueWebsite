import { useEffect, useState, useMemo } from "react";
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Zap, 
  Users,
  Trophy,
  Home,
  Away,
  ChevronRight,
  Star,
  BarChart2,
  Calendar,
  Goal,
  SortAsc,
  SortDesc
} from 'lucide-react';
import '../styles/Teams.css';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('strength');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

 useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("https://corsproxy.io/?https://fantasy.premierleague.com/api/bootstrap-static/");
      const data = await res.json();
      setTeams(data.teams || []);
      setPlayers(data.elements || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


 const teamsWithStats = useMemo(() => {
  if (!teams.length) return [];

  return teams.map(team => {
    const teamPlayers = players.filter(p => p.team === team.id);

    return {
      ...team,
      players: teamPlayers,
      total_goals_scored: teamPlayers.reduce((sum, p) => sum + (p.goals_scored || 0), 0),
      total_points: teamPlayers.reduce((sum, p) => sum + (p.total_points || 0), 0),
      player_count: teamPlayers.length
    };
  });
}, [teams, players]);


  // Calculate league stats
  const stats = useMemo(() => {
    if (!teamsWithStats.length) return null;
    
    const totalGoals = teamsWithStats.reduce((sum, team) => sum + team.total_goals_scored, 0);
    const avgStrength = teamsWithStats.reduce((sum, team) => sum + team.strength, 0) / teamsWithStats.length;
    const topTeam = [...teamsWithStats].sort((a, b) => b.strength - a.strength)[0];
    const totalPlayers = teamsWithStats.reduce((sum, team) => sum + team.player_count, 0);

    return {
      totalTeams: teamsWithStats.length,
      totalGoals,
      avgStrength: avgStrength.toFixed(1),
      topTeam: topTeam?.name || 'N/A',
      topStrength: topTeam?.strength || 0,
      totalPlayers
    };
  }, [teamsWithStats]);

  // Filter and sort teams
  const filteredAndSortedTeams = useMemo(() => {
    let filtered = teamsWithStats.filter(team => 
      team.name.toLowerCase().includes(search.toLowerCase()) ||
      team.short_name.toLowerCase().includes(search.toLowerCase())
    );

    // Apply filters
    if (activeFilter === 'strong') {
      filtered = filtered.filter(team => team.strength >= 4);
    } else if (activeFilter === 'weak') {
      filtered = filtered.filter(team => team.strength <= 2);
    } else if (activeFilter === 'top_home') {
      filtered = filtered.filter(team => team.strength_overall_home >= 4);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'strength':
          aValue = a.strength;
          bValue = b.strength;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'points':
          aValue = a.total_points || 0;
          bValue = b.total_points || 0;
          break;
        case 'goals':
          aValue = a.total_goals_scored || 0;
          bValue = b.total_goals_scored || 0;
          break;
        default:
          aValue = a.strength;
          bValue = b.strength;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [teamsWithStats, search, sortBy, sortOrder, activeFilter]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStrengthColor = (strength) => {
    if (strength >= 4) return 'strength-strong';
    if (strength >= 3) return 'strength-medium';
    return 'strength-weak';
  };

  const getFormColor = (form) => {
    const num = parseFloat(form);
    if (num >= 7) return 'form-excellent';
    if (num >= 5) return 'form-good';
    if (num >= 3) return 'form-average';
    return 'form-poor';
  };

  if (loading) return (
    <div className="page-wrapper">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading teams...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="page-wrapper">
      <div className="error-container">
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Premier League Teams</h1>
            <p className="page-subtitle">Team statistics, strengths, and player details</p>
          </div>
          <div className="header-actions">
            <Link to="/fixtures" className="header-link">
              <Calendar size={16} />
              View Fixtures
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <Trophy size={20} />
            <span className="stat-label">Total Teams</span>
          </div>
          <div className="stat-value">{stats?.totalTeams || 0}</div>
          <div className="stat-trend">Premier League</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <Goal size={20} />
            <span className="stat-label">Total Goals</span>
          </div>
          <div className="stat-value">{stats?.totalGoals || 0}</div>
          <div className="stat-trend">Season Total</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <Zap size={20} />
            <span className="stat-label">Avg. Strength</span>
          </div>
          <div className="stat-value">{stats?.avgStrength || '0.0'}</div>
          <div className="stat-trend">League Average</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <Star size={20} />
            <span className="stat-label">Top Team</span>
          </div>
          <div className="stat-value highlight">{stats?.topStrength || 0}</div>
          <div className="stat-trend">{stats?.topTeam}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="controls-section">
        <div className="search-bar-container">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search teams by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button 
                className="clear-search"
                onClick={() => setSearch('')}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Teams
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'strong' ? 'active' : ''}`}
              onClick={() => setActiveFilter('strong')}
            >
              <Zap size={14} />
              Strong (4+)
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'weak' ? 'active' : ''}`}
              onClick={() => setActiveFilter('weak')}
            >
              <TrendingDown size={14} />
              Weak (2-)
            </button>
          </div>
        </div>

        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <div className="sort-buttons">
            <button 
              className={`sort-btn ${sortBy === 'strength' ? 'active' : ''}`}
              onClick={() => handleSort('strength')}
            >
              {sortBy === 'strength' && sortOrder === 'desc' ? <SortDesc size={14} /> : <SortAsc size={14} />}
              Strength
            </button>
            <button 
              className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
              onClick={() => handleSort('name')}
            >
              {sortBy === 'name' && sortOrder === 'desc' ? <SortDesc size={14} /> : <SortAsc size={14} />}
              Name
            </button>
            <button 
              className={`sort-btn ${sortBy === 'points' ? 'active' : ''}`}
              onClick={() => handleSort('points')}
            >
              {sortBy === 'points' && sortOrder === 'desc' ? <SortDesc size={14} /> : <SortAsc size={14} />}
              Points
            </button>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="teams-grid">
        {filteredAndSortedTeams.map((team) => (
          <div 
            key={team.id} 
            className={`team-card ${getStrengthColor(team.strength)}`}
            onClick={() => setSelectedTeam(selectedTeam?.id === team.id ? null : team)}
          >
            {/* Team Header */}
            <div className="team-header">
              <div className="team-badge-container">
                <img
                  src={`https://resources.premierleague.com/premierleague/badges/t${team.code}.png`}
                  alt={team.name}
                  className="team-badge"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="team-badge-fallback ${getStrengthColor(team.strength)}">
                        ${team.short_name}
                      </div>
                    `;
                  }}
                />
              </div>
              
              <div className="team-info">
                <h3 className="team-name">{team.name}</h3>
                <div className="team-meta">
                  <span className="team-shortname">{team.short_name}</span>
                  <span className="team-divider">•</span>
                  <span className="team-id">ID: {team.id}</span>
                </div>
              </div>
              
              <button className="team-expand-btn">
                <ChevronRight size={20} className={selectedTeam?.id === team.id ? 'expanded' : ''} />
              </button>
            </div>

            {/* Team Stats */}
            <div className="team-stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <Zap size={16} />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{team.strength}</span>
                  <span className="stat-label">Strength</span>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <Home size={16} />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{team.strength_overall_home}</span>
                  <span className="stat-label">Home</span>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <Away size={16} />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{team.strength_overall_away}</span>
                  <span className="stat-label">Away</span>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <Goal size={16} />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{team.total_goals_scored || 0}</span>
                  <span className="stat-label">Goals</span>
                </div>
              </div>
            </div>

            {/* Team Form */}
            <div className="team-form-section">
              <div className="form-header">
                <span>Team Form</span>
                <span className={`form-rating ${getFormColor(team.avg_form)}`}>
                  {team.avg_form || '0.0'}
                </span>
              </div>
              <div className="form-stats">
                <span className="form-stat">
                  <Users size={12} />
                  {team.player_count} Players
                </span>
                <span className="form-stat">
                  <Target size={12} />
                  {team.total_assists || 0} Assists
                </span>
                <span className="form-stat">
                  <BarChart2 size={12} />
                  {team.total_points || 0} Points
                </span>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedTeam?.id === team.id && (
              <div className="team-details">
                <div className="details-section">
                  <h4>Team Details</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Attack Home</span>
                      <div className="detail-bar">
                        <div 
                          className="detail-fill attack" 
                          style={{ width: `${team.strength_attack_home * 20}%` }}
                        ></div>
                      </div>
                      <span className="detail-value">{team.strength_attack_home}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Defense Home</span>
                      <div className="detail-bar">
                        <div 
                          className="detail-fill defense" 
                          style={{ width: `${team.strength_defence_home * 20}%` }}
                        ></div>
                      </div>
                      <span className="detail-value">{team.strength_defence_home}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Clean Sheets</span>
                      <span className="detail-value">{team.total_clean_sheets || 0}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Goals Scored</span>
                      <span className="detail-value">{team.total_goals_scored || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="players-preview">
                  <div className="preview-header">
                    <h4>Top Players</h4>
                    <Link to={`/players?team=${team.id}`} className="view-all-link">
                      View All Players
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                  
                  <div className="players-list">
                    {team.players?.slice(0, 3).map(player => (
                      <div key={player.id} className="player-preview">
                        <div className="player-info">
                          <span className="player-name">{player.web_name}</span>
                          <span className="player-position">
                            {player.element_type === 1 ? 'GK' : 
                             player.element_type === 2 ? 'DEF' : 
                             player.element_type === 3 ? 'MID' : 'FWD'}
                          </span>
                        </div>
                        <div className="player-stats">
                          <span className="player-stat">
                            <Goal size={12} />
                            {player.goals_scored || 0}
                          </span>
                          <span className="player-stat">
                            <Target size={12} />
                            {player.assists || 0}
                          </span>
                          <span className="player-stat points">
                            {player.total_points || 0} pts
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {(!team.players || team.players.length === 0) && (
                      <p className="no-players">No player data available</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* View Players Button */}
            <Link 
              to={`/players?team=${team.id}`}
              className="view-players-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <Users size={16} />
              View Team Players ({team.player_count || 0})
              <ChevronRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedTeams.length === 0 && (
        <div className="empty-state">
          <Trophy size={48} className="empty-icon" />
          <h3>No teams found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* League Summary */}
      {stats && (
        <div className="league-summary">
          <h3>League Summary</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="summary-label">Total Players</span>
              <span className="summary-value">{stats.totalPlayers}</span>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Avg Team Strength</span>
              <span className="summary-value">{stats.avgStrength}</span>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Strongest Team</span>
              <span className="summary-value highlight">{stats.topTeam}</span>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Total Goals</span>
              <span className="summary-value">{stats.totalGoals}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;