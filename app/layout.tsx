import type { Metadata } from 'next'
import './globals.css'
import { getNotes, getArticles } from '@/lib/content'
import TriPanelLayout from '@/components/TriPanelLayout'

export const metadata: Metadata = {
  title: 'Alexandre Caillé',
  description: 'UI Designer spécialisé en design systems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const notes = getNotes()
  const articles = getArticles()

  return (
    <html lang="fr" className="h-full">
      <body className="h-full">
        <main className="h-full">
          <TriPanelLayout notes={notes} articles={articles}>
            {children}
          </TriPanelLayout>
        </main>
      </body>
    </html>
  )
}
