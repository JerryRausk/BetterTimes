<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  email: string
  firstName: string,
  lastName: string,
  role: string,
  password?: string,
}>();
const passwordVerification = ref("");
const emits = defineEmits(["update:email", "update:firstName", "update:lastName", "update:role", "update:password"])

function validateEmail(val: string) {
  const regexPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regexPattern.test(val) || "Ogiltig epost"
}


function validatePasswordVerification(val: string) {
  return val === props.password || "Lösenorden matchar inte"
}
</script>

<template>
  <v-form class="mt-4" style="gap:8px; display: flex; flex-direction: column;">
    <v-text-field variant="outlined" :value="email" @input="emits('update:email', $event.target.value)" type="email"
      label="Epost" required autocomplete="email" placeholder="Jane.Doe@mail.com" :rules="[validateEmail]" />
    <v-text-field variant="outlined" :value="password" @input="emits('update:password', $event.target.value)"
      label="Lösenord" type="password" required autocomplete="current-password" />
    <v-text-field variant="outlined" v-model="passwordVerification" label="Bekräfta lösenord" type="password" required
      autocomplete="current-password" :rules="[validatePasswordVerification]" />
    <v-text-field spellcheck="false" variant="outlined" :value="firstName"
      @input="emits('update:firstName', $event.target.value)" label="Förnamn" type="text" autocomplete="given-name" />
    <v-text-field spellcheck="false" variant="outlined" :value="lastName"
      @input="emits('update:lastName', $event.target.value)" label="Efternamn" type="text" autocomplete="family-name" />
    <v-text-field spellcheck="false" variant="outlined" :value="role" @input="emits('update:role', $event.target.value)"
      label="Roll" type="text" />
  </v-form>
</template>