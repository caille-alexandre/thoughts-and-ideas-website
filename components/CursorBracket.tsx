'use client'
import { useEffect, useRef, useState } from 'react'

const INTERACTIVE = 'a, button, input, select, textarea, [role="button"]'
const LERP = 0.22
const DEFAULT_SIZE = 22
const BRACKET_SIZE = 8
const BRACKET_THICKNESS = 1.5
const MARGIN = 5
// Au-delà, un bloc cliquable (ex. carte entière) n'est plus « encadré »
const MAX_ELEMENT_HEIGHT = 140

interface State {
  x: number
  y: number
  w: number
  h: number
}

export default function CursorBracket() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const tagRef   = useRef<HTMLSpanElement>(null)
  const cur      = useRef<State>({ x: 0, y: 0, w: DEFAULT_SIZE, h: DEFAULT_SIZE })
  const tgt      = useRef<State>({ x: 0, y: 0, w: DEFAULT_SIZE, h: DEFAULT_SIZE })
  const hoveredEl = useRef<Element | null>(null)
  const rafRef   = useRef(0)
  const [enabled, setEnabled] = useState(false)

  // Uniquement avec un pointeur précis (souris / trackpad) — pas sur écran tactile
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false

    function setVisible(v: boolean) {
      visible = v
      if (wrapRef.current) wrapRef.current.style.visibility = v ? 'visible' : 'hidden'
    }

    function lerp(a: number, b: number) {
      return reduceMotion.matches ? b : a + (b - a) * LERP
    }

    function clearHover() {
      hoveredEl.current = null
      tgt.current.w = DEFAULT_SIZE
      tgt.current.h = DEFAULT_SIZE
      if (tagRef.current) tagRef.current.style.display = 'none'
    }

    function updateFromElement(el: Element) {
      const rect = el.getBoundingClientRect()
      tgt.current = {
        x: rect.left + rect.width  / 2,
        y: rect.top  + rect.height / 2,
        w: rect.width  + MARGIN * 2,
        h: rect.height + MARGIN * 2,
      }
      if (tagRef.current) {
        tagRef.current.textContent = `<${el.tagName.toLowerCase()}>`
        tagRef.current.style.display = 'block'
      }
    }

    function tick() {
      // Suit l'élément survolé à chaque frame (scroll, mise en page) ; lâche-le s'il a quitté le DOM
      const el = hoveredEl.current
      if (el) {
        if (el.isConnected) updateFromElement(el)
        else clearHover()
      }

      const c = cur.current
      const t = tgt.current
      // Position instantanée — pas de retard derrière le curseur natif
      c.x = t.x
      c.y = t.y
      // Seule la taille est interpolée (défaut ↔ élément survolé)
      c.w = lerp(c.w, t.w)
      c.h = lerp(c.h, t.h)

      const wrap = wrapRef.current
      if (wrap) {
        wrap.style.transform = `translate(${c.x - c.w / 2}px, ${c.y - c.h / 2}px)`
        wrap.style.width  = `${c.w}px`
        wrap.style.height = `${c.h}px`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    function onMouseMove(e: MouseEvent) {
      if (!visible) {
        // Premier mouvement : on place le cadre avant de l'afficher
        cur.current.x = tgt.current.x = e.clientX
        cur.current.y = tgt.current.y = e.clientY
        setVisible(true)
      }
      if (!hoveredEl.current) {
        tgt.current.x = e.clientX
        tgt.current.y = e.clientY
      }
    }

    function onMouseOver(e: MouseEvent) {
      const el = (e.target as Element).closest?.(INTERACTIVE)
      if (el && el !== hoveredEl.current && el.getBoundingClientRect().height <= MAX_ELEMENT_HEIGHT) {
        hoveredEl.current = el
        updateFromElement(el)
      }
    }

    function onMouseOut(e: MouseEvent) {
      const related = e.relatedTarget as Element | null
      // La souris quitte la fenêtre
      if (!related) {
        clearHover()
        setVisible(false)
        return
      }
      const el = hoveredEl.current
      if (el && !el.contains(related)) clearHover()
    }

    setVisible(false)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout',  onMouseOut)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout',  onMouseOut)
      cancelAnimationFrame(rafRef.current)
      hoveredEl.current = null
    }
  }, [enabled])

  if (!enabled) return null

  const corner: React.CSSProperties = {
    position: 'absolute',
    width:  BRACKET_SIZE,
    height: BRACKET_SIZE,
  }
  const b = `${BRACKET_THICKNESS}px solid var(--layer-accent)`

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        visibility: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* Top-left */}
      <div style={{ ...corner, top: 0, left: 0, borderTop: b, borderLeft: b }} />
      {/* Top-right */}
      <div style={{ ...corner, top: 0, right: 0, borderTop: b, borderRight: b }} />
      {/* Bottom-left */}
      <div style={{ ...corner, bottom: 0, left: 0, borderBottom: b, borderLeft: b }} />
      {/* Bottom-right */}
      <div style={{ ...corner, bottom: 0, right: 0, borderBottom: b, borderRight: b }} />

      <span
        ref={tagRef}
        style={{
          display: 'none',
          position: 'absolute',
          bottom: 0,
          right: 0,
          transform: 'translate(0, 100%)',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.04em',
          color: 'var(--text-accent)',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          paddingTop: 2,
        }}
      />
    </div>
  )
}
