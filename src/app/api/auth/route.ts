import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "ADMIN_TOKEN belum diset di server." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { token?: string };
  const valid = body.token === token;

  return NextResponse.json({ valid }, { status: valid ? 200 : 401 });
}
