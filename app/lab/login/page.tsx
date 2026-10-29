import { login } from './actions'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 320 }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 500,
          color: 'var(--text)',
          marginBottom: '0.25rem',
        }}>Lab</p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
        }}>Design system & playground</p>

        <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            autoFocus
            aria-label="Mot de passe"
            required
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--text)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '0.625rem 0.75rem',
              outline: 'none',
              width: '100%',
            }}
          />
          {error && (
            <p role="alert" style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--accent)',
            }}>
              Mot de passe incorrect.
            </p>
          )}
          <button
            type="submit"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--bg)',
              backgroundColor: 'var(--text)',
              border: 'none',
              borderRadius: 4,
              padding: '0.625rem 1rem',
              cursor: 'pointer',
            }}
          >
            Entrer
          </button>
        </form>
      </div>
    </div>
  )
}
