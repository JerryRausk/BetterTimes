<script setup lang="ts">
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
const saveUserData = async () => {
  await HttpService.put(
    "/api/user", 
    {
      firstName: userData.value?.firstName, 
      lastName: userData.value?.lastName,
      role: userData.value?.role
    },
    true
  )
}
const userData = ref<User | null>(null);

</script>
<template>
  <v-container v-if="userData" style="max-width: 688px;">
    <v-form>
      <h2>{{ currentUser?.email }}</h2>
        <v-text-field v-model="userData.firstName" label="Förnamn"></v-text-field>
        <v-text-field v-model="userData.lastName" label="Efternam"></v-text-field>
        <v-text-field v-model="userData.role" label="Roll"></v-text-field>
    </v-form>
    <v-btn color="secondary" type="submit" @click="saveUserData">
      Spara
    </v-btn>
  </v-container>
  <v-container style="max-width: fit-content" v-if="!userData">
    <v-progress-circular indeterminate></v-progress-circular>
  </v-container>
</template>