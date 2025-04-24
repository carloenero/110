<template>
  <LayoutView>
    <div class="profile-container">
      <!-- Loading state -->
      <div v-if="loading" class="loading">
        <p>Loading...</p>
      </div>

      <!-- Display user details only when the user is not null -->
      <div v-else>
        <h1 class="profile-title">User Profile</h1>

        <!-- Display user info if the user exists -->
        <div v-if="user" class="profile-card">
          <img :src="user.avatar_url || '/default-avatar.png'" alt="User Avatar" class="avatar" />
          <div class="user-info">
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Created At:</strong> {{ new Date(user.created_at).toLocaleString() }}</p>
          </div>
        </div>

        <!-- Image Upload Section -->
        <div class="upload-section">
          <label for="file-upload" class="file-upload-label"><i class="bi bi-cloud-plus"></i>Upload Picture</label>
          <input 
            type="file" 
            id="file-upload" 
            class="file-upload-input" 
            @change="uploadImage" 
            accept="image/*" 
          />
          <p v-if="uploading" class="uploading">Uploading...</p>
          <p v-if="uploadError" class="error">{{ uploadError }}</p>

          <!-- Delete Image Button -->
          <div v-if="user.avatar_url" class="delete-btn-container">
            <button @click="deleteImage" class="delete-btn"><i class="bi bi-trash"></i>Delete Profile</button>
          </div>
        </div>
      </div>
    </div>
  </LayoutView>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase'; // Import Supabase client
import LayoutView from '@/components/HomeLayout.vue';

export default {
  components: {
    LayoutView,
  },
  setup() {
    const user = ref(null);
    const loading = ref(true);
    const uploading = ref(false);
    const uploadError = ref(null);

    // Fetch the authenticated user and profile data on mount
    onMounted(async () => {
      try {
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Error fetching user data:', authError);
          return;
        }
        if (currentUser) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, user_id, avatar_url')
            .eq('user_id', currentUser.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile data:', profileError);
            return;
          }

          user.value = { ...currentUser, avatar_url: profileData?.avatar_url };
        } else {
          console.log('No user authenticated');
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
      } finally {
        loading.value = false;
      }
    });

    const uploadImage = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      uploading.value = true;
      uploadError.value = null;

      try {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error: uploadErrorResult } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (uploadErrorResult) {
          uploadError.value = 'Error uploading image.';
          console.error('Upload error:', uploadErrorResult);
          return;
        }

        const filePath = data.fullPath;
        const baseURL = 'https://vuqbhzozalzkwpprsket.supabase.co';
        const publicURL = `${baseURL}/storage/v1/object/public/${filePath}`;

        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          uploadError.value = 'Error fetching user data.';
          console.error('Auth error:', authError);
          return;
        }

        if (!currentUser) {
          uploadError.value = 'No authenticated user found.';
          console.error('No authenticated user.');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, user_id')
          .eq('user_id', currentUser.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          uploadError.value = 'Error retrieving user profile data.';
          console.error('Profile error:', profileError);
          return;
        }

        const { error: upsertError, data: upsertData } = await supabase
          .from('profiles')
          .upsert({
            id: profileData ? profileData.id : currentUser.id,
            user_id: currentUser.id,
            avatar_url: publicURL
          });

        if (upsertError) {
          uploadError.value = 'Error updating avatar URL in the profiles table.';
          console.error('Upsert error:', upsertError);
          return;
        }

        user.value.avatar_url = publicURL;
        uploading.value = false;
      } catch (error) {
        uploading.value = false;
        uploadError.value = 'Error uploading image.';
        console.error('Error during upload process:', error);
      }
    };

    const deleteImage = async () => {
      if (!user.value.avatar_url) {
        console.log('No image to delete');
        return;
      }

      const fileName = user.value.avatar_url.split('/').pop();

      try {
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([fileName]);

        if (deleteError) {
          console.error('Error deleting image:', deleteError);
          return;
        }

        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.value.id,
            avatar_url: null
          });

        if (upsertError) {
          console.error('Error clearing avatar URL:', upsertError);
          return;
        }

        user.value.avatar_url = null;
      } catch (error) {
        console.error('Error during image deletion process:', error);
      }
    };

    return {
      user,
      loading,
      uploading,
      uploadError,
      uploadImage,
      deleteImage,
    };
  },
};
</script>

<style scoped>
/* Container for the profile page */
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  font-family: 'Roboto', sans-serif;
  background-color: #f4f4f9;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding-bottom: 60px; /* Added padding for the delete button */
}

/* Loading state */
.loading {
  text-align: center;
  font-size: 1.6em;
  color: #888;
  transition: opacity 0.3s ease;
}

/* Profile title */
.profile-title {
  font-size: 2.4em;
  margin-bottom: 25px;
  text-align: center;
  color: #333;
}

/* Card for displaying user details */
.profile-card {
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 25px;
  transition: transform 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
}

/* User avatar */
.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #ddd;
  transition: border-color 0.3s ease;
}

.avatar:hover {
  border-color: #2d9cdb;
}

/* User info styling */
.user-info {
  flex: 1;
}

.user-info p {
  font-size: 1.2em;
  color: #555;
  margin: 12px 0;
}

.user-info strong {
  font-weight: bold;
  color: #333;
}

/* File upload section */
.upload-section {
  margin-top: 25px;
  text-align: center;
}

.file-upload-label {
  display: inline-block;
  margin-bottom: 15px;
  font-size: 1.2em;
  color: #5CB338;
  background-color: #B4EBE6;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  border-radius: 20%;
}

.file-upload-input {
  display: none;
}

.uploading {
  font-size: 1.3em;
  color: #2d9cdb;
}

.error {
  color: red;
  font-size: 1.2em;
  margin-top: 15px;
}

/* Button Styles */
.delete-btn-container {
  margin-top: 30px; /* Added spacing before the delete button */
}

.delete-btn {
  background-color: #F2F9FF;
  color: black;
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #c0392b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 20px;
  }

  .profile-title {
    font-size: 2em;
  }

  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .user-info p {
    font-size: 1.1em;
  }

  .upload-section {
    margin-top: 20px;
  }

  .delete-btn {
    width: 100%;
  }
}
</style>
