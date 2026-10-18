import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import DoctrineWorkspace from '@/features/business-doctrine/DoctrineWorkspace.vue'
import { useDoctrineStore } from '@/entities/doctrine/store'
import mermaid from 'mermaid'

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg class="mock-mermaid"></svg>' }),
  },
}))

vi.mock('@/shared/api/doctrine', () => ({
  doctrineApi: {
    fetchCatalog: vi.fn().mockResolvedValue({ categories: {} }),
    fetchDocument: vi.fn().mockResolvedValue({
      slug: '',
      title: '',
      category: '',
      tags: [],
      created_at: '',
      last_updated_at: '',
      content: '',
    }),
  },
}))

describe('DoctrineWorkspace Markdown and Mermaid Rendering', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders parsed markdown and intercepts mermaid code blocks', async () => {
    const store = useDoctrineStore()
    store.categories = {
      explanation: [
        {
          slug: 'decision_matrix_flow',
          title: 'Decision Matrix Workflow',
          category: 'explanation',
          tags: ['sales'],
          created_at: '2026-10-18',
          last_updated_at: '',
        },
      ],
    }
    store.activeDocument = {
      slug: 'decision_matrix_flow',
      title: 'Decision Matrix Workflow',
      category: 'explanation',
      tags: ['sales', 'workflow'],
      created_at: '2026-10-18',
      last_updated_at: '',
      content: '# Flow\n\n```mermaid\ngraph TD\nA --> B\n```\n',
    }

    const wrapper = mount(DoctrineWorkspace)

    // Wait for markdown render and nextTick mermaid processing
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(wrapper.find('.markdown-body').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Flow')
    expect(mermaid.render).toHaveBeenCalled()
    expect(wrapper.find('.mermaid-diagram').html()).toContain('mock-mermaid')
  })
})
