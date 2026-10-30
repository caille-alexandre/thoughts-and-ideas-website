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

function LockIcon() {
  return (
    <svg aria-hidden="true" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect x="1" y="4.5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M3 4.5V3a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
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
      <Link href="/lab/login" aria-label="Lab — accès protégé" style={{
        ...linkBase,
        padding: '0.25rem 0.625rem',
        fontSize: '0.875rem',
        color: 'var(--border)',
        display: 'flex', alignItems: 'center', gap: '0.3rem',
      }}>
        <LockIcon />
        Lab
      </Link>
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
        <div style={{ margin: '0.75rem 1rem', borderTop: '1px solid var(--border)' }} />
        <Link href="/lab/login" aria-label="Lab — accès protégé par mot de passe" style={{
          ...linkBase,
          fontWeight: 300,
          color: 'var(--border)',
          borderLeft: '2px solid transparent',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}>
          <LockIcon />
          Lab
        </Link>
      </nav>
    </div>
  )
}
