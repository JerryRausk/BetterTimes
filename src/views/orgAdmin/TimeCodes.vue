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
  const oldTimeCodeState = {...mockedTimeCodes.value.find(tc => tc.id === timeCode.id)!};
  
  // Temporarly set state to the saved state
  mockedTimeCodes.value[mockedTimeCodes.value.findIndex(tc => tc.id === timeCode.id)] = timeCode;

  // send to API
  const res = await HttpService.post<TimeCodeType>("/api/timeCode", { id: timeCode.id, code: timeCode.code, name: timeCode.name, description: timeCode.description }, true);
  if (!res.success || !res.data) {
    console.error("Upsert went bom");
    
    // Revert to old pre-saved state
    mockedTimeCodes.value[mockedTimeCodes.value.findIndex(tc => tc.id === timeCode.id)] = oldTimeCodeState;
    return;
  }
  
  // Final update, incase this was newly created the tc will get id assigned from backend.
  mockedTimeCodes.value[mockedTimeCodes.value.findIndex(tc => tc.id === timeCode.id)] = res.data;
}

const handleAbortedTimeCodeEdit = (timeCodeId: number) => {
  if (locallyCreatedTimeCodeIds.includes(timeCodeId)) {
    mockedTimeCodes.value = mockedTimeCodes.value.filter((tc) => tc.id !== timeCodeId);
  }
}

const mockedTimeCodes = ref<TimeCode[]>([]);

const createNewTimeCode = () => {
  const localId = (new Date().getTime());
  locallyCreatedTimeCodeIds.push(localId);
  mockedTimeCodes.value.push({ id: localId, code: 0, name: null, description: null, organizationId: localId });
}

const locallyCreatedTimeCodeIds: number[] = [];



onMounted(async () => {
  mockedTimeCodes.value = await HttpService.get<TimeCode[]>("/api/timeCode", true);
  loading.value = false;
});
</script>
<template>
  <v-container v-if="!loading" class="d-flex flex-column" style="gap: 24px; max-width: 688px">
    <TimeCodeContainer v-for="timeCode in mockedTimeCodes" :key="timeCode.id" :id="timeCode.id"
      :code="timeCode.code" :name="timeCode.name" :description="timeCode.description"
      :organization-id="timeCode.organizationId" :newly-created-local-time-code="locallyCreatedTimeCodeIds.includes(timeCode.id)" @saved="handleSavedTimeCodeState" @edit-aborted="handleAbortedTimeCodeEdit" />
    <v-btn style="width: fit-content" class="pa-2" color="success" @click="createNewTimeCode">Ny tidkod</v-btn>
  </v-container>
  <v-container v-else style="width: fit-content; text-align: center;">
    <p class="mb-4">Hämtar tidkoder...</p>
    <v-progress-circular indeterminate />
  </v-container>
</template>

<style scoped></style>