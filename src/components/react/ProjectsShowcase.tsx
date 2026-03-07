import ProjectCard, { type ProjectCardData } from './ProjectCard';

interface ProjectsShowcaseProps {
	projects: ProjectCardData[];
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
	if (!projects.length) {
		return <p className="panel">Проєкти скоро будуть додані.</p>;
	}

	return (
		<div className="project-grid">
			{projects.map((project, index) => (
				<ProjectCard key={project.slug} project={project} index={index} />
			))}
		</div>
	);
}
