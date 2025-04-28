import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import MapView from '../components/Map.vue'
import HotelsView from '../views/HotelsView.vue'
import PlacesView from '../views/PlacesView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import ProfilesView from '@/views/ProfilesView.vue'
import { authGuard } from './authGuard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
      beforeEnter: authGuard,
    },
    {
      path: '/hotels',
      name: 'hotels',
      component: HotelsView,
      beforeEnter: authGuard,
    },
    {
      path: '/places',
      name: 'places',
      component: PlacesView,
      beforeEnter: authGuard,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilesView,
      beforeEnter: authGuard,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      beforeEnter: authGuard,
    },
  ],
})

export default router
