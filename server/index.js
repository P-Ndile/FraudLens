import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'module';
import 'dotenv/config';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const app = express();
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

const scanLimiter = rateLimit({ windowMs: 60_000, max: 20 });
const authLimiter = rateLimit({ windowMs: 60_000, max: 10 });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ---------- Auth middleware ----------
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid or expired token' });
  req.user = user;
  next();
}

// ---------- Health ----------
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'fraudlens', time: new Date().toISOString() }));

// ---------- Suppliers ----------
app.get('/api/suppliers', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('id, name, account_number, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ suppliers: data });
});

app.post('/api/suppliers', requireAuth, authLimiter, async (req, res) => {
  const { name, account_number } = req.body;
  if (!name || !account_number) return res.status(400).json({ error: 'name and account_number are required' });
  if (!/^[0-9]{6,20}$/.test(account_number)) return res.status(400).json({ error: 'account_number must be 6–20 digits' });

  const { data, error } = await supabase
    .from('suppliers')
    .insert({ user_id: req.user.id, name: name.slice(0, 120), account_number })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ supplier: data });
});

// ---------- Scans ----------
app.get('/api/scans', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('scans')
    .select('id, supplier_id, invoice_account, expected_account, mismatch_flagged, risk_level, has_urgent_language, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ scans: data });
});

app.post('/api/scan', scanLimiter, requireAuth, async (req, res) => {
  try {
    const { fileBuffer, supplierId } = req.body;
    if (!fileBuffer || !supplierId) return res.status(400).json({ error: 'Missing fileBuffer or supplierId' });

    // Confirm the supplier belongs to this user (defence in depth, in addition to RLS)
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers').select('*').eq('id', supplierId).eq('user_id', req.user.id).single();
    if (supplierError || !supplier) return res.status(404).json({ error: 'Verified supplier baseline not found' });

    // Parse PDF
    let textContent = '';
    try {
      const pdfData = await pdfParse(Buffer.from(fileBuffer, 'base64'));
      textContent = pdfData.text || '';
    } catch {
      return res.status(400).json({ error: 'Could not parse PDF. Upload a valid PDF file.' });
    }

    const accountMatch = textContent.match(/Account\s*(?:Number|No)?[:\s]*([0-9]{6,20})/i);
    const invoiceAccount = accountMatch ? accountMatch[1] : null;
    const hasUrgentLanguage = /urgent|immediate|audit|new bank account|verify now/i.test(textContent);

    const accountMismatch = invoiceAccount && invoiceAccount !== supplier.account_number;
    const riskLevel = (accountMismatch || hasUrgentLanguage) ? 'HIGH' : 'LOW';

    const { data: scanRecord, error: scanError } = await supabase
      .from('scans')
      .insert({
        user_id: req.user.id,
        supplier_id: supplierId,
        invoice_account: invoiceAccount,
        expected_account: supplier.account_number,
        mismatch_flagged: !!accountMismatch,
        risk_level: riskLevel,
        has_urgent_language: hasUrgentLanguage
      })
      .select()
      .single();
    if (scanError) throw scanError;

    res.json({
      success: true,
      riskLevel,
      mismatchFlagged: !!accountMismatch,
      hasUrgentLanguage,
      invoiceAccount,
      expectedAccount: supplier.account_number,
      caseReference: scanRecord.id,
      recommendedAction: accountMismatch
        ? 'Pause payment. Call supplier via a previously verified contact number.'
        : 'No mismatch detected. Still confirm via a trusted channel before paying.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scans/:id/verify', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { decision, notes } = req.body; // decision: 'approved' | 'rejected'
  if (!['approved', 'rejected'].includes(decision)) return res.status(400).json({ error: 'decision must be approved or rejected' });

  const { data, error } = await supabase
    .from('scans')
    .update({ verification_decision: decision, verification_notes: (notes || '').slice(0, 500), verified_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ scan: data });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('FraudLens Secure Backend running on port ' + PORT));
