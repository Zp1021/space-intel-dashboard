import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { formatDate, readJson } from "../format";

// Get API URL from environment variables
const API = import.meta.env.VITE_API_URL;

// Dashboard page to display upcoming launches with search and filter functionality
export default function Dashboard() {

  // State for launch items, search query, provider filter, and loading/error status
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [providerOnly, setProviderOnly] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch upcoming launches on component mount
  useEffect(() => {
    fetch(`${API}/api/launches/upcoming?limit=50`)
      .then(readJson)
      .then(d => setItems(d.results || []))
      .catch(() => setError("Launch data is unavailable right now. Please try again in a few minutes."))
      .finally(() => setLoading(false));
  }, []);

  // Filter items based on search query and provider selection
  const filtered = useMemo(() => {
    let x = items;
    // Filter by mission name if search query is not empty
    if (q.trim()) {
      const s = q.toLowerCase();
      x = x.filter(it => (it.name || "").toLowerCase().includes(s));
    }
    // Filter by provider if a specific provider is selected
    if (providerOnly !== "ALL") {
      x = x.filter(it => (it.launch_service_provider?.name || "") === providerOnly);
    }
    // Return the filtered items
    return x;
  }, [items, q, providerOnly]);

  // Build provider dropdown options
  const providers = useMemo(() => {
    // Create a set of unique provider names from the items
    const set = new Set(items.map(it => it.launch_service_provider?.name).filter(Boolean));
    // Return an array with "ALL" followed by the sorted unique provider names
    return ["ALL", ...Array.from(set).sort()];
  }, [items]);

  return (
    <div>
      <NavBar />
      <h3>Upcoming Launches</h3>

      {/* Search and filter controls */}
      <div id="launch-div">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search mission name..."
          aria-label="Search mission name"
        />

        {/* Provider dropdown */}
        <select
          value={providerOnly}
          onChange={(e) => setProviderOnly(e.target.value)}
          aria-label="Filter by provider"
          style={{ padding: 10 }}
        >
          {providers.map(p => <option key={p} value={p}>{p === "ALL" ? "All providers" : p}</option>)}
        </select>
      </div>

      {loading && <div className="status-msg">Loading launches...</div>}

      {/* Shown only when the launch data could not be loaded */}
      {error && <div className="error-msg">{error}</div>}

      {/* Results count */}
      {!loading && !error && <div id="results-div">Results: {filtered.length}</div>}

      {/* Launch items */}
      <ul id="launch-list">
        {filtered.map(it => (
          <li key={it.id}>
            <Link to={`/launch/${it.id}`}><b>{it.name}</b></Link>
            <div>Date: {formatDate(it.net)}</div>
            <div>Provider: {it.launch_service_provider?.name}</div>
            <div>Location: {it.pad?.location?.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
