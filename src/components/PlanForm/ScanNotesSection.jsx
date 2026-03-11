import { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import SectionHeader from './SectionHeader';
import Button from '../ui/Button';

export default function ScanNotesSection({ onAppendToNotes }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [scannedText, setScannedText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | processing | done | error
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processImage = async (file) => {
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
    setScannedText('');
    setStatus('processing');
    setProgress(0);

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      setScannedText(text.trim());
      setStatus('done');
    } catch (err) {
      console.error('OCR error:', err);
      setStatus('error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
    e.target.value = '';
  };

  const handleClear = () => {
    setImageUrl(null);
    setScannedText('');
    setStatus('idle');
    setProgress(0);
  };

  const handleAppend = () => {
    if (scannedText) {
      onAppendToNotes(scannedText);
    }
  };

  return (
    <div className="plan-section mb-6">
      <SectionHeader>Scan Physical Notes</SectionHeader>

      {/* Capture buttons */}
      <div className="flex gap-3 flex-wrap no-print">
        {/* Camera capture — on mobile opens camera; on desktop opens file picker */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="primary"
          onClick={() => cameraInputRef.current?.click()}
          disabled={status === 'processing'}
        >
          📷 Take Photo
        </Button>

        {/* File upload — always opens gallery/file picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={status === 'processing'}
        >
          🖼 Upload Image
        </Button>

        {(imageUrl || scannedText) && (
          <Button variant="ghost" onClick={handleClear} disabled={status === 'processing'}>
            Clear
          </Button>
        )}
      </div>

      {/* Image preview */}
      {imageUrl && (
        <div className="mt-3 no-print">
          <img
            src={imageUrl}
            alt="Captured notes"
            className="max-h-48 rounded-md border border-gray-300 object-contain bg-gray-50"
          />
        </div>
      )}

      {/* Processing indicator */}
      {status === 'processing' && (
        <div className="mt-3 no-print">
          <div className="flex items-center gap-2 text-sm text-blue-800 font-semibold">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Reading text… {progress > 0 ? `${progress}%` : ''}
          </div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-700 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <p className="mt-3 text-sm text-red-600 font-medium no-print">
          Could not read the image. Try a clearer photo with good lighting.
        </p>
      )}

      {/* Scanned text output */}
      {(status === 'done' || scannedText) && (
        <div className="mt-4">
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Scanned Text <span className="text-gray-400 font-normal">(edit as needed)</span>
          </label>
          <textarea
            value={scannedText}
            onChange={e => setScannedText(e.target.value)}
            rows={5}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white resize-y"
            placeholder="Scanned text will appear here…"
          />
          <div className="mt-2 no-print">
            <Button variant="success" onClick={handleAppend}>
              + Append to Notes
            </Button>
          </div>
        </div>
      )}

      {/* Print view — just show the scanned text as static content */}
      {scannedText && (
        <div className="hidden print:block mt-2">
          <p className="text-xs font-semibold text-gray-500 mb-1">Scanned Notes:</p>
          <p className="text-sm whitespace-pre-wrap">{scannedText}</p>
        </div>
      )}
    </div>
  );
}
