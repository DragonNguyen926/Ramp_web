// server/index.js (or index.js if you moved it to repo root)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pg from 'pg';

const { Pool } = pg;

/** ---------- DB Pool ---------- */
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // postgres://USER:PASS@HOST:5432/DB?sslmode=require
  ssl: { rejectUnauthorized: false },        // OK for Neon/Render; set true only if you manage certs
});

/** ---------- App ---------- */
const app = express();
app.set('trust proxy', 1); // Render/Netlify behind proxy
const PORT = Number(process.env.PORT || 5174);

/** ---------- CORS ---------- */
// Accept comma-separated origins in CORS_ORIGIN (no trailing slashes).
// Also allow Netlify preview subdomains: https://<hash>--rampcsub.netlify.app
const normalize = (o) => (o || '').replace(/\/+$/, '');
const envOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => normalize(s.trim()))
  .filter(Boolean);

const isNetlifyPreview = (origin) =>
  /^https:\/\/[^.]+--rampcsub\.netlify\.app$/.test(normalize(origin));

const isAllowedOrigin = (origin) => {
  const o = normalize(origin);
  return !o || envOrigins.includes(o) || isNetlifyPreview(o);
};

const corsOptions = {
  origin(origin, cb) {
    if (isAllowedOrigin(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

app.use(cookieParser());
app.use(express.json());

/** ---------- Root ---------- */
app.get('/', (_req, res) => res.send('API is working 🚀'));

/** ---------- Health (Render) ---------- */
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

/** ---------- Readiness (DB check) ---------- */
app.get('/readyz', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT 1::int AS ok');
    res.json({ ok: true, db: Number(rows[0]?.ok) === 1 });
  } catch (e) {
    console.error('[READYZ]', e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

/** ---------- Members API ---------- */
app.get('/api/members', async (req, res) => {
  try {
    const { status, q, team } = req.query;

    let limit = parseInt(req.query.limit, 10);
    if (!Number.isFinite(limit) || limit <= 0) limit = 100;
    if (limit > 500) limit = 500;

    let offset = parseInt(req.query.offset, 10);
    if (!Number.isFinite(offset) || offset < 0) offset = 0;

    const where = [];
    const params = [];

    if (status) {
      params.push(String(status));
      where.push(`u.status = $${params.length}`);
    }

    if (q) {
      params.push(`%${String(q)}%`);
      where.push(`u.first_name ILIKE $${params.length}`);
    }

    if (team && String(team).toLowerCase() !== 'all') {
      params.push(String(team));
      where.push(`g.name ILIKE $${params.length}`);
    }

    // add limit + offset as the last params
    params.push(limit);
    params.push(offset);
    const limitIdx = params.length - 1;
    const offsetIdx = params.length;

    const sql = `
      SELECT
        u.id,
        u.first_name AS display_name,
        COALESCE(NULLIF(TRIM(u.position), ''), u.role, 'Member') AS position,
        g.name AS display_group,
        u.bio,
        u.created_at
      FROM public.users u
      LEFT JOIN public.groups g ON g.id = u.group_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY u.created_at DESC NULLS LAST, u.id DESC
      LIMIT $${limitIdx}
      OFFSET $${offsetIdx}
    `;

    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error('[DB_ERROR /api/members]', e);
    res.status(500).json({ error: 'DB_ERROR', detail: String(e) });
  }
});

/** ---------- 404 ---------- */
app.use((_req, res) => res.status(404).json({ error: 'NOT_FOUND' }));

/** ---------- Start ---------- */
app.listen(PORT, () => {
  console.log(`➡️  API listening on http://localhost:${PORT}`);
  console.log('CORS allowlist:', envOrigins.length ? envOrigins : '(empty; preview + no-origin allowed)');
});
