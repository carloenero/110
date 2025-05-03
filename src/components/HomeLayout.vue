<template>
  <div class="background-color">
    <!-- Top Navbar -->
    <div class="container-fluid">
      <nav class="navbar navbar-expand-lg navbar-light fixed-top bg-light shadow-sm">
        <div class="container-fluid">
          <a class="navbar-brand d-flex align-items-center" href="#">
            <img :src="logo" alt="Explora Butuan" width="40" height="auto" class="me-2">
            <span class="fw-bold">Explorra D’ Explorer</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li class="nav-item">
                  <RouterLink class="nav-link active" to="/home">Home</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link active" to="/profile">Profile</RouterLink>
                </li>
                <li class="nav-item">
                  <button class="nav-link" @click="logout">Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="container mt-5 pt-5">
      <slot></slot>
    </div>

    <!-- Bottom Navbar -->
    <div class="fixed-bottom border-top">
      <div class="container d-flex justify-content-around py-2 px-3">
        <RouterLink to="/favorites" class="text-center text-decoration-none text-light">
          <i class="bi bi-heart"></i>
          <div>Favorite</div>
        </RouterLink>
        <RouterLink to="/home" class="text-center text-decoration-none text-light">
          <i class="bi bi-house-check-fill"></i>
          <div>Home</div>
        </RouterLink>
        <RouterLink to="/hotels" class="text-center text-decoration-none text-light">
          <i class="bi bi-buildings-fill"></i>
          <div>Hotels</div>
        </RouterLink>
        <RouterLink to="/places" class="text-center text-decoration-none text-light">
          <i class="bi bi-backpack2"></i>
          <div>Places</div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import logo from '@/assets/images/logo.png'

const router = useRouter()

const logout = async () => {
  const confirmed = window.confirm('Are you sure you want to log out?')
  if (confirmed) {
    try {
      await supabase.auth.signOut()
      console.log('Logged out successfully')
      router.push('/login')
      alert('You have been logged out.')
    } catch (error) {
      console.error('Error during logout:', error.message)
      alert('Error during logout: ' + error.message)
    }
  } else {
    console.log('Logout cancelled')
  }
}
</script>

<style scoped>
.background-color {
  background: repeating-linear-gradient(
    45deg,
    #bbd8a3,
    #f6c96e 66%,
    #f6c96e 66%
  );
  min-height: 100vh;
}

/* Navbar Styling */
.navbar {
  background-color: #f6c96e !important; /* Or rgba(255, 255, 255, 0.8) */
  backdrop-filter: blur(6px); /* optional, remove if not using transparency */
  color: #210F37;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}


.navbar-brand img {
  width: 40px;
  height: auto;
}

.navbar-toggler {
  border: none;
}

.navbar-nav .nav-link {
  font-size: 1rem;
  font-weight: 500;
}

.navbar-nav .nav-link:hover {
  color: #007bff;
}

.offcanvas-body {
  background-color: transparent;
}

.offcanvas-header {
  border-bottom: 1px solid #e0e0e0;
}

/* Bottom Navbar Styles */
.fixed-bottom {
  background-color: transparent;
}

.fixed-bottom .text-light {
  border: 2px solid black;
  color: #210F37 !important;
  background-color: #E5D0AC;
  padding: 5px 10px;
  border-radius: 50%;
  display: inline-block;
}

.fixed-bottom .text-light:hover {
  color: #BF3131 !important;
}

.text-center {
  font-size: 0.9rem;
}

.text-decoration-none {
  text-decoration: none;
}

.bi {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

/* Optional Button Styling */
.explora-button {
  text-decoration: none;
  background-color: #16C47F;
  color: white;
  font-size: 24px;
  font-weight: 600;
  padding: 15px 30px;
  text-transform: uppercase;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.explora-button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}
</style>
