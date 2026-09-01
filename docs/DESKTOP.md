# Deno local and desktop artifacts

The project has two deliberately separate Windows distributions. They serve the same pre-built English and
Ukrainian Vite site, but they are not interchangeable.

| Artifact                                     | What it is                                                                   | Output shape                                                                | Default automation                         |
| -------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------ |
| `HorizonLab-Local-Server-windows-x64.exe`    | A Deno local HTTP launcher. It prints a loopback URL for the user's browser. | One literal `.exe` with `dist/` embedded                                    | Every relevant push and pull request       |
| `HorizonLab-Desktop-webview-windows-x64.zip` | An experimental `deno desktop` package using the operating system WebView.   | A zip of the Windows app directory, including its launcher and support DLLs | Version tags or an explicit manual request |

The word **desktop** does not mean “one Windows file.” Deno's official 2.9 distribution model produces a
directory or MSI on Windows. The single-file deliverable is accurately named a **local-server launcher**.
Linux can produce a one-file AppImage, but that is outside this Windows workflow.

## Runtime behavior

[`desktop/main.ts`](../desktop/main.ts) reads the embedded Vite output from Deno's virtual file system and
binds only to `127.0.0.1`. The kernel chooses an unused port unless `--port` is supplied. It serves:

- `/` and built static files;
- `/en/` and `/uk/`, including locale-scoped SPA fallbacks;
- immutable hashed files below `/assets/`;
- `GET /__health` for the artifact smoke test.

Asset paths are decoded one segment at a time and reject traversal, encoded separators, backslashes, and null
bytes. Missing files with extensions return `404`; they are never rewritten to HTML. Non-`GET`/`HEAD` requests
return `405`.

The launcher does not spawn a browser because doing that portably would require subprocess permission. It
prints the exact URL instead. The optional `deno desktop` package opens its own WebView through Deno's desktop
runtime.

The embedded app contains no telemetry hook. Its compiled permission set allows only loopback networking and
explicitly denies filesystem reads/writes, environment access, system information, subprocesses, FFI, and
remote module imports. The development commands grant read access only to the local `dist/` directory because
those files have not yet been embedded.

The hosted Go `/api/pulse` function is not embedded. The portfolio remains usable, but that serverless-only
endpoint is unavailable in the offline/local distribution.

## Reproduce locally

Use Deno `2.9.5`, which is also pinned in CI.

```powershell
npm ci
npm run build
deno check --config desktop/deno.json desktop/main.ts
deno lint --config desktop/deno.json desktop/main.ts
deno run --config desktop/deno.json --allow-read=dist desktop/main.ts --self-test
```

To run from source:

```powershell
deno run --config desktop/deno.json --allow-read=dist --allow-net=127.0.0.1 desktop/main.ts
```

To compile the verified Deno 2.9.5 Windows launcher:

```powershell
New-Item -ItemType Directory -Force artifacts | Out-Null
deno compile --config desktop/deno.json -P=local-server `
  --target x86_64-pc-windows-msvc `
  --include dist `
  --output artifacts/HorizonLab-Local-Server-windows-x64.exe `
  desktop/main.ts
```

Run it from any directory and open the printed loopback URL:

```powershell
./artifacts/HorizonLab-Local-Server-windows-x64.exe
```

You can request a deterministic port for local automation:

```powershell
./artifacts/HorizonLab-Local-Server-windows-x64.exe --port=4177
```

## `--include-as-is` version boundary

The current Deno documentation recommends `deno compile --include-as-is ./dist` for already-built frontend
bundles. The pinned Deno `2.9.5` binary does **not** expose that flag and rejects it as an unknown argument;
its supported equivalent is `--include dist`. The workflow uses the command the pinned binary actually
accepts, then proves the result from a clean directory with HTTP smoke tests.

When the pinned runtime is upgraded to a release whose CLI exposes `--include-as-is`, replace `--include dist`
in the workflow and in this document. Do not silently unpin Deno to obtain the flag.

## Optional native-window package

The native-window job is intentionally gated to `v*` tags and manual runs with `build_native_desktop` enabled.
Its essential command is:

```powershell
deno desktop --config desktop/deno.json -P=local-server `
  --target x86_64-pc-windows-msvc `
  --backend webview `
  --include dist `
  --output artifacts/HorizonLab-Desktop `
  desktop/main.ts
```

The workflow zips that directory, produces a SHA-256 checksum, and uploads both. It does not call the zip a
single-file desktop executable. Release distribution still requires Windows code signing; unsigned CI
artifacts can trigger SmartScreen warnings.

## Integrity and CI evidence

The local-server job:

1. builds the production frontend;
2. formats, lints, and type-checks the Deno launcher;
3. validates that EN, UK, JavaScript, CSS, and WebAssembly exist;
4. compiles the x86-64 Windows executable;
5. copies only the executable into a clean directory and starts it there;
6. checks health, both locales, SPA fallback, a hashed asset, and a real `404`;
7. emits `HorizonLab-Local-Server-windows-x64.exe.sha256`.

Verify a downloaded launcher in PowerShell:

```powershell
Get-FileHash -Algorithm SHA256 ./HorizonLab-Local-Server-windows-x64.exe
Get-Content ./HorizonLab-Local-Server-windows-x64.exe.sha256
```

The two hashes must match before execution.

## Primary references

- [Deno compile and embedded files](https://docs.deno.com/runtime/reference/cli/compile/)
- [Deno Desktop overview](https://docs.deno.com/runtime/desktop/)
- [Deno Desktop framework detection for Vite](https://docs.deno.com/runtime/desktop/frameworks/)
- [Deno Desktop Windows distribution formats](https://docs.deno.com/runtime/desktop/distribution/)
- [Deno permissions](https://docs.deno.com/runtime/reference/permissions/)
