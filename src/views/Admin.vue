<template>
  <h2 v-if="auth.currentUser">Gz du är inloggad och kunde komma hit.</h2>
  <div v-else>
    <h2>Oops</h2>
    <h4>Vänligen logga in innan du gör något här.</h4>
    <button @click="router.push({name: 'Login'})">Logga in</button>
  </div>
  <button @click="verifyToken">Verfiera min token</button>
</template>
<script setup lang="ts">
import { HttpService } from "@/services/httpService";
import { useRouter } from "vue-router";
import { useFirebaseAuth } from 'vuefire';
const auth = useFirebaseAuth()!;
const router = useRouter();

const verifyToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("User is not signed in.");
    return;
  }
  const idToken = await currentUser.getIdToken(true);
  await HttpService.get("/api/updateUser", {"app-id-token": idToken});
}
</script>

<style scoped>
.side-nav {
  height: 100%;
  width: 12rem;
  float: left;
  background-color: green;
}

.wrapper {
  width: 100%;
  background-color: blue;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background-color: red;
}
</style>