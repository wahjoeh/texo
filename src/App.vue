<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
const showGlobalHeader = computed(() =>
  route.path !== '/login' && !route.matched.some(record => record.meta.hasPageHeader),
)
</script>

<template>
  <AppHeader v-if="showGlobalHeader" />
  <router-view />
</template>
