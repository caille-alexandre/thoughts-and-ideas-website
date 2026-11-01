import fs from 'fs'
import path from 'path'

interface Token { name: string; value: string }

function parseTokens(): { colors: Token[]; typography: Token[]; gradients: Token[] } {
  const css = fs.readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf-8')
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/)
  if (!rootMatch) return { colors: [], typography: [], gradients: [] }

  const tokens: Token[] = []
  for (const line of rootMatch[1].split('\n')) {
    const m = line.match(/--([a-z][a-z0-9-]*)\s*:\s*([^;]+);/)
    if (m) tokens.push({ name: `--${m[1]}`, value: m[2].trim() })
  }

  return {
    colors:     tokens.filter(t => t.value.match(/^#[0-9a-fA-F]{3,8}$/) && !t.name.includes('gradient')),
    typography: tokens.filter(t => t.name.includes('font')),
    gradients:  tokens.filter(t => t.name.includes('gradient')),
  }
}

function isLightColor(hex: string) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

const pad: React.CSSProperties = { padding: '2rem 2.5rem' }
const label: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '0.65rem',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  marginBottom: '1.25rem',
}
const section: React.CSSProperties = { marginBottom: '3rem' }

export default function TokensPage() {
  const { colors, typography, gradients } = parseTokens()

  return (
    <div style={pad}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.375rem' }}>
        Tokens
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Variables CSS extraites de <code style={{ fontSize: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 3, padding: '0.1em 0.3em' }}>globals.css</code>
      </p>

      {/* ── Couleurs ── */}
      <div style={section}>
        <p style={label}>Couleurs</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {colors.map(t => {
            const light = isLightColor(t.value)
            return (
              <div key={t.name} style={{ width: 120 }}>
                <div style={{
                  height: 80,
                  borderRadius: 6,
                  backgroundColor: t.value,
                  border: '1px solid var(--border)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '0.375rem 0.5rem',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.04em',
                    color: light ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.55)',
                  }}>{t.value}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text)', marginBottom: '0.125rem' }}>
                  {t.name}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Typographie ── */}
      <div style={section}>
        <p style={label}>Typographie</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {typography.map(t => (
            <div key={t.name} style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text)' }}>{t.name}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t.value}</p>
              </div>
              <p style={{ fontFamily: t.value, fontSize: '1.375rem', color: 'var(--text)', lineHeight: 1.3 }}>
                The quick brown fox
              </p>
              <p style={{ fontFamily: t.value, fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Gradients ── */}
      {gradients.length > 0 && (
        <div style={section}>
          <p style={label}>Gradient bar</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {gradients.map(t => (
              <div key={t.name} style={{ width: 64 }}>
                <div style={{
                  height: 48,
                  borderRadius: 4,
                  backgroundColor: t.value,
                  border: '1px solid var(--border)',
                  marginBottom: '0.375rem',
                }} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  {t.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--text)', textAlign: 'center' }}>
                  {t.value}
                </p>
              </div>
            ))}
          </div>
          <div style={{
            height: 12,
            borderRadius: 6,
            background: 'linear-gradient(to right, var(--gradient-1) 0%, var(--gradient-2) 25%, var(--gradient-3) 64%, var(--gradient-4) 100%)',
          }} />
        </div>
      )}
    </div>
  )
}
