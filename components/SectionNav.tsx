'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import MenuEntry from './MenuEntry'
import Divider from './Divider'
import ThemeToggle from './ThemeToggle'

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

const mobileLink: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px',
  padding: '0.25rem 0.625rem',
  fontFamily: 'var(--font-display)',
  fontSize: '0.875rem',
  letterSpacing: '0.01em',
  textDecoration: 'none',
}

export default function SectionNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()
  const current = activeSection(pathname)
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  if (mobile) {
    const currentLabel = SECTIONS.find(s => s.id === current)?.label ?? ''
    return (
      <nav aria-label="Navigation principale">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 1rem' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
            Alexandre C.
          </span>
          <button
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none">
              {open ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5.5" x2="17" y2="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="3" y1="14.5" x2="17" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
        {open && (
          <div id="mobile-nav-menu" style={{ borderTop: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                href={s.href}
                aria-current={current === s.id ? 'page' : undefined}
                style={{
                  ...mobileLink,
                  display: 'flex',
                  borderLeft: `3px solid ${current === s.id ? 'var(--stroke-accent)' : 'transparent'}`,
                  color: current === s.id ? 'var(--text-accent)' : 'var(--text-secondary)',
                  padding: '0.5rem 1rem',
                }}
              >
                {s.label}
              </Link>
            ))}
            <div style={{ padding: '0.25rem 1rem' }}><Divider /></div>
            <a
              href={DS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${DS_LABEL} — ouvre dans un nouvel onglet`}
              style={{ ...mobileLink, display: 'flex', padding: '0.5rem 1rem', color: 'var(--text-secondary)', borderLeft: '3px solid transparent' }}
            >
              {DS_LABEL}
              <span aria-hidden="true" className="menu-entry__icon" style={{ marginLeft: '6px' }} />
            </a>
            <a
              href={CONTACT_URL}
              style={{ ...mobileLink, display: 'flex', padding: '0.5rem 1rem', color: 'var(--text-secondary)', borderLeft: '3px solid transparent' }}
            >
              {CONTACT_LABEL}
            </a>
          </div>
        )}
      </nav>
    )
  }

  return (
    <nav
      aria-label="Navigation principale"
      style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px 0', width: '100%', height: '100%' }}
    >
      {SECTIONS.map(s => (
        <MenuEntry key={s.id} label={s.label} href={s.href} active={current === s.id} />
      ))}

      <div style={{ padding: '0 16px' }}>
        <Divider />
      </div>

      <MenuEntry label={DS_LABEL} href={DS_URL} external showIcon />
      <MenuEntry label={CONTACT_LABEL} href={CONTACT_URL} />

      <div style={{ marginTop: 'auto', padding: '0 0 4px' }}>
        <div style={{ padding: '0 16px' }}><Divider /></div>
        <ThemeToggle />
      </div>
    </nav>
  )
}
