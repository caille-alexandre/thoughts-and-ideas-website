'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import MenuEntry from './MenuEntry'
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

  if (mobile) return (
    <nav aria-label="Navigation principale" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', gap: '0.25rem', flexWrap: 'wrap' }}>
      {SECTIONS.map(s => (
        <Link key={s.id} href={s.href} aria-current={current === s.id ? 'page' : undefined} style={{
          ...mobileLink,
          color: current === s.id ? 'var(--text-accent)' : 'var(--text-secondary)',
        }}>{s.label}</Link>
      ))}
      <a href={DS_URL} target="_blank" rel="noopener noreferrer" aria-label={`${DS_LABEL} — ouvre dans un nouvel onglet`} style={{ ...mobileLink, color: 'var(--text-secondary)' }}>
        {DS_LABEL}
        <span aria-hidden="true" className="menu-entry__icon" />
      </a>
      <a href={CONTACT_URL} style={{ ...mobileLink, color: 'var(--text-secondary)' }}>{CONTACT_LABEL}</a>
    </nav>
  )

  return (
    <nav
      aria-label="Navigation principale"
      style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px 0', width: '100%' }}
    >
      {SECTIONS.map(s => (
        <MenuEntry key={s.id} label={s.label} href={s.href} active={current === s.id} />
      ))}

      <div style={{ padding: '0 16px' }}>
        <Divider />
      </div>

      <MenuEntry label={DS_LABEL} href={DS_URL} external showIcon />
      <MenuEntry label={CONTACT_LABEL} href={CONTACT_URL} />
    </nav>
  )
}
