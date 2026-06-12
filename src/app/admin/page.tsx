"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";

function formatIdr(value: number) {
  return `Rp${new Intl.NumberFormat("id-ID").format(value)}`;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [adminToken, setAdminToken] = useState("");

  // Manual orders state
  const [orders, setOrders] = useState<Array<{
    id: string;
    name: string;
    email: string;
    amount: number;
    createdAt: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [error, setError] = useState("");

  function checkPassword(event: FormEvent) {
    event.preventDefault();
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: passwordInput }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setAuthenticated(true);
          setAdminToken(passwordInput);
          setPasswordError("");
        } else {
          setPasswordError("Password salah.");
        }
      })
      .catch(() => {
        setPasswordError("Gagal verifikasi. Coba lagi.");
      });
  }

  const loadOrders = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/manual-orders", {
        headers: { authorization: `Bearer ${adminToken}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Gagal load.");
      setOrders(payload.orders ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal load.");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      window.setTimeout(loadOrders, 0);
      const timer = setInterval(loadOrders, 10000);
      return () => clearInterval(timer);
    }
  }, [adminToken, loadOrders]);

  async function approve(orderId: string) {
    setApproving(orderId);
    setError("");
    try {
      const response = await fetch("/api/admin/manual-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Gagal approve.");
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal approve.");
    } finally {
      setApproving(null);
    }
  }

  // Login screen
  if (!authenticated) {
    return (
      <main className="app-shell">
        <section className="login-section">
          <div className="login-box">
            <div className="brand-mark login-brand">AD</div>
            <h2>Admin Panel</h2>
            <form onSubmit={checkPassword} className="login-form">
              <input
                type="password"
                placeholder="Admin token"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError("");
                }}
                required
                autoFocus
              />
              {passwordError ? <p className="form-error">{passwordError}</p> : null}
              <button className="primary-button wide" type="submit">
                Masuk
              </button>
            </form>
            <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "16px" }}>
              <Link href="/" style={{ color: "var(--lime)" }}>← Kembali ke dashboard</Link>
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Kocokan Piala Dunia">
          <span className="brand-mark">KP</span>
          <span>Kocokan Piala Dunia</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/#peserta">Peserta</Link>
          <Link href="/#grup">Grup</Link>
          <Link href="/#jadwal">Jadwal</Link>
          <Link href="/admin" style={{ color: "var(--lime)" }}>Admin</Link>
        </nav>
      </header>

      <section className="hero" style={{ paddingBlock: "40px" }}>
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="status-light" />
            Admin Panel
          </div>
          <h1>Kelola Kocokan Piala Dunia.</h1>
          <p>
            Approve pembayaran manual, update status negara, dan kelola hasil pertandingan.
          </p>
        </div>
      </section>

      {/* Manual Payment Orders */}
      <section className="section-block" id="manual-orders">
        <div className="section-heading">
          <div>
            <span className="section-icon">01</span>
            <h2>Pembayaran Manual Pending</h2>
          </div>
          <p>
            Peserta yang udah transfer via QRIS dan menunggu konfirmasi. Klik Approve untuk unlock negara mereka.
          </p>
        </div>

        {error && <p className="form-error">{error}</p>}
        {loading && orders.length === 0 && (
          <p className="fine-print" style={{ padding: "0 24px" }}>Memuat data...</p>
        )}
        {!loading && orders.length === 0 && (
          <div className="fill-panel">
            <div>
              <span>Tidak ada pembayaran manual pending</span>
              <strong>0</strong>
            </div>
          </div>
        )}

        {orders.length > 0 && (
          <div className="participants-list">
            {orders.map((order) => (
              <article className="participant-card" key={order.id}>
                <div className="participant-rank">--</div>
                <div className="avatar-ring muted-avatar" aria-hidden="true">
                  {order.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase() || "MN"}
                </div>
                <div className="participant-name">
                  <strong>{order.name}</strong>
                  <span>{order.email}</span>
                </div>
                <div className="team-pair" style={{ flexDirection: "column", gap: "4px" }}>
                  <small>{formatIdr(order.amount)}</small>
                  <small>{new Date(order.createdAt).toLocaleString("id-ID")}</small>
                </div>
                <button
                  className="primary-button"
                  disabled={approving === order.id}
                  onClick={() => approve(order.id)}
                  type="button"
                  style={{ marginLeft: "auto" }}
                >
                  {approving === order.id ? "..." : "Approve"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* API Quick Reference */}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="section-icon">02</span>
            <h2>API Admin</h2>
          </div>
          <p>Endpoint admin untuk update negara gugur dan hasil pertandingan.</p>
        </div>
        <div className="fill-panel" style={{ flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "13px", color: "var(--muted-strong)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--lime)" }}>Update negara gugur:</strong>
            <code style={{
              display: "block",
              padding: "8px 12px",
              marginTop: "4px",
              background: "var(--surface-2)",
              borderRadius: "6px",
              fontSize: "12px",
              color: "var(--foreground)",
              wordBreak: "break-all",
            }}>
              curl -X PATCH /api/admin/countries -H &quot;Authorization: Bearer TOKEN&quot; -d &apos;&#123;&quot;countryCode&quot;:&quot;MEX&quot;,&quot;status&quot;:&quot;eliminated&quot;&#125;&apos;
            </code>
          </div>
          <div style={{ fontSize: "13px", color: "var(--muted-strong)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--lime)" }}>Update hasil match:</strong>
            <code style={{
              display: "block",
              padding: "8px 12px",
              marginTop: "4px",
              background: "var(--surface-2)",
              borderRadius: "6px",
              fontSize: "12px",
              color: "var(--foreground)",
              wordBreak: "break-all",
            }}>
              curl -X PATCH /api/admin/matches -H &quot;Authorization: Bearer TOKEN&quot; -d &apos;&#123;&quot;matchLabel&quot;:&quot;Canada vs Bosnia&quot;,&quot;status&quot;:&quot;finished&quot;,&quot;homeScore&quot;:2,&quot;awayScore&quot;:1&#125;&apos;
            </code>
          </div>
        </div>
      </section>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <Link href="/">Dashboard</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </main>
  );
}
