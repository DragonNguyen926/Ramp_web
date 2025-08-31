// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pg from 'pg';

const { Pool } = pg;

/* ------------------------- DB POOL ------------------------- */
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,   // e.g. postgres://USER:PASS@HOST/neondb?sslmode=require
  ssl: { rejectUnauthorized: false },           // fine for Neon/dev
});

/* ------------------------- APP SETUP ----------------------- */
const app = express();
const PORT = Number(process.env.PORT || 5174);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

/* ------------------------- ROOT / HEALTH ------------------- */
app.get('/', (_req, res) => res.send('API is working 🚀'));

app.get('/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT now() AS now');
    res.json({ ok: true, now: rows[0].now });
  } catch (e) {
    console.error('[HEALTH]', e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

/* ------------------------- MEMBERS API --------------------- */
/**
 * Safe fields only; never return email/password.
 * Query params:
 *   - status=active|pending|...    (filters users.status)
 *   - q=<partial first_name match> (ILIKE)
 *   - limit=number                 (default 100, max 500)
 *
 * Returns:
 *   id, display_name, position, display_group (group name), bio, created_at
 */
app.get('/api/members', async (req, res) => {
  try {
    const { status, q } = req.query;

    // limit guardrails
    let lim = parseInt(req.query.limit, 10);
    if (!Number.isFinite(lim) || lim <= 0) lim = 100;
    if (lim > 500) lim = 500;

    // dynamic WHERE with params
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

    // LIMIT always last param
    params.push(lim);

    const sql = `
      SELECT
        u.id,
        u.first_name                  AS display_name,
        u.position,                                          -- 👈 free-text portfolio position
        COALESCE(g.name, '')          AS display_group,      -- 👈 human-friendly group name
        u.bio,
        u.created_at
      FROM public.users u
      LEFT JOIN public.groups g ON g.id = u.group_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY u.created_at DESC NULLS LAST, u.id DESC
      LIMIT $${params.length}
    `;

    const { rows } = await pool.query(sql, params);
    // never send sensitive fields
    res.json(rows);
  } catch (e) {
    console.error('[DB_ERROR /api/members]', e);
    res.status(500).json({ error: 'DB_ERROR', detail: String(e) });
  }
});

/* ------------------------- 404 FALLBACK -------------------- */
app.use((_req, res) => res.status(404).json({ error: 'NOT_FOUND' }));

/* ------------------------- START --------------------------- */
app.listen(PORT, () => {
  console.log(`➡️  API listening on http://localhost:${PORT}`);
});
