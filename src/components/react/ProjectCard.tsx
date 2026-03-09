import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMemo, useState, type CSSProperties, type PointerEvent } from 'react';

export interface ProjectCardData {
	slug: string;
	title: string;
	summary: string;
	period: string;
	url: string;
	repo?: string;
	tags: string[];
	highlight: string[];
	accent: string;
}

export interface ProjectCardLabels {
	openProject: string;
	showDetails: string;
	hideDetails: string;
	openRepository: string;
}

interface ProjectCardProps {
	project: ProjectCardData;
	labels: ProjectCardLabels;
	index: number;
}

const springSettings = {
	stiffness: 185,
	damping: 18,
	mass: 0.52
};

export default function ProjectCard({ project, labels, index }: ProjectCardProps) {
	const [expanded, setExpanded] = useState(false);
	const pointerX = useMotionValue(0);
	const pointerY = useMotionValue(0);

	const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), springSettings);
	const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), springSettings);

	const accentStyle = useMemo(
		() =>
			({
				'--project-accent': project.accent
			}) as CSSProperties,
		[project.accent]
	);

	const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
		const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;

		pointerX.set(normalizedX);
		pointerY.set(normalizedY);
	};

	const handlePointerLeave = () => {
		pointerX.set(0);
		pointerY.set(0);
	};

	return (
		<motion.article
			className="project-card panel"
			style={{ ...accentStyle, rotateX, rotateY, transformPerspective: 1100 }}
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
		>
			<div className="project-card__header">
				<p>{project.period}</p>
				<h3>{project.title}</h3>
			</div>
			<p className="project-card__summary">{project.summary}</p>
			<ul className="chip-list project-card__tags">
				{project.tags.map((tag) => (
					<li key={tag}>{tag}</li>
				))}
			</ul>
			<div className="project-card__actions">
				<a href={project.url} target="_blank" rel="noreferrer" className="button button--ghost">
					{labels.openProject}
				</a>
				<button
					type="button"
					className="button button--primary"
					onClick={() => setExpanded((current) => !current)}
					aria-expanded={expanded}
				>
					{expanded ? labels.hideDetails : labels.showDetails}
				</button>
			</div>
			<AnimatePresence initial={false}>
				{expanded && (
					<motion.div
						className="project-card__details"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.26, ease: 'easeInOut' }}
					>
						<ul>
							{project.highlight.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						{project.repo && (
							<a href={project.repo} target="_blank" rel="noreferrer" className="text-link">
								{labels.openRepository}
							</a>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.article>
	);
}
