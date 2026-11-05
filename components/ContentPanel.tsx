import { marked } from 'marked'
import Divider from './Divider'

interface Props {
  content: string
  title?: string
  date?: string
  description?: string
  /** Largeur max de la colonne de lecture (le panneau, lui, remplit l'espace disponible) */
  maxWidth?: string | number
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ContentPanel({ content, title, date, description, maxWidth = 720 }: Props) {
  const html = marked.parse(content, { async: false }) as string

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px', maxWidth }}>
      {(title || date) && (
        <header style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            {date && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 400, lineHeight: '16px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                {fmtDate(date)}
              </p>
            )}
            {title && (
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500, lineHeight: 'normal', color: 'var(--text-primary)' }}>
                {title}
              </h1>
            )}
            {description && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '0.5rem' }}>
                {description}
              </p>
            )}
          </div>
          <Divider />
        </header>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
