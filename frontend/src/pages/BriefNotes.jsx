import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { formatDate, readJson } from "../format";

const API = import.meta.env.VITE_API_URL;

export default function BriefNotes() {
  const { launchId } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [keyObs, setKeyObs] = useState("");
  const [watchItems, setWatchItems] = useState("");
  const [sources, setSources] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [notes, setNotes] = useState([]);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(() => {
    fetch(`${API}/api/briefs/${launchId}`)
      .then(readJson)
      .then(d => {
        setNotes(Array.isArray(d) ? d : []);
        setLoadError("");
      })
      .catch(() => setLoadError("Saved briefs could not be loaded. Is the backend running?"));
  }, [launchId]);

  useEffect(() => { load(); }, [load]);

  // Every field except sources must have text before the brief can be saved
  const complete = [title, summary, keyObs, watchItems].every(v => v.trim());

  async function save() {
    setSavedMsg("");
    if (!complete) {
      setSavedMsg("Please fill in the title, summary, key observations and watch items.");
      return;
    }
    const body = {
      launchId,
      title,
      summary,
      keyObservations: keyObs,
      watchItems,
      sources: sources.split("\n").map(s => s.trim()).filter(Boolean),
    };

    try {
      const r = await fetch(`${API}/api/briefs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!r.ok) {
        setSavedMsg("Save failed. Please try again.");
        return;
      }
      setSavedMsg("Saved ✅");
      setTitle(""); setSummary(""); setKeyObs(""); setWatchItems(""); setSources("");
      load();
    } catch {
      setSavedMsg("Save failed: the server could not be reached.");
    }
  }

  return (
    <div>
      <NavBar />
      <div className="card">
        <Link to={`/launch/${launchId}`}>← Back to Launch</Link>
        <h4 className="launch-name">Briefing Notes</h4>

        <div className="briefing-div">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" aria-label="Title" style={{ padding: 10 }} />
          <textarea value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="Summary (2–4 sentences)" aria-label="Summary" rows={3} style={{ padding: 10 }} />
          <textarea value={keyObs} onChange={(e)=>setKeyObs(e.target.value)} placeholder="Key observations (bullets)" aria-label="Key observations" rows={4} style={{ padding: 10 }} />
          <textarea value={watchItems} onChange={(e)=>setWatchItems(e.target.value)} placeholder="Watch items / questions" aria-label="Watch items" rows={3} style={{ padding: 10 }} />
          <textarea value={sources} onChange={(e)=>setSources(e.target.value)} placeholder="Sources (optional, one URL per line)" aria-label="Sources" rows={3} style={{ padding: 10 }} />

          <button className="save-btn" onClick={save}>Save Brief</button>
          <div>{savedMsg}</div>
        </div>

        <h4 className="brief-h4">Saved Briefs</h4>
        {loadError && <div>{loadError}</div>}
        {!loadError && !notes.length && <div>No briefs yet.</div>}
        {notes.map(n => (
          <div key={n._id} className="brief-note">
            <b>{n.title}</b>
            <div className="brief-date">Updated {formatDate(n.updatedAt)}</div>
            <div style={{ marginTop: 6 }}>{n.summary}</div>
            <pre style={{ whiteSpace: "pre-wrap" }}><b>Key observations:</b>{"\n"}{n.keyObservations}</pre>
            <pre style={{ whiteSpace: "pre-wrap" }}><b>Watch items:</b>{"\n"}{n.watchItems}</pre>
            {!!(n.sources || []).length && (
              <div>
                <b>Sources:</b>
                <ul>
                  {(n.sources || []).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
