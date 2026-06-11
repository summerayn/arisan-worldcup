import { NextResponse } from "next/server";
import { getPublicState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPublicState());
}
