export default function AboutContent() {
  return (
    <div
      style={{
        padding: '3.5rem 4rem',
        maxWidth: '860px',
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3rem',
            fontWeight: 600,
            letterSpacing: '-0.0625rem',
            lineHeight: 1,
            color: 'var(--text)',
          }}
        >
          Alexandre CAILLÉ
        </h1>
      </div>

      {/* Body */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.125rem',
        }}
      >
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--text)' }}>
          Hey&nbsp;! 👋🏻
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--text)' }}>
          Moi c'est Alex, UI Designer chez LVMH avec plus de 7 ans d'expérience dans l'industrie du design. J'ai aidé à l'élaboration et la mise en place de plusieurs Design Systems. Quelques unes des entreprises pour lesquelles j'ai travaillé&nbsp;: LVMH, L'Occitane en Provence, Bedrock Streaming, 100M…
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--text)' }}>
          J'apprécie également redonner et façonner l'avenir du design&nbsp;; si vous souhaitez des retours sur votre portfolio, envoyez-moi un message&nbsp;! 📫
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--text)' }}>
          Au fait, je n'ai jamais rencontré une nouvelle technologie que je ne voulais pas tester ou un cookie que je ne voulais pas essayer&nbsp;! 🍪
        </p>
      </div>

      {/* Links */}
      <div
        style={{
          marginTop: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
        }}
      >
        <span>See also:&nbsp;&nbsp;</span>
        {[
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alexandrecaille/' },
          { label: 'GitHub', href: 'https://github.com/caille-alexandre' },
          { label: 'X.com', href: 'https://x.com/AlexandreCaille' },
        ].map((link, i, arr) => (
          <span key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text)',
                textDecoration: 'underline',
                textDecorationThickness: '1px',
                textUnderlineOffset: '2px',
                fontFamily: 'var(--font-body)',
              }}
            >
              {link.label}
            </a>
            {i < arr.length - 1 && <span style={{ color: 'var(--text-secondary)' }}>,&nbsp;&nbsp;</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
