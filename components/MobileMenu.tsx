'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Divider from './Divider'

const SECTIONS = [
  { id: 'about',   label: 'About',   href: '/about' },
  { id: 'notes',   label: 'Notes',   href: '/notes' },
  { id: 'writing', label: 'Writing', href: '/writing' },
] as const

const DS_LABEL = 'AC Design System'
const DS_URL = 'https://ac-design-system.alexandrecaille.fr'
const CONTACT_LABEL = 'Write me'
const CONTACT_URL = 'mailto:hello-alex@alexandrecaille.fr'

type SectionId = (typeof SECTIONS)[number]['id']

function activeSection(pathname: string): SectionId {
  if (pathname.startsWith('/notes'))   return 'notes'
  if (pathname.startsWith('/writing')) return 'writing'
  return 'about'
}

const navLink = (active: boolean): React.CSSProperties => ({
  display: 'block',
  padding: '0.625rem 0.75rem',
  fontFamily: 'var(--font-display)',
  fontSize: '1rem',
  fontWeight: active ? 500 : 400,
  color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
  textDecoration: 'none',
  borderLeft: `3px solid ${active ? 'var(--stroke-accent)' : 'transparent'}`,
})

const secondaryLink: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '0.5rem 0.75rem',
  fontFamily: 'var(--font-display)', fontSize: '0.875rem',
  color: 'var(--text-secondary)', textDecoration: 'none',
  borderLeft: '3px solid transparent',
}

export default function MobileMenu() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const current = activeSection(pathname)

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        className="mobile-burger"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          {open ? (
            <>
              <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="2" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <nav
            id="mobile-nav-panel"
            aria-label="Navigation principale"
            style={{
              position: 'absolute',
              top: 0, left: 0, bottom: 0,
              width: '50%',
              backgroundColor: 'var(--background-default)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '2rem 1.5rem',
              gap: '0.25rem',
            }}
          >
            {SECTIONS.map(s => (
              <Link key={s.id} href={s.href} aria-current={current === s.id ? 'page' : undefined} style={navLink(current === s.id)}>
                {s.label}
              </Link>
            ))}
            <div style={{ margin: '0.75rem 0' }}><Divider /></div>
            <a href={DS_URL} target="_blank" rel="noopener noreferrer" aria-label={`${DS_LABEL} — ouvre dans un nouvel onglet`} style={secondaryLink}>
              {DS_LABEL}
              <span aria-hidden="true" className="menu-entry__icon" />
            </a>
            <a href={CONTACT_URL} style={secondaryLink}>{CONTACT_LABEL}</a>
          </nav>
          <div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0, left: '50%', right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          />
        </div>
      )}
    </>
  )
}
