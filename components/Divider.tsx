interface Props {
  orientation?: 'horizontal' | 'vertical'
  /** thin : 1px (layer-default) · bold : 4px (layer-inverted) */
  size?: 'thin' | 'bold'
}

export default function Divider({ orientation = 'horizontal', size = 'thin' }: Props) {
  const thickness = size === 'bold' ? 4 : 1
  const color = size === 'bold' ? 'var(--layer-inverted)' : 'var(--layer-default)'

  if (orientation === 'vertical') return (
    <div
      role="separator"
      aria-orientation="vertical"
      style={{ width: thickness, alignSelf: 'stretch', minHeight: '40px', flexShrink: 0, backgroundColor: color }}
    />
  )

  return (
    <div
      role="separator"
      style={{ height: thickness, width: '100%', flexShrink: 0, backgroundColor: color }}
    />
  )
}
