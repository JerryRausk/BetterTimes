<script setup lang="ts">
import ButtonWithLoader from "@/components/base/ButtonWithLoader.vue";
import { HttpService } from "@/services/httpService";
import { User } from "@prisma/client";
import { onBeforeMount, onMounted, ref } from "vue";
import { useCurrentUser } from "vuefire";
const currentUser = useCurrentUser();
onBeforeMount(() => {
  //Validate that user is logged in
})
onMounted(async () => {
  userData.value = await HttpService.get("/api/user", true);
})

const isSaving = ref(false);
const saveUserData = async () => {
  isSaving.value = true;
  HttpService.put(
    "/api/user", 
    {
      firstName: userData.value?.firstName, 
      lastName: userData.value?.lastName,
      role: userData.value?.role
    },
    true
  ).then(() => {
    isSaving.value = false;
    snackbarData.value.shouldDisplay = true;
    snackbarData.value.text = "Användaren har sparats"
  })
}
const userData = ref<User | null>(null);

const snackbarData = ref({
  shouldDisplay: false,
  text: "",
  isError: false,
});

</script>
<template>
  <v-snackbar v-model="snackbarData.shouldDisplay" timeout="2000" :color="snackbarData.isError ? 'error' : 'success'">
    {{ snackbarData.text }}
  </v-snackbar>
  <v-container v-if="userData" style="max-width: 688px;">
    <v-form>
      <h2>{{ currentUser?.email }}</h2>
        <v-text-field v-model="userData.firstName" label="Förnamn"></v-text-field>
        <v-text-field v-model="userData.lastName" label="Efternamn"></v-text-field>
        <v-text-field v-model="userData.role" label="Roll"></v-text-field>
    </v-form>
    <button-with-loader text="Spara" color="secondary" @clicked="saveUserData" :should-display-loading="isSaving" />
  </v-container>
  <v-container style="max-width: fit-content; text-align: center;" v-if="!userData">
    <p class="mb-4">Hämtar användare...</p>
    <v-progress-circular indeterminate></v-progress-circular>
  </v-container>
</template>