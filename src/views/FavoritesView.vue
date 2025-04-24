<template>
  <LayoutView>
    <div class="favorites-container">
      <div v-if="loading" class="loading">
        <p>Loading...</p>
      </div>
      <div v-else>
        <h1 class="title">Favorite Places</h1>
        <ul class="places-list">
          <li v-for="item in favoritePlaces" :key="item.id" class="place-item">
            <img :src="item.image" alt="Place Image" class="place-image" />
            <div class="place-info">
              <h3 class="place-name">{{ item.name }}</h3>
              <p class="place-rating">Rating: <span class="rating">{{ item.rating }}</span></p>
              <p class="place-review">{{ item.review }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="favorites-container">
      <div v-if="loading" class="loading">
        <p>Loading...</p>
      </div>
      <div v-else>
        <h1 class="title">Favorite Hotels</h1>
        <ul class="places-list">
          <li v-for="item in favoriteHotels" :key="item.id" class="place-item">
            <img :src="item.image" alt="Place Image" class="place-image" />
            <div class="place-info">
              <h3 class="place-name">{{ item.name }}</h3>
              <p class="place-rating">Rating: <span class="rating">{{ item.rating }}</span></p>
              <p class="place-review">{{ item.review }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </LayoutView>
</template>

<script>
import { ref, onMounted } from 'vue' // Import the required Composition API functions
import { supabase } from '@/supabase' // Import the Supabase client
import LayoutView from '@/components/HomeLayout.vue'

export default {
  components: {
    LayoutView
  },
  setup() {
    const favoritePlaces = ref([])  // To store the fetched data
    const favoriteHotels = ref([]) 
    const loading = ref(true)       // To control the loading state
    const loading1 = ref(true)  
    // Fetch data when the component is mounted
    onMounted(async () => {
      try {
        const { data, error } = await supabase.rpc('favorites_places') // Call the RPC function
        if (error) throw error
        favoritePlaces.value = data // Set the fetched data
      } catch (error) {
        console.error('Error fetching favorite places:', error)
        // You might want to display an error message here
      } finally {
        loading.value = false // Set loading state to false once data is fetched
      }
    })

     onMounted(async () => {
      try {
        const { data, error } = await supabase.rpc('favorites_hotels') // Call the RPC function
        if (error) throw error
        favoriteHotels.value = data // Set the fetched data
      } catch (error) {
        console.error('Error fetching favorite hotels:', error)
        // You might want to display an error message here
      } finally {
        loading1.value = false // Set loading state to false once data is fetched
      }
    })

    return {
        favoritePlaces,  // Expose the reactive properties to the template
        favoriteHotels,
        loading,         // Expose the loading state to the template
        loading1,        // Expose the loading state to the template
    }
  }
}
</script>

<style scoped>
.favorites-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.loading {
  text-align: center;
  font-size: 1.5em;
  color: #888;
}

.title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.places-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  list-style-type: none;
  padding: 0;
}

.place-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.place-item:hover {
  transform: translateY(-10px);
}

.place-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 2px solid #f1f1f1;
}

.place-info {
  padding: 15px;
}

.place-name {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.place-rating {
  font-size: 1.1em;
  color: #f39c12;
}

.rating {
  font-weight: bold;
}

.place-review {
  font-size: 1em;
  color: #666;
  margin-top: 10px;
}
</style>
