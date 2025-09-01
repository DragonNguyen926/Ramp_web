import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* === Simplified Theme Matching MeetTheCrew === */
function FuturisticTheme() {
  return (
    <style>{`
:root {
  --bg: #0B0F1A;
  --text: #FFFFFF;
  --muted: rgba(255,255,255,0.8);
  --brand-1: #3B82F6;
  --brand-2: #22D3EE;
  --accent: #22D3EE;
  --glass-border: rgba(255,255,255,0.1);
  --btn-bg-1: #3B82F6;
  --btn-bg-2: #8B5CF6;
  --btn-shadow: rgba(59,130,246,0.3);
  --chip-bg: rgba(34,211,238,0.1);
  --line: #22D3EE;
  --star: rgba(255,255,255,0.8);
  --code-rain: #22D3EE;
  --scroll-dot: #22D3EE;
  --gold-1: #f5d67b;
  --gold-2: #caa85a;
}

:root[data-theme="monochrome"] {
  --bg: #0A0A0A;
  --text: #FFFFFF;
  --muted: rgba(255,255,255,0.7);
  --brand-1: #CCCCCC;
  --brand-2: #999999;
  --accent: #FFFFFF;
  --glass-border: rgba(255,255,255,0.15);
  --btn-bg-1: #333333;
  --btn-bg-2: #666666;
  --btn-shadow: rgba(0,0,0,0.4);
  --chip-bg: rgba(255,255,255,0.1);
  --line: #FFFFFF;
  --star: rgba(255,255,255,0.9);
  --code-rain: #FFFFFF;
  --scroll-dot: #FFFFFF;
  --gold-1: #FFFFFF;
  --gold-2: #CCCCCC;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(11, 15, 26, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid var(--glass-border);
}

.nav-brand {
  font-weight: 900;
  font-size: 1.5rem;
}

.nav-logo {
  color: var(--gold-1);
  text-shadow: 0 0 8px rgba(202, 168, 90, 0.25);
  transition: all 0.4s ease;
}

.nav-logo:hover {
  background: linear-gradient(45deg, var(--brand-1), var(--brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--muted);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--chip-bg);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-link:hover {
  color: var(--accent);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  background: transparent;
  border: none;
  cursor: pointer;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: var(--accent);
  margin: 3px 0;
  transition: 0.3s;
  border-radius: 2px;
}

/* Main Content */
.wrapper {
  padding: 120px 24px 80px;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Typography */
.h1 {
  font-size: clamp(3.5rem, 10vw, 8rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-bottom: 16px;
  color: var(--gold-1);
  text-shadow: 
    0 0 15px rgba(255, 215, 0, 1),
    0 0 30px rgba(255, 215, 0, 0.9),
    0 0 45px rgba(255, 215, 0, 0.8);
  animation: starBlink 1.8s infinite ease-in-out;
  cursor: pointer;
}

:root[data-theme="monochrome"] .h1 {
  color: var(--gold-1);
  text-shadow: 
    0 0 15px rgba(255, 255, 255, 0.7),
    0 0 30px rgba(255, 255, 255, 0.5),
    0 0 45px rgba(255, 255, 255, 0.3);
}

@keyframes starBlink {
  0%, 100% {
    opacity: 1;
    text-shadow: 
      0 0 30px rgba(255,215,0,1),
      0 0 60px rgba(255,215,0,0.9);
  }
  50% {
    opacity: 0.7;
    text-shadow: 
      0 0 60px rgba(255,215,0,1),
      0 0 100px rgba(255,215,0,1);
  }
}

.sub {
  color: var(--text-secondary);
  font-size: clamp(20px, 3vw, 28px);
  max-width: 800px;
  margin: 0 auto 40px;
  line-height: 1.6;
  font-weight: 400;
}

/* Toolbar */
.toolbar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  padding: 32px;
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

@media (min-width: 768px) {
  .toolbar {
    grid-template-columns: 2fr 220px 180px;
    align-items: center;
  }
}

.input, .select {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid var(--glass-border);
  color: var(--text);
  border-radius: 12px;
  padding: 16px 20px;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.input::placeholder {
  color: var(--muted);
  font-weight: 400;
}

.input:focus, .select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
}

.select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2322D3EE' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 20px center;
  background-size: 20px;
  padding-right: 56px;
  appearance: none;
  cursor: pointer;
}

.btn {
  background: linear-gradient(45deg, var(--btn-bg-1), var(--btn-bg-2));
  border: none;
  color: white;
  padding: 16px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px var(--btn-shadow);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px var(--btn-shadow);
}

/* Grid and Cards */
.grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  border-color: rgba(34, 211, 238, 0.3);
  box-shadow: 0 30px 60px rgba(34, 211, 238, 0.2);
}

.row {
  display: flex;
  gap: 20px;
  align-items: center;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: linear-gradient(45deg, var(--btn-bg-1), var(--btn-bg-2));
  display: grid;
  place-items: center;
  font-weight: 900;
  color: white;
  font-size: 28px;
  flex-shrink: 0;
}

.name {
  font-weight: 600;
  font-size: 22px;
  color: var(--accent);
  margin-bottom: 4px;
}

.meta {
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  opacity: 0.8;
}

.bio {
  color: var(--muted);
  font-size: 16px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty {
  margin-top: 24px;
  border: 3px dashed rgba(34, 211, 238, 0.3);
  padding: 60px 40px;
  border-radius: 16px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  grid-column: 1 / -1;
  backdrop-filter: blur(20px);
}

/* Modal */
.modalScrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  width: min(900px, 95%);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modalHd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  border-bottom: 1px solid var(--glass-border);
}

.modalBd {
  display: grid;
  gap: 32px;
  padding: 32px;
}

@media (min-width: 900px) {
  .modalBd {
    grid-template-columns: 240px 1fr;
  }
}

.close {
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 24px;
  font-weight: 900;
}

.close:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

.bigAvatar {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  background: linear-gradient(45deg, var(--btn-bg-1), var(--btn-bg-2));
  display: grid;
  place-items: center;
  font-size: 64px;
  font-weight: 900;
  margin: 0 auto;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    background: rgba(11, 15, 26, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 1rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-links.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-toggle {
    display: flex;
  }
  
  .wrapper {
    padding: 100px 16px 60px;
  }
  
  .toolbar {
    padding: 24px;
  }
  
  .modalBd {
    padding: 24px;
    gap: 24px;
  }
  
  .bigAvatar {
    width: 150px;
    height: 150px;
    font-size: 48px;
  }
}
`}</style>
  );
}

