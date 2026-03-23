module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AGUARA26";
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
    const { id } = body;

    if (!id) return res.status(400).json({ error: "Missing id" });

    // ---- 1) Traer producto actual para conocer imagen ----
    const currentResp = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=*`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        "Content-Type": "application/json",
      },
    });

    const currentText = await currentResp.text();
    let currentJson;
    try {
      currentJson = JSON.parse(currentText);
    } catch {
      currentJson = currentText;
    }

    if (!currentResp.ok) {
      return res.status(500).json({
        error: "Fetch current product failed",
        status: currentResp.status,
        detail: currentJson,
      });
    }

    const current = Array.isArray(currentJson) ? currentJson[0] : null;
    if (!current) return res.status(404).json({ error: "Product not found" });

    // ---- 2) Borrar imagen de Storage si existe ----
    if (current.image_path) {
      const deleteStorageResp = await fetch(`${SUPABASE_URL}/storage/v1/object/product-images/${current.image_path}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          apikey: SERVICE_KEY,
        },
      });

      if (!deleteStorageResp.ok) {
        const t = await deleteStorageResp.text();
        return res.status(500).json({
          error: "Storage delete failed",
          status: deleteStorageResp.status,
          detail: t,
          image_path: current.image_path,
        });
      }
    }

    // ---- 3) Borrar producto de DB ----
    const deleteResp = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    });

    const deleteText = await deleteResp.text();
    let deleteJson;
    try {
      deleteJson = JSON.parse(deleteText);
    } catch {
      deleteJson = deleteText;
    }

    if (!deleteResp.ok) {
      return res.status(500).json({
        error: "Delete failed",
        status: deleteResp.status,
        detail: deleteJson,
      });
    }

    return res.status(200).json({ ok: true, deleted: deleteJson[0] || { id } });
  } catch (e) {
    return res.status(500).json({ error: "Function crashed", detail: String(e) });
  }
};

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
