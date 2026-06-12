import { NextResponse } from "next/server";
import { getAppConfig, updateAppConfig } from "@/lib/store";

export const dynamic = "force-dynamic";

function requireAdminToken(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) throw new Error("Unauthorized. ADMIN_TOKEN env belum diset di server.");
  const auth = request.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ") || auth.slice(7) !== token) throw new Error("Unauthorized.");
}

export async function GET(request: Request) {
  try {
    requireAdminToken(request);
    const config = await getAppConfig();
    // Mask sensitive key for response
    if (config.dokuSecretKey) {
      config.dokuSecretKey = config.dokuSecretKey.slice(0, 8) + "****" + config.dokuSecretKey.slice(-4);
    }
    return NextResponse.json({ config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil config.";
    const status = message.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    requireAdminToken(request);
    const body = (await request.json()) as {
      dokuEnabled?: boolean;
      manualEnabled?: boolean;
      dokuClientId?: string;
      dokuSecretKey?: string;
      dokuBaseUrl?: string;
      qrisUrl?: string;
      manualInstructions?: string;
    };
    // Only update secret key if not masked
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (key === "dokuSecretKey" && typeof value === "string" && value.includes("****")) continue;
      updates[key] = value;
    }
    const config = await updateAppConfig(updates as Parameters<typeof updateAppConfig>[0]);
    if (config.dokuSecretKey) {
      config.dokuSecretKey = config.dokuSecretKey.slice(0, 8) + "****" + config.dokuSecretKey.slice(-4);
    }
    return NextResponse.json({ config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal update config.";
    const status = message.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
