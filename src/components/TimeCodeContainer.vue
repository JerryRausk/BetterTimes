<script setup lang="ts">
import ButtonWithLoader from "@/components/base/ButtonWithLoader.vue";
import { onUpdated, ref } from 'vue';

interface TimeCode {
  id: number;
  code: number;
  name: string | null;
  description: string | null;
  organizationId: number;
}

interface TimeCodeProps extends TimeCode {
  isPersisted?: boolean
  isEditable: boolean
  isSaving: boolean
}

const props = defineProps<TimeCodeProps>();

const emits = defineEmits<{
  (e: "saved", newState: TimeCode): void,
  (e: "deleted", timeCodeId: number): void,
  (e: "editInitiated", timeCodeId: number): void,
  (e: "editAborted", timeCodeId: number): void
}>();

const dirtyState = ref({ ...props });

const handleAbortEdit = () => {
  emits("editAborted", props.id);
  dirtyState.value = { ...props };
}

// Reset to props and act when parent update props
// If external call fails we won't lie to the user and show the newly saved value.
const handleSaveEdit = () => {
  emits("saved", dirtyState.value);
  dirtyState.value = { ...props }
}

onUpdated(() => { dirtyState.value = { ...props } })
</script>

<template>
  <v-container class="bg-surface rounded">
    <v-container class="flex-row d-flex py-0" style="gap: 16px">
      <v-text-field dirty :readonly="!isEditable" density="compact" label="Namn" variant="outlined"
        v-model="dirtyState.name" class="w-66" />
      <v-text-field dirty :readonly="!isEditable" density="compact" label="Kod" variant="outlined"
        v-model.number="dirtyState.code" type="number" class="w-33" />
    </v-container>
    <v-container class="py-0">
      <v-textarea dirty :readonly="!isEditable" density="compact" label="Beskrivning" variant="outlined"
        v-model="dirtyState.description" rows="1" auto-grow></v-textarea>
    </v-container>
    <v-container class="justify-space-between d-flex flex-row-reverse">
      <v-btn v-if="!isEditable" color="primary" @click="emits('editInitiated', id)">Ändra</v-btn>
      <v-container v-if="isEditable" class="d-flex flex-row pa-0">
        <v-container class="d-flex flex-row pa-0" style="gap: 16px;">
          <button-with-loader color="success" text="Spara" @clicked="handleSaveEdit" :should-display-loading="isSaving"/>
          <v-btn v-if="isPersisted" color="error" @click="emits('deleted', props.id)">Radera</v-btn>
        </v-container>
        <v-btn color="warning" @click="handleAbortEdit">Avbryt</v-btn>
      </v-container>

    </v-container>
  </v-container>
</template>