import type { Locale } from '../data/content';

type FrontierState = 'live' | 'verified' | 'gated' | 'research';

interface FrontierTarget {
  index: string;
  name: string;
  state: FrontierState;
  status: { en: string; uk: string };
  summary: { en: string; uk: string };
  proof: string;
  url: string;
}

const targets: FrontierTarget[] = [
  {
    index: '01', name: 'oj 0.1.11', state: 'verified', proof: 'RUST / OXC / ROLLDOWN',
    status: { en: 'Parity lane', uk: 'Parity lane' },
    summary: { en: 'Pinned Linux CI builds the real multi-entry app. Vite remains canonical until repeated artifact parity.', uk: 'Закріплений Linux CI збирає реальний multi-entry застосунок. Vite лишається canonical до повторюваного artifact parity.' },
    url: 'https://github.com/raphamorim/oj',
  },
  {
    index: '02', name: 'Vinext', state: 'research', proof: 'NEXT API / VITE 8',
    status: { en: 'Compatibility probe', uk: 'Compatibility probe' },
    summary: { en: 'Tracked as an isolated beta fixture. Vinext-on-oj is not a supported production stack and is never misrepresented as one.', uk: 'Відстежується як ізольований beta fixture. Vinext-on-oj не є підтримуваним production stack і не подається як такий.' },
    url: 'https://github.com/cloudflare/vinext',
  },
  {
    index: '03', name: 'Browser TypeScript', state: 'live', proof: 'ESMS 2.8.4 / AMARO',
    status: { en: 'Intent-gated runtime', uk: 'Runtime за запитом' },
    summary: { en: 'Self-hosted TypeScript is stripped and executed in the tab; the 4.8 MB transformer costs zero bytes before intent.', uk: 'Self-hosted TypeScript видаляє типи й виконується у вкладці; 4.8 MB transformer не коштує жодного байта до дії.' },
    url: 'https://github.com/guybedford/es-module-shims#typescript-type-stripping',
  },
  {
    index: '04', name: 'WebMCP', state: 'live', proof: '2 READ-ONLY TOOLS',
    status: { en: 'Site-wide adapter', uk: 'Site-wide adapter' },
    summary: { en: 'The page registers public project and progress tools when document.modelContext exists—no fake polyfill or mutations.', uk: 'Сторінка реєструє публічні tools проєктів і прогресу, коли існує document.modelContext — без fake polyfill і змін.' },
    url: 'https://webmachinelearning.github.io/webmcp/',
  },
  {
    index: '05', name: 'HTML-in-Canvas', state: 'live', proof: 'DOM / GPU CO-RENDER',
    status: { en: 'Accessible production path', uk: 'Доступний production path' },
    summary: { en: 'Semantic DOM nodes are projected over an aria-hidden GPU scene; the evolving Canary API is detected separately.', uk: 'Семантичні DOM-вузли проєктуються над aria-hidden GPU-сценою; змінний Canary API визначається окремо.' },
    url: 'https://github.com/WICG/html-in-canvas',
  },
  {
    index: '06', name: 'WebContainers', state: 'gated', proof: 'NODE / BROWSER TAB',
    status: { en: 'Implemented, license-gated', uk: 'Реалізовано, license-gated' },
    summary: { en: 'A deterministic node:http POC is ready behind explicit license and cross-origin-isolation gates; production does not boot it.', uk: 'Детермінований node:http POC готовий за явними license та cross-origin-isolation gates; production його не запускає.' },
    url: 'https://webcontainers.io/api',
  },
  {
    index: '07', name: 'Deno Desktop', state: 'verified', proof: 'DENO 2.9.5 / ONE EXE',
    status: { en: 'Release artifact', uk: 'Release artifact' },
    summary: { en: 'A pinned workflow compiles the built EN/UK site into a literal Windows launcher; native desktop packages remain separate.', uk: 'Закріплений workflow компілює EN/UK сайт у буквальний Windows launcher; native desktop packages лишаються окремими.' },
    url: 'https://docs.deno.com/runtime/reference/cli/compile/',
  },
  {
    index: '08', name: 'Wasm Components', state: 'verified', proof: 'WIT / RUST / GO / JCO',
    status: { en: 'Multi-language build proof', uk: 'Multi-language build proof' },
    summary: { en: 'Pure WIT boundaries compose language components at build time and transpile to browser ESM without claiming native support.', uk: 'Pure WIT boundaries компонують мовні компоненти під час build і транспілюють у browser ESM без заяви про native support.' },
    url: 'https://component-model.bytecodealliance.org/',
  },
  {
    index: '09', name: 'Browser AI', state: 'live', proof: 'PROMPT API / OFFLINE PLAN',
    status: { en: 'Progressive enhancement', uk: 'Progressive enhancement' },
    summary: { en: 'The browser-provided model is negotiated at execution time; unsupported or failed sessions use a labelled deterministic planner.', uk: 'Browser-provided model узгоджується під час виконання; непідтримувані чи невдалі сесії використовують позначений deterministic planner.' },
    url: 'https://developer.chrome.com/docs/ai/prompt-api',
  },
  {
    index: '10', name: 'WebGPU Neural', state: 'live', proof: 'GRAPHICS / COMPUTE / MLP',
    status: { en: 'Real GPU pipeline', uk: 'Справжній GPU pipeline' },
    summary: { en: 'A deterministic neural field combines WebGPU compute and rendering, with the same JavaScript reference model as fallback.', uk: 'Детерміноване neural field поєднує WebGPU compute і rendering з тією самою JavaScript reference model як fallback.' },
    url: 'https://gpuweb.github.io/gpuweb/',
  },
];

const labels = {
  en: { evidence: 'Primary source', legend: { live: 'Live', verified: 'Build proof', gated: 'Gated', research: 'Research' } },
  uk: { evidence: 'Першоджерело', legend: { live: 'Live', verified: 'Build proof', gated: 'Обмежено', research: 'Дослідження' } },
} as const;

export default function FrontierMatrix({ locale }: { locale: Locale }) {
  const c = labels[locale];
  return (
    <div className="frontier-matrix">
      {targets.map((target) => (
        <article className={`frontier-card is-${target.state}`} key={target.index}>
          <header>
            <span>{target.index}</span>
            <strong>{c.legend[target.state]}</strong>
          </header>
          <p>{target.proof}</p>
          <h3>{target.name}</h3>
          <h4>{target.status[locale]}</h4>
          <p>{target.summary[locale]}</p>
          <a href={target.url} target="_blank" rel="noreferrer">{c.evidence}<span aria-hidden="true">↗</span></a>
        </article>
      ))}
    </div>
  );
}
