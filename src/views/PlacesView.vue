<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/supabase'; // Import Supabase client
import LayoutView from '@/components/HomeLayout.vue';

const places = ref([]); // Array to store place data
const searchQuery = ref(''); // Search input for place names
const activeIndex = ref(0); // To manage the active carousel slide

// Fetch places from Supabase when component is mounted
onMounted(async () => {
  const { data, error } = await supabase.from('places').select('*');
  if (error) {
    console.error('Error fetching places:', error);
    return;
  }
  places.value = data; // Store fetched place data into the places array
});

// Computed property to filter places based on search query
const filteredPlaces = computed(() => {
  if (!searchQuery.value) {
    return places.value; // Return all places if no search query
  }
  return places.value.filter(places => 
    place.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Save place interaction to Supabase
const saveToSupabase = async (place) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log('No user logged in');
    return;
  }

  try {
    const { data: recommendationData, error: recommendationError } = await supabase
      .from('recommendations')
      .insert([{
        created_at: new Date().toISOString(),
        target_type: 'place',
        user_id: user.id,
        target_spot: place.id,
      }]);

    if (recommendationError) {
      console.error('Error saving recommendation:', recommendationError);
    } else {
      console.log('Recommendation saved:', recommendationData);
    }
  } catch (err) {
    console.error('Error:', err);
  }
};
</script>

<template>
  <LayoutView>
    <h1 class="p-4 text-center">Places Reviews</h1>

    <!-- Search Input -->
    <div class="search-container p-4">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="Search for Places by name"
      />
    </div>

    <!-- Carousel -->
    <div id="carouselExampleCaptions" class="carousel slide">
      <div class="carousel-indicators">
        <button 
          v-for="(place, index) in filteredPlaces" 
          :key="index" 
          type="button" 
          :data-bs-target="'#carouselExampleCaptions'" 
          :data-bs-slide-to="index" 
          :class="{ active: activeIndex === index }" 
          aria-current="index === activeIndex" 
          aria-label="'Slide ' + (index + 1)">
        </button>
      </div>
      <div class="carousel-inner">
        <div 
          v-for="(place, index) in filteredPlaces" 
          :key="index" 
          :class="{ 'carousel-item': true, active: activeIndex === index }">
          <img :src="place.image" class="d-block w-100" alt="Place image">
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ place.name }}</h5>
            <p class="text-shadow">{{ place.review }}</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Place Reviews -->
    <div class="hotel-reviews mt-5">
      <h2>Places Reviews</h2>
      <div class="row">
        <div v-for="(place, index) in filteredPlaces" :key="index" class="col-md-4">
          <div class="card">
            <img :src="place.image" class="card-img-top" alt="Place image">
            <div class="card-body">
              <h5 class="card-title">{{ place.name }}<i @click="saveToSupabase(place)" class="p-4 bi bi-heart"></i></h5>
              <div class="rating">
                <span v-for="n in 5" :key="n" :class="{'text-warning': n <= place.rating, 'text-muted': n > place.rating}">★</span>
              </div>
              <p class="card-text">{{ place.review }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutView>
</template>

<style scoped>
.carousel-caption {
  background-color: rgba(0, 0, 0, 0.5); /* Transparent background with slight darkening */
  color: white; /* White text for contrast */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6); /* Adding text shadow for readability */
}

.text-shadow {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7); /* Optional: enhances the contrast and readability of the text */
}

.hotel-reviews {
  padding: 20px;
}

.card {
  margin-bottom: 20px;
}

.rating {
  font-size: 1.5rem;
  color: gold;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.bi-heart {
  cursor: pointer;
  color: red;
}

.bi-heart:hover {
  color: darkred;
}

.search-container {
  text-align: center;
  margin-bottom: 20px;
}
</style>
