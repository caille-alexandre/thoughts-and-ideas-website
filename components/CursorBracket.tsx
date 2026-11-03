'use client'

import { useEffect, useRef } from 'react'

export default function CursorBracket() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cursor = cursorRef.current
    const label = labelRef.current
    if (!cursor || !label) return

    let mouseX = -200
    let mouseY = -200
    let activeEl: Element | null = null
    const state = { x: -200, y: -200, w: 22, h: 22 }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      document.documentElement.classList.add('has-cursor')

      let el = (e.target as Element)?.closest?.('a, button, input, select, textarea, [role="button"]') ?? null
      if (el && el.getBoundingClientRect().height > 140) el = null

      if (el !== activeEl) {
        activeEl = el
        cursor.classList.toggle('cursor-locked', !!el)
        if (el) label.textContent = `<${el.tagName.toLowerCase()}>`
      }
    }

    const onMouseLeave = () => {
      document.documentElement.classList.remove('has-cursor')
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)

    let rafId: number
    const tick = () => {
      let targetX = mouseX - 11
      let targetY = mouseY - 11
      let targetW = 22
      let targetH = 22

      if (activeEl?.isConnected) {
        const rect = activeEl.getBoundingClientRect()
        targetX = rect.left - 5
        targetY = rect.top - 5
        targetW = rect.width + 10
        targetH = rect.height + 10
      }

      state.x = lerp(state.x, targetX, 0.22)
      state.y = lerp(state.y, targetY, 0.22)
      state.w = lerp(state.w, targetW, 0.22)
      state.h = lerp(state.h, targetH, 0.22)

      cursor.style.transform = `translate(${state.x}px, ${state.y}px)`
      cursor.style.width = `${state.w}px`
      cursor.style.height = `${state.h}px`

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(rafId)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div id="cursor-bracket" ref={cursorRef} aria-hidden="true">
      <span className="cb-tl" />
      <span className="cb-tr" />
      <span className="cb-bl" />
      <span className="cb-br" />
      <span className="cb-label" ref={labelRef} />
    </div>
  )
}
