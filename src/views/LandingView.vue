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

    <!-- Welcome Section -->
    <div class="container-welcome mt-5">
      <h1>Welcome to Butuan City</h1>
      <p>Discover the best places and hotels in Butuan City.</p>
    </div>

    <!-- About Us Section -->
    <div class="about-us-section">
      <h2 class="about-title">About Us</h2>
      <p class="about-description">
        We are a travel guide service dedicated to providing the best experiences in Butuan City. From stunning places to stay, 
        to exciting places to visit, we bring you the best options to make your trip memorable.
      </p>
      <p class="about-description">
        Our team is committed to offering helpful and reliable information, so you can explore Butuan City with ease and confidence. 
        Whether you're looking for a relaxing hotel stay or an adventurous tour, we have it all covered!
      </p>
    </div>
    
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
  margin: 0 auto;
  max-width: 900px;
}
.carousel-image {
  padding: 20px;
  height: 450px;
  object-fit: cover;
  width: 100%;
  background-color: transparent;
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

/* About Us Section */
.about-us-section {
  text-align: center;
  margin: 50px 0;
  padding: 20px;
  border: 2px solid black;
  font-weight: bold;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.about-title {
  font-size: 2rem;
  font-weight: 700;
  color: #334347;
  margin-bottom: 15px;
}

.about-description {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 15px;
}
</style>
