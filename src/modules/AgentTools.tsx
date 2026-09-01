import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '../data/content';
import {
  createPortfolioTools,
  getSiteWebMcpStatus,
  subscribeSiteWebMcpStatus,
  type SiteWebMcpStatus,
} from '../lib/webmcp';

const text = {
  en: {
    kicker: 'AGENT INTERFACE / WEBMCP / READ ONLY',
    title: 'Native agent tools',
    intro: 'When this browser exposes the experimental Document Model Context API, the page registers two narrowly scoped tools for inspecting only the public portfolio state.',
    disclaimer: 'NO MUTATIONS · NO SECRETS · NO PRIVATE DATABASES · NO NETWORK ACTIONS',
    checking: 'CHECKING API…',
    registered: 'REGISTERED / LIVE',
    unsupported: 'UNSUPPORTED',
    error: 'REGISTRATION ERROR',
    registeredBody: 'The browser accepted both tools. Its agent can now inspect the same public projects and progress shown on this page.',
    unsupportedBody: 'This browser does not expose document.modelContext. No polyfill or simulated tool has been registered.',
    errorBody: 'The API exists, but the browser rejected registration. Any partially registered tools were removed.',
    schema: 'INPUT SCHEMA',
    annotation: 'ANNOTATION / READ ONLY',
  },
  uk: {
    kicker: 'АГЕНТНИЙ ІНТЕРФЕЙС / WEBMCP / ЛИШЕ ЧИТАННЯ',
    title: 'Нативні agent tools',
    intro: 'Коли браузер надає експериментальний Document Model Context API, сторінка реєструє два вузькі інструменти лише для перегляду публічного стану портфоліо.',
    disclaimer: 'БЕЗ ЗМІН · БЕЗ СЕКРЕТІВ · БЕЗ ПРИВАТНИХ БАЗ · БЕЗ МЕРЕЖЕВИХ ДІЙ',
    checking: 'ПЕРЕВІРКА API…',
    registered: 'ЗАРЕЄСТРОВАНО / LIVE',
    unsupported: 'НЕ ПІДТРИМУЄТЬСЯ',
    error: 'ПОМИЛКА РЕЄСТРАЦІЇ',
    registeredBody: 'Браузер прийняв обидва інструменти. Його агент може переглядати ті самі публічні проєкти й прогрес, що показані на сторінці.',
    unsupportedBody: 'Цей браузер не надає document.modelContext. Polyfill або імітований інструмент не реєструються.',
    errorBody: 'API існує, але браузер відхилив реєстрацію. Усі частково зареєстровані інструменти видалено.',
    schema: 'СХЕМА ВХОДУ',
    annotation: 'АНОТАЦІЯ / ЛИШЕ ЧИТАННЯ',
  },
} as const;

export default function AgentTools({ locale }: { locale: Locale }) {
  const c = text[locale];
  const definitions = useMemo(() => createPortfolioTools(locale), [locale]);
  const [status, setStatus] = useState<SiteWebMcpStatus>(getSiteWebMcpStatus);

  useEffect(() => {
    setStatus(getSiteWebMcpStatus());
    return subscribeSiteWebMcpStatus(setStatus);
  }, []);

  const statusLabel = status.state === 'checking'
    ? c.checking
    : status.state === 'registered'
      ? c.registered
      : status.state === 'unsupported'
        ? c.unsupported
        : c.error;

  const statusBody = status.state === 'registered'
    ? c.registeredBody
    : status.state === 'unsupported'
      ? c.unsupportedBody
      : status.state === 'registration-error'
        ? c.errorBody
        : c.checking;

  return (
    <div className="module-grid">
      <div className="module-copy">
        <p className="module-kicker">{c.kicker}</p>
        <h3>{c.title}</h3>
        <p>{c.intro}</p>
        <p className="module-disclaimer">{c.disclaimer}</p>
      </div>

      <div className="telemetry-card" aria-live="polite">
        <div className="telemetry-head">
          <span>DOCUMENT.MODELCONTEXT / {statusLabel}</span>
          <i className={status.state === 'registered' ? 'is-ready' : ''} />
        </div>

        <p className={status.state === 'registration-error' ? 'module-warning' : 'telemetry-foot'}>
          {statusBody}
        </p>

        <dl className="compute-output">
          {definitions.map((tool, index) => (
            <div key={tool.name}>
              <dt>TOOL {String(index + 1).padStart(2, '0')} / {c.annotation}</dt>
              <dd>{tool.name}</dd>
              <dt>{c.schema}</dt>
              <dd>{JSON.stringify(tool.inputSchema)}</dd>
            </div>
          ))}
        </dl>

        <p className="telemetry-foot">
          WEBMCP DRAFT · READONLYHINT: TRUE · ADDITIONALPROPERTIES: FALSE
          {status.state === 'registration-error' ? ` · ${status.errorName}` : ''}
        </p>
      </div>
    </div>
  );
}
