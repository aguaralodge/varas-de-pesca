export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const ANON = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !ANON) return res.status(500).json({ error: "Missing env vars" });

  const url = `${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`;

  const r = await fetch(url, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` }
  });

  const j = await r.json();
  if (!r.ok) return res.status(500).json({ error: "Supabase error", detail: j });

  res.status(200).json(j);
}
