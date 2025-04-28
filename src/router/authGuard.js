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
      next({ name: 'login' })
      return
    }

    if (!user || !user.id) {
      // No user detected
      console.warn('No authenticated user found.')
      next({ name: 'login' })
    } else {
      // User is authenticated
      console.log('Authenticated user:', user)
      next()
    }
  } catch (error) {
    console.error('Error during authGuard check:', error)
    next({ name: 'login' }) // fallback if error occurs
  }
}
