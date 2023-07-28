<script setup lang="ts">
import { HttpService } from "@/services/httpService";
import {
createUserWithEmailAndPassword,
deleteUser,
signInWithEmailAndPassword,
} from '@firebase/auth';
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFirebaseAuth } from "vuefire";
const userInput = ref({
  email: '',
  password: '',
});

const auth = useFirebaseAuth()!;
const router = useRouter();

async function createUser() {
  createUserWithEmailAndPassword(
    auth,
    userInput.value.email,
    userInput.value.password
  )
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      HttpService.post("/api/registerIndependentUser", { userEmail: user.email }).then(() => {
        router.push({ name: "Landing" });
      }).catch(() => {
        deleteUser(user);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    })
}

async function signInToFirebase() {
  signInWithEmailAndPassword(
    auth,
    userInput.value.email,
    userInput.value.password
  )
    .then(() => {
      // Signed in
      router.push({ name: "Landing" });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    })
}
</script>

<template>
  <h1>Sign In</h1>
  <v-responsive class="mx-auto" max-width="344">
    <v-form v-on:submit.prevent="signInToFirebase" class="mt-4">
      <v-text-field clearable variant="outlined" v-model="userInput.email" type="email" label="Email" required
        autocomplete="email" placeholder="Jane.Doe@mail.com" />
      <v-text-field clearable variant="outlined" v-model="userInput.password" label="Password" type="password" required
        autocomplete="current-password" />
      <v-card-actions class="flex-column">
        <v-btn type="submit" color="success">
          Logga in
          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
        <v-btn color="secondary" @click="createUser">
          Registrera ny användare
        </v-btn>
      </v-card-actions>
    </v-form>


  </v-responsive>
</template>

<style scoped></style>