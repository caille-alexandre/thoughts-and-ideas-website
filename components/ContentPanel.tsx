import { marked } from 'marked'

interface Props {
  content: string
  title?: string
  date?: string
  description?: string
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ContentPanel({ content, title, date, description }: Props) {
  const html = marked.parse(content, { async: false }) as string

  return (
    <div style={{ padding: '2.5rem 3rem', maxWidth: '720px' }}>
      {(title || date) && (
        <header style={{ marginBottom: '2rem' }}>
          {date && (
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {fmtDate(date)}
            </p>
          )}
          {title && (
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2, marginBottom: description ? '0.75rem' : 0 }}>
              {title}
            </h1>
          )}
          {description && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {description}
            </p>
          )}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)' }} />
        </header>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
