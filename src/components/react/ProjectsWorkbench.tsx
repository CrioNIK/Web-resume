import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { emitHudSound } from '../../lib/hudEvents';
import type { ProjectProfile } from '../../lib/projects';

type WorkbenchLabels = {
	openDossier: string;
	closeDossier: string;
	selectPrompt: string;
	role: string;
	status: string;
	overview: string;
	responsibilities: string;
	architecture: string;
	delivery: string;
	impact: string;
	stack: string;
	codeSample: string;
	openCaseStudy: string;
	openProject: string;
	openRepository: string;
};

interface ProjectsWorkbenchProps {
	projects: ProjectProfile[];
	labels: WorkbenchLabels;
}

export default function ProjectsWorkbench({ projects, labels }: ProjectsWorkbenchProps) {
	const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
	const [panelOpen, setPanelOpen] = useState(false);

	const selectedProject = useMemo(
		() => projects.find((project) => project.slug === selectedSlug) ?? projects[0] ?? null,
		[projects, selectedSlug]
	);

	const openDossier = (slug: string) => {
		setSelectedSlug(slug);
		setPanelOpen(true);
		emitHudSound('panel-open');
	};

	const closeDossier = () => {
		setPanelOpen(false);
		emitHudSound('panel-close');
	};

	if (!projects.length) {
		return null;
	}

	return (
		<div className="workbench-shell">
			<div className="workbench-browser panel">
				{projects.map((project) => {
					const active = selectedProject?.slug === project.slug && panelOpen;
					return (
						<article key={project.slug} className={`workbench-card ${active ? 'is-active' : ''}`}>
							<div className="workbench-card__meta">
								<p>{project.period}</p>
								<span className="workbench-card__accent" style={{ backgroundColor: project.accent }} />
							</div>
							<h3>{project.title}</h3>
							<p className="workbench-card__summary">{project.summary}</p>
							<ul className="workbench-card__highlights">
								{project.highlight.slice(0, 2).map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
							<ul className="chip-list workbench-card__tags">
								{project.tags.map((tag) => (
									<li key={tag}>{tag}</li>
								))}
							</ul>
							<div className="workbench-card__actions">
								<a
									href={project.url}
									target="_blank"
									rel="noreferrer"
									className="button button--ghost"
									onMouseEnter={() => emitHudSound('hover')}
									onClick={() => emitHudSound('confirm')}
								>
									{labels.openProject}
								</a>
								<button
									type="button"
									className="button button--primary"
									onMouseEnter={() => emitHudSound('hover')}
									onClick={() => openDossier(project.slug)}
								>
									{labels.openDossier}
								</button>
							</div>
						</article>
					);
				})}
			</div>
			<div className={`workbench-dock ${panelOpen ? 'is-open' : ''}`}>
				<AnimatePresence mode="wait">
					{panelOpen && selectedProject ? (
						<motion.aside
							key={selectedProject.slug}
							className="panel workbench-detail"
							initial={{ opacity: 0, x: 24 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 28 }}
							transition={{ duration: 0.28, ease: 'easeOut' }}
						>
							<div className="workbench-detail__header">
								<div>
									<p>{selectedProject.period}</p>
									<h3>{selectedProject.title}</h3>
								</div>
								<button
									type="button"
									className="button button--ghost"
									onMouseEnter={() => emitHudSound('hover')}
									onClick={closeDossier}
								>
									{labels.closeDossier}
								</button>
							</div>

							<div className="workbench-detail__grid">
								<div className="workbench-detail__badge">
									<span>{labels.role}</span>
									<strong>{selectedProject.role}</strong>
								</div>
								<div className="workbench-detail__badge">
									<span>{labels.status}</span>
									<strong>{selectedProject.status}</strong>
								</div>
							</div>

							<section className="workbench-detail__section">
								<h4>{labels.overview}</h4>
								<p>{selectedProject.overview}</p>
								{selectedProject.highlight.length > 0 && (
									<ul className="workbench-inline-list">
										{selectedProject.highlight.map((item) => (
											<li key={item}>{item}</li>
										))}
									</ul>
								)}
							</section>

							<section className="workbench-detail__section">
								<h4>{labels.stack}</h4>
								<ul className="chip-list">
									{selectedProject.tags.map((tag) => (
										<li key={tag}>{tag}</li>
									))}
								</ul>
							</section>

							<section className="workbench-detail__section">
								<h4>{labels.responsibilities}</h4>
								<ul>
									{selectedProject.responsibilities.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</section>

							<section className="workbench-detail__section">
								<h4>{labels.architecture}</h4>
								<ul>
									{selectedProject.architecture.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</section>

							<section className="workbench-detail__section">
								<h4>{labels.delivery}</h4>
								<ul>
									{selectedProject.delivery.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</section>

							<section className="workbench-detail__section">
								<h4>{labels.impact}</h4>
								<ul>
									{selectedProject.impact.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</section>

							{selectedProject.codeSnippet && (
								<section className="workbench-detail__section">
									<div className="workbench-detail__section-head">
										<h4>{labels.codeSample}</h4>
										{selectedProject.codeLanguage && <span>{selectedProject.codeLanguage.toUpperCase()}</span>}
									</div>
									<pre className="workbench-code"><code>{selectedProject.codeSnippet}</code></pre>
								</section>
							)}

							<div className="workbench-detail__actions">
								{selectedProject.caseStudyPath && (
									<a
										href={selectedProject.caseStudyPath}
										className="button button--ghost"
										data-route-link="true"
										onMouseEnter={() => emitHudSound('hover')}
									>
										{labels.openCaseStudy}
									</a>
								)}
								<a
									href={selectedProject.url}
									target="_blank"
									rel="noreferrer"
									className="button button--primary"
									onMouseEnter={() => emitHudSound('hover')}
									onClick={() => emitHudSound('confirm')}
								>
									{labels.openProject}
								</a>
								{selectedProject.repo && (
									<a
										href={selectedProject.repo}
										target="_blank"
										rel="noreferrer"
										className="button button--ghost"
										onMouseEnter={() => emitHudSound('hover')}
										onClick={() => emitHudSound('confirm')}
									>
										{labels.openRepository}
									</a>
								)}
							</div>
						</motion.aside>
					) : (
						<motion.aside
							key="empty"
							className="panel workbench-detail workbench-detail--empty"
							initial={{ opacity: 0, x: 12 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 12 }}
						>
							<p>{labels.selectPrompt}</p>
						</motion.aside>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
