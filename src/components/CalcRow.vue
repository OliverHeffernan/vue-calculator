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
  rowManager.updateSmoothCursorPosition();
});

function handleInput() {
  rowManager.getRow(props.index).setEquation(rowInput.value);
  rowInput.value = rowManager.getRow(props.index).getEquation();
}

function handleEnter() {
  rowManager.addRowAt(props.index);
}

function handleBackspace() {
  rowManager.removeRowAt(props.index);
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
        v-model="rowInput"
        v-on:input="handleInput"
        @keyup.enter="handleEnter"
        @keyup.backspace="handleBackspace"
        @keypress.backspace="handleBackspace"
        @keydown.backspace="handleBackspace"
      />
    </td>
  </tr>
  <tr class="calcRow">
    <td @click="focusOnRow" class="dispRow" :id="'dispRow' + props.index" v-html="rowManager.getRow(props.index).getDispEquation()"></td>
    <td :id="'equal' + props.index" v-html="getEquals(props.index)"></td>
    <td @click="copyAnswer" class="answer">{{ rowManager.getRow(props.index).getAnswer() }}</td>
  </tr>
</template>

<style>
.inputs {
  opacity: 0;
  width: 0;
  height: 0;
}

.calcRow {
  height: 20px;
  vertical-align: top;
}

.dispRow {
  min-width: 180px;
}

brack, unexpected {
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
comm space {
  width: 10px;
  color: transparent;
}

space {
  width: 10px;
  color: transparent;
}

.answer {
  cursor: pointer;
  transition: all 0.2s;
  height: 20px;
  overflow: scroll;
}

.answer:hover {
  scale: 1.2;
}

.answer:active {
  scale: 1.05;
}

crs {
  background: none;
  width: 0;
  margin: 0;
  padding: 0;
}

.lastSpace {
  margin-left: 12px;
}

sup {
  color: inherit;
}
</style>
