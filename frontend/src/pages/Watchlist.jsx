import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { formatDate, readJson } from "../format";

const API = import.meta.env.VITE_API_URL;

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    fetch(`${API}/api/watchlist`)
      .then(readJson)
      .then(d => {
        setItems(Array.isArray(d) ? d : []);
        setError("");
      })
      .catch(() => setError("The watchlist could not be loaded. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(id) {
    try {
      await fetch(`${API}/api/watchlist/${id}`, { method: "DELETE" });
    } catch {
      setError("That item could not be removed. Please try again.");
    }
    load();
  }

  return (
    <div>
      <NavBar />
      <h3>Watchlist</h3>

      {loading && <div className="status-msg">Loading...</div>}
      {error && <div className="error-msg">{error}</div>}
      {!loading && !error && !items.length && <div className="status-msg">No saved launches yet.</div>}

      <ul id="launch-list">
        {items.map(it => (
          <li key={it._id}>
            <b>{it.name}</b>
            <div>Provider: {it.provider}</div>
            <div>Time: {formatDate(it.launchTime)}</div>
            <div>Location: {it.location}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <Link to={`/launch/${it.launchId}`}>Open</Link>
              <button onClick={() => remove(it._id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
