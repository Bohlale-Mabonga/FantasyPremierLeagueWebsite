import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Trophy, 
  Calendar, 
  BarChart2, 
  TrendingUp, 
  Settings,
  ChevronRight,
  Bell,
  Star,
  Target,
  Zap,
  Clock
} from 'lucide-react';
import "../../styles/Navbar.css";

function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/players', label: 'Players', icon: <Users size={20} /> },
    { path: '/teams', label: 'Teams', icon: <Trophy size={20} /> },
    { path: '/fixtures', label: 'Fixtures', icon: <Calendar size={20} /> },
    { path: '/stats', label: 'Statistics', icon: <BarChart2 size={20} /> },
    { path: '/transfers', label: 'Transfers', icon: <TrendingUp size={20} /> },
    { path: '/about', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="sidebar">
      {/* Enhanced Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <Trophy size={24} />
            <span className="logo-badge">FPL</span>
          </div>
          <div className="logo-text">
            <span className="logo-title">Bash's FPL</span>
            <span className="logo-subtitle">Fantasy Dashboard</span>
          </div>
        </div>
        <button className="notifications-btn">
          <Bell size={18} />
          <span className="notification-count">3</span>
        </button>
      </div>
      
      {/* User Info Section */}
      <div className="user-section">
        <div className="user-avatar-large">
          <img 
            src="https://resources.premierleague.com/premierleague/photos/players/250x250/p{player_code}.png" 
            alt="Manager"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="avatar-fallback">FPL</div>';
            }}
          />
          <div className="user-status"></div>
        </div>
        <div className="user-details">
          <h3 className="user-name">Fantasy Manager</h3>
          <p className="user-rank">
            <Star size={12} />
            Overall Rank: <strong>#12,456</strong>
          </p>
          <div className="user-stats">
            <span className="user-stat">
              <Target size={12} />
              1,234 Pts
            </span>
            <span className="user-stat">
              <Zap size={12} />
              Form: 6.8
            </span>
          </div>
        </div>
      </div>

      {/* Navigation with enhanced styling */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4 className="nav-section-title">Navigation</h4>
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon-wrapper">
                {item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
              {currentPath === item.path && (
                <ChevronRight size={16} className="nav-indicator" />
              )}
              {item.path === '/fixtures' && (
                <span className="nav-badge">Live</span>
              )}
            </Link>
          ))}
        </div>

        <div className="nav-section">
          <h4 className="nav-section-title">My Team</h4>
          {navItems.slice(4, 6).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon-wrapper">
                {item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
              {currentPath === item.path && (
                <ChevronRight size={16} className="nav-indicator" />
              )}
            </Link>
          ))}
        </div>

        {/* Quick Stats in Sidebar */}
        <div className="sidebar-stats">
          <div className="sidebar-stat">
            <Clock size={14} />
            <div className="stat-info">
              <span className="stat-value">12</span>
              <span className="stat-label">Live Games</span>
            </div>
          </div>
          <div className="sidebar-stat">
            <Trophy size={14} />
            <div className="stat-info">
              <span className="stat-value">6</span>
              <span className="stat-label">My Transfers</span>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Enhanced Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="gameweek-info">
          <div className="gw-current">
            <span className="gw-label">Current GW</span>
            <span className="gw-number">GW28</span>
          </div>
          <div className="gw-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '65%' }}></div>
            </div>
            <span className="progress-text">65% Complete</span>
          </div>
        </div>
        
        <button className="sidebar-action-btn">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}

export default NavBar;