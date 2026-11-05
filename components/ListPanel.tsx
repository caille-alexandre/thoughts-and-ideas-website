'use client'

import { usePathname } from 'next/navigation'
import ListPanelItem from './ListPanelItem'
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

const panel: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '32px',
  height: '100%', overflow: 'hidden',
  padding: '32px 0',
  backgroundColor: 'var(--background-default)',
}

// lineHeight « normal » : équivaut à l'interligne automatique de Figma (titre de 47px)
const heading: React.CSSProperties = {
  flexShrink: 0, padding: '0 24px',
  fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500,
  color: 'var(--text-primary)', lineHeight: 'normal',
}

export default function ListPanel({ notes, articles }: { notes: Note[]; articles: Article[] }) {
  const pathname = usePathname()
  const sec = section(pathname)
  const active = slug(pathname)

  if (sec === 'about') return (
    <div style={panel}>
      <p style={heading}>About</p>
    </div>
  )

  const items = sec === 'notes' ? notes : articles
  const base  = sec === 'notes' ? '/notes' : '/writing'

  return (
    <div style={panel}>
      <p style={heading}>{sec === 'notes' ? 'Notes' : 'Writing'}</p>

      <ul style={{ flex: 1, overflowY: 'auto', listStyle: 'none' }}>
        {items.length === 0 && (
          <li style={{ padding: '12px 24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Aucun contenu publié.
          </li>
        )}
        {items.map(item => (
          <li key={item.slug}>
            <ListPanelItem
              title={item.title ?? 'Sans titre'}
              date={fmtDate(item.date)}
              href={`${base}/${item.slug}`}
              active={active === item.slug}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
