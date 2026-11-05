import Link from 'next/link'

interface Props {
  label: string
  href: string
  active?: boolean
  /** Icône « lien externe » (propriété Show Icon de Figma) */
  showIcon?: boolean
  /** Lien externe : nouvel onglet, avec libellé accessible */
  external?: boolean
}

const base: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  width: '100%',
  fontFamily: 'var(--font-display)',
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: '24px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}

export default function MenuEntry({ label, href, active = false, showIcon = false, external = false }: Props) {
  const className = active ? 'menu-entry menu-entry--active' : 'menu-entry'
  const icon = showIcon && <span aria-hidden="true" className="menu-entry__icon" />

  // <a> plutôt que <Link> : un lien externe n'a pas besoin du routeur, et le libellé annonce le nouvel onglet (RGAA)
  if (external) return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — ouvre dans un nouvel onglet`}
      style={base}
      className={className}
    >
      {label}
      {icon}
    </a>
  )

  return (
    <Link href={href} aria-current={active ? 'page' : undefined} style={base} className={className}>
      {label}
      {icon}
    </Link>
  )
}
