// app/api/admin/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from /api/admin/users" });
}
