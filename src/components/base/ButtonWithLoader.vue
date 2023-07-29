<script setup lang="ts">
defineProps<{
  shouldDisplayLoading: boolean,
  text: string,
  color: "primary" | "secondary" | "error" | "warning" | "success"
}>();

const emits = defineEmits<{
  (e: "clicked"): void
}>();
</script>
<template>
   <v-btn :color="color" @click="emits('clicked')">
      <v-progress-circular style="position: absolute; height: 66%" v-if="shouldDisplayLoading" indeterminate />
      <span :style="{ visibility: shouldDisplayLoading ? 'hidden' : 'visible' }">{{ text }}</span>
    </v-btn>
</template>