'use client'

import { usePathname } from 'next/navigation'
import SectionNav from './SectionNav'
import ListPanel from './ListPanel'
import Divider from './Divider'
import type { Note, Article } from '@/lib/types'

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

const mobileListStyle: React.CSSProperties = {
  overflowY: 'auto', maxHeight: '40vh',
  backgroundColor: 'var(--background-default)',
}

const gradientBar: React.CSSProperties = {
  height: 32, flexShrink: 0,
  background: 'var(--gradient-header)',
}

interface Props { notes: Note[]; articles: Article[]; children: React.ReactNode }

export default function TriPanelLayout({ notes, articles, children }: Props) {
  const pathname = usePathname()
  const showList = !pathname.startsWith('/about')

  return (
    <>
      {/* Desktop */}
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

      {/* Mobile */}
      <div className="panels-mobile">
        <div style={gradientBar} />
        <Divider size="bold" />
        <div style={{ backgroundColor: 'var(--background-default)' }}><SectionNav mobile /></div>
        <Divider size="bold" />
        {showList && <><div style={mobileListStyle}><ListPanel notes={notes} articles={articles} /></div><Divider size="bold" /></>}
        <div style={{ flex: '1 1 0%', overflowY: 'auto', backgroundColor: 'var(--background-secondary)' }}>{children}</div>
      </div>
    </>
  )
}
