import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Watchlist() {
  const [items, setItems] = useState([]);

  function load() {
    fetch(`${API}/api/watchlist`)
      .then(r => r.json())
      .then(d => setItems(d || []));
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    await fetch(`${API}/api/watchlist/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h3>Watchlist</h3>

      {!items.length && <div>No saved items yet.</div>}

      <ul style={{ paddingLeft: 18 }}>
        {items.map(it => (
          <li key={it._id} style={{ margin: "10px 0" }}>
            <b>{it.name}</b>
            <div>Provider: {it.provider}</div>
            <div>Time: {it.launchTime}</div>
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