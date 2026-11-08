import ContentPanel from '@/components/ContentPanel'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import { getAboutContent, getExperiences } from '@/lib/content'

export default function AboutPage() {
  return (
    <>
      <ContentPanel content={getAboutContent()} />
      <ExperienceTimeline experiences={getExperiences()} />
    </>
  )
}
