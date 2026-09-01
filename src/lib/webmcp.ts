import { copy, projects, type Locale } from '../data/content';

export const WEBMCP_TOOL_NAMES = [
  'portfolio.list_projects',
  'portfolio.get_progress',
] as const;

export type WebMcpToolName = (typeof WEBMCP_TOOL_NAMES)[number];

export interface WebMcpJsonSchema {
  readonly type: 'object';
  readonly properties: Readonly<Record<string, never>>;
  readonly additionalProperties: false;
}

export interface WebMcpExecutionOptions {
  readonly signal: AbortSignal;
}

export interface WebMcpToolDefinition {
  readonly name: WebMcpToolName;
  readonly title: string;
  readonly description: string;
  readonly inputSchema: WebMcpJsonSchema;
  readonly execute: (
    input: unknown,
    options: WebMcpExecutionOptions,
  ) => Promise<unknown>;
  readonly annotations: {
    readonly readOnlyHint: true;
    readonly untrustedContentHint: false;
  };
}

export interface WebMcpModelContext {
  registerTool(
    tool: WebMcpToolDefinition,
    options?: { readonly signal?: AbortSignal; readonly exposedTo?: readonly string[] },
  ): Promise<void>;
}

export interface PublicProjectSnapshot {
  readonly id: string;
  readonly title: string;
  readonly kind: string;
  readonly summary: string;
  readonly role: string;
  readonly status: string;
  readonly proof: readonly string[];
  readonly tags: readonly string[];
  readonly links: readonly {
    readonly kind: 'live' | 'source' | 'evidence';
    readonly label: string;
    readonly url: string;
  }[];
}

export interface PortfolioProgressSnapshot {
  readonly highlights: readonly {
    readonly value: string;
    readonly label: string;
  }[];
  readonly trajectory: readonly {
    readonly period: string;
    readonly title: string;
    readonly summary: string;
    readonly status: string;
  }[];
}

export interface PortfolioToolSource {
  getLocale(): Locale;
  listProjects(locale: Locale): readonly PublicProjectSnapshot[];
  getProgress(locale: Locale): PortfolioProgressSnapshot;
}

export type WebMcpRegistrationStatus =
  | {
    readonly state: 'unsupported';
    readonly toolNames: readonly WebMcpToolName[];
  }
  | {
    readonly state: 'registered';
    readonly toolNames: readonly WebMcpToolName[];
  }
  | {
    readonly state: 'registration-error';
    readonly toolNames: readonly WebMcpToolName[];
    readonly errorName: string;
  };

export type SiteWebMcpStatus = { readonly state: 'checking' } | WebMcpRegistrationStatus;

export interface WebMcpRegistrationTask {
  readonly result: Promise<WebMcpRegistrationStatus>;
  dispose(): void;
}

let siteStatus: SiteWebMcpStatus = { state: 'checking' };
let siteGeneration = 0;
const siteListeners = new Set<(status: SiteWebMcpStatus) => void>();

function publishSiteStatus(status: SiteWebMcpStatus) {
  siteStatus = status;
  for (const listener of siteListeners) listener(status);
}

export function getSiteWebMcpStatus(): SiteWebMcpStatus {
  return siteStatus;
}

export function subscribeSiteWebMcpStatus(
  listener: (status: SiteWebMcpStatus) => void,
): () => void {
  siteListeners.add(listener);
  return () => siteListeners.delete(listener);
}

const NO_INPUT_SCHEMA: WebMcpJsonSchema = Object.freeze({
  type: 'object',
  properties: Object.freeze({}),
  additionalProperties: false,
});

const toolCopy = {
  en: {
    listTitle: 'List portfolio projects',
    listDescription: 'Returns the public project summaries currently presented on this portfolio. This tool only reads page-owned, public data and has no side effects.',
    progressTitle: 'Get portfolio progress',
    progressDescription: 'Returns the verified highlights and public trajectory currently presented on this portfolio. This tool only reads page-owned, public data and has no side effects.',
    live: 'Live product',
    source: 'Public source',
  },
  uk: {
    listTitle: 'Перелік проєктів портфоліо',
    listDescription: 'Повертає публічні описи проєктів, які зараз показані в цьому портфоліо. Інструмент лише читає публічні дані сторінки й не має побічних ефектів.',
    progressTitle: 'Прогрес портфоліо',
    progressDescription: 'Повертає перевірені результати й публічну траєкторію, які зараз показані в цьому портфоліо. Інструмент лише читає публічні дані сторінки й не має побічних ефектів.',
    live: 'Живий продукт',
    source: 'Публічний код',
  },
} as const;

function documentLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang.toLowerCase().startsWith('uk') ? 'uk' : 'en';
}

