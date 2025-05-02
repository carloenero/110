<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

// Form fields
const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

// Password visibility
const showPassword = ref(false)

const router = useRouter()

const registeration = async (e) => {
  e.preventDefault()

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  try {
    const { user, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (error) {
      console.error('Error during registration:', error.message)
      errorMessage.value = error.message
    } else {
      console.log('Registration successful:', user)
      alert('Registration successful! Please check your email to confirm.')
    }
  } catch (error) {
    errorMessage.value = error.message
    console.error('Error:', error)
  }
}

onMounted(() => {
  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session.user) {
      if (session.user.email_confirmed_at) {
        router.push('/home')
      }
    }
  })

  onBeforeUnmount(() => {
    authListener?.unsubscribe()
  })
})
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg p-4">
          <h3 class="text-center mb-4">Register</h3>
          <form @submit="registeration">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="floatingName" placeholder="Your Name" v-model="name" required />
              <label for="floatingName">Full Name</label>
            </div>

            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" v-model="email" required />
              <label for="floatingEmail">Email address</label>
            </div>

            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="floatingPhoneNumber" placeholder="Phone Number" v-model="phone" required />
              <label for="floatingPhoneNumber">Phone Number</label>
            </div>

            <!-- Password Field -->
            <div class="form-floating mb-3 position-relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                id="floatingPassword"
                placeholder="Password"
                v-model="password"
                required
              />
              <label for="floatingPassword">Password</label>
              <span class="password-toggle" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash'"></i>
              </span>
            </div>

            <!-- Confirm Password Field -->
            <div class="form-floating mb-3 position-relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                id="floatingConfirmPassword"
                placeholder="Confirm Password"
                v-model="confirmPassword"
                required
              />
              <label for="floatingConfirmPassword">Confirm Password</label>
              <span class="password-toggle" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash'"></i>
              </span>
            </div>

            <div v-if="errorMessage" class="text-danger text-center mb-3">
              <small>{{ errorMessage }}</small>
            </div>

            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary">Register</button>
            </div>
          </form>

          <div class="mt-3 text-center">
            <small>Already have an account? <RouterLink to="/login">Login</RouterLink></small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 10px;
  background-color: #EDF4C2;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}
.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
.password-toggle {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
}
.password-toggle i {
  font-size: 1.3rem;
  color: #6c757d;
}
</style>
