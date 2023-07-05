<template>
  Detta är login
  <button role="button" @click="handleLogin">Logga in</button>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
const store = useUserStore();
const router = useRouter();
const handleLogin = async () => {
  store.isLoggedIn = true;
  
  await router.push({name: "Landing"});
}
</script>
<style scoped>
</style>