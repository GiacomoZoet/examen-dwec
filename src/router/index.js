import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/authentication.js'
import PicsView from '@/views/PicsView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import AuthView from '@/views/AuthView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: "/", redirect: '/pics'},
    {path: "/pics", component: PicsView},
    {path: "/favorites", component: FavoritesView, meta: {requiresAuth: true}},
    {path: "/auth", component: AuthView},
  ],
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth){
    if(isAuthenticated()){
      next() // allowed to access
    }else{
      next('/auth')
    }
  }else{
    next() // is not a protected routed
  }
})

export default router