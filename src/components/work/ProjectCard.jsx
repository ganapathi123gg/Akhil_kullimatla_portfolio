import { YouTubeProject } from './YouTubeProject'
import { InstagramProject } from './InstagramProject'
import { ModelingProject } from './ModelingProject'

export function ProjectCard({
  project,
  activeMediaId,
  onActivateMedia,
  onStopMedia,
  onOpenLightbox
}) {
  const isVideoActive = activeMediaId === project.id

  if (project.type === 'youtube') {
    return (
      <YouTubeProject
        project={project}
        isActive={isVideoActive}
        onPlay={onActivateMedia}
        onStop={onStopMedia}
      />
    )
  }

  if (project.type === 'instagram') {
    return (
      <InstagramProject
        project={project}
        isActive={isVideoActive}
        onActivate={onActivateMedia}
        onStop={onStopMedia}
      />
    )
  }

  // Default to modeling / photography image
  return (
    <ModelingProject
      project={project}
      onOpenLightbox={onOpenLightbox}
    />
  )
}
