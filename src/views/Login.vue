<script setup lang="ts">
import { HttpService } from "@/services/httpService";
import {
createUserWithEmailAndPassword,
deleteUser,
sendPasswordResetEmail,
signInWithEmailAndPassword,
} from '@firebase/auth';
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFirebaseAuth } from "vuefire";
const userInput = ref({
  email: '',
  emailVerification: '',
  password: '',
  passwordVerification: '',
  firstName: '',
  lastName: '',
  role: ''
});

const auth = useFirebaseAuth()!;
const router = useRouter();
const inRegisterMode = ref(false);
const inForgotPasswordMode = ref(false);
const snackbarData = ref({
  shouldDisplay: false,
  text: "",
  isError: false,
});

async function createUser() {
  createUserWithEmailAndPassword(
    auth,
    userInput.value.email,
    userInput.value.password
  )
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      HttpService
        .post(
          "/api/registerIndependentUser",
          {
            userEmail: user.email,
            firstName: userInput.value.firstName,
            lastName: userInput.value.lastName,
            role: userInput.value.role
          })
        .then(() => {
          router.push({ name: "Landing" });
        })
        .catch(() => {
          // If we cant create the user in our DB we delete user from provider, we dont want orphaned users.
          deleteUser(user);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    })
}

async function completeForm() {
  if (inForgotPasswordMode.value) {
    sendPasswordResetEmail(
      auth,
      userInput.value.email
    ).then(() => {
      snackbarData.value.shouldDisplay = true;
      snackbarData.value.isError = false;
      snackbarData.value.text = "Mejl för att återställa lösenord har skickats";
      setTimeout(() => { location.reload(); }, 2000);
    })
    return;
  }
  if (!inRegisterMode.value) {
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
  } else {
    createUser();
  }
}

function validatePasswordVerification(val: string) {
  return val === userInput.value.password || "Lösenorden matchar inte"
}

function validateEmail(val: string) {
  const regexPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regexPattern.test(val) || "Ogiltig epost"
}

function validateEmailVerification(val: string) {
  return val === userInput.value.email || "Epost"
}
</script>

<template>
  <v-snackbar v-model="snackbarData.shouldDisplay" timeout="2000" :color="snackbarData.isError ? 'error' : 'success'">
    {{ snackbarData.text }}
  </v-snackbar>
  <v-responsive class="mx-auto text-center mt-2" max-width="344">
    <h1 v-if="inRegisterMode">Registrera användare</h1>
    <h1 v-else>Logga in</h1>
    <v-form v-on:submit.prevent="completeForm" class="mt-4" style="gap:8px; display: flex; flex-direction: column;">
      <v-text-field clearable variant="outlined" v-model="userInput.email" type="email" label="Epost" required
        autocomplete="email" placeholder="Jane.Doe@mail.com" :rules="[validateEmail]" />
      <v-text-field v-if="inForgotPasswordMode" clearable variant="outlined" v-model="userInput.emailVerification"
        type="email" label="Bekräfta epost" required autocomplete="none" placeholder="Jane.Doe@mail.com"
        :rules="[validateEmailVerification]" />
      <v-text-field v-if="!inForgotPasswordMode" clearable variant="outlined" v-model="userInput.password"
        label="Lösenord" type="password" required autocomplete="current-password" />
      <v-container class="pa-0" style="gap:8px; display: flex; flex-direction: column;" v-if="inRegisterMode">
        <v-text-field clearable variant="outlined" v-model="userInput.passwordVerification" label="Bekräfta lösenord"
          type="password" required autocomplete="current-password" :rules="[validatePasswordVerification]" />
        <v-text-field spellcheck="false" clearable variant="outlined" v-model="userInput.firstName" label="Förnamn"
          type="text" autocomplete="given-name" />
        <v-text-field spellcheck="false" clearable variant="outlined" v-model="userInput.lastName" label="Efternamn"
          type="text" autocomplete="family-name" />
        <v-text-field spellcheck="false" clearable variant="outlined" v-model="userInput.role" label="Roll" type="text" />
      </v-container>
      <v-card-actions class="flex-column pt-0">
        <v-btn type="submit" color="success" class="mb-4 align-start">
          <span v-if="inRegisterMode">Registrera</span>
          <span v-else-if="inForgotPasswordMode">Återställ lösenord</span>
          <span v-else>Logga in</span>
          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
        <v-btn v-if="!inForgotPasswordMode" color="secondary" @click="inRegisterMode = !inRegisterMode">
          <span v-if="inRegisterMode">Logga in med befintlig användare</span>
          <span v-else>Registrera ny användare</span>
        </v-btn>
        <v-btn v-if="!inRegisterMode" color="warning" @click="inForgotPasswordMode = !inForgotPasswordMode">
          <span v-if="inForgotPasswordMode">Avbryt</span>
          <span v-else>Glömt lösenord</span>
        </v-btn>
      </v-card-actions>
    </v-form>


  </v-responsive>
</template>

<style scoped></style>