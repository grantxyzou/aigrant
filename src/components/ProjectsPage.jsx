import ProjectCard from './ProjectCard'
import projectsData from '../projectsConfig'
import './ProjectsPage.css'

const ProjectsPage = ({ onNavigate = () => {} }) => {
  const handleCaseStudyClick = (slug) => {
    onNavigate(`/work/${slug}`)
    window.scrollTo(0, 0)
  }

  return (
    <div className="projects-page">
      {/* Header */}
      <section className="projects-header">
        <h1 className="projects-title">Projects</h1>
        <p className="projects-subtitle">
          A selection of work across design systems, data visualization, AI, and full-stack development.
          Each project includes a live link or repository, plus deeper context in the case study.
        </p>
      </section>

      {/* Projects grid */}
      <section className="projects-grid-section">
        <div className="projects-grid">
          {projectsData.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onCaseStudyClick={handleCaseStudyClick}
            />
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="projects-footer">
        <p>
          Want to chat about a project or explore a collaboration? Reach out via{' '}
          <a href="https://www.linkedin.com/in/grantxyzou" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          {' '}or{' '}
          <a href="https://github.com/grantxyzou" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      </section>
    </div>
  )
}

export default ProjectsPage
