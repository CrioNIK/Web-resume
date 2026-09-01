import { describe, expect, it, vi } from 'vitest';
import {
  createPortfolioTools,
  registerPortfolioWebMcp,
  type PortfolioToolSource,
  type WebMcpModelContext,
} from './webmcp';

const executionOptions = () => ({ signal: new AbortController().signal });

function sourceFixture(): PortfolioToolSource {
  let call = 0;

  return {
    getLocale: () => (call++ === 0 ? 'en' : 'uk'),
    listProjects: (locale) => [{
      id: `project-${locale}`,
      title: 'Public project',
      kind: 'Public',
      summary: `Summary ${locale}`,
      role: 'Builder',
      status: 'Shipped',
      proof: ['Public evidence'],
      tags: ['WebMCP'],
      links: [],
    }],
    getProgress: (locale) => ({
      highlights: [{ value: '23', label: `Merged ${locale}` }],
      trajectory: [{ period: 'NOW', title: 'Lab', summary: 'Shipping', status: 'Live' }],
    }),
  };
}

describe('createPortfolioTools', () => {
  it('creates two strictly read-only tools with closed input schemas', () => {
    const tools = createPortfolioTools('en', sourceFixture());

    expect(tools.map((tool) => tool.name)).toEqual([
      'portfolio.list_projects',
      'portfolio.get_progress',
    ]);

    for (const tool of tools) {
      expect(tool.inputSchema).toEqual({
        type: 'object',
        properties: {},
        additionalProperties: false,
      });
      expect(tool.annotations).toEqual({
        readOnlyHint: true,
        untrustedContentHint: false,
      });
    }
  });

  it('validates arguments manually instead of trusting the agent schema', async () => {
    const [listProjects] = createPortfolioTools('en', sourceFixture());

    await expect(listProjects.execute([], executionOptions())).rejects.toThrow(TypeError);
    await expect(listProjects.execute({ unexpected: true }, executionOptions())).rejects.toThrow(TypeError);
  });

  it('reads source state at execution time and returns detached public snapshots', async () => {
    const [listProjects, getProgress] = createPortfolioTools('en', sourceFixture());
    const projects = await listProjects.execute({}, executionOptions()) as {
      locale: string;
      projects: Array<{ id: string; tags: string[] }>;
    };
    const progress = await getProgress.execute({}, executionOptions()) as {
      locale: string;
      highlights: Array<{ label: string }>;
    };

    expect(projects.locale).toBe('en');
    expect(projects.projects[0].id).toBe('project-en');
    expect(progress.locale).toBe('uk');
    expect(progress.highlights[0].label).toBe('Merged uk');
  });

  it('honors an aborted tool execution', async () => {
    const controller = new AbortController();
    controller.abort(new DOMException('Cancelled', 'AbortError'));
    const [listProjects] = createPortfolioTools('en', sourceFixture());

    await expect(listProjects.execute({}, { signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    });
  });
});

describe('registerPortfolioWebMcp', () => {
  it('reports unsupported without registering a fallback', async () => {
    const task = registerPortfolioWebMcp({ locale: 'en', modelContext: null });

    await expect(task.result).resolves.toMatchObject({ state: 'unsupported' });
  });

  it('registers both tools with one cleanup signal', async () => {
    const signals: AbortSignal[] = [];
    const registerTool = vi.fn<WebMcpModelContext['registerTool']>(async (_tool, options) => {
      if (options?.signal) signals.push(options.signal);
    });
    const task = registerPortfolioWebMcp({
      locale: 'uk',
      modelContext: { registerTool },
    });

    await expect(task.result).resolves.toMatchObject({
      state: 'registered',
      toolNames: ['portfolio.list_projects', 'portfolio.get_progress'],
    });
    expect(registerTool).toHaveBeenCalledTimes(2);
    expect(signals).toHaveLength(2);
    expect(signals[0]).toBe(signals[1]);
    expect(signals[0].aborted).toBe(false);

    task.dispose();
    expect(signals[0].aborted).toBe(true);
  });

  it('does not register when disposed before asynchronous setup starts', async () => {
    const registerTool = vi.fn<WebMcpModelContext['registerTool']>();
    const task = registerPortfolioWebMcp({ locale: 'en', modelContext: { registerTool } });

    task.dispose();

    await expect(task.result).resolves.toMatchObject({
      state: 'registration-error',
      errorName: 'AbortError',
    });
    expect(registerTool).not.toHaveBeenCalled();
  });

  it('aborts a partially registered set and reports the browser error name', async () => {
    const signals: AbortSignal[] = [];
    const modelContext: WebMcpModelContext = {
      async registerTool(tool, options) {
        if (options?.signal) signals.push(options.signal);
        if (tool.name === 'portfolio.get_progress') {
          throw new DOMException('Denied', 'NotAllowedError');
        }
      },
    };
    const task = registerPortfolioWebMcp({ locale: 'en', modelContext });

    await expect(task.result).resolves.toMatchObject({
      state: 'registration-error',
      errorName: 'NotAllowedError',
    });
    expect(signals[0].aborted).toBe(true);
  });
});
