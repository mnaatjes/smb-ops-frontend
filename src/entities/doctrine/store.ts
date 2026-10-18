import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DoctrineMetadata, DoctrineDocument } from '@/shared/types/doctrine'
import { fetchDoctrineCatalog, fetchDoctrineDocument } from '@/shared/api/doctrine'

export const useDoctrineStore = defineStore('doctrine', () => {
  const categories = ref<Record<string, DoctrineMetadata[]>>({})
  const activeDocument = ref<DoctrineDocument | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function loadCatalog(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await fetchDoctrineCatalog()
      categories.value = data.categories
      // Default to first document if available and none selected
      if (!activeDocument.value) {
        const firstCategory = Object.keys(data.categories)[0]
        if (firstCategory && data.categories[firstCategory].length > 0) {
          const firstDoc = data.categories[firstCategory][0]
          await selectDocument(firstDoc.category, firstDoc.slug)
        }
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load doctrine catalog'
    } finally {
      loading.value = false
    }
  }

  async function selectDocument(category: string, slug: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      activeDocument.value = await fetchDoctrineDocument(category, slug)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load document'
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    activeDocument,
    loading,
    error,
    loadCatalog,
    selectDocument
  }
})
