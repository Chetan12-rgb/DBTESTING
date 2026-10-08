'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ username: '', email: '', requirement: '' });
  const [submissions, setSubmissions] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch entries from backend
  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      const json = await res.json();
      if (json.success) setSubmissions(json.data);
    } catch (err) {
      console.error('Failed to load data', err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Submit entry to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Transmitting data to TiDB...');

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus('Success! Data saved to TiDB Cloud.');
        setFormData({ username: '', email: '', requirement: '' });
        fetchSubmissions(); // Refresh stored list
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (err) {
      setStatus('Network Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-emerald-400">Database Connection Practice</h1>
      <p className="text-slate-400 text-sm mb-6">Testing Next.js API Routes + TiDB Cloud MySQL Driver</p>

      {/* Form Submission Block */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 mb-8">
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Username</label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="john_doe"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Requirement</label>
          <textarea
            rows="3"
            value={formData.requirement}
            onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="Database requirements..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 font-medium py-2 px-4 rounded text-slate-950 transition-colors text-sm"
        >
          {loading ? 'Processing...' : 'Send to Database'}
        </button>

        {status && <p className="text-xs font-mono text-emerald-400 mt-2">{status}</p>}
      </form>

      {/* Stored Entries Table Block */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4 text-slate-200">Live Entries in Database</h2>
        {submissions.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono">No records found yet.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-3 bg-slate-950 border border-slate-800 rounded text-xs font-mono">
                <p className="text-emerald-400 font-semibold">{sub.username} ({sub.email})</p>
                <p className="text-slate-300 mt-1">{sub.requirement}</p>
                <span className="text-[10px] text-slate-500">{new Date(sub.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

