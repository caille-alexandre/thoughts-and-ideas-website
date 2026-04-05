'use client'

import { usePathname } from 'next/navigation'
import SectionNav from './SectionNav'
import ListPanel from './ListPanel'
import type { Note, Article } from '@/lib/types'

const LEFT_W = 200
const MID_W  = 420

const GRADIENT_TOP = 'linear-gradient(to right, var(--gradient-1) 0%, var(--gradient-2) 25%, var(--gradient-3) 64%, var(--gradient-4) 100%)'

const panel1Style: React.CSSProperties = {
  width: LEFT_W, flexShrink: 0, overflow: 'hidden',
  borderRight: '1px solid var(--border)',
  backgroundColor: 'var(--surface)',
}

const panel2Style: React.CSSProperties = {
  width: MID_W, flexShrink: 0, overflow: 'hidden',
  borderRight: '1px solid var(--border)',
  backgroundColor: 'var(--surface)',
}

const contentStyle: React.CSSProperties = {
  flex: '1 1 0%', minWidth: 0, overflowY: 'auto',
  backgroundColor: 'var(--bg)',
}

const mobileListStyle: React.CSSProperties = {
  overflowY: 'auto', maxHeight: '40vh',
  borderBottom: '1px solid var(--border)',
  backgroundColor: 'var(--surface)',
}

const gradientBar: React.CSSProperties = {
  height: 32, flexShrink: 0,
  background: GRADIENT_TOP,
  borderBottom: '1px solid var(--border)',
}

interface Props { notes: Note[]; articles: Article[]; children: React.ReactNode }

export default function TriPanelLayout({ notes, articles, children }: Props) {
  const pathname = usePathname()
  const isAbout = pathname.startsWith('/about')

  return (
    <>
      {/* Desktop */}
      <div className="panels-desktop" style={{ flexDirection: 'column' }}>
        <div style={gradientBar} />
        <div style={{ flex: '1 1 0%', display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          <div style={panel1Style} className="flex-col"><SectionNav /></div>
          {!isAbout && (
            <div style={panel2Style} className="flex-col"><ListPanel notes={notes} articles={articles} /></div>
          )}
          <div style={contentStyle}>{children}</div>
        </div>
      </div>

      {/* Mobile */}
      <div className="panels-mobile">
        <div style={gradientBar} />
        <div style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><SectionNav mobile /></div>
        {!isAbout && <div style={mobileListStyle}><ListPanel notes={notes} articles={articles} /></div>}
        <div style={{ flex: '1 1 0%', overflowY: 'auto', backgroundColor: 'var(--bg)' }}>{children}</div>
      </div>
    </>
  )
}
