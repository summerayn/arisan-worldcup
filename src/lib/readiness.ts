export type Readiness = {
  ready: boolean;
  storage: "supabase";
  payment: "doku";
  checks: {
    supabaseUrl: boolean;
    supabaseServiceRoleKey: boolean;
    dokuClientId: boolean;
    dokuSecretKey: boolean;
    adminToken: boolean;
    appUrl: boolean;
  };
  missing: string[];
};

export function getReadiness(): Readiness {
  const checks = {
    supabaseUrl: Boolean(process.env.SUPABASE_URL),
    supabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    dokuClientId: Boolean(process.env.DOKU_CLIENT_ID),
    dokuSecretKey: Boolean(process.env.DOKU_SECRET_KEY),
    adminToken: Boolean(process.env.ADMIN_TOKEN),
    appUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL),
  };
  const required = {
    SUPABASE_URL: checks.supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: checks.supabaseServiceRoleKey,
    DOKU_CLIENT_ID: checks.dokuClientId,
    DOKU_SECRET_KEY: checks.dokuSecretKey,
    ADMIN_TOKEN: checks.adminToken,
    NEXT_PUBLIC_APP_URL: checks.appUrl,
  };
  const missing = Object.entries(required)
    .filter(([, configured]) => !configured)
    .map(([name]) => name);

  return {
    ready: missing.length === 0,
    storage: "supabase",
    payment: "doku",
    checks,
    missing,
  };
}