const defaultSource: PortfolioToolSource = {
  getLocale: documentLocale,
  listProjects(locale) {
    const labels = toolCopy[locale];

    return projects.map((project) => ({
      id: project.id,
      title: project.title,
      kind: project.kind[locale],
      summary: project.summary[locale],
      role: project.role[locale],
      status: project.status[locale],
      proof: project.proof.map((item) => item[locale]),
      tags: [...project.tags],
      links: [
        ...(project.liveUrl
          ? [{ kind: 'live' as const, label: labels.live, url: project.liveUrl }]
          : []),
        ...(project.repoUrl
          ? [{ kind: 'source' as const, label: labels.source, url: project.repoUrl }]
          : []),
        ...(project.evidence ?? []).map((item) => ({
          kind: 'evidence' as const,
          label: item.label[locale],
          url: item.url,
        })),
      ],
    }));
  },
  getProgress(locale) {
    return {
      highlights: copy[locale].proofs.map(([value, label]) => ({ value, label })),
      trajectory: copy[locale].trajectory.map(([period, title, summary, status]) => ({
        period,
        title,
        summary,
        status,
      })),
    };
  },
};

function assertNoArguments(input: unknown): asserts input is Record<string, never> {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('WebMCP portfolio tools require an object input.');
  }

  if (Object.keys(input).length !== 0) {
    throw new TypeError('WebMCP portfolio tools do not accept input properties.');
  }
}

function throwIfAborted(signal: AbortSignal | undefined) {
  if (!signal?.aborted) return;
  throw signal.reason ?? new DOMException('The tool execution was aborted.', 'AbortError');
}

function cloneProject(project: PublicProjectSnapshot): PublicProjectSnapshot {
  return {
    ...project,
    proof: [...project.proof],
    tags: [...project.tags],
    links: project.links.map((link) => ({ ...link })),
  };
}

function cloneProgress(progress: PortfolioProgressSnapshot): PortfolioProgressSnapshot {
  return {
    highlights: progress.highlights.map((highlight) => ({ ...highlight })),
    trajectory: progress.trajectory.map((milestone) => ({ ...milestone })),
  };
}

function readModelContext(): WebMcpModelContext | null {
  if (typeof document === 'undefined') return null;
  const candidate = (document as Document & { modelContext?: WebMcpModelContext }).modelContext;
  return candidate && typeof candidate.registerTool === 'function' ? candidate : null;
}

function errorName(error: unknown) {
  if (error && typeof error === 'object' && 'name' in error && typeof error.name === 'string') {
    return error.name;
  }
  return 'RegistrationError';
}

export function createPortfolioTools(
  metadataLocale: Locale,
  source: PortfolioToolSource = defaultSource,
): readonly WebMcpToolDefinition[] {
  const labels = toolCopy[metadataLocale];
  const annotations = Object.freeze({
    readOnlyHint: true as const,
    untrustedContentHint: false as const,
  });

  return [
    {
      name: 'portfolio.list_projects',
      title: labels.listTitle,
      description: labels.listDescription,
      inputSchema: NO_INPUT_SCHEMA,
      annotations,
      async execute(input, options) {
        assertNoArguments(input);
        throwIfAborted(options?.signal);
        const locale = source.getLocale();
        const currentProjects = source.listProjects(locale).map(cloneProject);
        throwIfAborted(options?.signal);

        return {
          schemaVersion: 1,
          locale,
          count: currentProjects.length,
          projects: currentProjects,
        };
      },
    },
    {
      name: 'portfolio.get_progress',
      title: labels.progressTitle,
      description: labels.progressDescription,
      inputSchema: NO_INPUT_SCHEMA,
      annotations,
      async execute(input, options) {
        assertNoArguments(input);
        throwIfAborted(options?.signal);
        const locale = source.getLocale();
        const progress = cloneProgress(source.getProgress(locale));
        throwIfAborted(options?.signal);

        return {
          schemaVersion: 1,
          locale,
          ...progress,
        };
      },
    },
  ];
}

export function registerPortfolioWebMcp(options: {
  readonly locale: Locale;
  readonly source?: PortfolioToolSource;
  readonly modelContext?: WebMcpModelContext | null;
}): WebMcpRegistrationTask {
  const controller = new AbortController();
  const tools = createPortfolioTools(options.locale, options.source);
  const toolNames = tools.map((tool) => tool.name);
  const modelContext = options.modelContext === undefined
    ? readModelContext()
    : options.modelContext;

  const result = Promise.resolve().then(async (): Promise<WebMcpRegistrationStatus> => {
    if (!modelContext) return { state: 'unsupported', toolNames };

    try {
      throwIfAborted(controller.signal);
      for (const tool of tools) {
        await modelContext.registerTool(tool, { signal: controller.signal });
        throwIfAborted(controller.signal);
      }
      return { state: 'registered', toolNames };
    } catch (error) {
      controller.abort();
      return {
        state: 'registration-error',
        toolNames,
        errorName: errorName(error),
      };
    }
  });

  return {
    result,
    dispose() {
      controller.abort();
    },
  };
}

export function startSitePortfolioWebMcp(locale: Locale): () => void {
  const generation = ++siteGeneration;
  publishSiteStatus({ state: 'checking' });
  const registration = registerPortfolioWebMcp({ locale });
  void registration.result.then((status) => {
    if (generation === siteGeneration) publishSiteStatus(status);
  });

  return () => {
    registration.dispose();
    if (generation === siteGeneration) siteGeneration += 1;
  };
}
