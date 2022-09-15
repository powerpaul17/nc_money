<template>
  <router-view
    v-if="sidebarVisible"
    name="sidebar"
    class="h-[calc(100vh-50px)]"
  ></router-view>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    computed: {
      sidebarVisible() {
        return this.$route.meta.showSidebar;
      }
    }
  });
</script>
