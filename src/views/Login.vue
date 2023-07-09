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
      HttpService.post("/api/newUser", {userEmail: user.email}).then(() => {
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
  <div class="sign-in-wrapper">
    <h1>Sign In</h1>
    <div class="sign-in-form">
      <form>
        <input v-model="userInput.email" type="email" label="Email" required autocomplete="email"
          placeholder="Jane.Doe@mail.com" />
        <input v-model="userInput.password" label="Password" type="password" required autocomplete="current-password" />
      </form>

      <button @click="signInToFirebase" style="background-color:rgb(67, 182, 67)">
        Sign In
      </button>
      <button @click="createUser" style="background-color: rgb(56, 56, 255);">
        Create New User
      </button>
    </div>
  </div>
</template>

<style scoped>
.sign-in-form {
  display:flex;
  flex-direction: column;
  gap: 1rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
form > input {
  height: 1.5rem;
}
form > input:focus-visible {
  outline-style: solid;
  outline-width: 0.5px;
  outline-color: rgb(187, 186, 186);
}

.sign-in-wrapper {
  width: 16rem;
}
</style>