// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pg from 'pg';

const { Pool } = pg;

/** ---------- DB Pool (Neon usually needs SSL) ---------- */
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,        // e.g. postgres://USER:PASS@HOST:5432/DB?sslmode=require
  ssl: { rejectUnauthorized: false },                // okay for dev/Neon
});

/** ---------- App ---------- */
const app = express();
const PORT = Number(process.env.PORT || 5174);

/** Allow comma-separated origins: CORS_ORIGIN="http://localhost:5173,https://your-frontend.vercel.app" */
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow server-to-server (no origin) and any listed origin
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS blocked'), false);
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

/** ---------- Root ---------- */
app.get('/', (_req, res) => res.send('API is working 🚀'));

/** ---------- Liveness (for Render health check) ---------- */
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

/** ---------- Readiness (DB check) ---------- */
app.get('/readyz', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: rows[0].ok === 1 });
  } catch (e) {
    console.error('[READYZ]', e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

/** ---------- Members API ----------
 * Safe fields only.
 * Query:
 *   - status=active|pending|...
 *   - q=partial first_name match
 *   - team=group name (exact; case-insensitive). Use "All" to disable.
 *   - limit (default 100, max 500), offset (default 0)
 */
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

    params.push(limit);
    params.push(offset);

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
      LIMIT $${params.length - 1}
      OFFSET $${params.length}
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
});
