<template>
  <div class="wrapper">
    <div class="side-nav">
      <ul>
        <li>
          Användare
        </li>
        <li>
          Organisation
        </li>
        <li>
          Tidkoder
        </li>
      </ul>
    </div>
    <div class="main">
      Main content goes here
    </div>
  </div>
</template>
<script setup lang="ts">

</script>

<style scoped>
.side-nav {
  height: 100%;
  width: 12rem;
  float: left;
  background-color: green;
}

.wrapper {
  width: 100%;
  background-color: blue;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background-color: red;
}
</style>