<template>

<CalcTable />

</template>

<script>

import CalcTable from './components/CalcTable.vue';

export default {
  name: 'App',
  components: {
    CalcTable
  }
}

</script>

<style>
* {
  background-color: black;
  color: white;
  font-family: "Inconsolata", monospace;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
  font-variation-settings:
      "wdth" 100;
  font-size: 20px;
}

#app {
  font-family: "Inconsolata", monospace;
  font-optical-sizing: auto;
  font-weight: 200;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  background-color: black;
}
</style>
