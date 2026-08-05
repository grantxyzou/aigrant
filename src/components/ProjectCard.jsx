import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { ProjectCover } from '../utils/generateProjectCover'
import './ProjectCard.css'

export const ProjectCard = ({ project, onCaseStudyClick }) => {
  return (
    <div className="project-card">
      {/* Cover image area */}
      <div className="project-cover">
        <ProjectCover title={project.title} tags={project.tags} slug={project.slug} />
      </div>

      {/* Card content */}
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        {/* Tech tags */}
        <div className="project-tags">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Links section */}
        <div className="project-links">
          {project.githubRepo && (
            <a
              href={`https://github.com/${project.githubRepo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-btn github-btn"
              aria-label={`View ${project.title} on GitHub`}
            >
              <FaGithub /> GitHub
            </a>
          )}
          {project.vercelUrl && (
            <a
              href={project.vercelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-btn vercel-btn"
              aria-label={`View ${project.title} on Vercel`}
            >
              <FaExternalLinkAlt /> Live
            </a>
          )}
        </div>

        {/* Case study link */}
        {project.caseStudySlug && (
          <button
            onClick={() => onCaseStudyClick(project.caseStudySlug)}
            className="case-study-link"
          >
            Read case study →
          </button>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
