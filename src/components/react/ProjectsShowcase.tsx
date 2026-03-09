import ProjectCard, { type ProjectCardData, type ProjectCardLabels } from './ProjectCard';

interface ProjectsShowcaseLabels extends ProjectCardLabels {
	empty: string;
}

interface ProjectsShowcaseProps {
	projects: ProjectCardData[];
	labels: ProjectsShowcaseLabels;
}

export default function ProjectsShowcase({ projects, labels }: ProjectsShowcaseProps) {
	if (!projects.length) {
		return <p className="panel">{labels.empty}</p>;
	}

	return (
		<div className="project-grid">
			{projects.map((project, index) => (
				<ProjectCard key={project.slug} project={project} labels={labels} index={index} />
			))}
		</div>
	);
}
