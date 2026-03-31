'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import SectionNav from './SectionNav'
import ListPanel from './ListPanel'
import type { Note, Article } from '@/lib/types'

const STORE_LEFT = 'panel-left-width'
const STORE_MID  = 'panel-mid-width'
const DEF_LEFT = 136, MIN_LEFT = 100, MAX_LEFT = 220
const DEF_MID  = 300, MIN_MID  = 200, MAX_MID  = 480

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const panel1Style = (w: number): React.CSSProperties => ({
  width: w, flexShrink: 0, overflow: 'hidden',
  borderRight: '1px solid var(--border)',
  backgroundColor: 'var(--surface)',
})

const panel2Style = (w: number): React.CSSProperties => ({
  width: w, flexShrink: 0, overflow: 'hidden',
  borderRight: '1px solid var(--border)',
  backgroundColor: 'var(--surface)',
})

const handleStyle = (active: boolean): React.CSSProperties => ({
  width: 4, flexShrink: 0, cursor: 'col-resize', position: 'relative', zIndex: 10,
  backgroundColor: active ? 'var(--accent)' : 'transparent',
  transition: 'background-color 0.15s ease',
})

interface Props { notes: Note[]; articles: Article[]; children: React.ReactNode }

export default function TriPanelLayout({ notes, articles, children }: Props) {
  const pathname = usePathname()
  const isAbout = pathname.startsWith('/about')

  const [leftW, setLeftW] = useState(DEF_LEFT)
  const [midW,  setMidW]  = useState(DEF_MID)
  const [drag,  setDrag]  = useState<'left' | 'mid' | null>(null)
  const target   = useRef<'left' | 'mid' | null>(null)
  const startX   = useRef(0)
  const startLeft = useRef(DEF_LEFT)
  const startMid  = useRef(DEF_MID)

  useEffect(() => {
    const sl = localStorage.getItem(STORE_LEFT)
    const sm = localStorage.getItem(STORE_MID)
    if (sl) setLeftW(clamp(+sl, MIN_LEFT, MAX_LEFT))
    if (sm) setMidW(clamp(+sm, MIN_MID,  MAX_MID))
  }, [])

  const onDragStart = useCallback((t: 'left' | 'mid', e: React.MouseEvent) => {
    e.preventDefault()
    target.current = t
    startX.current = e.clientX
    startLeft.current = leftW
    startMid.current  = midW
    setDrag(t)
  }, [leftW, midW])

  useEffect(() => {
    if (!drag) return
    const onMove = (e: MouseEvent) => {
      const d = e.clientX - startX.current
      if (target.current === 'left') setLeftW(clamp(startLeft.current + d, MIN_LEFT, MAX_LEFT))
      else                            setMidW(clamp(startMid.current  + d, MIN_MID,  MAX_MID))
    }
    const onUp = () => {
      setDrag(null)
      target.current = null
      localStorage.setItem(STORE_LEFT, String(leftW))
      localStorage.setItem(STORE_MID,  String(midW))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [drag, leftW, midW])

  const contentStyle: React.CSSProperties = { flex: '1 1 0%', minWidth: 0, overflowY: 'auto', backgroundColor: 'var(--bg)' }
  const mobileListStyle: React.CSSProperties = { overflowY: 'auto', maxHeight: '40vh', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }

  return (
    <>
      {/* Desktop */}
      <div className={`panels-desktop${drag ? ' select-none' : ''}`}>
        <div style={panel1Style(leftW)} className="flex-col"><SectionNav /></div>
        <div onMouseDown={e => onDragStart('left', e)} style={handleStyle(drag === 'left')}><div style={{ position: 'absolute', inset: '0 -4px' }} /></div>

        {!isAbout && (
          <>
            <div style={panel2Style(midW)} className="flex-col"><ListPanel notes={notes} articles={articles} /></div>
            <div onMouseDown={e => onDragStart('mid', e)} style={handleStyle(drag === 'mid')}><div style={{ position: 'absolute', inset: '0 -4px' }} /></div>
          </>
        )}

        <div style={contentStyle}>{children}</div>
      </div>

      {/* Mobile */}
      <div className="panels-mobile">
        <div style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><SectionNav mobile /></div>
        {!isAbout && <div style={mobileListStyle}><ListPanel notes={notes} articles={articles} /></div>}
        <div style={{ flex: '1 1 0%', overflowY: 'auto', backgroundColor: 'var(--bg)' }}>{children}</div>
      </div>
    </>
  )
}
