'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from './actions'

const GRADIENT = 'linear-gradient(to right, #406fb6 0%, #87676f 25%, #f97c21 64%, #f9c98c 100%)'

const NAV_ITEMS = [
  { label: 'Tokens', href: '/lab/tokens' },
  { label: 'Composants', href: '/lab/composants' },
]

function LabNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Navigation Lab">
      <ul style={{ listStyle: 'none', padding: '1rem 0' }}>
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'block',
                  padding: '0.5rem 1.5rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: active ? 500 : 400,
                  color: active ? 'var(--text)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'color 0.1s ease',
                }}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/lab/login') return <>{children}</>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Gradient bar + header */}
      <div style={{
        height: 32,
        flexShrink: 0,
        background: GRADIENT,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        justifyContent: 'space-between',
      }}>
        <Link href="/lab" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.9)',
          textDecoration: 'none',
        }}>
          Lab
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.68rem',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
          }}>
            ← Portfolio
          </Link>
          <form action={logout}>
            <button type="submit" style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '0.68rem',
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.7)',
              padding: 0,
            }}>
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: 200,
          flexShrink: 0,
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          overflow: 'hidden',
        }}>
          <LabNav />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
