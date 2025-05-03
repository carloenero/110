<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabase'
import LayoutView from '@/components/HomeLayout.vue'

const hotels = ref([])
const searchQuery = ref('')
const activeIndex = ref(0)

// Image preview modal state
const showModal = ref(false)
const selectedHotel = ref(null)

const openImage = (hotel) => {
  selectedHotel.value = hotel
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedHotel.value = null
}

onMounted(async () => {
  const { data, error } = await supabase.from('hotels').select('*')
  if (error) {
    console.error('Error fetching hotels:', error)
    return
  }
  hotels.value = data
})

const filteredHotels = computed(() => {
  if (!searchQuery.value) return hotels.value
  return hotels.value.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const saveToSupabase = async (hotel) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.log('No user logged in')
    return
  }

  try {
    const { data: recommendationData, error: recommendationError } = await supabase
      .from('favorites')
      .insert([
        {
          created_at: new Date().toISOString(),
          target_type: 'hotel',
          user_id: user.id,
          target_spot: hotel.id,
        },
      ])
    if (recommendationError) {
      console.error('Error saving recommendation:', recommendationError)
    } else {
      console.log('favorites saved:', recommendationData)
    }
  } catch (err) {
    console.error('Error:', err)
  }
}
</script>


<template>
  <LayoutView>
    <h1 class="p-4 text-center">Hotels Reviews</h1>

    <!-- Search Input -->
    <div class="search-container p-4">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="Search for Hotels by name"
      />
    </div>

    <!-- Carousel -->
    <div id="carouselExampleCaptions" class="carousel slide">
      <div class="carousel-indicators">
        <button
          v-for="(hotel, index) in filteredHotels"
          :key="index"
          type="button"
          :data-bs-target="'#carouselExampleCaptions'"
          :data-bs-slide-to="index"
          :class="{ active: activeIndex === index }"
        ></button>
      </div>
      <div class="carousel-inner">
        <div
          v-for="(hotel, index) in filteredHotels"
          :key="index"
          :class="{ 'carousel-item': true, active: activeIndex === index }"
        >
          <img
            :src="hotel.image"
            class="d-block w-100"
            alt="Hotel image"
            @click="openImage(hotel)"
            style="cursor: pointer"
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ hotel.name }}</h5>
            <p class="text-shadow">{{ hotel.review }}</p>
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

    <!-- Cards Section -->
    <div class="hotel-reviews mt-5">
      <h2>Hotels Reviews</h2>
      <div class="row">
        <div v-for="(hotel, index) in filteredHotels" :key="index" class="col-md-4">
          <div class="card">
            <img
              :src="hotel.image"
              class="card-img-top"
              alt="Hotels image"
              @click="openImage(hotel)"
              style="cursor: pointer"
            />
            <div class="card-body">
              <h5 class="card-title">
                {{ hotel.name }}
                <i @click="saveToSupabase(hotel)" class="p-4 bi bi-heart"></i>
              </h5>
              <div class="rating">
                <span
                  v-for="n in 5"
                  :key="n"
                  :class="{ 'text-warning': n <= hotel.rating, 'text-muted': n > hotel.rating }"
                >★</span>
              </div>
              <p class="card-text">{{ hotel.review }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 💡 Preview Modal with Image + Info -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-content-custom">
        <img :src="selectedHotel?.image" class="modal-image" />
        <h3 class="mt-3">{{ selectedHotel?.name }}</h3>
        <p>{{ selectedHotel?.review }}</p>
        <button class="btn btn-danger mt-2" @click="closeModal">Close</button>
      </div>
    </div>
  </LayoutView>
</template>


<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content-custom {
  background: #FEF3E2;
  border-radius: 12px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  animation: zoomIn 0.3s ease-in-out;
}

.modal-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  object-fit: cover;
}

@keyframes zoomIn {
  from {
    transform: scale(0.7);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

</style>
