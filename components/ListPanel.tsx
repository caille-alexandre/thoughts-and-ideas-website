'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Note, Article } from '@/lib/types'

function fmtDate(s: string) {
  if (!s) return ''
  return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function section(p: string) {
  if (p.startsWith('/notes'))   return 'notes'
  if (p.startsWith('/writing')) return 'writing'
  return 'about'
}

function slug(p: string) { return p.split('/').pop() ?? '' }

function excerpt(md: string) {
  return md.replace(/^#{1,6}\s.*/gm, '').replace(/[*_`]/g, '').trim().slice(0, 100)
}

const header: React.CSSProperties = {
  flexShrink: 0, padding: '0.75rem 1rem',
  borderBottom: '1px solid var(--border)',
  fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 500,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)',
}

const row = (active: boolean): React.CSSProperties => ({
  display: 'block', padding: '0.875rem 1rem',
  borderBottom: '1px solid var(--border)',
  backgroundColor: active ? 'var(--bg)' : 'transparent',
  textDecoration: 'none', transition: 'background-color 0.1s ease',
})

const meta: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: '0.68rem',
  color: 'var(--text-secondary)', flexShrink: 0, letterSpacing: '0.02em',
}

export default function ListPanel({ notes, articles }: { notes: Note[]; articles: Article[] }) {
  const pathname = usePathname()
  const sec = section(pathname)
  const active = slug(pathname)

  if (sec === 'about') return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={header}>About</div>
      <p style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        UI Designer spécialisé en design systems.
      </p>
    </div>
  )

  const items = sec === 'notes' ? notes : articles
  const base  = sec === 'notes' ? '/notes' : '/writing'
  const label = sec === 'notes'
    ? `${notes.length} note${notes.length !== 1 ? 's' : ''}`
    : `${articles.length} article${articles.length !== 1 ? 's' : ''}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={header}>{label}</div>
      <ul style={{ flex: 1, overflowY: 'auto', listStyle: 'none' }}>
        {items.length === 0 && (
          <li style={{ padding: '1.25rem 1rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Aucun contenu publié.
          </li>
        )}
        {items.map(item => {
          const on = active === item.slug
          const text: string | undefined = 'description' in item
            ? (item as Article).description
            : excerpt((item as Note).content)
          const title = item.title ?? 'Sans titre'
          return (
            <li key={item.slug}>
              <Link href={`${base}/${item.slug}`} style={row(on)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: text ? '0.3rem' : 0 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: on ? 500 : 400, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {title}
                  </span>
                  <span style={meta}>{fmtDate(item.date)}</span>
                </div>
                {text && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {text}
                  </p>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
