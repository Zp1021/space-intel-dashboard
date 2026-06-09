import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function LaunchDetail() {
  const { id } = useParams();
  const [launch, setLaunch] = useState(null);
  const [enrich, setEnrich] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API}/api/launches/${id}`)
      .then(r => r.json())
      .then(d => setLaunch(d));
  }, [id]);

  useEffect(() => {
    if (!launch) return;
    const provider = launch.launch_service_provider?.name || "";
    if (provider.toLowerCase().includes("spacex")) {
      const name = encodeURIComponent(launch.name);
      const date = encodeURIComponent(launch.net || "");
      fetch(`${API}/api/enrich/spacex?name=${name}&date=${date}`)
        .then(r => r.json())
        .then(d => setEnrich(d));
    }
  }, [launch]);

  async function saveWatchlist() {
    setMsg("");
    if (!launch) return;

    const body = {
      launchId: launch.id,
      name: launch.name,
      provider: launch.launch_service_provider?.name,
      launchTime: launch.net,
      location: launch.pad?.location?.name,
      sourceUrl: `https://ll.thespacedevs.com/2.2.0/launch/${launch.id}/`
    };

    const r = await fetch(`${API}/api/watchlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const d = await r.json();
    if (d?.error) setMsg("Save failed");
    else setMsg("Saved to watchlist ✅");
  }

  if (!launch) return <div>Loading...</div>;

  return (
    <div>
      <Link to="/">← Back</Link>
      <h3>{launch.name}</h3>

      <div><b>Date:</b> {launch.net}</div>
      <div><b>Status:</b> {launch.status?.name}</div>
      <div><b>Provider:</b> {launch.launch_service_provider?.name}</div>
      <div><b>Pad:</b> {launch.pad?.name}</div>
      <div><b>Location:</b> {launch.pad?.location?.name}</div>

      <h4>Mission</h4>
      <div>{launch.mission?.description || "No description"}</div>

      <button onClick={saveWatchlist} style={{ marginTop: 12, padding: 10 }}>
        Save to Watchlist
      </button>
      <div style={{ marginTop: 8 }}>{msg}</div>

      <div style={{ marginTop: 16 }}>
        <Link to={`/brief/${launch.id}`}>Write Briefing Note →</Link>
      </div>

      {enrich?.found && (
        <div style={{ marginTop: 18, padding: 12, border: "1px solid #ddd" }}>
          <h4>SpaceX Enrichment</h4>
          <div><b>SpaceX Launch Name:</b> {enrich.launch?.name}</div>
          <div><b>Success:</b> {String(enrich.launch?.success)}</div>
          <div><b>Rocket:</b> {enrich.rocket?.name || "Unknown"}</div>
          <div><b>Webcast:</b> {enrich.launch?.links?.webcast || "None"}</div>
        </div>
      )}
    </div>
  );
}