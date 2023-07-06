<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { RouterLink, RouterView } from "vue-router";

const store = useUserStore();
</script>

<template>
  <div class="app">
    <nav>
      <ul>
        <li>
          <router-link :to="{ name: 'Landing' }">Start</router-link>
        </li>
        <li>
          <router-link v-if="store.isLoggedIn" :to="{ name: 'Admin' }">Admin</router-link>
        </li>
      </ul>
      <ul>
        <li>
          <router-link v-if="!store.isLoggedIn" :to="{ name: 'Login' }">Logga in</router-link>
          <a href="#" v-else @click="store.isLoggedIn = false">Logga ut</a>
        </li>
      </ul>
    </nav>
    <div class="router-view-wrapper">
      <router-view />
    </div>
    
  </div>
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
  background-color: gray;
}
.router-view-wrapper {
  width: 100%;
  height: 100%;
  background-color: purple;
}
.app {
  height: 100%;
  width: 100%;
  display: block;
}
</style>
