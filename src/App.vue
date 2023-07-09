<script setup lang="ts">
import { signOut } from "firebase/auth";
import { RouterLink, RouterView } from "vue-router";
import { useCurrentUser, useFirebaseAuth } from "vuefire";

const currentUser = useCurrentUser();
const auth = useFirebaseAuth()!;
</script>

<template>
  <div class="app">
    <nav>
      <ul>
        <li>
          <router-link :to="{ name: 'Landing' }">Start</router-link>
        </li>
        <li>
          <router-link v-if="currentUser" :to="{ name: 'Admin' }">Admin</router-link>
        </li>
      </ul>
      <ul>
        <li>
          <router-link v-if="!currentUser" :to="{ name: 'Login' }">Logga in</router-link>
          <a href="#" v-else @click="signOut(auth)">Logga ut {{ currentUser.email }}</a>
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
}
</style>
