
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/authentication.js'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: "/", redirect: '/characters'},
    {path: "/characters", component: CharactersView},
    {path: "/favorites", component: FavoritesView, meta: {requiresAuth: true}},
    {path: "/login", component: LoginView},
    {path: "/register", component: RegisterView},],
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth){
    if(isAuthenticated()){
      next() // allowed to access
    }else{
      next('/login')
    }
  }else{
    next() // is not a protected routed
  }
})

export default router