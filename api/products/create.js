module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AGUARA25";
    const provided = req.headers["x-admin-password"];
    if (provided !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return res.status(500).json({
        error: "Missing env vars",
        haveUrl: !!SUPABASE_URL,
        haveService: !!SERVICE_KEY,
      });
    }

    const body = await readJson(req);
    const { name, price, stock, category, description, imageBase64, imageMime } = body;

    if (!name) return res.status(400).json({ error: "Missing name" });

    let image_path = null;
    let image_url = null;

    // ---- 1) Upload imagen a Storage (bucket: product-images) ----
    if (imageBase64 && imageMime) {
      const bytes = Buffer.from(imageBase64, "base64");
      const ext = mimeToExt(imageMime);
      image_path = `products/${Date.now()}-${safeSlug(name)}.${ext}`;

      const storageUrl = `${SUPABASE_URL}/storage/v1/object/product-images/${image_path}`;

      const uploadResp = await fetch(storageUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          apikey: SERVICE_KEY,
          "Content-Type": imageMime,
          "x-upsert": "true",
        },
        body: bytes,
      });

      if (!uploadResp.ok) {
        const t = await uploadResp.text();
        return res.status(500).json({
          error: "Upload failed",
          status: uploadResp.status,
          detail: t,
          storageUrl,
          bucket: "product-images",
        });
      }

      image_url = `${SUPABASE_URL}/storage/v1/object/public/product-images/${image_path}`;
    }

    // ---- 2) Insert producto en DB ----
    const insertResp = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify([
        {
          name,
          price: Number(price || 0),
          stock: Number(stock || 0),
          category: category || null,
          description: description || null,
          image_path,
          image_url,
        },
      ]),
    });

    const text = await insertResp.text();
    let insertJson;
    try {
      insertJson = JSON.parse(text);
    } catch {
      insertJson = text;
    }

    if (!insertResp.ok) {
      return res.status(500).json({
        error: "Insert failed",
        status: insertResp.status,
        detail: insertJson,
      });
    }

    return res.status(200).json({ ok: true, product: insertJson[0] });
  } catch (e) {
    return res.status(500).json({ error: "Function crashed", detail: String(e) });
  }
};

function mimeToExt(mime) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/jpeg") return "jpg";
  return "jpg";
}

function safeSlug(s) {
  return (s || "product")
    .toLowerCase()
    .normalize("NFD") // saca acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (e) {
        reject(e);
      }
    });
  });
}

