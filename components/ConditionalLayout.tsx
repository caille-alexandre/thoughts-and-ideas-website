'use client'

import { usePathname } from 'next/navigation'
import TriPanelLayout from './TriPanelLayout'
import type { Note, Article } from '@/lib/types'

interface Props {
  notes: Note[]
  articles: Article[]
  children: React.ReactNode
}

export default function ConditionalLayout({ notes, articles, children }: Props) {
  const pathname = usePathname()
  if (pathname.startsWith('/lab')) return <>{children}</>
  return <TriPanelLayout notes={notes} articles={articles}>{children}</TriPanelLayout>
}
