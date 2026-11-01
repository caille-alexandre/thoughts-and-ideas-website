'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS = [
  { id: 'about',   label: 'About',   href: '/about' },
  { id: 'notes',   label: 'Notes',   href: '/notes' },
  { id: 'writing', label: 'Writing', href: '/writing' },
] as const

const LAB_ITEMS = [
  { label: 'Tokens',     href: '/lab/tokens' },
  { label: 'Composants', href: '/lab/composants' },
]

type SectionId = (typeof SECTIONS)[number]['id']

function activeSection(pathname: string): SectionId | 'lab' {
  if (pathname.startsWith('/notes'))   return 'notes'
  if (pathname.startsWith('/writing')) return 'writing'
  if (pathname.startsWith('/lab'))     return 'lab'
  return 'about'
}

const linkBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center',
  padding: '0.5rem 1rem',
  fontFamily: 'var(--font-display)',
  fontSize: '0.9375rem',
  letterSpacing: '0.01em',
  textDecoration: 'none',
  transition: 'color 0.15s ease, border-color 0.15s ease',
}

export default function SectionNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()
  const current = activeSection(pathname)
  const isLab = current === 'lab'

  if (mobile) return (
    <nav aria-label="Navigation principale" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', gap: '0.25rem', flexWrap: 'wrap' }}>
      {SECTIONS.map(s => (
        <Link key={s.id} href={s.href} aria-current={current === s.id ? 'page' : undefined} style={{
          ...linkBase,
          padding: '0.25rem 0.625rem',
          fontSize: '0.875rem',
          color: current === s.id ? 'var(--accent)' : 'var(--text-secondary)',
        }}>{s.label}</Link>
      ))}
      <Link href="/lab" aria-current={isLab ? 'page' : undefined} style={{
        ...linkBase,
        padding: '0.25rem 0.625rem',
        fontSize: '0.875rem',
        color: isLab ? 'var(--accent)' : 'var(--text-secondary)',
      }}>DS-Lab</Link>
    </nav>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <nav aria-label="Navigation principale" style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingTop: '0.75rem' }}>
        {SECTIONS.map(s => {
          const on = current === s.id
          return (
            <Link key={s.id} href={s.href} aria-current={on ? 'page' : undefined} style={{
              ...linkBase,
              fontWeight: on ? 400 : 300,
              color: on ? 'var(--accent)' : 'var(--text-secondary)',
              borderLeft: `2px solid ${on ? 'var(--accent)' : 'transparent'}`,
              backgroundColor: on ? 'color-mix(in srgb, var(--accent) 6%, transparent)' : 'transparent',
            }}>{s.label}</Link>
          )
        })}

        <div style={{ margin: '0.75rem 1rem', borderTop: '1px solid var(--border)' }} />

        <Link href="/lab" aria-current={isLab ? 'page' : undefined} style={{
          ...linkBase,
          fontWeight: isLab ? 400 : 300,
          color: isLab ? 'var(--accent)' : 'var(--text-secondary)',
          borderLeft: `2px solid ${isLab ? 'var(--accent)' : 'transparent'}`,
          backgroundColor: isLab ? 'color-mix(in srgb, var(--accent) 6%, transparent)' : 'transparent',
        }}>DS-Lab</Link>

        {isLab && LAB_ITEMS.map(item => {
          const on = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} aria-current={on ? 'page' : undefined} style={{
              ...linkBase,
              padding: '0.375rem 1rem 0.375rem 2rem',
              fontSize: '0.8125rem',
              fontWeight: on ? 400 : 300,
              color: on ? 'var(--text)' : 'var(--text-secondary)',
              borderLeft: `2px solid ${on ? 'var(--accent)' : 'transparent'}`,
            }}>{item.label}</Link>
          )
        })}
      </nav>
    </div>
  )
}
