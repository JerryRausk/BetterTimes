<script setup lang="ts">
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { useCurrentUser, useFirebaseAuth } from "vuefire";

const currentUser = useCurrentUser();
const auth = useFirebaseAuth()!;
const router = useRouter();

const handleSignOut = async () => {
  await signOut(auth);
  router.push({ name: "Login" });
}
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar>
      <div class="nav">
        <div class="nav-group">
          <router-link :to="{ name: 'Landing' }">Start</router-link>
          <router-link v-if="currentUser" :to="{ name: 'TimeCodes' }">Administrera tidkoder</router-link>
          <router-link v-if="currentUser" :to="{ name: 'Organization' }">Administrera organisation</router-link>
          <router-link v-if="currentUser" :to="{ name: 'Users' }">Administrera användare</router-link>
          <router-link v-if="currentUser" :to="{ name: 'Report' }">Rapport</router-link>
        </div>
        <div class="nav-group">
          <router-link v-if="!currentUser" :to="{ name: 'Login' }">Logga in</router-link>
          <v-btn v-else>
            {{ currentUser.email }}
            <v-menu activator="parent">
              <v-list>
                <v-list-item @click="router.push({ name: 'User' })" theme="dark">
                  <v-list-item-title>Användare</v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleSignOut" theme="dark">
                  <v-list-item-title>Logga ut</v-list-item-title>
                </v-list-item>
              </v-list>

            </v-menu>

          </v-btn>
        </div>
      </div>


    </v-app-bar>
    <v-main>
      <div class="v-col-11 v-col-sm-10 v-col-md-8 v-col-lg-7 v-col-xl-6 v-col-xxl-5 ma-auto">
        <router-view />
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 0 16px;
}

.nav-group {
  gap: 12px;
  display: flex;

}
</style>
