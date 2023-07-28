<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';

interface TimeCode {
  id: number;
  code: number;
  name: string | null;
  description: string | null;
  organizationId: number;
}

interface TimeCodeProps extends TimeCode {
  newlyCreatedLocalTimeCode?: boolean
}

const props = defineProps<TimeCodeProps>();

const emits = defineEmits<{
  (e: "saved", newState: TimeCode): void,
  (e: "deleted", timeCodeId: number): void,
  (e: "editAborted", timeCodeId: number): void
}>();

const inEditState = ref(false);
const dirtyState = ref({ ...props });

const handleAbortEdit = () => {
  emits("editAborted", props.id);
  dirtyState.value = { ...props };
  inEditState.value = false;
}

// Reset to props and act when parent update props
// If external call fails we won't lie to the user and show the newly saved value.
const handleSaveEdit = () => {
  emits("saved", dirtyState.value);
  inEditState.value = false;
  dirtyState.value = { ...props }
}

const handleDelete = () => {
  emits("deleted", props.id);
}

onUpdated(() => { dirtyState.value = { ...props } })
onMounted(() => { 
  inEditState.value = props.newlyCreatedLocalTimeCode; })
</script>

<template>
  <v-container class="bg-surface rounded">
    <v-container class="flex-row d-flex py-0" style="gap: 16px">
      <v-text-field dirty :readonly="!inEditState" density="compact" label="Namn" variant="outlined"
        v-model="dirtyState.name" />
      <v-text-field dirty :readonly="!inEditState" density="compact" label="Kod" variant="outlined"
        v-model.number="dirtyState.code" type="number"/>
    </v-container>
    <v-container class="py-0">
      <v-textarea dirty :readonly="!inEditState" density="compact" label="Beskrivning" variant="outlined"
        v-model="dirtyState.description" rows="1" auto-grow></v-textarea>
    </v-container>
    <v-container class="justify-space-between d-flex flex-row-reverse">
      <v-btn v-if="!inEditState" color="primary" @click="inEditState = true">Ändra</v-btn>
      <v-container v-if="inEditState" class="d-flex flex-row pa-0">
        <v-container class="d-flex flex-row pa-0" style="gap: 16px;">
          <v-btn color="success" @click="handleSaveEdit">Spara</v-btn>
          <v-btn v-if="!newlyCreatedLocalTimeCode" color="error" @click="handleDelete">Radera</v-btn>
        </v-container>
        <v-btn color="warning" @click="handleAbortEdit">Avbryt</v-btn>
      </v-container>

    </v-container>
  </v-container>
</template>