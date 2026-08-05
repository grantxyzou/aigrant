// Project configuration — static project metadata for portfolio showcase.
// Each project can link to a case study and/or live URLs (Vercel, GitHub).

export const projectsData = [
  {
    slug: 'aigrant-portfolio',
    title: 'AI-Powered Portfolio (grantzou.com)',
    description: 'An interactive AI portfolio website featuring an agentic chat interface powered by Azure OpenAI. Visitors can ask questions about my experience, design philosophy, and background, receiving personalized responses.',
    tags: ['React', 'Azure', 'OpenAI', 'AI', 'Portfolio'],
    vercelUrl: null,
    githubRepo: 'grantxyzou/aigrant',
    caseStudySlug: 'azure-storage-mover-s3',
    featured: true,
    accentColor: 'azure',
  },
  {
    slug: 'design-system-exploration',
    title: 'Azure Portal Design System',
    description: 'Exploring design tokens, component systems, and design-to-code workflows within the Azure Portal ecosystem. Researching modern design system practices.',
    tags: ['Design System', 'Azure', 'Figma', 'Design Tokens'],
    vercelUrl: null,
    githubRepo: null,
    caseStudySlug: 'azure-storage-mover-s3',
    featured: true,
    accentColor: 'azure',
  },
  {
    slug: 'data-viz-exploration',
    title: 'Data Visualization Experiments',
    description: 'Interactive data visualization experiments exploring analytics patterns, financial dashboards, and information hierarchy for complex datasets.',
    tags: ['React', 'Data Viz', 'D3', 'Analytics'],
    vercelUrl: null,
    githubRepo: null,
    caseStudySlug: 'advertising-analytics',
    featured: true,
    accentColor: 'gold',
  },
]

export default projectsData
