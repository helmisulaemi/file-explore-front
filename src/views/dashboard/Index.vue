<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md p-4 flex flex-col">
      <h2 class="text-lg font-bold mb-4">FILE MANAGER</h2>

      <nav class="flex-1 overflow-y-auto">
        <ul class="space-y-1">
          <FolderTree
            v-for="item in folderTree"
            :key="item.id"
            :node="item"
          />
        </ul>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6">
      <h1 class="text-2xl font-semibold">Explorer</h1>
    </main>
  </div>
</template>

<script setup>
import FolderTree from "../../components/FolderTree.vue";

const folderTree = [
  {
    id: 1,
    name: "Design",
    children: [
      { id: 2, name: "Logos" },
      {
        id: 3,
        name: "UI",
        children: [
          { id: 4, name: "Buttons" },
          { id: 5, name: "Forms" },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Development",
    children: [
      { id: 7, name: "Frontend" },
      {
        id: 8,
        name: "Backend",
        children: [
          { id: 9, name: "API" },
          { id: 10, name: "Database" },
        ],
      },
    ],
  },
];
</script>
