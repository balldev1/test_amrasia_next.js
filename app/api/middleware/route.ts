import jwt from "jsonwebtoken";

// ตรวจสอบ token
export async function authenticate(req: any) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  if (!match) throw new Error("Unauthorized");

  const token = match[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload; // { userId, username, iat, exp }
  } catch {
    throw new Error("Invalid token");
  }
}
