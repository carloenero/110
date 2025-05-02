<template>
  <LayoutView>
    <div class="profile-container">
      <div v-if="loading" class="loading">
        <p>Loading...</p>
      </div>

      <div v-else>
        <div class="profile-card">
          <div class="avatar-container">
            <img :src="user.avatar_url || '/default-avatar.png'" alt="User Avatar" class="avatar" />
          </div>
          <div class="profile-info">
            <h2 class="user-name">{{ user.email }}</h2>
            <p class="user-details"><strong>Email:</strong> {{ user.email }}</p>
            <p class="user-details"><strong>Created At:</strong> {{ new Date(user.created_at).toLocaleString() }}</p>
          </div>

          <!-- Upload Section -->
          <div class="upload-section">
            <label for="file-upload" class="file-upload-label">
              <i class="bi bi-cloud-upload"></i> Upload New Profile Picture
            </label>
            <input 
              type="file" 
              id="file-upload" 
              class="file-upload-input" 
              @change="uploadImage" 
              accept="image/*" 
            />
            <p v-if="uploading" class="uploading">Uploading...</p>
            <p v-if="uploadError" class="error">{{ uploadError }}</p>
          </div>
        </div>
      </div>
    </div>
  </LayoutView>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import LayoutView from '@/components/HomeLayout.vue'

const user = ref(null)
const loading = ref(true)
const uploading = ref(false)
const uploadError = ref(null)

onMounted(async () => {
  await fetchUserProfile()
})

// Fetch user profile from Supabase
const fetchUserProfile = async () => {
  try {
    const { data: { user: currentUser }, error } = await supabase.auth.getUser()
    if (error) throw error

    if (currentUser) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, user_id, avatar_url', { head: false })
        .eq('user_id', currentUser.id)
        .single()

      if (profileError) throw profileError

      user.value = { ...currentUser, avatar_url: profileData?.avatar_url }
    }
  } catch (err) {
    console.error('Error loading user profile:', err.message)
  } finally {
    loading.value = false
  }
}

// Handle image upload and update profile
const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  uploadError.value = null;

  try {
    const fileName = `${Date.now()}-${file.name}`;
    
    // Upload the image to Supabase storage
    const { data, error: uploadErrorResult } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadErrorResult) {
      uploadError.value = 'Error uploading image.';
      console.error('Upload error:', uploadErrorResult);
      return;
    }

    // Build the public URL
    const filePath = data.path; 
    const baseURL = 'https://vuqbhzozalzkwpprsket.supabase.co';
    const publicURL = `${baseURL}/storage/v1/object/public/avatars/${filePath}`;

    // Get the authenticated user
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !currentUser) {
      uploadError.value = 'Error fetching user data.';
      console.error('Auth error:', authError);
      return;
    }

    // Fetch existing profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', currentUser.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      uploadError.value = 'Error retrieving profile data.';
      console.error('Profile error:', profileError);
      return;
    }

    // Update or create profile with new avatar URL
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: profileData ? profileData.id : undefined, 
        user_id: currentUser.id,
        avatar_url: publicURL
      });

    if (upsertError) {
      uploadError.value = 'Error updating profile.';
      console.error('Upsert error:', upsertError);
      return;
    }

    // Refetch user profile to reflect the updated avatar
    await fetchUserProfile();

  } catch (error) {
    console.error('Unexpected error:', error);
    uploadError.value = 'Unexpected error occurred.';
  } finally {
    uploading.value = false;
  }
}
</script>

<style scoped>
/* General Container */
.profile-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
}

/* Loading State */
.loading {
  font-size: 1.6em;
  font-weight: 600;
  color: #8e8e8e;
  animation: fadeIn 1s ease-in-out;
}

/* Profile Card */
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa; /* Soft background */
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  text-align: center;
}

/* Avatar Styling */
.avatar-container {
  margin-bottom: 20px;
}

.avatar {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* Hover effect on avatar */
.avatar:hover {
  border-color: #47b5ff;
  box-shadow: 0 6px 15px rgba(71, 181, 255, 0.5);
}

/* User Info */
.profile-info {
  width: 100%;
  margin-top: 20px;
}

.user-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
}

.user-details {
  font-size: 1.1rem;
  color: #555;
  margin: 10px 0;
}

.user-details strong {
  color: #333;
}

/* Upload Section */
.upload-section {
  margin-top: 30px;
}

.file-upload-label {
  background: linear-gradient(135deg, #47b5ff, #6a99e7);
  color: #fff;
  padding: 12px 30px;
  border-radius: 30px;
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  font-size: 1.1rem;
  transition: background 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Hover effect on upload button */
.file-upload-label:hover {
  background: linear-gradient(135deg, #6a99e7, #47b5ff);
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.file-upload-input {
  display: none;
}

/* Uploading Text */
.uploading {
  font-size: 1.1rem;
  color: #2ecc71;
  margin-top: 15px;
  font-weight: 600;
}

/* Error Message */
.error {
  color: #e74c3c;
  font-size: 1.1rem;
  margin-top: 10px;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 30px;
  }

  .user-name {
    font-size: 1.3rem;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .user-details {
    font-size: 1rem;
  }

  .file-upload-label {
    font-size: 1rem;
    padding: 10px 25px;
  }
}

/* Animation for Loading Text */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}


</style>
