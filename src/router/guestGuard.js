// src/router/guestGuard.js
import { supabase } from '../supabase'

export const guestGuard = async (to, from, next) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Supabase getUser error:', error.message)
      return next()
    }

    if (user && user.id) {
      // 🚫 Already authenticated — redirect to /home
      console.warn('Authenticated user trying to access guest page. Redirecting to home.')
      return next({ name: 'home' }) // Or any route you want
    }

    // ✅ User is not authenticated — allow access
    return next()
  } catch (err) {
    console.error('Guest guard error:', err)
    return next()
  }
}
