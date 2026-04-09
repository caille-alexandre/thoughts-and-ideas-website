import type { Metadata } from 'next'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'
import './globals.css'
import { getNotes, getArticles } from '@/lib/content'
import TriPanelLayout from '@/components/TriPanelLayout'

export const metadata: Metadata = {
  title: 'Alexandre Caillé',
  description: 'UI Designer spécialisé en design systems.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Lecture du nonce injecté par middleware.ts — Next.js l'applique automatiquement
  // à ses propres <script> tags (hydratation RSC, chunks)
  await headers()
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
