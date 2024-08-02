<script setup>
import { ref, onMounted, defineProps } from 'vue';
import rowManager from '../utils/rowManager';

const props = defineProps({
  index: {
    type: Number,
    required: true
  }
});

const rowInput = ref();

onMounted(() => {
  rowInput.value = rowManager.getRow(props.index).getEquation();
  if (props.index == rowManager.focusRowIndex.value) {
    document.getElementById(`row${props.index}`).focus();
  }
});

function handleInput() {
  rowManager.getRow(props.index).setEquation(rowInput.value);
  rowInput.value = rowManager.getRow(props.index).getEquation();
}

function handleEnter() {
  rowManager.addRowAt(props.index);
}
</script>

<template>
  <tr>
    <td>
      <input
        class="inputs"
        :id="'row' + props.index"
        type="text"
        placeholder="|"
        v-model="rowInput"
        v-on:input="handleInput"
        @keyup.enter="handleEnter"
      />
    </td>
    <td class="answer">{{ rowManager.getRow(props.index).getAnswer() }}</td>
  </tr>
</template>

<style>
.inputs {
  width: 50vw;
  border: none;
  background-color: black;
  color: white;
  font-family: "Inconsolata", monospace;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
  font-variation-settings: "wdth" 100;
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.inputs:focus {
  outline: none;
  border: none;
}
</style>
