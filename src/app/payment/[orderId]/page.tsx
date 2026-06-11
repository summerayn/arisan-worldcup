import Link from "next/link";
import { findOrder } from "@/lib/store";
import "./payment.css";

export const dynamic = "force-dynamic";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await findOrder(orderId);

  if (!order) {
    return (
      <main className="payment-shell">
        <section className="payment-card">
          <Link href="/" className="back-link">
            Back to dashboard
          </Link>
          <h1>Order tidak ditemukan</h1>
          <p>Order <strong>{orderId}</strong> tidak ada di database. Kembali ke dashboard dan daftar ulang.</p>
        </section>
      </main>
    );
  }

  const isPaid = order.status === "paid";

  return (
    <main className="payment-shell">
      <section className="payment-card">
        <div>
          <Link href="/" className="back-link">
            Back to dashboard
          </Link>
          <h1>{isPaid ? "Pembayaran berhasil" : "Pembayaran diproses"}</h1>
          <p>Order <strong>{orderId}</strong></p>
        </div>

        <div className="payment-detail">
          <span>Status</span>
          <strong data-status={order.status}>{order.status.toUpperCase()}</strong>
          <span>Nama</span>
          <strong>{order.name}</strong>
          <span>Email</span>
          <strong>{order.email}</strong>
          <span>Total</span>
          <strong>Rp{new Intl.NumberFormat("id-ID").format(order.amount)}</strong>
        </div>

        {isPaid ? (
          <p className="fine-print">
            Dua negara sudah dikunci untukmu. Kembali ke dashboard untuk melihat hasilnya.
          </p>
        ) : (
          <p className="fine-print" data-pending-hint>
            Pembayaran DOKU sedang dikonfirmasi lewat webhook. Halaman ini akan otomatis redirect ke dashboard begitu status berubah menjadi PAID.
          </p>
        )}

        <Link href="/" className="primary-button wide">
          {isPaid ? "Lihat Dashboard" : "Kembali ke Dashboard"}
        </Link>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var status = document.querySelector('[data-status]');
              if (!status || status.getAttribute('data-status') === 'paid') return;
              var orderId = ${JSON.stringify(orderId)};
              function poll() {
                fetch('/api/orders/' + encodeURIComponent(orderId), { cache: 'no-store' })
                  .then(function(r) { return r.ok ? r.json() : null; })
                  .then(function(data) {
                    if (data && data.order && data.order.status === 'paid') {
                      window.location.href = '/?paid=' + encodeURIComponent(orderId);
                    }
                  })
                  .catch(function() {});
              }
              poll();
              setInterval(poll, 2000);
              setTimeout(function() { window.location.href = '/?paid=' + encodeURIComponent(orderId); }, 60000);
            })();
          `,
        }}
      />
    </main>
  );
}
