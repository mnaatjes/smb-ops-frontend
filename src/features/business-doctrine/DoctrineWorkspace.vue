<script setup lang="ts">
import { onMounted, watch, nextTick, ref } from 'vue'
import { marked } from 'marked'
import mermaid from 'mermaid'
import { useDoctrineStore } from '@/entities/doctrine/store'
import BaseBadge from '@/shared/ui/BaseBadge.vue'

const doctrineStore = useDoctrineStore()
const renderedHtml = ref('')
const docContainer = ref<HTMLElement | null>(null)

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'default',
})

const renderMarkdown = async (content: string) => {
  if (!content) {
    renderedHtml.value = ''
    return
  }

  const renderer = new marked.Renderer()
  let diagramIndex = 0

  renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
    if (lang === 'mermaid') {
      const id = `mermaid-svg-${Date.now()}-${diagramIndex++}`
      // Escape HTML entities in raw mermaid code to preserve syntax in data attribute
      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
      return `<div class="mermaid-diagram" id="${id}" data-mermaid="${escaped}"></div>`
    }
    return `<pre><code class="language-${lang || 'text'}">${text}</code></pre>`
  }

  renderedHtml.value = await marked.parse(content, { renderer, async: true })

  await nextTick()

  if (docContainer.value) {
    const diagrams = docContainer.value.querySelectorAll<HTMLElement>('.mermaid-diagram')
    for (let i = 0; i < diagrams.length; i++) {
      const el = diagrams[i]
      const rawCode = el.getAttribute('data-mermaid')
      if (rawCode) {
        try {
          const unescaped = rawCode
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&')
          const uniqueId = `mermaid-${Date.now()}-${i}`
          const { svg } = await mermaid.render(uniqueId, unescaped)
          el.innerHTML = svg
        } catch (err) {
          console.error('Mermaid render error:', err)
          el.innerHTML = `<pre class="mermaid-error">${rawCode}</pre>`
        }
      }
    }
  }
}

watch(
  () => doctrineStore.activeDocument?.content,
  async (newContent) => {
    await renderMarkdown(newContent || '')
  },
  { immediate: true }
)

onMounted(async () => {
  await doctrineStore.loadCatalog()
})
</script>

<template>
  <div class="doctrine-workspace">
    <!-- Left Navigation Pane -->
    <aside class="doctrine-sidebar">
      <div class="sidebar-header">
        <h3>Business Doctrine</h3>
        <p class="sidebar-sub">Canonical operational manuals, reference guides, and strategies.</p>
      </div>

      <div v-if="doctrineStore.loading && !doctrineStore.activeDocument" class="sidebar-loading">
        Loading doctrine index...
      </div>

      <div v-else class="categories-list">
        <div
          v-for="(docs, category) in doctrineStore.categories"
          :key="category"
          class="category-group"
        >
          <div class="category-title">{{ category }}</div>
          <ul class="document-items">
            <li
              v-for="doc in docs"
              :key="doc.slug"
              :class="['document-item', { active: doctrineStore.activeDocument?.slug === doc.slug }]"
              @click="doctrineStore.selectDocument(doc.category, doc.slug)"
            >
              <span class="doc-icon">📄</span>
              <span class="doc-name">{{ doc.title }}</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <!-- Right Reader Pane -->
    <main class="doctrine-reader">
      <div v-if="doctrineStore.activeDocument" class="document-sheet">
        <header class="doc-header">
          <div class="header-meta">
            <BaseBadge variant="primary">{{ doctrineStore.activeDocument.category }}</BaseBadge>
            <span v-if="doctrineStore.activeDocument.last_updated_at" class="meta-date">
              Updated: {{ doctrineStore.activeDocument.last_updated_at }}
            </span>
          </div>
          <h2 class="doc-title">{{ doctrineStore.activeDocument.title }}</h2>
          <div v-if="doctrineStore.activeDocument.tags.length > 0" class="tag-row">
            <span
              v-for="tag in doctrineStore.activeDocument.tags"
              :key="tag"
              class="doc-tag"
            >
              #{{ tag }}
            </span>
          </div>
        </header>

        <article ref="docContainer" class="doc-body markdown-body" v-html="renderedHtml" />
      </div>

      <div v-else class="empty-state">
        <span class="empty-icon">📖</span>
        <p>Select a business doctrine document from the left sidebar to view.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.doctrine-workspace {
  display: flex;
  min-height: calc(100vh - 4rem);
  background: var(--bg-surface);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.doctrine-sidebar {
  width: 300px;
  min-width: 300px;
  border-right: 1px solid var(--border-color);
  background: var(--bg-surface-subtle);
  padding: 1.25rem 1rem;
  overflow-y: auto;
  box-sizing: border-box;
}

.sidebar-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
}

.sidebar-sub {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0 0 1.25rem;
  line-height: 1.35;
}

.category-group {
  margin-bottom: 1.25rem;
}

.category-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

.document-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.65rem;
  border-radius: 6px;
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.document-item:hover {
  background: var(--bg-surface-hover);
  color: var(--text-primary);
}

.document-item.active {
  background: var(--accent-subtle);
  color: var(--accent-primary);
  font-weight: 600;
}

.doc-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doctrine-reader {
  flex: 1;
  padding: 2rem 2.5rem;
  overflow-y: auto;
  box-sizing: border-box;
}

.document-sheet {
  max-width: 860px;
  margin: 0 auto;
}

.doc-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.25rem;
  margin-bottom: 1.75rem;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.meta-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.doc-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
  line-height: 1.25;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.doc-tag {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: monospace;
}

.doc-body {
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.65;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  color: var(--text-primary);
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.markdown-body :deep(h1) {
  font-size: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.markdown-body :deep(h2) {
  font-size: 1.25rem;
  border-bottom: 1px solid var(--border-color-subtle, var(--border-color));
  padding-bottom: 0.35rem;
}

.markdown-body :deep(h3) {
  font-size: 1.1rem;
}

.markdown-body :deep(p) {
  margin-top: 0;
  margin-bottom: 1rem;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
}

.markdown-body :deep(li) {
  margin-bottom: 0.35rem;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 1.75rem 0;
}

.markdown-body :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-left: 4px solid var(--accent-primary);
  background: var(--bg-surface-subtle);
  color: var(--text-secondary);
}

.markdown-body :deep(code) {
  font-family: monospace;
  font-size: 0.85em;
  background: var(--bg-surface-subtle);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.markdown-body :deep(pre) {
  background: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  border: none;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.25rem 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--bg-surface-subtle);
  font-weight: 600;
}

.markdown-body :deep(.mermaid-diagram) {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  overflow-x: auto;
}

.markdown-body :deep(.mermaid-diagram svg) {
  max-width: 100%;
  height: auto;
}

.markdown-body :deep(.mermaid-error) {
  color: var(--status-error, #ef4444);
  font-size: 0.8rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: var(--text-secondary);
  gap: 1rem;
}

.empty-icon {
  font-size: 3rem;
}
</style>
