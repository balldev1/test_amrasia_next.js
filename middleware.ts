// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ดึง cookie ชื่อ jwt
  const token = req.cookies.get("token")?.value;

  // ถ้าไม่มี token แล้วเปิดหน้าอื่นที่ไม่ใช่ /login
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ถ้ามี token แล้วเปิดหน้า /login
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // อื่น ๆ ให้ผ่าน
  return NextResponse.next();
}

// บอก next ว่า middleware นี้จะรันกับ path ไหนบ้าง
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
