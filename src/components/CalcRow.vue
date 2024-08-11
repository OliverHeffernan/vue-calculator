<script setup>
import { ref, onMounted, defineProps } from 'vue';
import rowManager from '../utils/rowManager';

const props = defineProps({
  index: {
    type: Number,
    required: true
  }
});

var mounted = false;
const rowInput = ref();

onMounted(() => {
  rowInput.value = rowManager.getRow(props.index).getEquation();
  if (props.index == rowManager.focusRowIndex.value) {
    document.getElementById(`row${props.index}`).focus();
  }
  mounted = true;
});

function handleInput() {
  rowManager.getRow(props.index).setEquation(rowInput.value);
  rowInput.value = rowManager.getRow(props.index).getEquation();
}

function handleEnter() {
  rowManager.addRowAt(props.index);
}

function focusOnRow() {
  if (mounted) {
    document.getElementById(`row${props.index}`).focus();
    rowManager.setFocusRowIndex(props.index);
  }
}
focusOnRow();

function getEquals(index) {
  return rowManager.getRow(index).getEquation().substring(0,2) == '//' ? '' : '<op> = </op>';
}

function copyAnswer() {
  navigator.clipboard.writeText(rowManager.getRow(props.index).getAnswer());
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
  </tr>
  <tr>
    <td @click="focusOnRow" :id="'dispRow' + props.index" v-html="rowManager.getRow(props.index).getDispEquation()"></td>
    <td :id="'equal' + props.index" v-html="getEquals(props.index)"></td>
    <td @click="copyAnswer" class="answer">{{ rowManager.getRow(props.index).getAnswer() }}</td>
  </tr>
</template>

<style>
.inputs {
  /* width: 50vw; */
  width: 1ch;
  border: none;
  background-color: transparent;
  font-family: "Inconsolata", monospace;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
  font-variation-settings: "wdth" 100;
  font-size: 0px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgb(142, 142, 142);
  transition: all 0.4s;
  margin-right: 50px;
  width: auto;
}

.inputs:focus {
  width: auto;
  font-size: 12px;
  outline: none;
  border: none;
  color: transparent;
}

brack {
  color: red;
}

.depth0 {
  color: orange;
}

.depth1 {
  color: yellow;
}

.depth2 {
  color: green;
}

op {
  color: rgb(223, 104, 116);
}

func {
  color: rgb(119, 157, 233);
}

comm {
  color: rgb(83, 83, 83);

}

.answer {
  cursor: pointer;
  transition: all 0.2s;
}

.answer:hover {
  scale: 1.2;
}

.answer:active {
  scale: 1.05;
}

crs {
  background: none;
  border-left: 1px solid white;
  width: 0;
  margin: 0;
  padding: 0;
}
</style>
