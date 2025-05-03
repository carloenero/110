// src/router/authGuard.js
import { supabase } from '../supabase'

export const authGuard = async (to, from, next) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Supabase error during getUser:', error.message)
      return next({ name: 'login' })
    }

    const isLoggedIn = !!user?.id

    const guestRoutes = ['login', 'register', 'landing'] // unauthenticated pages
    const protectedRoutes = ['home', 'favorites', 'hotels', 'places', 'profile']

    if (isLoggedIn) {
      if (guestRoutes.includes(to.name)) {
        // 👇 Redirect to home if logged in and trying to access login/register/landing
        return next({ name: 'home' })
      } else {
        return next() // ✅ allow access to protected pages
      }
    } else {
      if (protectedRoutes.includes(to.name)) {
        // 👇 Redirect to login if not logged in and trying to access protected pages
        return next({ name: 'login' })
      } else {
        return next() // ✅ allow access to guest pages
      }
    }
  } catch (err) {
    console.error('Error in authGuard:', err)
    next({ name: 'login' })
  }
}
