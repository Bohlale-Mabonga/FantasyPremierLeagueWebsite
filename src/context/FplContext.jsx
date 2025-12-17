import { createContext, useEffect, useState } from 'react';

export const FplContext = createContext();

const BASE_URL = "https://fantasy.premierleague.com/api";

export function FplProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  let isMounted = true;

  const fetchFplData = async () => {
    try {
      const response = await fetch(
        "https://fantasy.premierleague.com/api/bootstrap-static/"
      );

      const data = await response.json();

      if (isMounted) {
        setPlayers(data.elements || []);
        setTeams(data.teams || []);
        setEvents(data.events || []);
        setError(null);
      }
    } catch (err) {
      console.error("FPL fetch failed:", err);
      if (isMounted) {
        setError("Failed to load Fantasy Premier League data");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchFplData();

  return () => {
    isMounted = false;
  };
}, []);

  return (
    <FplContext.Provider
      value={{ players, teams, events, loading, error }}
    >
      {children}
    </FplContext.Provider>
  );
}
