<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../supabase'
import logo from '@/assets/images/logo.png'

const router = useRouter()
const route = useRoute()

const user = ref(null)

// Password visibility
const showPassword = ref(false)

onMounted(async () => {
  const { data: session } = await supabase.auth.getSession()
  user.value = session?.user
})
</script>

<template>
  <div>
    <div
      v-if="route.name === 'landing' || route.name === 'login' || route.name === 'register'"
      class="background-color min-vh-100 d-flex flex-column"
    >
      <nav class="navbar bg-body-tertiary fixed-top shadow-sm">
        <div class="container-fluid">
          <h1 class="navbar-brand">Explorra D’ Explorer</h1>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li class="nav-item">
                  <RouterLink class="nav-link active" aria-current="page" to="/">Home</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link" to="/login">Login</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link" to="/register">Register</RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div class="container py-5 mt-5">
        <div class="row justify-content-center">
            <slot></slot>
        </div>
      </div>

      <div class="fixed-bottom bg-dark border-top py-2">
        <div class="container d-flex justify-content-around">
          <RouterLink to="/login" class="text-center text-decoration-none text-light">
            <i class="bi bi-box-arrow-in-right"></i>
            <div>Login</div>
          </RouterLink>

          <RouterLink to="/register" class="text-center text-decoration-none text-light">
            <i class="bi bi-person-plus"></i>
            <div>Register</div>
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.background-color {
  background: repeating-linear-gradient(
    45deg,
    #bbd8a3,
    #bbd8a3 33%,
    #fb653c 33%,
    #f6c96e 66%,
    #f6c96e 66%
  );
  min-height: 100vh;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-link {
  color: #000;
}

.offcanvas-body {
  background-color: #fff6e0;
}

.container {
  max-width: 1200px;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

img.logo-img {
  width: 200px;
  height: auto;
  border-radius: 10px;
  cursor: pointer;
}

.fixed-bottom {
  background-color: #343a40;
}

.fixed-bottom .text-light {
  color: #f8f9fa !important;
}

.fixed-bottom .text-light:hover {
  color: #007bff !important;
}

.text-center {
  font-size: 0.9rem;
}

@keyframes popUp {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.fst-italic {
  animation: popUp 1s ease-out;
}

.offcanvas-end {
  width: 220px;
}

.offcanvas-backdrop {
  opacity: 0.5;
}

.offcanvas-body {
  padding: 20px;
}

.nav-item {
  border: 2px solid #ffedd8;
  background-color: #ffa559;
  padding: 10px 20px;
  border-radius: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}
</style>
