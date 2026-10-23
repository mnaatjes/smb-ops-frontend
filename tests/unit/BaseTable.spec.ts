import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTable, { type TableColumn } from '@/shared/ui/BaseTable.vue'

describe('BaseTable.vue Headless Assertion Matrix', () => {
  interface DemoRow extends Record<string, unknown> {
    id: string
    name: string
    role: string
    active: boolean
  }

  const sampleCols: TableColumn[] = [
    { key: 'name', label: 'Operator Name' },
    { key: 'role', label: 'Access Tier' },
    { key: 'active', label: 'Status', formatter: (val) => (val ? 'Online' : 'Offline') }
  ]

  const sampleRows: DemoRow[] = [
    { id: 'u-1', name: 'Alice Operator', role: 'Lead Architect', active: true },
    { id: 'u-2', name: 'Bob Engineer', role: 'DevOps Specialist', active: false }
  ]

  it('renders header labels and rows accurately', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: sampleCols,
        rows: sampleRows
      }
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(3)
    expect(headers[0].text()).toBe('Operator Name')
    expect(headers[1].text()).toBe('Access Tier')

    const rows = wrapper.findAll('.data-row')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('Alice Operator')
    expect(rows[0].text()).toContain('Online')
    expect(rows[1].text()).toContain('Offline')
  })

  it('renders loading state when loading is true', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: sampleCols,
        rows: sampleRows,
        loading: true
      }
    })

    expect(wrapper.find('.loading-row').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading dataset...')
    expect(wrapper.find('.data-row').exists()).toBe(false)
  })

  it('renders empty text when rows array is empty', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: sampleCols,
        rows: [],
        emptyText: 'Zero operators found'
      }
    })

    expect(wrapper.find('.empty-row').exists()).toBe(true)
    expect(wrapper.text()).toContain('Zero operators found')
  })

  it('emits row-click when a data row is clicked', async () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: sampleCols,
        rows: sampleRows
      }
    })

    await wrapper.findAll('.data-row')[0].trigger('click')
    expect(wrapper.emitted('row-click')).toHaveLength(1)
    expect(wrapper.emitted('row-click')![0][0]).toEqual(sampleRows[0])
  })

  it('supports custom cell slot overrides', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: sampleCols,
        rows: sampleRows
      },
      slots: {
        'cell-role': '<span class="custom-badge">{{ params.value }} Badge</span>'
      }
    })

    expect(wrapper.find('.custom-badge').exists()).toBe(true)
  })
})
