import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Supabase client-side auth handles normal signup confirmation in this starter.
  // This route provides a safe landing URL for the configured email redirect.
  return NextResponse.redirect(new URL(code ? "/login?verified=1" : "/login", origin));
}