export default function RampCrew() {
  /* ----- THEME (same simple behavior as MeetTheCrew) ----- */
  const [theme, setTheme] = useState("aurora");
  
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const t = saved === "monochrome" ? "monochrome" : "aurora";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);
  
  const cycleTheme = () => {
    const next = theme === "aurora" ? "monochrome" : "aurora";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  /* ----- NAV ----- */
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  /* ----- DATA ----- */
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const API_BASE = useMemo(() => {
    const base = import.meta?.env?.VITE_API_URL || "http://localhost:5174";
    return base.endsWith("/") ? base.slice(0, -1) : base;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/members`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map((m, i) => ({
          id: m.id ?? i,
          name: m.display_name ?? m.name ?? m.first_name ?? "Unnamed",
          role: m.position ?? "",
          major: m.display_group ?? m.group_name ?? "",
          bio: m.bio ?? "",
          initials: ((m.display_name ?? m.name ?? "U N").split(" ").map(p => p[0]).slice(0,2).join("") || "UN"),
        }));
        setRows(normalized);
      } catch (e) {
        console.error("[RampCrew] fetch error", e);
        setRows([]);
      }
    })();
  }, [API_BASE]);

  const roles = useMemo(
    () => Array.from(new Set(rows.map(r => r.role).filter(Boolean))).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(m => {
      const inText =
        q === "" ||
        m.name.toLowerCase().includes(q) ||
        (m.major || "").toLowerCase().includes(q) ||
        (m.bio || "").toLowerCase().includes(q);
      const inRole = roleFilter === "" || m.role === roleFilter;
      return inText && inRole;
    });
  }, [rows, query, roleFilter]);

  /* ----- Modal ----- */
  const [selected, setSelected] = useState(null);
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    setTimeout(() => {
      modalRef.current?.querySelector('button,[href],[tabindex]:not([tabindex="-1"])')?.focus();
    }, 0);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [selected]);

  return (
    <>
      <FuturisticTheme />
      
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-logo">RAMP</span>
        </div>
        <div className={`nav-links ${navOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link" onClick={closeNav}>Home</Link>
          <Link to="/meet-the-crew" className="nav-link" onClick={closeNav}>Meet the Crew</Link>
          <Link to="/ramp-crew" className="nav-link" onClick={closeNav}>Members Profile</Link>
        </div>
        <button className="nav-toggle" onClick={() => setNavOpen(v => !v)} aria-label="Toggle navigation">
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* HERO with theme switch */}
      <div className="wrapper">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h1 
              className="h1" 
              onClick={cycleTheme}
              style={{ cursor: "pointer" }}
              title="Click to change theme"
            >
              RAMP
            </h1>
            <p className="sub" style={{ textAlign: "center", marginTop: "8px" }}>
              RoadRunner Advancing Modern Programming.
            </p>
          </div>

          <div className="toolbar" role="region" aria-label="Crew filters">
            <input
              className="input"
              placeholder="Search by name, group, bio…"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              aria-label="Search crew"
            />
            <select
              className="select"
              value={roleFilter}
              onChange={(e)=>setRoleFilter(e.target.value)}
              aria-label="Filter by role"
            >
              <option value="">All roles</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button className="btn" onClick={()=>{ setQuery(""); setRoleFilter(""); }}>
              Clear
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <strong>No matches.</strong> Try a different search or clear filters.
            </div>
          ) : (
            <div className="grid" aria-live="polite">
              {filtered.map((m, index) => (
                <article
                  key={m.id}
                  className="card"
                  tabIndex={0}
                  role="button"
                  onClick={()=>setSelected(m)}
                  onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setSelected(m); } }}
                  aria-label={`View ${m.name}`}
                >
                  <div className="row">
                    <div className="avatar" aria-hidden>{m.initials}</div>
                    <div>
                      <div className="name">{m.name}</div>
                      <div className="meta">
                        {m.role}{m.major ? ` • ${m.major}` : ""}
                      </div>
                    </div>
                  </div>
                  {m.bio && <p className="bio">{m.bio}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="modalScrim"
          role="dialog"
          aria-modal="true"
          aria-labelledby="crew-name"
          onClick={()=>setSelected(null)}
        >
          <div className="modal" onClick={(e)=>e.stopPropagation()} ref={modalRef}>
            <div className="modalHd">
              <h2 id="crew-name" className="name" style={{ margin: 0 }}>
                {selected.name}
              </h2>
              <button className="close" onClick={()=>setSelected(null)} aria-label="Close">×</button>
            </div>
            <div className="modalBd">
              <aside>
                <div className="bigAvatar" aria-hidden>{selected.initials}</div>
              </aside>
              <section>
                <p className="meta" style={{ marginBottom: "16px" }}>
                  {selected.role}{selected.major ? ` • ${selected.major}` : ""}
                </p>
                {selected.bio && <p className="bio" style={{ fontSize: "16px", lineHeight: "1.6" }}>{selected.bio}</p>}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}