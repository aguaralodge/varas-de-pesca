module.exports = async function handler(req, res) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const ANON = process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !ANON) {
      return res.status(500).json({ error: "Missing env vars", haveUrl: !!SUPABASE_URL, haveAnon: !!ANON });
    }

    const url = `${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`;

    const r = await fetch(url, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
    });

    const text = await r.text();
    let j;
    try { j = JSON.parse(text); } catch { j = text; }

    if (!r.ok) return res.status(500).json({ error: "Supabase error", status: r.status, detail: j });

    return res.status(200).json(j);
  } catch (e) {
    return res.status(500).json({ error: "Function crashed", detail: String(e) });
  }
};
