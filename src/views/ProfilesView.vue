<template>
  <LayoutView>
    <div class="profile-container">
      <div v-if="loading" class="loading">
        <p>Loading...</p>
      </div>

      <div v-else>
        <h1 class="profile-title">User Profile</h1>

        <div v-if="user" class="profile-card">
          <img :src="user.avatar_url || '/default-avatar.png'" alt="User Avatar" class="avatar" />
          <div class="user-info">
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Created At:</strong> {{ new Date(user.created_at).toLocaleString() }}</p>
          </div>
        </div>

        <div class="upload-section">
          <label for="file-upload" class="file-upload-label">
            <i class="bi bi-cloud-upload"></i> Upload Profile Picture
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

// Fetch user profile
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

// Upload image to 'reportimage' bucket
const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  uploadError.value = null;

  try {
    const fileName = `${Date.now()}-${file.name}`;
    
    // Upload the image
    const { data, error: uploadErrorResult } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadErrorResult) {
      uploadError.value = 'Error uploading image.';
      console.error('Upload error:', uploadErrorResult);
      return;
    }

    // Build public URL
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

    // Fetch existing profile
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

    // Upsert avatar URL into profiles
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

    // Refetch user profile
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
/* Container */
.profile-container {
  max-width: 720px;
  margin: 40px auto;
  padding: 40px 30px;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  border-radius: 20px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.4s ease;
}

/* Loading State */
.loading {
  font-size: 1.6em;
  font-weight: 600;
  color: #7b8a97;
}

/* Title */
.profile-title {
  font-size: 2.8rem;
  font-weight: bold;
  color: #334e68;
  margin-bottom: 30px;
  font-family: 'Poppins', sans-serif;
}

/* Profile Card */
.profile-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  transition: transform 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
}

/* Avatar Image */
.avatar {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #d4d9de;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar:hover {
  border-color: #47b5ff;
  box-shadow: 0px 6px 20px rgba(71, 181, 255, 0.5);
}

/* User Info */
.user-info p {
  font-size: 1.2em;
  color: #555;
  margin: 8px 0;
}

.user-info strong {
  color: #334e68;
}

/* Upload Section */
.upload-section {
  margin-top: 30px;
}

/* Upload Button */
.file-upload-label {
  background: linear-gradient(135deg, #47b5ff, #679ffb);
  color: #ffffff;
  padding: 14px 30px;
  border-radius: 30px;
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  font-size: 1.1em;
  transition: background 0.4s ease, transform 0.3s ease;
}

.file-upload-label:hover {
  background: linear-gradient(135deg, #679ffb, #47b5ff);
  transform: scale(1.05);
}

/* Upload Input Hidden */
.file-upload-input {
  display: none;
}

/* Uploading Text */
.uploading {
  font-size: 1.2em;
  color: #2d9cdb;
  margin-top: 15px;
}

/* Error Message */
.error {
  color: #e63946;
  font-size: 1.1em;
  margin-top: 10px;
  font-weight: 600;
}

/* Smooth Responsive */
@media (max-width: 768px) {
  .profile-container {
    padding: 30px 20px;
  }
  
  .profile-title {
    font-size: 2.2rem;
  }
  
  .avatar {
    width: 120px;
    height: 120px;
  }
  
  .user-info p {
    font-size: 1.1em;
  }
  
  .file-upload-label {
    font-size: 1em;
    padding: 12px 24px;
  }
}
</style>

