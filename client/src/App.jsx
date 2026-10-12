import { useEffect, useState, useCallback } from 'react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];
const empty = { company: '', role: '', status: 'Applied', link: '', notes: '' };

async function api(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(API + path, {
    method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || 'Request failed'), { status: res.status });
  return data;
}

function Auth({ onAuth }) {
  const [mode, setMode] = useState('login'), [f, setF] = useState({ name: '', email: '', password: '' }), [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { onAuth(await api(`/api/auth/${mode}`, { method: 'POST', body: f })); } catch (x) { setErr(x.message); }
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form className="card auth" onSubmit={submit}>
      <h1>JobTrack</h1><p className="muted">Track every application in one place.</p>
      {mode === 'register' && <input placeholder="Name" value={f.name} onChange={set('name')} />}
      <input type="email" placeholder="Email" required value={f.email} onChange={set('email')} />
      <input type="password" placeholder="Password (6+ chars)" required value={f.password} onChange={set('password')} />
      {err && <p className="error">{err}</p>}
      <button>{mode === 'login' ? 'Log in' : 'Create account'}</button>
      <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'New here? Register' : 'Have an account? Log in'}</button>
    </form>
  );
}

function Dashboard({ session, onLogout }) {
  const { token, user } = session;
  const [jobs, setJobs] = useState([]), [stats, setStats] = useState({}), [status, setStatus] = useState(''), [q, setQ] = useState('');
  const [form, setForm] = useState(empty), [editId, setEditId] = useState(null), [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      const qs = new URLSearchParams({ ...(status && { status }), ...(q && { q }) });
      const [j, s] = await Promise.all([api(`/api/jobs?${qs}`, { token }), api('/api/jobs/stats', { token })]);
      setJobs(j); setStats(s);
    } catch (x) { x.status === 401 ? onLogout() : setErr(x.message); }
  }, [token, status, q, onLogout]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const save = async (e) => {
    e.preventDefault(); setErr('');
    try {
      await api(editId ? `/api/jobs/${editId}` : '/api/jobs', { method: editId ? 'PUT' : 'POST', body: form, token });
      setForm(empty); setEditId(null); load();
    } catch (x) { setErr(x.message); }
  };
  const changeStatus = async (j, s) => { await api(`/api/jobs/${j._id}`, { method: 'PUT', body: { ...j, status: s }, token }); load(); };
  const remove = async (id) => { if (confirm('Delete this application?')) { await api(`/api/jobs/${id}`, { method: 'DELETE', token }); load(); } };
  const edit = (j) => { setEditId(j._id); setForm({ company: j.company, role: j.role, status: j.status, link: j.link || '', notes: j.notes || '' }); window.scrollTo(0, 0); };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <main>
      <header><h1>JobTrack</h1><span>{user.name || user.email} <button className="link" onClick={onLogout}>Log out</button></span></header>
      <section className="stats">{STATUSES.map((s) => <div key={s} className={`stat ${s}`}><b>{stats[s] ?? 0}</b>{s}</div>)}</section>
      <form className="card grid" onSubmit={save}>
        <input placeholder="Company *" required value={form.company} onChange={set('company')} />
        <input placeholder="Role *" required value={form.role} onChange={set('role')} />
        <select value={form.status} onChange={set('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <input placeholder="Job link" value={form.link} onChange={set('link')} />
        <input className="wide" placeholder="Notes" value={form.notes} onChange={set('notes')} />
        <button>{editId ? 'Update' : 'Add application'}</button>
        {editId && <button type="button" className="link" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
      </form>
      {err && <p className="error">{err}</p>}
      <div className="filters">
        <input placeholder="Search company or role" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      {jobs.length === 0 && <p className="muted">No applications yet. Add your first one above.</p>}
      {jobs.map((j) => (
        <article className="card job" key={j._id}>
          <div><h3>{j.role}</h3><p>{j.company} · <span className="muted">{new Date(j.appliedOn).toLocaleDateString()}</span></p>
            {j.notes && <p className="muted">{j.notes}</p>}{j.link && <a href={j.link} target="_blank" rel="noreferrer">View posting</a>}</div>
          <div className="actions">
            <select className={`badge ${j.status}`} value={j.status} onChange={(e) => changeStatus(j, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            <button className="link" onClick={() => edit(j)}>Edit</button><button className="link danger" onClick={() => remove(j._id)}>Delete</button>
          </div>
        </article>
      ))}
    </main>
  );
}

export default function App() {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('jobtrack') || 'null'));
  const login = (s) => { localStorage.setItem('jobtrack', JSON.stringify(s)); setSession(s); };
  const logout = useCallback(() => { localStorage.removeItem('jobtrack'); setSession(null); }, []);
  return session ? <Dashboard session={session} onLogout={logout} /> : <Auth onAuth={login} />;
}
