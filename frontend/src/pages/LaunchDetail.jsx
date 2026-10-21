import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { bestWebcast, formatDate, readJson } from "../format";

const API = import.meta.env.VITE_API_URL;

export default function LaunchDetail() {
  const { id } = useParams();
  const [launch, setLaunch] = useState(null);
  const [msg, setMsg] = useState("");
  const [loadError, setLoadError] = useState(false);

  // Load this launch's details (rocket, orbit and webcast come from Launch Library too)
  useEffect(() => {
    fetch(`${API}/api/launches/${id}`)
      .then(readJson)
      .then(d => setLaunch(d))
      .catch(() => setLoadError(true));
  }, [id]);

  async function saveWatchlist() {
    setMsg("");
    if (!launch) return;

    const body = {
      launchId: launch.id,
      name: launch.name,
      provider: launch.launch_service_provider?.name,
      launchTime: launch.net,
      location: launch.pad?.location?.name,
      sourceUrl: launch.url
    };

    try {
      const r = await fetch(`${API}/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (r.status === 409) setMsg("Already in your watchlist");
      else if (!r.ok) setMsg("Save failed. Please try again.");
      else setMsg("Saved to watchlist ✅");
    } catch {
      setMsg("Save failed: the server could not be reached.");
    }
  }

  if (loadError) {
    return (
      <div>
        <NavBar />
        <div className="card">
          <Link to="/dashboard">← Back</Link>
          <p>This launch could not be loaded. It may not exist, or the data service is busy.</p>
        </div>
      </div>
    );
  }
  if (!launch) {
    return (
      <div>
        <NavBar />
        <div className="status-msg">Loading...</div>
      </div>
    );
  }

  const webcast = bestWebcast(launch);

  return (
    <div>
      <NavBar />
      <div className="card">
        <Link to="/dashboard">← Back</Link>
        <h4 className="launch-name">{launch.name}</h4>

        <div><b>Date:</b> {formatDate(launch.net)}</div>
        <div><b>Status:</b> {launch.status?.name}</div>
        <div><b>Provider:</b> {launch.launch_service_provider?.name}</div>
        <div><b>Rocket:</b> {launch.rocket?.configuration?.full_name || "Unknown"}</div>
        <div><b>Pad:</b> {launch.pad?.name}</div>
        <div><b>Location:</b> {launch.pad?.location?.name}</div>

        <h4>Mission</h4>
        <div><b>Type:</b> {launch.mission?.type || "Unknown"}</div>
        <div><b>Orbit:</b> {launch.mission?.orbit?.name || "Unknown"}</div>
        <p>{launch.mission?.description || "No description"}</p>
        <div>
          <b>Webcast:</b>{" "}
          {webcast
            ? <a href={webcast} target="_blank" rel="noreferrer">Watch</a>
            : "Not announced yet"}
        </div>

        <button onClick={saveWatchlist} style={{ marginTop: 12, padding: 10 }}>
          Save to Watchlist
        </button>
        <div style={{ marginTop: 8 }}>{msg}</div>

        <div style={{ marginTop: 16 }}>
          <Link to={`/brief/${launch.id}`}>Write Briefing Note →</Link>
        </div>
      </div>
    </div>
  );
}
