// /api/login.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "Missing password" });

  if (password !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Set HttpOnly cookie valid for 1 hour
  const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
  res.setHeader(
    "Set-Cookie",
    `admin=1; HttpOnly; Path=/; Expires=${expires}; Secure; SameSite=Lax`
  );

  return res.status(200).json({ ok: true });
}
