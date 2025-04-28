<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

// Reactive variables
const places = ref([])
const hotels = ref([])
const selectedCategory = ref('places') // Default category

onMounted(async () => {
  // Fetch places
  const { data: placesData, error: placesError } = await supabase.from('places').select('*')
  if (placesError) {
    console.error('Error fetching places:', placesError)
    return
  }
  places.value = placesData

  // Fetch hotels
  const { data: hotelsData, error: hotelsError } = await supabase.from('hotels').select('*')
  if (hotelsError) {
    console.error('Error fetching hotels:', hotelsError)
    return
  }
  hotels.value = hotelsData
})
</script>

<template>
  <v-app>
    <!-- Category Selector -->
    <div class="category-selector text-center">
      <button
        @click="selectedCategory = 'places'"
        :class="{ active: selectedCategory === 'places' }"
        class="btn-category"
      >
        Places
      </button>
      <button
        @click="selectedCategory = 'hotels'"
        :class="{ active: selectedCategory === 'hotels' }"
        class="btn-category"
      >
        Hotels
      </button>
    </div>

    <!-- Carousel -->
    <div id="carouselExampleAutoplaying" class="carousel slide rounded-carousel shadow" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div
          v-for="(item, index) in selectedCategory === 'places' ? places : hotels"
          :key="index"
          class="carousel-item"
          :class="{ active: index === 0 }"
          :data-bs-interval="index === 0 ? 10000 : 3000"
        >
          <img
            :src="item.image"
            class="carousel-image d-block mx-auto"
            :alt="selectedCategory + ' Image'"
          />
        </div>
      </div>

      <!-- Controls -->
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon custom-control" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon custom-control" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Welcome Section -->
    <div class="container-welcome mt-5">
      <h1>Welcome to Butuan City</h1>
      <p>Discover the best places and hotels in Butuan City.</p>
    </div>
  </v-app>
</template>

<style scoped>
/* Category Buttons */
.category-selector {
  margin: 20px 0;
}
.btn-category {
  background: #ffffff;
  color: #334347;
  font-weight: 600;
  margin: 0 10px;
  padding: 10px 20px;
  border: 2px solid #334347;
  border-radius: 30px;
  transition: all 0.3s ease;
}
.btn-category:hover {
  background-color: #334347;
  color: #ffffff;
}
.btn-category.active {
  background-color: #334347;
  color: #ffffff;
}

/* Carousel */
.rounded-carousel {
  overflow: hidden;
  border-radius: 20px;
  background-color: #f6f6f6;
  margin: 0 auto;
  max-width: 900px;
}
.carousel-image {
  padding: 20px;
  height: 450px;
  object-fit: cover;
  width: 100%;
  background-color: antiquewhite;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.15);
}

/* Custom controls */
.custom-control {
  background-color: #334347;
  border-radius: 50%;
}

/* Welcome Section */
.container-welcome {
  text-align: center;
  margin-top: 40px;
}
.container-welcome h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #334347;
  margin-bottom: 10px;
}
.container-welcome p {
  font-size: 1.2rem;
  color: #555;
}
</style>
