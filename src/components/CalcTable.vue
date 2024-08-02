<script setup >
import CalcRow from "./CalcRow.vue";
import rowManager from '../utils/rowManager';
</script>

<template>
  <table id="calcTable" ref="calcTable">
    <CalcRow v-for="row in rowManager.getRows()" :key="row.getIndex()" :index="row.getIndex()" />
  </table>
  <pre>{{ rowManager.getRows() }}</pre>
</template>
