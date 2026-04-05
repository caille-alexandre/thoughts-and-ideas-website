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

const INSET = '2rem'

const meta: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: '0.68rem',
  color: 'var(--text-secondary)', flexShrink: 0, letterSpacing: '0.02em',
}

const divider: React.CSSProperties = {
  borderBottom: '1px solid var(--border)',
}

export default function ListPanel({ notes, articles }: { notes: Note[]; articles: Article[] }) {
  const pathname = usePathname()
  const sec = section(pathname)
  const active = slug(pathname)

  if (sec === 'about') return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexShrink: 0, padding: `0.75rem ${INSET}`, borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>About</div>
      <p style={{ padding: `1rem ${INSET}`, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        UI Designer spécialisé en design systems.
      </p>
    </div>
  )

  const items = sec === 'notes' ? notes : articles
  const base  = sec === 'notes' ? '/notes' : '/writing'

  const sectionMeta = sec === 'notes'
    ? { title: 'Notes', description: 'Pensées courtes, observations du quotidien, fragments en transit.' }
    : { title: 'Writing', description: 'Articles longs, réflexions structurées sur le design et les systèmes.' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Section header */}
      <div style={{ flexShrink: 0, padding: `2rem ${INSET} 1.75rem`, ...divider }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.375rem' }}>
          {sectionMeta.title}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {sectionMeta.description}
        </p>
      </div>

      {/* Items list */}
      <ul style={{ flex: 1, overflowY: 'auto', listStyle: 'none' }}>
        {items.length === 0 && (
          <li style={{ padding: `1.5rem ${INSET}`, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
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
              <Link href={`${base}/${item.slug}`} style={{
                display: 'block',
                padding: `1.625rem ${INSET} 0`,
                backgroundColor: on ? 'var(--bg)' : 'transparent',
                textDecoration: 'none',
                transition: 'background-color 0.1s ease',
              }}>
                <div style={{ paddingBottom: '1.625rem', ...divider }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: text ? '0.375rem' : 0 }}>
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
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
