import Link from 'next/link'

interface Props {
  title: string
  /** Date déjà formatée (ex. 12/10/25) */
  date: string
  href: string
  /** État « selected » : fond accent à 10 % + point dégradé */
  active?: boolean
}

// États Figma : default / hover (CSS :hover) / selected (active)
export default function ListPanelItem({ title, date, href, active = false }: Props) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={active ? 'list-item list-item--active' : 'list-item'}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 24px', textDecoration: 'none' }}
    >
      <span style={{ display: 'flex', alignItems: 'center', height: '20px', width: '8px', flexShrink: 0 }}>
        {active && (
          <span
            aria-hidden="true"
            style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gradient-header)' }}
          />
        )}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 500, lineHeight: '20px',
          color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {title}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', lineHeight: '13px', color: 'var(--text-secondary)' }}>
          {date}
        </span>
      </span>
    </Link>
  )
}
