import { NextResponse } from "next/server";
import { getReadiness } from "@/lib/readiness";
import { getPublicState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = await getPublicState();
    return NextResponse.json(getReadiness(state.storage));
  } catch (error) {
    const readiness = getReadiness("memory");
    return NextResponse.json(
      {
        ...readiness,
        ready: false,
        error: error instanceof Error ? error.message : "Readiness check gagal.",
      },
      { status: 503 },
    );
  }
}
