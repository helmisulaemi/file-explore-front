<template>
  <li>
    <div
      @click="handleClick"
      class="flex items-center cursor-pointer px-2 py-1 hover:bg-gray-100 rounded-md transition-colors duration-150"
    >
      <Folder class="w-4 h-4 text-yellow-500 mr-2" />
      <span class="text-sm font-medium text-gray-700">{{ node.name }}</span>
      <span class="ml-auto" v-if="node.children">
        <ChevronDown v-if="isOpen" class="w-4 h-4 text-gray-500" />
        <ChevronRight v-else class="w-4 h-4 text-gray-500" />
      </span>
    </div>

    <!-- Recursive children -->
    <ul v-if="isOpen && node.children" class="ml-5 space-y-1 mt-1 pl-2 border-l border-gray-200/60">
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

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['open']);

const isOpen = ref(false);

function toggle() {
  if (props.node.children) {
    isOpen.value = !isOpen.value;
  }
}

function handleClick() {
  toggle();
  // Emit the open event with the node id when a folder without children is clicked
  emit('open', props.node.id);
}

// Define the component for recursive use
defineOptions({
  name: 'FolderTree'
})
</script>
