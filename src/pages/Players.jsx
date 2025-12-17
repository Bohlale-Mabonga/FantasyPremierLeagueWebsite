import { useContext } from 'react';
import { FplContext } from '../context/FplContext';
import { Link } from 'react-router-dom';

function Players() {
  const { players, loading, error } = useContext(FplContext);

  if (loading) return <p>Loading players...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="page">
      <h1>Players</h1>

      <div className="players-grid">
        {players.slice(0, 20).map(player => (
          <Link
            key={player.id}
            to={`/players/${player.id}`}
            className="player-card"
          >
            <h3>{player.web_name}</h3>
            <p>Price: £{player.now_cost / 10}m</p>
            <p>Total Points: {player.total_points}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Players;
