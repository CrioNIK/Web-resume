import { useEffect, useRef } from 'react';
import HorizonField from './components/HorizonField';
import LabDeck from './components/LabDeck';
import ProjectCard from './components/ProjectCard';
import { copy, localeFromPath, projects } from './data/content';

export default function App() {
  const locale = localeFromPath(window.location.pathname);
  const c = copy[locale];
  const otherLocale = locale === 'en' ? 'uk' : 'en';
  const otherLabel = locale === 'en' ? 'UA' : 'EN';
  const mobileMenu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('criomant-locale', locale);
    } catch {
      // Locale persistence is optional when the browser blocks storage.
    }
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!window.location.hash) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      target?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {c.skip}
      </a>
      <header className="site-header">
        <a className="identity" href={`/${locale}/`}>
          <span className="identity-mark" aria-hidden="true">C//</span>
          <span>
            <strong>{c.brandMeta}</strong>
            <small>{c.brandSub}</small>
          </span>
          <span className="sr-only">{c.home}</span>
        </a>

        <nav className="desktop-nav" aria-label={c.navigation}>
          {c.nav.map(([label, href]) => (
            <a href={href} key={href}>{label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <span className="live-chip"><i aria-hidden="true" /> LIVE / V2</span>
          <a
            className="language-switch"
            href={`/${otherLocale}/`}
            hrefLang={otherLocale}
            lang={otherLocale}
            aria-label={`${c.language}: ${otherLabel}`}
          >
            {otherLabel}
          </a>
          <details className="mobile-menu" ref={mobileMenu}>
            <summary>{c.menu}</summary>
            <nav aria-label={c.navigation}>
              {c.nav.map(([label, href]) => (
                <a href={href} key={href} onClick={() => { if (mobileMenu.current) mobileMenu.current.open = false; }}>{label}</a>
              ))}
            </nav>
          </details>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <HorizonField locale={locale} />
          <div className="hero-grid shell">
            <div className="hero-copy">
              <p className="eyebrow"><span>00</span>{c.heroEyebrow}</p>
              <h1 id="hero-title">
                <span>{c.heroTitle[0]}</span>
                <em>{c.heroTitle[1]}</em>
              </h1>
              <p className="hero-lead">{c.heroLead}</p>
              <div className="hero-actions">
                <a className="action action-primary" href="#lab">{c.enterLab}<span aria-hidden="true">↘</span></a>
                <a className="action action-ghost" href="#work">{c.traceWork}<span aria-hidden="true">↓</span></a>
              </div>
            </div>

            <aside className="hero-manifest" aria-label={c.manifest}>
              <div className="manifest-head">
                <span>SYSTEM MANIFEST</span>
                <span>V2.0.0</span>
              </div>
              <dl>
                <div><dt>BUILD</dt><dd>VITE 8 / ROLLDOWN</dd></div>
                <div><dt>COMPUTE</dt><dd>RUST → WASM</dd></div>
                <div><dt>SERVICE</dt><dd>GO / VERCEL BETA</dd></div>
                <div><dt>RENDER</dt><dd>WEBGPU → CANVAS</dd></div>
                <div><dt>DATA</dt><dd>WORKER / INDEXEDDB</dd></div>
                <div><dt>LANG</dt><dd>EN / UK</dd></div>
              </dl>
              <p>{c.heroNote}</p>
            </aside>
          </div>
          <div className="proof-rail" aria-label={c.highlights}>
            <div className="shell proof-grid">
              {c.proofs.map(([value, label]) => (
                <div className="proof-item" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="work-section shell section" id="work" aria-labelledby="work-title">
          <header className="section-head">
            <p className="eyebrow"><span>01</span>{c.workEyebrow}</p>
            <div>
              <h2 id="work-title">{c.workTitle}</h2>
              <p>{c.workLead}</p>
            </div>
          </header>
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} />
            ))}
          </div>
        </section>

        <section className="lab-section section" id="lab" aria-labelledby="lab-title">
          <div className="shell">
            <header className="section-head section-head-light">
              <p className="eyebrow"><span>02</span>{c.labEyebrow}</p>
              <div>
                <h2 id="lab-title">{c.labTitle}</h2>
                <p>{c.labLead}</p>
              </div>
            </header>
            <LabDeck locale={locale} />
          </div>
        </section>

        <section className="trajectory-section shell section" id="trajectory" aria-labelledby="trajectory-title">
          <header className="section-head">
            <p className="eyebrow"><span>03</span>{c.trajectoryEyebrow}</p>
            <div><h2 id="trajectory-title">{c.trajectoryTitle}</h2></div>
          </header>
          <ol className="trajectory-list">
            {c.trajectory.map(([period, title, summary, status], index) => (
              <li key={title}>
                <span className="trajectory-index">{String(index + 1).padStart(2, '0')}</span>
                <time>{period}</time>
                <div><h3>{title}</h3><p>{summary}</p></div>
                <strong>{status}</strong>
              </li>
            ))}
          </ol>
        </section>

        <section className="principles-section shell section" aria-labelledby="principles-title">
          <header className="section-head">
            <p className="eyebrow"><span>04</span>{c.principlesEyebrow}</p>
            <div><h2 id="principles-title">{c.principlesTitle}</h2></div>
          </header>
          <div className="principles-grid">
            {c.principles.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-field" aria-hidden="true">CRIO//MANT</div>
          <div className="shell contact-content">
            <p className="eyebrow"><span>05</span>{c.contactEyebrow}</p>
            <h2 id="contact-title">{c.contactTitle}</h2>
            <p>{c.contactLead}</p>
            <div className="hero-actions">
              <a className="action action-primary" href="mailto:coldboycrio314@gmail.com">{c.email}<span aria-hidden="true">↗</span></a>
              <a className="action action-ghost action-ghost-light" href="https://github.com/CrioNIK" target="_blank" rel="noreferrer">{c.github}<span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell">
          <p>{c.footer}</p>
          <p>© {new Date().getFullYear()} · V2.0.0</p>
        </div>
      </footer>
    </>
  );
}
