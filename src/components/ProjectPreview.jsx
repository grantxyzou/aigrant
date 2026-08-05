import ProjectCard from './ProjectCard'
import projectsData from '../projectsConfig'
import './ProjectPreview.css'

const ProjectPreview = ({ onNavigate = () => {} }) => {
  const featuredProjects = projectsData.filter((p) => p.featured).slice(0, 3)

  const handleCaseStudyClick = (slug) => {
    onNavigate(`/work/${slug}`)
    window.scrollTo(0, 0)
  }

  const handleViewAllProjects = () => {
    onNavigate('/projects')
    window.scrollTo(0, 0)
  }

  return (
    <section className="project-preview-section">
      <div className="preview-header">
        <h2 className="preview-title">Featured Projects</h2>
        <p className="preview-description">
          A selection of recent work across design, development, and AI.
        </p>
      </div>

      <div className="preview-grid">
        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            onCaseStudyClick={handleCaseStudyClick}
          />
        ))}
      </div>

      <div className="preview-footer">
        <button onClick={handleViewAllProjects} className="view-all-btn">
          View all projects →
        </button>
      </div>
    </section>
  )
}

export default ProjectPreview
