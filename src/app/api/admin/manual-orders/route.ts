import { NextResponse } from "next/server";
import { listPendingManualOrders, markOrderPaid } from "@/lib/store";

export const dynamic = "force-dynamic";

function requireAdminToken(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    throw new Error("Unauthorized. ADMIN_TOKEN env belum diset di server.");
  }
  const auth = request.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ") || auth.slice(7) !== token) {
    throw new Error("Unauthorized.");
  }
}

export async function GET(request: Request) {
  try {
    requireAdminToken(request);
    const orders = await listPendingManualOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data.";
    const status = message.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    requireAdminToken(request);
    const body = (await request.json()) as { orderId?: string };
    if (!body.orderId) {
      return NextResponse.json({ error: "orderId diperlukan." }, { status: 400 });
    }
    const participant = await markOrderPaid(body.orderId);
    return NextResponse.json({ ok: true, participant });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal approve pembayaran.";
    const status = message.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
