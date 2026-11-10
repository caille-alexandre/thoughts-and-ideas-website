'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SectionNav from './SectionNav'
import ListPanel from './ListPanel'
import Divider from './Divider'
import MobileMenu from './MobileMenu'
import type { Note, Article } from '@/lib/types'

function CopyLinkButton() {
  const copy = () => navigator.clipboard.writeText(window.location.href)
  return (
    <button onClick={copy} className="mobile-action-btn" aria-label="Copier le lien">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M6.5 9.5a3.535 3.535 0 0 0 5 0l2-2a3.536 3.536 0 0 0-5-5l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9.5 6.5a3.535 3.535 0 0 0-5 0l-2 2a3.536 3.536 0 0 0 5 5l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  )
}

const LEFT_W = 200
const MID_W  = 420

const panel1Style: React.CSSProperties = {
  width: LEFT_W, flexShrink: 0, overflow: 'hidden',
  backgroundColor: 'var(--background-default)',
}

const panel2Style: React.CSSProperties = {
  width: MID_W, flexShrink: 0, overflow: 'hidden',
  backgroundColor: 'var(--background-default)',
}

const contentStyle: React.CSSProperties = {
  flex: '1 1 0%', minWidth: 0, overflowY: 'auto',
  backgroundColor: 'var(--background-secondary)',
}

const gradientBar: React.CSSProperties = {
  height: 32, flexShrink: 0,
  background: 'var(--gradient-header)',
}

interface Props { notes: Note[]; articles: Article[]; children: React.ReactNode }

export default function TriPanelLayout({ notes, articles, children }: Props) {
  const pathname = usePathname()
  const showList  = !pathname.startsWith('/about')
  const isDetail  = /^\/(notes|writing)\/.+/.test(pathname)
  const backHref = pathname.startsWith('/notes') ? '/notes' : '/writing'

  return (
    <>
      {/* Desktop — inchangé */}
      <div className="panels-desktop" style={{ flexDirection: 'column' }}>
        <div style={gradientBar} />
        <Divider size="bold" />
        <div style={{ flex: '1 1 0%', display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          <div style={panel1Style} className="flex-col"><SectionNav /></div>
          <Divider orientation="vertical" size="bold" />
          {showList && (
            <>
              <div style={panel2Style} className="flex-col"><ListPanel notes={notes} articles={articles} /></div>
              <Divider orientation="vertical" size="bold" />
            </>
          )}
          <div style={contentStyle}>{children}</div>
        </div>
      </div>

      {/* Mobile — contenu plein écran + burger flottant */}
      <div className="panels-mobile">
        {showList && !isDetail
          ? <div style={{ flex: '1 1 0%', overflowY: 'auto', backgroundColor: 'var(--background-default)', paddingTop: '4.5rem' }}><ListPanel notes={notes} articles={articles} /></div>
          : <div style={{ flex: '1 1 0%', overflowY: 'auto', backgroundColor: 'var(--background-secondary)', paddingTop: '4.5rem' }}>{children}</div>
        }

        {/* Burger flottant — toujours visible */}
        <MobileMenu />

        {/* Boutons flottants sur les pages détail */}
        {isDetail && (
          <div className="mobile-actions">
            <CopyLinkButton />
            <Link href={backHref} className="mobile-action-btn" aria-label="Fermer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
