<script>
import CalcRow from "./CalcRow.vue";

export default {
  name: "CalcTable",
  components: {
    CalcRow,
  },
  data() {
    return {
      rows: ["0", "5", "6"],
    };
  },
  mounted() {
    // Attach the keypress listener when the component is mounted
    window.addEventListener("keypress", this.handleKeyPress);
  },
  beforeUnmount() {
    // Clean up the event listener when the component is destroyed
    window.removeEventListener("keypress", this.handleKeyPress);
  },
};
</script>

<template>
  <table id="calcTable" ref="calcTable">
    <CalcRow v-for="(row, index) in rows" :key="index" v-model="rows[index]" />
  </table>
  <pre>{{ rows }}</pre>
</template>
