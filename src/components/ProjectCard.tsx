import type { CSSProperties } from 'react';
import { copy, localize, type Locale, type Project } from '../data/content';

interface ProjectCardProps {
  project: Project;
  locale: Locale;
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  const c = copy[locale];
  const style = { '--project-accent': project.accent } as CSSProperties;

  return (
    <article className="project-card" style={style}>
      <div className="project-index" aria-hidden="true">{project.index}</div>
      <div className="project-core">
        <p className="project-kind">{localize(project.kind, locale)}</p>
        <h3>{project.title}</h3>
        <p className="project-summary">{localize(project.summary, locale)}</p>
        <p className="project-role">{localize(project.role, locale)}</p>
        <ul className="project-proof">
          {project.proof.map((item) => <li key={item.en}>{localize(item, locale)}</li>)}
        </ul>
        <div className="tag-row" aria-label={c.technologies}>
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="project-meta">
        <p>{localize(project.status, locale)}</p>
        <div className="project-links">
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">{c.openLive}<span aria-hidden="true">↗</span></a>}
          {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer">{c.openSource}<span aria-hidden="true">↗</span></a>}
          {!project.repoUrl && <span className="private-label">{c.privateSource}</span>}
        </div>
        {project.evidence && (
          <details className="evidence-list">
            <summary>{c.showProof} <span aria-hidden="true">+</span></summary>
            <ul>
              {project.evidence.map((item) => (
                <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{localize(item.label, locale)}<span aria-hidden="true">↗</span></a></li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </article>
  );
}
