'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS = [
  { id: 'about',   label: 'About',   href: '/about' },
  { id: 'notes',   label: 'Notes',   href: '/notes' },
  { id: 'writing', label: 'Writing', href: '/writing' },
] as const

type Id = (typeof SECTIONS)[number]['id']

function active(pathname: string): Id {
  if (pathname.startsWith('/notes'))   return 'notes'
  if (pathname.startsWith('/writing')) return 'writing'
  return 'about'
}

const linkBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center',
  padding: '0.5rem 1rem',
  fontFamily: 'var(--font-display)',
  fontSize: '0.9375rem',
  letterSpacing: '0.01em',
  textTransform: 'none',
  textDecoration: 'none',
  transition: 'color 0.15s ease, border-color 0.15s ease',
}

export default function SectionNav({ mobile = false }: { mobile?: boolean }) {
  const current = active(usePathname())

  if (mobile) return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', gap: '0.25rem' }}>
      {SECTIONS.map(s => (
        <Link key={s.id} href={s.href} style={{
          ...linkBase,
          padding: '0.25rem 0.625rem',
          fontSize: '0.875rem',
          color: current === s.id ? 'var(--accent)' : 'var(--text-secondary)',
        }}>{s.label}</Link>
      ))}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingTop: '0.75rem' }}>
        {SECTIONS.map(s => {
          const on = current === s.id
          return (
            <Link key={s.id} href={s.href} style={{
              ...linkBase,
              fontWeight: on ? 400 : 300,
              color: on ? 'var(--accent)' : 'var(--text-secondary)',
              borderLeft: `2px solid ${on ? 'var(--accent)' : 'transparent'}`,
              backgroundColor: on ? 'color-mix(in srgb, var(--accent) 6%, transparent)' : 'transparent',
            }}>{s.label}</Link>
          )
        })}
      </nav>
    </div>
  )
}
