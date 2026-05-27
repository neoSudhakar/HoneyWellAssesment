import { useState } from 'react';
import { verifyFile } from '../api';
import { computeSha256Hex } from '../utils/sha256';

export default function FileUpload({ onVerified }) {
  const [file, setFile] = useState(null);
  const [digest, setDigest] = useState('');
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = async (selected) => {
    setFile(selected);
    setDigest('');
    setState('idle');
    setMessage('');

    if (!selected) return;

    setState('computing');
    try {
      const hash = await computeSha256Hex(selected);
      setDigest(hash);
      setState('idle');
      setMessage('SHA-256 computed in browser. Click Verify & Upload to validate with the server.');
    } catch {
      setState('error');
      setMessage('Failed to compute SHA-256 in the browser.');
    }
  };

  const handleUpload = async () => {
    if (!file || !digest) return;

    setState('uploading');
    setMessage('Verifying file hash with server…');

    try {
      const result = await verifyFile(file, digest);
      if (result.valid) {
        setState('success');
        setMessage(`${result.message} Loaded ${result.movements?.length ?? 0} records.`);
        onVerified();
      } else {
        setState('error');
        setMessage(result.message);
      }
    } catch {
      setState('error');
      setMessage('Upload failed. Is the backend running on port 8080?');
    }
  };

  const statusClass =
    state === 'success' ? 'success' : state === 'error' ? 'error' : state !== 'idle' ? 'pending' : '';

  return (
    <section className="panel">
      <h2>JSON + SHA-256 Validation</h2>
      <div className="upload-row">
        <label>
          JSON file
          <input
            type="file"
            accept=".json,application/json"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || !digest || state === 'computing' || state === 'uploading'}
        >
          {state === 'uploading' ? 'Verifying…' : 'Verify & Upload'}
        </button>
      </div>
      {digest && (
        <p className="hash-preview">
          <strong>Computed SHA-256:</strong> {digest}
        </p>
      )}
      {message && <div className={`status ${statusClass}`}>{message}</div>}
    </section>
  );
}
