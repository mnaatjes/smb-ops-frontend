import { createRouter, createWebHistory } from 'vue-router'
import LeadsView from '@/pages/LeadsView.vue'
import PlaceholderWorkspaceView from '@/pages/PlaceholderWorkspaceView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/leads'
    },
    {
      path: '/leads',
      name: 'leads',
      component: LeadsView
    },
    {
      path: '/pursued',
      name: 'pursued',
      component: () => import('@/pages/PursuedLeadsView.vue')
    },
    {
      path: '/clients',
      name: 'clients',
      component: PlaceholderWorkspaceView,
      props: {
        title: 'Client Accounts & Retainers',
        subtitle: 'Active account ledgers, maintenance SLAs, and credential vaults',
        sectionName: 'Client Accounts'
      }
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('@/pages/ServiceCatalogView.vue')
    },
    {
      path: '/addons',
      name: 'addons',
      component: () => import('@/pages/AddOnsView.vue')
    },
    {
      path: '/doctrine',
      name: 'doctrine',
      component: PlaceholderWorkspaceView,
      props: {
        title: 'Business Doctrine & Operating Manuals',
        subtitle: 'Standardized operational procedures, playbooks, and strategic architectural guidelines',
        sectionName: 'Business Doctrine'
      }
    },
    {
      path: '/dev/components',
      name: 'dev-components',
      component: () => import('@/pages/DevComponentsView.vue'),
      meta: { layout: 'isolated' }
    }
  ]
})
