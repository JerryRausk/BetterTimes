<script setup lang="ts">
import { ref } from "vue";
interface Row {
  col1: string,
  col2: string,
}
const gridRows = ref<Row[]>([]);
const addRow = () => {
  gridRows.value.push({col1: "Tom", col2: "Placerholder"})
}
</script>
<template>
  <v-table
    fixed-header
    height="300px"
  >
    <thead>
      <tr>
        <th class="text-left">
          Kod
        </th>
        <th class="text-left">
          Dag 1
        </th>
        <th class="text-left">
          Dag 2
        </th>
        <th class="text-left">
          Dag 3
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in gridRows"
        :key="item.col1"
      >
        <td><v-text-field variant="outlined"></v-text-field></td>
        <td><v-text-field></v-text-field></td>
        <td><v-text-field></v-text-field></td>
        <td><v-text-field></v-text-field></td>
      </tr>
    </tbody>
  </v-table>
  <v-btn @click="addRow">Lägg till rad</v-btn>
</template>