<template>
  <li>
    <div
      @click="toggle"
      class="flex items-center cursor-pointer px-2 py-1 hover:bg-gray-100 rounded-md"
    >
      <Folder class="w-4 h-4 text-yellow-500 mr-2" />
      <span>{{ node.name }}</span>
      <span class="ml-auto">
        <ChevronDown v-if="isOpen" class="w-4 h-4 text-gray-500" />
        <ChevronRight v-else class="w-4 h-4 text-gray-500" />
      </span>
    </div>

    <!-- Recursive children -->
    <ul v-if="isOpen && node.children" class="ml-6 space-y-1 mt-1">
      <FolderTree
        v-for="child in node.children"
        :key="child.id"
        :node="child"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref } from "vue";
import { Folder, ChevronRight, ChevronDown } from "lucide-vue-next";

defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const isOpen = ref(false);

function toggle() {
  if (node.children) {
    isOpen.value = !isOpen.value;
  }
}
</script>
