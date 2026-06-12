import { NextResponse } from "next/server";
import { createDokuCheckout } from "@/lib/doku";
import { createPendingOrder, deletePendingOrder, updateOrderPaymentUrl, getAppConfig } from "@/lib/store";

export const dynamic = "force-dynamic";

type JoinRequest = {
  name?: string;
  email?: string;
  mode?: "doku" | "manual";
};

function appOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      return configured.replace(/\/$/, "");
    }
  }
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as JoinRequest;
    const fallbackPaymentUrl = `${appOrigin(request)}/payment/__ORDER_ID__`;
    const config = await getAppConfig();

    // Validate mode is enabled
    const mode = body.mode ?? "doku";
    if (mode === "manual" && !config.manualEnabled) {
      return NextResponse.json({ error: "Pembayaran manual sedang dinonaktifkan." }, { status: 400 });
    }
    if (mode === "doku" && !config.dokuEnabled) {
      return NextResponse.json({ error: "Pembayaran DOKU sedang dinonaktifkan." }, { status: 400 });
    }

    // Manual payment
    if (mode === "manual") {
      const pending = await createPendingOrder({
        name: body.name ?? "",
        email: body.email ?? "",
        paymentUrl: fallbackPaymentUrl,
        provider: "manual",
      });
      return NextResponse.json({ order: pending.order, manual: true });
    }

    // DOKU checkout
    const pending = await createPendingOrder({
      name: body.name ?? "",
      email: body.email ?? "",
      paymentUrl: fallbackPaymentUrl,
    });
    const { order } = pending;

    try {
      const dokuPaymentUrl = await createDokuCheckout({
        orderId: order.id,
        name: order.name,
        email: order.email,
        clientIdOverride: config.dokuClientId || undefined,
        secretKeyOverride: config.dokuSecretKey || undefined,
        baseUrlOverride: config.dokuBaseUrl || undefined,
      });
      await updateOrderPaymentUrl(order.id, dokuPaymentUrl);
      order.paymentUrl = dokuPaymentUrl;
    } catch (error) {
      if (pending.created) {
        await deletePendingOrder(order.id);
      }
      throw error;
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal membuat order." },
      { status: 400 },
    );
  }
}
