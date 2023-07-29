<script setup lang="ts">
import TimeCodeContainer from "@/components/TimeCodeContainer.vue";
import { HttpService } from "@/services/httpService";
import { TimeCode as TimeCodeType } from "@prisma/client";
import { onMounted, ref } from "vue";

// We can create a dummy interface from the prisma model.
interface TimeCode {
  id: number;
  code: number;
  name: string | null;
  description: string | null;
  organizationId: number;
}
const loading = ref(true);

const handleSavedTimeCodeState = async (timeCode: TimeCode) => {
  const oldTimeCodeState = { ...timeCodes.value.find(tc => tc.id === timeCode.id)! };
  // Temporarly set state to the saved state
  timeCodes.value[timeCodes.value.findIndex(tc => tc.id === timeCode.id)] = timeCode;

  currentlySavingTimeCodeIds.value.push(timeCode.id);
  // send to API
  const res = await HttpService.post<TimeCodeType>("/api/timeCode", { id: timeCode.id, code: timeCode.code, name: timeCode.name, description: timeCode.description }, true);
  
  currentlySavingTimeCodeIds.value.splice(currentlySavingTimeCodeIds.value.findIndex(id => id === timeCode.id));
  currentlyEditingTimeCodeIds.value.splice(currentlyEditingTimeCodeIds.value.findIndex(id => id === timeCode.id))
  if (!res.success || !res.data) {
    console.error("Upsert went bom");
    snackbarData.value.text = `Tidkod ${timeCode.code} kunde inte uppdateras.`;
    snackbarData.value.shouldDisplay = true;
    snackbarData.value.isError = true;
    // Revert to old pre-saved state
    timeCodes.value[timeCodes.value.findIndex(tc => tc.id === timeCode.id)] = oldTimeCodeState;
    return;
  }

  snackbarData.value.text = `Tidkod ${timeCode.code} uppdaterad`;
  snackbarData.value.shouldDisplay = true;
  snackbarData.value.isError = false;
  // Final update, incase this was newly created the tc will get id assigned from backend.
  timeCodes.value[timeCodes.value.findIndex(tc => tc.id === timeCode.id)] = res.data;
}

const handleAbortedTimeCodeEdit = (timeCodeId: number) => {
  currentlyEditingTimeCodeIds.value = currentlyEditingTimeCodeIds.value.filter(id => id !== timeCodeId);
  if (localTimeCodesNotYetpersisted.value.includes(timeCodeId)) {
    timeCodes.value = timeCodes.value.filter((tc) => tc.id !== timeCodeId);
  }
}

const handleDeletedTimeCode = async (timeCodeId: number) => {
  const deleteTask = HttpService.delete("/api/timeCode", { id: timeCodeId }, true);
  timeCodes.value = timeCodes.value.filter(tc => tc.id !== timeCodeId);
  deleteTask.catch(() => console.error("Ultra error no good, delet no funky"))
}

const handleEditInitiated = (timeCodeId: number) => {
  currentlyEditingTimeCodeIds.value.push(timeCodeId);
}

const currentlyEditingTimeCodeIds = ref<number[]>([]);
const currentlySavingTimeCodeIds = ref<number[]>([]);
const localTimeCodesNotYetpersisted = ref<number[]>([]);
const timeCodes = ref<TimeCode[]>([]);

const createNewTimeCode = () => {
  const localId = (new Date().getTime());
  currentlyEditingTimeCodeIds.value.push(localId);
  localTimeCodesNotYetpersisted.value.push(localId);
  timeCodes.value.push({ id: localId, code: 0, name: null, description: null, organizationId: localId });
}

const snackbarData = ref({
  shouldDisplay: false,
  text: "",
  isError: false,
});

onMounted(async () => {
  timeCodes.value = await HttpService.get<TimeCode[]>("/api/timeCode", true);
  loading.value = false;
});
</script>
<template>
  <v-snackbar v-model="snackbarData.shouldDisplay" timeout="2000" :color="snackbarData.isError ? 'error' : 'success'">
    {{ snackbarData.text }}
  </v-snackbar>
  <v-container v-if="!loading" class="d-flex flex-column" style="gap: 24px; max-width: 688px">
    <TimeCodeContainer 
      v-for="timeCode in timeCodes" 
      :key="timeCode.id" 
      :id="timeCode.id" 
      :code="timeCode.code"
      :name="timeCode.name" 
      :description="timeCode.description" 
      :organization-id="timeCode.organizationId"
      :is-persisted="!localTimeCodesNotYetPersisted.includes(timeCode.id)"
      :is-editable="currentlyEditingTimeCodeIds.includes(timeCode.id)"
      :is-saving="currentlySavingTimeCodeIds.includes(timeCode.id)"
      @saved="handleSavedTimeCodeState"
      @edit-initiated="handleEditInitiated"
      @edit-aborted="handleAbortedTimeCodeEdit" 
      @deleted="handleDeletedTimeCode" 
    />
    <v-btn style="width: fit-content" class="pa-2" color="success" @click="createNewTimeCode">Ny tidkod</v-btn>
  </v-container>
  <v-container v-else style="width: fit-content; text-align: center;">
    <p class="mb-4">Hämtar tidkoder...</p>
    <v-progress-circular indeterminate />
  </v-container>
</template>

<style scoped></style>