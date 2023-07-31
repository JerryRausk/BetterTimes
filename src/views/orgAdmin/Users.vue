<script setup lang="ts">
import { HttpService } from '@/services/httpService';
import { ref } from 'vue';
const newUserData = ref({
  email: "",
  firstName: "",
  lastName: "",
  role: ""
})
const snackbarData = ref({
  shouldDisplay: false,
  text: "",
  isError: false,
});

const handleRegisterNewUser = async () => {
  const res = await HttpService.post("/api/newOrganizationUser", newUserData.value, true);
  if (res.success) {
    snackbarData.value.shouldDisplay = true;
    snackbarData.value.isError = false;
    snackbarData.value.text = "Användaren är registrerad och behöver återställa sitt lösenord vid första inloggning.";
  
  } else {
    snackbarData.value.shouldDisplay = true;
    snackbarData.value.isError = true;
    snackbarData.value.text = "Kunde inte skapa användaren.";
  }
    
}

function validateEmail(val: string) {
  const regexPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regexPattern.test(val) || "Ogiltig epost"
}
</script>

<template>
  <v-snackbar v-model="snackbarData.shouldDisplay" timeout="2000" :color="snackbarData.isError ? 'error' : 'success'">
    {{ snackbarData.text }}
  </v-snackbar>
  <v-container>
    <h2>Befintliga användare i organisationen</h2>

    <v-btn color="success">Skapa ny användare</v-btn>
    <v-container class="ma-auto pa-2 rounded">
      <v-form class="mt-4" style="gap:8px; display: flex; flex-direction: column;">
        <v-text-field variant="outlined" v-model="newUserData.email" type="email" label="Epost" required
          autocomplete="email" placeholder="Jane.Doe@mail.com" :rules="[validateEmail]" />
        <v-text-field spellcheck="false" variant="outlined" v-model="newUserData.firstName" label="Förnamn" type="text"
          autocomplete="given-name" />
        <v-text-field spellcheck="false" variant="outlined" v-model="newUserData.lastName" label="Efternamn" type="text"
          autocomplete="family-name" />
        <v-text-field spellcheck="false" variant="outlined" v-model="newUserData.role" label="Roll" type="text" />
      </v-form>
      <v-btn color="success" @click="handleRegisterNewUser">Bekräfta</v-btn>
    </v-container>

</v-container></template>