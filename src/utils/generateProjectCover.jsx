// Generate deterministic, portfolio-vibe SVG covers for projects based on slug.
// Each project gets a consistent color and design based on its slug hash.

const colorPalette = [
  { bg: '#0078D4', accent: '#00A4EF', text: '#FFFFFF' },    // Azure Blue
  { bg: '#FFB81C', accent: '#FFD700', text: '#1F1F1F' },    // Gold
  { bg: '#107C10', accent: '#10B981', text: '#FFFFFF' },    // Green
  { bg: '#00B4D8', accent: '#0DD9FF', text: '#FFFFFF' },    // Teal
  { bg: '#8661C5', accent: '#A78BFA', text: '#FFFFFF' },    // Purple
  { bg: '#FF6B6B', accent: '#FF8E8E', text: '#FFFFFF' },    // Coral
]

// Simple hash function to get consistent color per slug
const hashSlug = (slug) => {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash) % colorPalette.length
}

export const getProjectCoverColor = (slug) => {
  const index = hashSlug(slug)
  return colorPalette[index]
}

export const ProjectCover = ({ title, tags = [], slug }) => {
  const color = getProjectCoverColor(slug)
  const primaryTag = tags[0] || 'Project'

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient background */}
      <defs>
        <linearGradient id={`grad-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color.bg} />
          <stop offset="100%" stopColor={color.accent} />
        </linearGradient>
      </defs>

      {/* Background with gradient */}
      <rect width="400" height="240" fill={`url(#grad-${slug})`} />

      {/* Subtle geometric accent (top-right corner) */}
      <circle cx="400" cy="0" r="120" fill={color.accent} opacity="0.15" />

      {/* Bottom accent */}
      <circle cx="0" cy="240" r="100" fill={color.accent} opacity="0.1" />

      {/* Project title */}
      <text
        x="24"
        y="80"
        fontSize="28"
        fontWeight="700"
        fill={color.text}
        fontFamily="IBM Plex Sans, sans-serif"
        textAnchor="start"
        dominantBaseline="middle"
      >
        {title.length > 30 ? title.substring(0, 27) + '...' : title}
      </text>

      {/* Tech stack tag */}
      <rect
        x="24"
        y="130"
        width={primaryTag.length * 8.5 + 16}
        height="28"
        rx="14"
        fill={color.text}
        opacity="0.2"
      />
      <text
        x={32 + (primaryTag.length * 8.5) / 2}
        y="150"
        fontSize="12"
        fontWeight="600"
        fill={color.text}
        fontFamily="IBM Plex Mono, monospace"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {primaryTag}
      </text>

      {/* "View Project" label at bottom */}
      <text
        x="24"
        y="215"
        fontSize="10"
        fill={color.text}
        opacity="0.6"
        fontFamily="IBM Plex Sans, sans-serif"
      >
        → Go check it out
      </text>
    </svg>
  )
}

export default ProjectCover
