# Go pulse API

`GET /api/pulse` is a small, stateless Vercel Go Function for the portfolio's live system panel. The root entry point is `api/pulse.go`, where Vercel discovers the exported `Handler(http.ResponseWriter, *http.Request)`. The implementation and tests live in `internal/pulse`.

## Contract

- Methods: `GET` and `HEAD` only. Other methods receive `405 Method Not Allowed` with `Allow: GET, HEAD`.
- Media type: `application/json; charset=utf-8`.
- Cache policy: both the browser and Vercel CDN receive `no-store`; the response contains current server time and measured invocation timing.
- CORS: same production origin plus explicit local Vite/Vercel development origins on ports `3000`, `4173`, and `5173`. Arbitrary origins, wildcard subdomains, and credentialed CORS are not enabled.
- `HEAD` returns the same status and representation headers as `GET`, including `Content-Length`, with no response body.

Representative response shape:

```json
{
  "ok": true,
  "service": {
    "name": "portfolio-pulse",
    "contractVersion": "1"
  },
  "observedAt": "2026-09-01T12:00:00.123456Z",
  "timing": {
    "handlerPreparationNanoseconds": 82451,
    "scope": "application preparation before JSON serialization"
  },
  "runtime": {
    "language": "go",
    "version": "go1.26.7",
    "operatingSystem": "linux",
    "architecture": "amd64"
  },
  "capabilities": {
    "methods": ["GET", "HEAD"],
    "mediaType": "application/json",
    "serverTiming": true,
    "deterministicSignal": true,
    "persistence": false,
    "visitorTracking": false
  },
  "signal": {
    "algorithm": "fixed-lcg32-v1",
    "kind": "synthetic-diagnostic",
    "source": "public-fixed-seed",
    "seed": 3223173726,
    "range": "0..1000",
    "values": [398, 121, 91, 883, 955, 893, 878, 88, 95, 572, 308, 127]
  },
  "privacy": {
    "applicationPersistence": false,
    "applicationLogging": false,
    "visitorFingerprinting": false,
    "requestDerivedSignal": false
  }
}
```

The numbers above illustrate the schema, not a latency promise. `handlerPreparationNanoseconds` is measured from handler entry until the response structure is ready. The `Server-Timing` header measures handler work through JSON serialization. Neither value includes Vercel routing, cold-start work before handler entry, network transfer, browser processing, or the final socket flush, so the UI must not label either value as total request latency.

## Privacy boundary

The application code does not use cookies, read IP or user-agent identifiers, log requests, persist data, read secrets, or derive the signal from request metadata. It reads only the HTTP method and optional `Origin` needed for the strict CORS allowlist. The signal is explicitly labeled synthetic, uses a public fixed seed, and is a repeatable diagnostic visualization—not live telemetry, measured latency, randomness, or cryptography.

For allowed origins only, `Server-Timing` is listed in `Access-Control-Expose-Headers` and the exact origin is echoed in `Timing-Allow-Origin`. Wildcards are not used, so other browser origins cannot read detailed application timing.

These statements cover this repository's handler code. Vercel may still produce standard infrastructure and security telemetry according to the project's platform settings and Vercel's policies.

## Development and verification

The module intentionally uses only the Go standard library. Vercel reads the root `go.mod` to select the Go toolchain and maps `api/pulse.go` to `/api/pulse` without an additional runtime dependency.

Run with a local Go toolchain or in CI:

```sh
gofmt -w api cmd internal
go vet ./...
go test ./...
go test -race ./...
```

For an integration check through Vercel's local router:

```sh
vercel dev
curl --include http://localhost:3000/api/pulse
curl --head http://localhost:3000/api/pulse
```

If the host does not have the pinned Go toolchain, run the same commands in `golang:1.26.7-bookworm` or rely on the identical CI gate. Release validation must still include `go vet ./...` and `go test -race ./...` before deployment.
