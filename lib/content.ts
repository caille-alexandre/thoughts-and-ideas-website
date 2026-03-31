import fs   from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Note, Article } from './types'

const CONTENT = path.join(process.cwd(), 'content')

// Security: only alphanumeric + hyphens — blocks path traversal
const SAFE_SLUG = /^[a-z0-9-]+$/

function read(dir: string) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => /\.mdx?$/.test(f))
}

function parse(file: string) {
  const { data, content } = matter(fs.readFileSync(file, 'utf-8'))
  return { data, content: content.trim() }
}

// ─── Notes ────────────────────────────────────────────────
export function getNotes(): Note[] {
  const dir = path.join(CONTENT, 'notes')
  return read(dir)
    .map(f => {
      const { data, content } = parse(path.join(dir, f))
      if (!data.published) return null
      return { slug: f.replace(/\.mdx?$/, ''), title: data.title, date: data.date ?? '', content } as Note
    })
    .filter((n): n is Note => n !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getNoteBySlug(slug: string): Note | null {
  if (!SAFE_SLUG.test(slug)) return null
  const dir = path.join(CONTENT, 'notes')
  const file = ['.md', '.mdx'].map(ext => path.join(dir, slug + ext)).find(f => fs.existsSync(f))
  if (!file) return null
  const { data, content } = parse(file)
  if (!data.published) return null
  return { slug, title: data.title, date: data.date ?? '', content }
}

// ─── Articles ─────────────────────────────────────────────
export function getArticles(): Article[] {
  const dir = path.join(CONTENT, 'writing')
  return read(dir)
    .map(f => {
      const { data, content } = parse(path.join(dir, f))
      if (!data.published) return null
      return { slug: f.replace(/\.mdx?$/, ''), title: data.title ?? f, date: data.date ?? '', description: data.description, content } as Article
    })
    .filter((a): a is Article => a !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getArticleBySlug(slug: string): Article | null {
  if (!SAFE_SLUG.test(slug)) return null
  const dir = path.join(CONTENT, 'writing')
  const file = ['.md', '.mdx'].map(ext => path.join(dir, slug + ext)).find(f => fs.existsSync(f))
  if (!file) return null
  const { data, content } = parse(file)
  if (!data.published) return null
  return { slug, title: data.title ?? slug, date: data.date ?? '', description: data.description, content }
}

// ─── About ────────────────────────────────────────────────
export function getAboutContent(): string {
  const file = ['.md', '.mdx'].map(ext => path.join(CONTENT, 'about' + ext)).find(f => fs.existsSync(f))
  if (!file) return ''
  return parse(file).content
}
