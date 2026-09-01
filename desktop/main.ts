const DIST_ROOT = new URL("../dist/", import.meta.url);

const MIME_TYPES: Readonly<Record<string, string>> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".ts": "application/typescript; charset=utf-8",
  ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

const BASE_HEADERS: Readonly<Record<string, string>> = {
  "content-security-policy":
    "default-src 'self'; script-src 'self' blob: 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
  "permissions-policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=(), browsing-topics=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

type ResolvedAsset = {
  bytes: Uint8Array;
  relativePath: string;
};

class UnsafePathError extends Error {}

function extension(path: string): string {
  const filename = path.slice(path.lastIndexOf("/") + 1);
  const dot = filename.lastIndexOf(".");
  return dot < 0 ? "" : filename.slice(dot).toLowerCase();
}

function safeSegments(pathname: string): string[] {
  const rawSegments = pathname.split("/").slice(1);
  const segments: string[] = [];

  for (const rawSegment of rawSegments) {
    if (rawSegment === "") continue;

    let segment: string;
    try {
      segment = decodeURIComponent(rawSegment);
    } catch {
      throw new UnsafePathError("Malformed URL encoding");
    }

    if (
      segment === "." ||
      segment === ".." ||
      segment.includes("/") ||
      segment.includes("\\") ||
      segment.includes("\0")
    ) {
      throw new UnsafePathError("Unsafe URL path");
    }

    segments.push(segment);
  }

  return segments;
}

function candidatePaths(pathname: string): string[] {
  const segments = safeSegments(pathname);
  const directPath = segments.join("/");

  if (pathname.endsWith("/") || directPath === "") {
    return [directPath === "" ? "index.html" : `${directPath}/index.html`];
  }

  if (segments[0] === "api") return [];
  if (extension(directPath) !== "") return [directPath];

  const locale = segments[0] === "uk" ? "uk" : segments[0] === "en" ? "en" : null;
  return locale ? [`${locale}/index.html`] : ["index.html"];
}

function assetUrl(relativePath: string): URL {
  const encodedPath = relativePath.split("/").map(encodeURIComponent).join("/");
  return new URL(encodedPath, DIST_ROOT);
}

async function resolveAsset(pathname: string): Promise<ResolvedAsset | null> {
  for (const relativePath of candidatePaths(pathname)) {
    try {
      return {
        bytes: await Deno.readFile(assetUrl(relativePath)),
        relativePath,
      };
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) continue;
      throw error;
    }
  }

  return null;
}

function responseHeaders(asset: ResolvedAsset): Headers {
  const headers = new Headers(BASE_HEADERS);
  const contentType = MIME_TYPES[extension(asset.relativePath)] ?? "application/octet-stream";

  headers.set("content-type", contentType);
  headers.set("content-length", String(asset.bytes.byteLength));
  headers.set(
    "cache-control",
    asset.relativePath.startsWith("assets/")
      ? "public, max-age=31536000, immutable"
      : contentType.startsWith("text/html")
      ? "no-store"
      : "no-cache",
  );

  return headers;
}

function plainResponse(
  message: string,
  status: number,
  extraHeaders?: HeadersInit,
  headOnly = false,
): Response {
  const headers = new Headers(BASE_HEADERS);
  headers.set("content-type", "text/plain; charset=utf-8");
  headers.set("cache-control", "no-store");
  if (extraHeaders) {
    for (const [name, value] of new Headers(extraHeaders)) headers.set(name, value);
  }
  return new Response(headOnly ? null : message, { status, headers });
}

export async function handleRequest(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return plainResponse("Method not allowed\n", 405, { allow: "GET, HEAD" });
  }

  const url = new URL(request.url);
  if (url.pathname === "/__health") {
    const body = JSON.stringify({
      status: "ok",
      runtime: "deno",
      distribution: "embedded-local-server",
      locales: ["en", "uk"],
    });
    const headers = new Headers(BASE_HEADERS);
    headers.set("content-type", "application/json; charset=utf-8");
    headers.set("cache-control", "no-store");
    return new Response(request.method === "HEAD" ? null : body, { headers });
  }

  try {
    const asset = await resolveAsset(url.pathname);
    if (!asset) return plainResponse("Not found\n", 404, undefined, request.method === "HEAD");

    const body = asset.bytes.buffer instanceof ArrayBuffer
      ? asset.bytes.buffer.slice(
        asset.bytes.byteOffset,
        asset.bytes.byteOffset + asset.bytes.byteLength,
      )
      : new Uint8Array(asset.bytes).buffer;

    return new Response(request.method === "HEAD" ? null : body, {
      headers: responseHeaders(asset),
    });
  } catch (error) {
    if (error instanceof UnsafePathError) {
      return plainResponse("Bad request\n", 400, undefined, request.method === "HEAD");
    }
    console.error("Static asset read failed:", error instanceof Error ? error.message : "unknown error");
    return plainResponse("Internal server error\n", 500, undefined, request.method === "HEAD");
  }
}

function parsePort(args: string[]): number {
  let port = 0;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--self-test") continue;

    const value = argument === "--port"
      ? args[++index]
      : argument.startsWith("--port=")
      ? argument.slice("--port=".length)
      : null;

    if (value === null) throw new Error(`Unknown argument: ${argument}`);
    if (value === undefined || !/^\d+$/.test(value)) throw new Error("--port requires a number");

    port = Number(value);
    if (!Number.isSafeInteger(port) || port < 0 || port > 65_535) {
      throw new Error("--port must be between 0 and 65535");
    }
  }

  return port;
}

async function selfTest(): Promise<void> {
  const requiredPages = ["index.html", "en/index.html", "uk/index.html"];
  for (const page of requiredPages) {
    const markup = await Deno.readTextFile(assetUrl(page));
    if (!markup.includes("<!doctype html>")) throw new Error(`${page} is not a built HTML document`);
  }

  const extensions = new Set<string>();
  for await (const entry of Deno.readDir(assetUrl("assets"))) {
    if (entry.isFile) extensions.add(extension(entry.name));
  }

  for (const requiredExtension of [".css", ".js", ".wasm"]) {
    if (!extensions.has(requiredExtension)) {
      throw new Error(`dist/assets is missing a ${requiredExtension} build artifact`);
    }
  }

  console.log("Embedded site self-test passed: EN, UK, JS, CSS, and WASM are present.");
}

if (import.meta.main) {
  if (Deno.args.includes("--self-test")) {
    await selfTest();
  } else {
    let port: number;
    try {
      port = parsePort(Deno.args);
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Invalid command-line arguments");
      Deno.exit(2);
    }

    const server = Deno.serve(
      {
        hostname: "127.0.0.1",
        port,
        onListen: ({ hostname, port: listeningPort }) => {
          console.log(`CrioMant Horizon Lab is available at http://${hostname}:${listeningPort}/en/`);
          console.log(
            "BrowserWindow" in Deno
              ? "Deno Desktop will open its local WebView automatically."
              : "The standalone local-server launcher does not open external programs; copy this URL into a browser.",
          );
        },
      },
      handleRequest,
    );

    await server.finished;
  }
}
