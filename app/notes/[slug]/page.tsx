import { getNotes, getNoteBySlug } from '@/lib/content'
import ContentPanel from '@/components/ContentPanel'
import { notFound } from 'next/navigation'

// New slugs added via volume (without rebuild) are rendered on-demand
export const dynamicParams = true

export async function generateStaticParams() {
  const notes = getNotes()
  return notes.map((n) => ({ slug: n.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (!note) notFound()

  return (
    <ContentPanel
      content={note.content}
      title={note.title}
      date={note.date}
    />
  )
}
