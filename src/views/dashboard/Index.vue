<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <!-- Sidebar -->
    <aside class="w-64 bg-white/80 backdrop-blur-sm shadow-lg border-r border-gray-200/50 rounded-l-lg p-5 flex flex-col transition-all duration-300">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-800 tracking-tight">FILE MANAGER</h2>
        <div class="mt-1 w-10 h-0.5 bg-blue-500 rounded-full"></div>
      </div>

      <div class="mb-4">
        <button 
          @click="createParentFolder"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">New Folder</span>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-2">
        <ul class="space-y-1">
          <FolderTree
            v-for="item in folderTree"
            :key="item.id"
            :node="item"
            @open="openFolder(item)"
          />
        </ul>
      </nav>

      <!-- User Info and Logout -->
      <div class="mt-auto pt-4 border-t border-gray-200">
        <div class="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="text-blue-600 font-medium">{{ getInitials(userEmail) }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">{{ userEmail }}</p>
            <p class="text-xs text-gray-500 truncate">Free Account</p>
          </div>
          <div>
            <button 
              @click="logout"
              class="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200 cursor-pointer"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-8 bg-white/50 backdrop-blur-sm rounded-r-lg">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Explorer</h1>
              <p class="text-gray-500 mt-1">Manage your files and folders efficiently</p>
            </div>
            <div class="flex space-x-3" v-if="currentFolder != null">
              <button 
                @click="showUploadFileModal = true"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <span>Upload File</span>
              </button>
              <button 
                @click="showCreateFolderModal = true"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <span>New Folder</span>
              </button>
            </div>
          </div>
          
          <!-- Breadcrumbs -->
          <div class="flex items-center mt-4 text-sm text-gray-600">
            <span class="cursor-pointer hover:text-blue-600" @click="navigateToHome()">Home</span>
            <span v-for="(folder, index) in breadcrumb" :key="index" class="flex items-center">
              <span class="mx-2">/</span>
              <span class="cursor-pointer hover:text-blue-600" @click="navigateToBreadcrumb(folder)">
                {{ folder.name }}
              </span>
            </span>
          </div>
        </div>
        
        <!-- Content area -->
        <div class="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 min-h-[70vh]">
          <div v-if="currentFolderContents?.length > 0">
            <!-- Folders and Files Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div 
                v-for="item in currentFolderContents" 
                :key="item.id"
                class="p-4 rounded-lg border border-gray-200/50 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                @click="!item.folderId ? openFolder(item, 'child') : openFile(item)"
              >
                <div class="flex flex-col items-center">
                  <div class="w-12 h-12 flex items-center justify-center mb-3">
                    <svg 
                      v-if="!item.folderId" 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-8 w-8 text-yellow-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <svg 
                      v-else 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-8 w-8 text-blue-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="text-center">
                    <p class="font-medium text-gray-800 truncate w-full group-hover:text-blue-600">{{ item.name }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(item.updatedAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-800 mb-1">No files or folders</h3>
            <p class="text-gray-500 max-w-md mx-auto">This folder is empty. Create a new folder or upload files to get started.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Folder Modal -->
    <div v-if="showCreateFolderModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Create New Folder</h3>
          <button @click="showCreateFolderModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Folder Name</label>
          <input
            v-model="newFolderName"
            type="text"
            placeholder="Enter folder name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            @keyup.enter="createFolder"
            ref="folderInputRef"
          />
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="showCreateFolderModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            @click="createFolder"
            :disabled="!newFolderName.trim()"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- Upload File Modal -->
    <div v-if="showUploadFileModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Upload File</h3>
          <button @click="showUploadFileModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Select File</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mt-2 text-sm text-gray-600">Click to select a file or drag and drop</p>
            <p class="text-xs text-gray-500">Any file type up to 10MB</p>
            <input type="file" class="hidden" ref="fileInputRef" @change="onFileSelect" />
            <button 
              @click="selectFile" 
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Select File
            </button>
          </div>
          <div v-if="selectedFile" class="mt-3 text-sm text-gray-600">
            Selected: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="showUploadFileModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            @click="uploadFile"
            :disabled="!selectedFile"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from "../../store/auth";
import { useRouter } from "vue-router";
import FolderTree from "../../components/FolderTree.vue";
import api from "../../api/axios";
import { toast } from 'vue3-toastify';

const auth = useAuthStore();
const router = useRouter();
const userEmail = ref();
const folderTree = ref();
const currentFolderContents = ref();
const currentFolder = ref();
const breadcrumb = ref([]);
const showCreateFolderModal = ref(false);
const showUploadFileModal = ref(false);
const newFolderName = ref('');
const selectedFile = ref<File | null>(null);
const folderInputRef = ref(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const fetchFolder = async () => {
  const response = await api.get("/folder");
  folderTree.value = response.data.data;
  breadcrumb.value = [];
}

const openFolder = async (data: any, source: any = '') => {
  const response = await api.get(`/folder/${data.id}`);
  currentFolderContents.value = response.data.data;
  currentFolder.value = data;

  let bread = {
    id: data.id,
    name: data.name
  }

  if(source == 'bread') return;
  if(source == 'child') {
    breadcrumb.value.push(bread)
  } else {
    breadcrumb.value = [];
    breadcrumb.value.push(bread)
  }
}

const navigateToHome = async () => {
  currentFolderContents.value = null
  currentFolder.value = null
  breadcrumb.value = [];
}

const navigateToBreadcrumb = async (folder: any) => {
  if (folder.id === currentFolder.value.id) return
  
  // Find the index of the folder in breadcrumb and slice up to that point
  const index = breadcrumb.value.findIndex(item => item.id === folder.id);
  if (index !== -1) {
    breadcrumb.value = breadcrumb.value.slice(0, index + 1);
    await openFolder(folder, 'bread');
  }
}

const openFile = (file: any) => {
  // Placeholder for file opening logic
  console.log('Opening file:', file);
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const selectFile = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return;
  
  try {
    const formData = new FormData();
    formData.append('image', selectedFile.value);
    
    // If we're in a specific folder, add the folder ID
    if (currentFolder.value) {
      formData.append('folderId', currentFolder.value.id.toString());
    }
    
    const response = await api.post('/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    toast(response.data.message, {
      type: response.data.success ? "success" : "error",
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    
    // Refresh the current folder view
    if (currentFolder.value) {
      await openFolder(currentFolder.value);
    } else {
      await fetchFolder();
    }
    
    // Reset and close modal
    showUploadFileModal.value = false;
    selectedFile.value = null;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast('Error uploading file', {
      type: "error",
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }
}

// Create a new folder
const createFolder = async () => {
  try {
    if (newFolderName.value.trim()) {
      let response;
      
      if (currentFolder.value) {
        // Create folder in current folder
        response = await api.post("/folder", { 
          name: newFolderName.value,
          parentId: currentFolder.value.id
        });
      } else {
        // Create folder in root
        response = await api.post("/folder", { 
          name: newFolderName.value
        });
      }
      
      toast(response.data.message, {
        type: response.data.success ? "success" : "error",
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      
      // Refresh the current folder view
      if (currentFolder.value) {
        await openFolder(currentFolder.value);
      }
      
      await fetchFolder();
      showCreateFolderModal.value = false;
      newFolderName.value = '';
    }
  } catch (error) {
    console.error('Error creating folder:', error);
    toast('Error creating folder', {
      type: "error",
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }
};

const createParentFolder = () => {
  currentFolder.value = null
  showCreateFolderModal.value = true
}

const getInitials = (email: string | null) => {
  if (!email) return 'U';
  const parts = email.split('@')[0].split('.');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const logout = () => {
  auth.logout();
  router.push("/login");
};

onMounted(async () => {
  userEmail.value = localStorage.getItem('email');
  await fetchFolder();
});
</script>
