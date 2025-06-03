import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@renderer/pages/index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@renderer/pages/index.vue')
        }
      ]
    },
    {
      path: '/about',
      component: () => import('@renderer/pages/about.vue')
    }
  ]
})
