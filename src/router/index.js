import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ReadingPackageView from '../views/ReadingPackageView.vue'
import ReadingView from '../views/ReadingView.vue'
import ListeningPackageView from '../views/ListeningPackageView.vue'
import ListeningView from '../views/ListeningView.vue'
import StructurePackageView from '../views/StructurePackageView.vue'
import StructureView from '../views/StructureView.vue'
import FullTestPackageView from '../views/FullTestPackageView.vue'
import FullTestView from '../views/FullTestView.vue'
import ResultView from '../views/ResultView.vue'
import FullResultView from '../views/FullResultView.vue'
import LoginView from '../views/LoginView.vue'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    { path: '/login', component: LoginView },
    {
      path: '/',
      component: HomeView, meta: { requiresAuth: true }
    },

    {
      path: '/listening',
      component: ListeningPackageView, meta: { requiresAuth: true }
    },

    {
      path: '/reading',
      component: ReadingPackageView, meta: { requiresAuth: true }
    },

    {
      path: '/reading/:packageId',
      component: ReadingView, meta: { requiresAuth: true }
    },

    {
      path: '/listening/:packageId',
      component: ListeningView, meta: { requiresAuth: true }
    },

    {
      path: '/structure',
      component: StructurePackageView, meta: { requiresAuth: true }
    },

    {
      path: '/structure/:packageId',
      component: StructureView, meta: { requiresAuth: true }
    },

    {
      path: '/result',
      component: ResultView, meta: { requiresAuth: true }
    },

    {
      path: '/full-test',
      component: FullTestPackageView, meta: { requiresAuth: true }
    },

    {
      path: '/full-result',
      component: FullResultView, meta: { requiresAuth: true }
    },
    
    {
      path: '/full-test/:packageId',
      component: FullTestView, meta: { requiresAuth: true }
    }

  ]
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true
  if (!isSupabaseConfigured) return { path: '/login', query: { redirect: to.fullPath } }
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { path: '/login', query: { redirect: to.fullPath } }
  return true
})

export default router
