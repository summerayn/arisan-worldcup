import { createHmac, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

const invoice = process.argv[2];
if (!invoice) {
  console.error("Usage: npm run doku:status -- <invoice_number>");
  process.exit(2);
}

function loadEnv() {
  return Object.fromEntries(
    readFileSync(".env", "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [
          line.slice(0, index),
          line
            .slice(index + 1)
            .trim()
            .replace(/^['"]|['"]$/g, ""),
        ];
      }),
  );
}

function createGetSignature({ clientId, secretKey, target }) {
  const requestId = randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const component = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${timestamp}`,
    `Request-Target:${target}`,
  ].join("\n");

  return {
    requestId,
    timestamp,
    signature: `HMACSHA256=${createHmac("sha256", secretKey).update(component).digest("base64")}`,
  };
}

const env = loadEnv();
const clientId = env.DOKU_CLIENT_ID;
const secretKey = env.DOKU_SECRET_KEY;
if (!clientId || !secretKey) {
  console.error("DOKU_CLIENT_ID and DOKU_SECRET_KEY are required in .env.");
  process.exit(2);
}

const baseUrl = env.DOKU_BASE_URL ?? "https://api-sandbox.doku.com";
const target = `/orders/v1/status/${encodeURIComponent(invoice)}`;
const signed = createGetSignature({ clientId, secretKey, target });

const response = await fetch(`${baseUrl}${target}`, {
  headers: {
    "Client-Id": clientId,
    "Request-Id": signed.requestId,
    "Request-Timestamp": signed.timestamp,
    Signature: signed.signature,
  },
});

const text = await response.text();
let payload = text;
try {
  payload = JSON.parse(text);
} catch {
  payload = text.slice(0, 500);
}

console.log(
  JSON.stringify(
    {
      ok: response.ok,
      status: response.status,
      invoice,
      requestId: signed.requestId,
      orderStatus: payload?.order?.status,
      transactionStatus: payload?.transaction?.status,
      channel: payload?.channel?.id,
      acquirer: payload?.acquirer?.id,
      payload,
    },
    null,
    2,
  ),
);

if (!response.ok) {
  process.exit(1);
}
