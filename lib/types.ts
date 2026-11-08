export interface Note {
  slug: string
  title?: string
  date: string
  content: string
  pinned?: boolean
}

export interface Experience {
  slug: string
  /** Intitulé du poste */
  title: string
  company: string
  /** Format YYYY-MM */
  start: string
  /** Format YYYY-MM — absent = poste en cours */
  end?: string
  location?: string
  content: string
}

export interface Article {
  slug: string
  title: string
  date: string
  description?: string
  content: string
}
