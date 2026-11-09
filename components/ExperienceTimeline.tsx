import { marked } from 'marked'
import type { Experience } from '@/lib/types'

// YYYY-MM → « oct. 2024 » (UTC : évite le décalage de fuseau sur le 1er du mois)
function fmtMonth(s: string) {
  return new Date(`${s}-01`).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) return null

  return (
    <section aria-labelledby="experience-title" style={{ padding: '0 32px 30vh', maxWidth: 720 }}>
      <div className="prose"><h2 id="experience-title">{"Expérience"}</h2></div>
      <ol className="timeline">
        {experiences.map(e => (
          <li key={e.slug} className="timeline__item">
            <div className="timeline__content">
              <p className="timeline__meta">
                <time dateTime={e.start}>{fmtMonth(e.start)}</time>
                {' – '}
                {e.end ? <time dateTime={e.end}>{fmtMonth(e.end)}</time> : "aujourd’hui"}
              </p>
              <h3 className="timeline__title">{e.title}</h3>
              <p className="timeline__company">{[e.company, e.location].filter(Boolean).join(' · ')}</p>
              {e.content && (
                <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(e.content, { async: false }) as string }} />
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
