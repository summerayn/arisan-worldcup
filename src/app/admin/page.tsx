"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";

function formatIdr(value: number) {
  return `Rp${new Intl.NumberFormat("id-ID").format(value)}`;
}

type AppConfig = {
  dokuEnabled: boolean;
  manualEnabled: boolean;
  dokuClientId: string;
  dokuSecretKey: string;
  dokuBaseUrl: string;
  qrisUrl: string;
  manualInstructions: string;
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [adminToken, setAdminToken] = useState("");

  // Config state
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configSaving, setConfigSaving] = useState(false);
  const [configError, setConfigError] = useState("");
  const [configSaved, setConfigSaved] = useState(false);

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
      .catch(() => setPasswordError("Gagal verifikasi."));
  }

  // ── Config ────────────────────────────────────

  const loadConfig = useCallback(async () => {
    if (!adminToken) return;
    setConfigLoading(true);
    try {
      const res = await fetch("/api/admin/config", {
        headers: { authorization: `Bearer ${adminToken}` },
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Gagal load config.");
      setConfig(payload.config);
      setConfigError("");
    } catch (err) {
      setConfigError(err instanceof Error ? err.message : "Gagal load config.");
    } finally {
      setConfigLoading(false);
    }
  }, [adminToken]);

  async function saveConfig(event: FormEvent) {
    event.preventDefault();
    if (!config) return;
    setConfigSaving(true);
    setConfigSaved(false);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(config),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Gagal simpan.");
      setConfig(payload.config);
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 3000);
    } catch (err) {
      setConfigError(err instanceof Error ? err.message : "Gagal simpan.");
    } finally {
      setConfigSaving(false);
    }
  }

  // ── Manual Orders ────────────────────────────

  const loadOrders = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/manual-orders", {
        headers: { authorization: `Bearer ${adminToken}` },
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Gagal load.");
      setOrders(payload.orders ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal load.");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  async function approve(orderId: string) {
    setApproving(orderId);
    try {
      const res = await fetch("/api/admin/manual-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Gagal approve.");
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal approve.");
    } finally {
      setApproving(null);
    }
  }

  useEffect(() => {
    if (adminToken) {
      window.setTimeout(loadOrders, 0);
      window.setTimeout(loadConfig, 0);
      const timer = setInterval(() => { loadOrders(); loadConfig(); }, 10000);
      return () => clearInterval(timer);
    }
  }, [adminToken, loadOrders, loadConfig]);

  // ── Login screen ─────────────────────────────

  if (!authenticated) {
    return (
      <main className="app-shell">
        <section className="login-section">
          <div className="login-box">
            <div className="brand-mark login-brand">AD</div>
            <h2>Admin Panel</h2>
            <form onSubmit={checkPassword} className="login-form">
              <input type="password" placeholder="Admin token" value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(""); }}
                required autoFocus />
              {passwordError && <p className="form-error">{passwordError}</p>}
              <button className="primary-button wide" type="submit">Masuk</button>
            </form>
            <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "16px" }}>
              <Link href="/" style={{ color: "var(--lime)" }}>← Kembali ke dashboard</Link>
            </p>
          </div>
        </section>
      </main>
    );
  }

  const inputStyle: React.CSSProperties = {
    padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)",
    background: "var(--surface-2)", color: "var(--foreground)", fontSize: "14px", width: "100%",
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">KP</span><span>Kocokan Piala Dunia</span></Link>
        <nav>
          <Link href="/#peserta">Peserta</Link>
          <Link href="/#grup">Grup</Link>
          <Link href="/#jadwal">Jadwal</Link>
          <Link href="/admin" style={{ color: "var(--lime)" }}>Admin</Link>
        </nav>
      </header>

      <section className="hero" style={{ paddingBlock: "40px" }}>
        <div className="hero-copy">
          <div className="hero-kicker"><span className="status-light" />Admin Panel</div>
          <h1>Kelola Kocokan Piala Dunia.</h1>
          <p>Atur mode pembayaran, DOKU, QRIS, approve peserta manual.</p>
        </div>
      </section>

      {/* ── Settings ──────────────────────────── */}
      <section className="section-block" id="settings">
        <div className="section-heading">
          <div><span className="section-icon">00</span><h2>Pengaturan</h2></div>
          <p>Mode pembayaran, kredensial DOKU, dan QRIS.</p>
        </div>

        {configError && <p className="form-error">{configError}</p>}
        {configLoading && !config && <p className="fine-print" style={{ padding: "0 24px" }}>Memuat...</p>}

        {config && (
          <form onSubmit={saveConfig} style={{ padding: "0 24px 24px" }}>
            {/* Payment modes */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--muted-strong)", cursor: "pointer" }}>
                <input type="checkbox" checked={config.dokuEnabled}
                  onChange={(e) => setConfig({ ...config, dokuEnabled: e.target.checked })} />
                DOKU Checkout
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--muted-strong)", cursor: "pointer" }}>
                <input type="checkbox" checked={config.manualEnabled}
                  onChange={(e) => setConfig({ ...config, manualEnabled: e.target.checked })} />
                Transfer Manual (QRIS)
              </label>
            </div>

            {/* DOKU settings */}
            <details style={{ marginBottom: "16px" }} open={config.dokuEnabled}>
              <summary style={{ fontSize: "14px", fontWeight: 600, color: "var(--lime)", cursor: "pointer", marginBottom: "12px" }}>
                Kredensial DOKU
              </summary>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label style={{ fontSize: "13px", color: "var(--muted)" }}>
                  Client ID
                  <input style={inputStyle} value={config.dokuClientId}
                    onChange={(e) => setConfig({ ...config, dokuClientId: e.target.value })} />
                </label>
                <label style={{ fontSize: "13px", color: "var(--muted)" }}>
                  Secret Key
                  <input style={inputStyle} type="password" value={config.dokuSecretKey}
                    onChange={(e) => setConfig({ ...config, dokuSecretKey: e.target.value })}
                    placeholder="Kosongkan jika tidak ingin diubah" />
                </label>
                <label style={{ fontSize: "13px", color: "var(--muted)" }}>
                  Base URL
                  <input style={inputStyle} value={config.dokuBaseUrl}
                    onChange={(e) => setConfig({ ...config, dokuBaseUrl: e.target.value })} />
                </label>
              </div>
            </details>

            {/* Manual payment settings */}
            <details style={{ marginBottom: "16px" }} open={config.manualEnabled}>
              <summary style={{ fontSize: "14px", fontWeight: 600, color: "var(--lime)", cursor: "pointer", marginBottom: "12px" }}>
                Pengaturan QRIS
              </summary>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label style={{ fontSize: "13px", color: "var(--muted)" }}>
                  QRIS Image URL
                  <input style={inputStyle} value={config.qrisUrl}
                    onChange={(e) => setConfig({ ...config, qrisUrl: e.target.value })} />
                </label>
                {config.qrisUrl && (
                  <div style={{ padding: "12px", background: "#fff", borderRadius: "8px", width: "fit-content" }}>
                    <img src={config.qrisUrl} alt="QRIS Preview" style={{ width: "120px", height: "120px", display: "block" }} />
                  </div>
                )}
                <label style={{ fontSize: "13px", color: "var(--muted)" }}>
                  Instruksi Manual
                  <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={config.manualInstructions}
                    onChange={(e) => setConfig({ ...config, manualInstructions: e.target.value })} />
                </label>
              </div>
            </details>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button className="primary-button" type="submit" disabled={configSaving}>
                {configSaving ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
              {configSaved && <span style={{ fontSize: "13px", color: "var(--green)" }}>Tersimpan!</span>}
            </div>
          </form>
        )}
      </section>

      {/* ── Manual Payment Orders ─────────────── */}
      <section className="section-block" id="manual-orders">
        <div className="section-heading">
          <div><span className="section-icon">01</span><h2>Pembayaran Manual Pending</h2></div>
          <p>Peserta yang udah transfer via QRIS dan menunggu konfirmasi.</p>
        </div>

        {error && <p className="form-error">{error}</p>}
        {loading && orders.length === 0 && <p className="fine-print" style={{ padding: "0 24px" }}>Memuat data...</p>}
        {!loading && orders.length === 0 && (
          <div className="fill-panel"><div><span>Tidak ada pembayaran manual pending</span><strong>0</strong></div></div>
        )}

        {orders.length > 0 && (
          <div className="participants-list">
            {orders.map((order) => (
              <article className="participant-card" key={order.id}>
                <div className="participant-rank">--</div>
                <div className="avatar-ring muted-avatar">
                  {order.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "MN"}
                </div>
                <div className="participant-name"><strong>{order.name}</strong><span>{order.email}</span></div>
                <div className="team-pair" style={{ flexDirection: "column", gap: "4px" }}>
                  <small>{formatIdr(order.amount)}</small>
                  <small>{new Date(order.createdAt).toLocaleString("id-ID")}</small>
                </div>
                <button className="primary-button" disabled={approving === order.id}
                  onClick={() => approve(order.id)} type="button" style={{ marginLeft: "auto" }}>
                  {approving === order.id ? "..." : "Approve"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── API Reference ─────────────────────── */}
      <section className="section-block">
        <div className="section-heading">
          <div><span className="section-icon">02</span><h2>API Admin</h2></div>
          <p>Endpoint admin untuk update negara gugur dan hasil pertandingan.</p>
        </div>
        <div className="fill-panel" style={{ flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "13px", color: "var(--muted-strong)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--lime)" }}>Update negara gugur:</strong>
            <code style={{ display: "block", padding: "8px 12px", marginTop: "4px", background: "var(--surface-2)", borderRadius: "6px", fontSize: "12px", color: "var(--foreground)", wordBreak: "break-all" }}>
              curl -X PATCH /api/admin/countries -H &quot;Authorization: Bearer *** -d &apos;&#123;&quot;countryCode&quot;:&quot;MEX&quot;,&quot;status&quot;:&quot;eliminated&quot;&#125;&apos;
            </code>
          </div>
          <div style={{ fontSize: "13px", color: "var(--muted-strong)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--lime)" }}>Update hasil match:</strong>
            <code style={{ display: "block", padding: "8px 12px", marginTop: "4px", background: "var(--surface-2)", borderRadius: "6px", fontSize: "12px", color: "var(--foreground)", wordBreak: "break-all" }}>
              curl -X PATCH /api/admin/matches -H &quot;Authorization: Bearer *** -d &apos;&#123;&quot;matchLabel&quot;:&quot;Canada vs Bosnia&quot;,&quot;status&quot;:&quot;finished&quot;,&quot;homeScore&quot;:2,&quot;awayScore&quot;:1&#125;&apos;
            </code>
          </div>
        </div>
      </section>

      <nav className="bottom-nav">
        <Link href="/">Dashboard</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </main>
  );
}
