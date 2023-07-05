<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { RouterLink, RouterView } from "vue-router";

const store = useUserStore();
</script>

<template>
  <nav>
    <ul>
      <li>
        <router-link :to="{name: 'Landing'}">Start</router-link>
      </li>
      <li>
        <router-link v-if="store.isLoggedIn" :to="{name: 'Admin'}">Admin</router-link>
      </li>
    </ul>
    <ul>
      <li>
        <router-link v-if="!store.isLoggedIn" :to="{name: 'Login'}">Logga in</router-link>
        <a href="#" v-else @click="store.isLoggedIn = false">Logga ut</a>
      </li>
    </ul>
  </nav> 
  <router-view />
</template>

<style scoped>
ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  gap: 24px;
  margin: 8px 16px;
  padding: 0px;
}

nav {
  position: fixed;
  display: flex;
  flex-direction: row;
  top: 0px;
  left: 0px;
  width: 100%;
  justify-content: space-between;
}
</style>
