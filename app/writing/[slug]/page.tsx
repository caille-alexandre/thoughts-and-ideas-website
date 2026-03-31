import { getArticles, getArticleBySlug } from '@/lib/content'
import ContentPanel from '@/components/ContentPanel'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const articles = getArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <ContentPanel
      content={article.content}
      title={article.title}
      date={article.date}
      description={article.description}
    />
  )
}
