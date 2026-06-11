import { NextResponse } from "next/server";
import { getReadiness } from "@/lib/readiness";
import { getPublicState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getPublicState();
    return NextResponse.json(getReadiness());
  } catch (error) {
    return NextResponse.json(
      {
        ...getReadiness(),
        ready: false,
        error: error instanceof Error ? error.message : "Readiness check gagal.",
      },
      { status: 503 },
    );
  }
}
