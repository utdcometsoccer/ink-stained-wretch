/**
 * Formats any error-like value into a user-friendly string.
 * Handles:
 * - Error / AggregateError
 * - string / number / boolean
 * - null/undefined
 * - Arrays (joins formatted items)
 * - Objects (looks for common message fields, Axios/fetch/Stripe envelopes)
 * - Fallback to JSON/stringification safely
 */
export function formatError(value: unknown): string {
  if (value == null) return "";

  // Primitive strings as-is
  if (typeof value === "string") return value;

  // Other primitives
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }

  // Native Error types
  if (value instanceof AggregateError) {
    const msgs = value.errors?.map((e) => formatError(e)).filter(Boolean) || [];
    const header = value.message ? `${value.message}: ` : "";
    return `${header}${msgs.join("; ")}`.trim();
  }
  if (value instanceof Error) {
    // Prefer message; optionally include cause if informative
    const causeText = value.cause ? formatError(value.cause as unknown) : "";
    const base = value.message || value.name || "Error";
    return [base, causeText].filter(Boolean).join(": ");
  }

  // Arrays
  if (Array.isArray(value)) {
    return value.map((v) => formatError(v)).filter(Boolean).join("; ");
  }

  // Objects and special envelopes
  if (isRecord(value)) {
    // Common error field shapes
    // 1) Direct message fields
    const direct = pickFirstString(value, [
      "message",
      "error_description",
      "errorMessage",
      "detail",
      "title",
      "reason",
    ]);
    if (direct) return direct;

    // 2) Stripe-like envelope { error: { message } | string }
    const stripeLike = extractFromKey(value, "error");
    if (stripeLike) return stripeLike;

    // 3) Fetch/Axios-like envelope: response.data or data.{message|error}
    const dataMsg = extractFromKey(value, "data") || extractFromKey(value, "response");
    if (dataMsg) return dataMsg;

    // 4) Errors collection
    //    - errors: string[] | { message }[]
    if (Array.isArray((value as Record<string, unknown>)["errors"])) {
      const arr = (value as Record<string, unknown>)["errors"] as unknown[];
      const msg = arr.map((e) => formatError(e)).filter(Boolean).join("; ");
      if (msg) return msg;
    }

    // 5) toString override that's informative
    const maybeToString = (value as { toString?: () => string }).toString;
    if (maybeToString && maybeToString !== Object.prototype.toString) {
      try {
        const s = String(value);
        if (s && s !== "[object Object]") return s;
      } catch {
        // ignore and fall through
      }
    }

    // 6) JSON fallback (safe)
    try {
      const json = JSON.stringify(value);
      if (json && json !== "{}") return json;
    } catch {
      // ignore
    }
  }

  // Final fallback
  try {
    return String(value);
  } catch {
    return "";
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function hasString(obj: Record<string, unknown>, key: string): obj is Record<string, string> {
  return typeof obj[key] === "string";
}

function pickFirstString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    if (hasString(obj, k)) return obj[k];
  }
  return null;
}

function extractFromKey(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  if (v == null) return null;
  // If it's directly a string, use it
  if (typeof v === "string") return v;
  // If it's an object, try common fields recursively
  if (isRecord(v)) {
    const direct = pickFirstString(v, ["message", "error", "detail", "title", "reason"]);
    if (direct) return direct;
    // Nested data
    const nested = extractFromKey(v, "data");
    if (nested) return nested;
    // Nested errors array
    if (Array.isArray(v["errors"])) {
      const arr = v["errors"] as unknown[];
      const msg = arr.map((e) => formatError(e)).filter(Boolean).join("; ");
      if (msg) return msg;
    }
  }
  return null;
}
