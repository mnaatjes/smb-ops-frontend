import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDoctrineStore } from '@/entities/doctrine/store'
import * as doctrineApi from '@/shared/api/doctrine'

vi.mock('@/shared/api/doctrine')

describe('useDoctrineStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads catalog and selects first document automatically', async () => {
    vi.mocked(doctrineApi.fetchDoctrineCatalog).mockResolvedValue({
      categories: {
        explanation: [
          {
            slug: 'retainer_model',
            title: 'Retainer Model',
            category: 'explanation',
            tags: ['retainer'],
            created_at: '2026-10-18',
            last_updated_at: '2026-10-18'
          }
        ]
      }
    })

    vi.mocked(doctrineApi.fetchDoctrineDocument).mockResolvedValue({
      slug: 'retainer_model',
      title: 'Retainer Model',
      category: 'explanation',
      tags: ['retainer'],
      created_at: '2026-10-18',
      last_updated_at: '2026-10-18',
      content: '# Retainer Model Economics\n\nContent here.'
    })

    const store = useDoctrineStore()
    await store.loadCatalog()

    expect(doctrineApi.fetchDoctrineCatalog).toHaveBeenCalled()
    expect(doctrineApi.fetchDoctrineDocument).toHaveBeenCalledWith('explanation', 'retainer_model')
    expect(store.categories.explanation.length).toBe(1)
    expect(store.activeDocument?.slug).toBe('retainer_model')
    expect(store.activeDocument?.content).toContain('# Retainer Model')
  })

  it('selects a specific document on demand', async () => {
    vi.mocked(doctrineApi.fetchDoctrineDocument).mockResolvedValue({
      slug: 'contracts',
      title: 'Standard Contracts',
      category: 'reference',
      tags: ['legal'],
      created_at: '2026-10-18',
      last_updated_at: '2026-10-18',
      content: 'Contract terms.'
    })

    const store = useDoctrineStore()
    await store.selectDocument('reference', 'contracts')

    expect(doctrineApi.fetchDoctrineDocument).toHaveBeenCalledWith('reference', 'contracts')
    expect(store.activeDocument?.slug).toBe('contracts')
  })
})
