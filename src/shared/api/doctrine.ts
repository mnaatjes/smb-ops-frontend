import { apiClient } from './client'
import type { DoctrineCatalog, DoctrineDocument } from '@/shared/types/doctrine'

export async function fetchDoctrineCatalog(): Promise<DoctrineCatalog> {
  const response = await apiClient.get<DoctrineCatalog>('/doctrine')
  return response.data
}

export async function fetchDoctrineDocument(category: string, slug: string): Promise<DoctrineDocument> {
  const response = await apiClient.get<DoctrineDocument>(`/doctrine/${category}/${slug}`)
  return response.data
}
