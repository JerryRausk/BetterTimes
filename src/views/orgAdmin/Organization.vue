<script setup lang="ts">
import ButtonWithLoader from "@/components/base/ButtonWithLoader.vue";
import { HttpService } from "@/services/httpService";
import { Organization } from "@prisma/client";
import { onBeforeMount, onMounted, ref } from "vue";
onBeforeMount(() => {
  //Validate that user is logged in
})
onMounted(async () => {
  organizationData.value = await HttpService.get("/api/organization", true);
})

const isSaving = ref(false);
const saveOrganizationData = async () => {
  isSaving.value = true;
  HttpService.put(
    "/api/organization", 
    {
      id: organizationData.value?.id, 
      orgName: organizationData.value?.name,
    },
    true
  ).then(() => {
    snackbarData.value.shouldDisplay = true;
    snackbarData.value.isError = false;
    snackbarData.value.text = "Organisationen har uppdaterats";
    isSaving.value = false;
  }
    
  )
}

const snackbarData = ref({
  shouldDisplay: false,
  text: "",
  isError: false,
});
const organizationData = ref<Organization | null>(null);

</script>
<template>
  <v-snackbar v-model="snackbarData.shouldDisplay" timeout="2000" :color="snackbarData.isError ? 'error' : 'success'">
    {{ snackbarData.text }}
  </v-snackbar>
  <v-container v-if="organizationData" style="max-width: 688px;">
    <v-form>
        <v-text-field v-model="organizationData.name" label="Organisationens namn"></v-text-field>
    </v-form>
    <ButtonWithLoader color="secondary" text="spara" :shouldDisplayLoading="isSaving" @clicked="saveOrganizationData"/>
  </v-container>
  <v-container style="max-width: fit-content; text-align: center;" v-if="!organizationData">
    <p class="mb-4">Hämtar organisation...</p>
    <v-progress-circular indeterminate></v-progress-circular>
  </v-container>
</template>