import { useState } from 'react';
import SectionHeader from './SectionHeader';
import Button from '../ui/Button';
import { QUERY_MODES, buildDocumentIntelligencePrompt } from '../../constants/documentIntelligencePrompt';

export default function DocumentIntelligenceSection({ onAppendToNotes }) {
  const [mode, setMode] = useState(QUERY_MODES[0].value);
  const [query, setQuery] = useState('');
  const [retrievedDocs, setRetrievedDocs] = useState('');
  const [builtPrompt, setBuiltPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleBuild = () => {
    if (!query.trim()) return;
    setBuiltPrompt(buildDocumentIntelligencePrompt(query.trim(), retrievedDocs.trim(), mode));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!builtPrompt) return;
    try {
      await navigator.clipboard.writeText(builtPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API not available — silently skip
    }
  };

  const handleAppend = () => {
    if (builtPrompt && onAppendToNotes) {
      onAppendToNotes(builtPrompt);
    }
  };

  const handleClear = () => {
    setQuery('');
    setRetrievedDocs('');
    setBuiltPrompt('');
    setCopied(false);
  };

  return (
    <div className="plan-section mb-6 no-print">
      <SectionHeader>Document Intelligence</SectionHeader>

      {/* Mode selector */}
      <div className="mb-3">
        <label htmlFor="doc-intel-mode" className="text-sm font-semibold text-gray-700 block mb-1">
          Query Mode
        </label>
        <select
          id="doc-intel-mode"
          value={mode}
          onChange={e => { setMode(e.target.value); setBuiltPrompt(''); }}
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white"
        >
          {QUERY_MODES.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* User query */}
      <div className="mb-3">
        <label htmlFor="doc-intel-query" className="text-sm font-semibold text-gray-700 block mb-1">
          Your Question or Request
        </label>
        <textarea
          id="doc-intel-query"
          value={query}
          onChange={e => setQuery(e.target.value)}
          rows={3}
          placeholder={
            mode === 'question'
              ? 'e.g. What cable size is specified for circuit CB-12A in the cable schedule?'
              : mode === 'summary'
              ? 'e.g. Summarize the grounding requirements from the substation civil drawings.'
              : 'e.g. Compare the one-line diagram and the relay settings package for transformer T1.'
          }
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white resize-y"
        />
      </div>

      {/* Retrieved document passages */}
      <div className="mb-3">
        <label htmlFor="doc-intel-retrieved" className="text-sm font-semibold text-gray-700 block mb-1">
          Retrieved Document Passages{' '}
          <span className="text-gray-400 font-normal">(paste text extracted from project documents)</span>
        </label>
        <textarea
          id="doc-intel-retrieved"
          value={retrievedDocs}
          onChange={e => setRetrievedDocs(e.target.value)}
          rows={6}
          placeholder="Paste extracted text or OCR output from the relevant construction documents here…"
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white resize-y font-mono text-sm"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap mb-3">
        <Button
          variant="primary"
          onClick={handleBuild}
          disabled={!query.trim()}
        >
          Build Prompt
        </Button>
        {(query || retrievedDocs || builtPrompt) && (
          <Button variant="ghost" onClick={handleClear}>
            Clear
          </Button>
        )}
      </div>

      {/* Built prompt output */}
      {builtPrompt && (
        <div className="mt-2">
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            AI-Ready Prompt{' '}
            <span className="text-gray-400 font-normal">(copy into your AI assistant or document intelligence tool)</span>
          </label>
          <textarea
            value={builtPrompt}
            readOnly
            rows={12}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50 resize-y font-mono"
          />
          <div className="flex gap-2 flex-wrap mt-2">
            <Button variant="secondary" onClick={handleCopy}>
              {copied ? '✓ Copied!' : '📋 Copy Prompt'}
            </Button>
            <Button variant="success" onClick={handleAppend}>
              + Append to Notes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
