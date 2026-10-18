export interface DoctrineMetadata {
  slug: string
  title: string
  category: string
  tags: string[]
  created_at: string
  last_updated_at: string
}

export interface DoctrineDocument extends DoctrineMetadata {
  content: string
}

export interface DoctrineCatalog {
  categories: Record<string, DoctrineMetadata[]>
}
