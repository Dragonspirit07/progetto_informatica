import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/jtw";
 
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:     "/",
    maxAge:   0, // cancella il cookie immediatamente
  });
  return response;
}
 