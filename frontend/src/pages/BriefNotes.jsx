import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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

  function load() {
    fetch(`${API}/api/briefs/${launchId}`)
      .then(r => r.json())
      .then(d => setNotes(d || []));
  }

  useEffect(() => { load(); }, [launchId]);

  async function save() {
    setSavedMsg("");
    const body = {
      launchId,
      title,
      summary,
      keyObservations: keyObs,
      watchItems,
      sources: sources.split("\n").map(s => s.trim()).filter(Boolean),
    };

    const r = await fetch(`${API}/api/briefs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const d = await r.json();
    if (d?.error) setSavedMsg("Save failed");
    else {
      setSavedMsg("Saved ✅");
      setTitle(""); setSummary(""); setKeyObs(""); setWatchItems(""); setSources("");
      load();
    }
  }

  return (
    <div>
      <Link to={`/launch/${launchId}`}>← Back to Launch</Link>
      <h3>Briefing Notes</h3>

      <div className= "briefing-div">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" style={{ padding: 10 }} />
        <textarea value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="Summary (2–4 sentences)" rows={3} style={{ padding: 10 }} />
        <textarea value={keyObs} onChange={(e)=>setKeyObs(e.target.value)} placeholder="Key observations (bullets)" rows={4} style={{ padding: 10 }} />
        <textarea value={watchItems} onChange={(e)=>setWatchItems(e.target.value)} placeholder="Watch items / questions" rows={3} style={{ padding: 10 }} />
        <textarea value={sources} onChange={(e)=>setSources(e.target.value)} placeholder="Sources (one URL per line)" rows={3} style={{ padding: 10 }} />

        <button className="save-btn" onClick={save}>Save Brief</button>
        <div>{savedMsg}</div>
      </div>

      <h4 className ="brief-h4">Saved Briefs</h4>
      {!notes.length && <div>No briefs yet.</div>}
      {notes.map(n => (
        <div key={n._id} style={{ border: "1px solid #ddd", padding: 12, marginTop: 10 }}>
          <b>{n.title}</b>
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
  );
}