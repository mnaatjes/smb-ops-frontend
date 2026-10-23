<script setup lang="ts">
export interface TableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  formatter?: (val: unknown, row: Record<string, unknown>) => string
}

withDefaults(
  defineProps<{
    columns: TableColumn[]
    rows: Record<string, unknown>[]
    loading?: boolean
    emptyText?: string
    rowKey?: string
  }>(),
  {
    loading: false,
    emptyText: 'No records available.',
    rowKey: 'id'
  }
)

const emit = defineEmits<{
  (e: 'row-click', row: Record<string, unknown>): void
}>()

function handleRowClick(row: Record<string, unknown>): void {
  emit('row-click', row)
}

function getRowVal(row: Record<string, unknown>, key: string): unknown {
  return row[key]
}
</script>

<template>
  <div class="base-table-container">
    <table class="base-table">
      <thead>
        <tr class="header-row">
          <th
            v-for="col in columns"
            :key="col.key"
            class="table-th"
            :style="{ width: col.width, textAlign: col.align || 'left' }"
          >
            <slot :name="`header-${col.key}`" :column="col">
              {{ col.label }}
            </slot>
          </th>
        </tr>
      </thead>

      <tbody>
        <!-- Loading State -->
        <tr v-if="loading" class="state-row loading-row">
          <td :colspan="columns.length" class="state-cell">
            <div class="loading-cluster">
              <span class="spinner" aria-hidden="true"></span>
              <span class="state-text">Loading dataset...</span>
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="rows.length === 0" class="state-row empty-row">
          <td :colspan="columns.length" class="state-cell">
            <slot name="empty">
              <span class="empty-text">{{ emptyText }}</span>
            </slot>
          </td>
        </tr>

        <!-- Nominal Row Render -->
        <tr
          v-else
          v-for="(row, rIdx) in rows"
          :key="(getRowVal(row, rowKey) as string) || rIdx"
          class="data-row"
          @click="handleRowClick(row)"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="table-td"
            :style="{ textAlign: col.align || 'left' }"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="getRowVal(row, col.key)">
              {{ col.formatter ? col.formatter(getRowVal(row, col.key), row) : (getRowVal(row, col.key) ?? '—') }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.base-table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-surface);
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.header-row {
  background-color: var(--bg-surface-subtle);
  border-bottom: 2px solid var(--border-color);
}

.table-th {
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  white-space: nowrap;
}

.table-td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border-color);
  line-height: 1.4;
}

.data-row {
  transition: background-color 0.15s ease;
  cursor: pointer;
}

.data-row:hover {
  background-color: var(--bg-surface-hover);
}

.data-row:last-child .table-td {
  border-bottom: none;
}

.state-row {
  background-color: var(--bg-surface);
}

.state-cell {
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--text-muted);
}

.loading-cluster {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 9999px;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-text {
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
