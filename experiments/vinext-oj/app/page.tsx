const pinnedStack = [
  ["Vinext", "1.0.0-beta.8"],
  ["Vite", "8.2.2"],
  ["oj", "0.1.11 (CI probe)"],
  ["React", "19.2.8"],
] as const;

export default async function ProbePage() {
  const renderedBy = await Promise.resolve("React Server Component");

  return (
    <main style={{ width: "min(48rem, calc(100% - 2rem))", margin: "0 auto", padding: "5rem 0" }}>
      <p style={{ color: "#7dd3fc", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Isolated compatibility fixture
      </p>
      <h1 style={{ margin: "0.5rem 0 1rem", fontSize: "clamp(2rem, 7vw, 4.5rem)" }}>
        Vinext meets oj.
      </h1>
      <p style={{ maxWidth: "42rem", color: "#b8c7da", lineHeight: 1.7 }}>
        This route is a real {renderedBy}. A successful Vinext build is the control; the oj build is an
        experimental compatibility signal, never a production claim.
      </p>
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
          gap: "0.75rem",
          marginTop: "2rem",
        }}
      >
        {pinnedStack.map(([name, version]) => (
          <div key={name} style={{ padding: "1rem", border: "1px solid #29415f", borderRadius: "0.75rem" }}>
            <dt style={{ color: "#8aa3c2" }}>{name}</dt>
            <dd style={{ margin: "0.35rem 0 0", fontWeight: 700 }}>{version}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
