import { useState } from 'react';
import Button from '../ui/Button';
import { getCompanyName, setCompanyName } from '../../utils/storage';

export default function Header({ view, onNewPlan, onShowSaved, onPrint }) {
  const [editing, setEditing] = useState(false);
  const [company, setCompany] = useState(getCompanyName);
  const [draft, setDraft] = useState('');

  const startEdit = () => {
    setDraft(company);
    setEditing(true);
  };

  const saveEdit = () => {
    setCompanyName(draft);
    setCompany(draft);
    setEditing(false);
  };

  return (
    <header className="no-print bg-blue-900 text-white shadow-md">
      <div className="max-w-2xl mx-auto px-4 py-3 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false); }}
                  placeholder="Enter company name..."
                  className="text-sm font-semibold bg-blue-800 border border-blue-400 rounded px-2 py-1 text-white placeholder-blue-300 focus:outline-none focus:ring-1 focus:ring-white w-48"
                />
                <button onClick={saveEdit} className="text-xs bg-white text-blue-900 px-2 py-1 rounded font-bold">Save</button>
                <button onClick={() => setEditing(false)} className="text-xs text-blue-300 hover:text-white">Cancel</button>
              </div>
            ) : (
              <button onClick={startEdit} className="text-left group" title="Click to set company name">
                {company ? (
                  <span className="text-sm font-semibold text-blue-200 group-hover:text-white transition-colors">{company}</span>
                ) : (
                  <span className="text-xs text-blue-400 group-hover:text-blue-200 transition-colors italic">+ Set company name</span>
                )}
              </button>
            )}
            <h1 className="text-xl font-extrabold tracking-tight leading-tight">Plan of the Day</h1>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="secondary" onClick={onPrint} className="text-xs px-3 py-1.5">
              🖨 Print
            </Button>
          </div>
        </div>
        <nav className="flex gap-2 mt-1">
          <button
            onClick={onNewPlan}
            className={`text-sm px-3 py-1 rounded-md font-semibold transition-colors ${view === 'form' ? 'bg-white text-blue-900' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
          >
            New Plan
          </button>
          <button
            onClick={onShowSaved}
            className={`text-sm px-3 py-1 rounded-md font-semibold transition-colors ${view === 'list' ? 'bg-white text-blue-900' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
          >
            Saved Plans
          </button>
        </nav>
      </div>
    </header>
  );
}
