export interface Note {
  slug: string
  title?: string
  date: string
  content: string
}

export interface Article {
  slug: string
  title: string
  date: string
  description?: string
  content: string
}
