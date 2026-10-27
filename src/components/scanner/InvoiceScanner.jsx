import React, { useState } from 'react';
import { supabase, isConfigured } from '../../supabase';

export default function InvoiceScanner() {
  const [file, setFile] = useState(null);
  const [supplierId, setSupplierId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Only PDF invoices are accepted.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      return;
    }
    setError('');
    setFile(f);
  };

  const scanInvoice = async () => {
    if (!isConfigured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
      return;
    }
    if (!file || !supplierId) {
      setError('Choose a PDF and enter a supplier ID.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to scan invoices.');
        setLoading(false);
        return;
      }

      const buffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

      const res = await fetch('http://localhost:3001/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ fileBuffer: base64, supplierId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h1 className="text-2xl font-bold mb-2 text-slate-800">Scan an invoice</h1>
        <p className="text-slate-500 mb-6">Upload a supplier PDF and compare it against a verified baseline.</p>

        {!isConfigured && (
          <p className="text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl text-sm mb-4">
            Supabase is not configured yet. Add your URL and anon key to .env.local and restart Vite.
          </p>
        )}

        <label className="block text-sm font-semibold mb-2">Supplier ID</label>
        <input
          type="text"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          placeholder="Paste the supplier UUID"
          className="w-full p-3 mb-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
        />

        <label className="block text-sm font-semibold mb-2">Invoice PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          className="w-full p-3 mb-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          onClick={scanInvoice}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-md transition disabled:opacity-50"
        >
          {loading ? 'Scanning...' : 'Scan Invoice'}
        </button>

        {result && (
          <div className={`mt-6 p-5 rounded-xl border ${result.riskLevel === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <h2 className="font-bold mb-2">Risk: {result.riskLevel}</h2>
            <p className="text-sm">Invoice account: <span className="font-mono">{result.invoiceAccount || 'Not found'}</span></p>
            <p className="text-sm">Verified account: <span className="font-mono">{result.expectedAccount}</span></p>
            <p className="text-sm mt-2"><strong>Action:</strong> {result.recommendedAction}</p>
            <p className="text-xs mt-2 text-slate-500">Case ref: {result.caseReference}</p>
          </div>
        )}
      </div>
    </div>
  );
}
