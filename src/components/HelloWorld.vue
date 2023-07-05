<script setup lang="ts">
import HttpService from "@/services/httpService";
import type { Thing } from "@prisma/client";
import { onMounted, ref } from 'vue';
const thing = ref<string>();

onMounted(async () => {
  const fromBackend = await HttpService.get<Thing>("/api/getThing")
  thing.value = fromBackend.name;
})

</script>

<template>
  <h1>{{ thing }}</h1>
</template>

<style scoped>
</style>
