<script setup>
var open = true;
import { onMounted } from 'vue'
onMounted(() => {
    document.getElementById("precisionInput").value = 10;
    document.getElementById("angleInput").value = 'rad';
});

function openCloseSettings() {
    console.log('hello');
    open = !open;
    document.getElementById("settings").className = open ? "open" : "closed";
    document.getElementById("settingsButton").className = open? "openButton" : "closedButton";
}

function changeAngleUnit() {
    let units = ['rad', 'deg', 'grad'];
    let curUnit = document.getElementById('angleInput');
    let newIndex = units.indexOf(curUnit.innerText) + 1;
    newIndex = newIndex > 2 ? 0 : newIndex;
    curUnit.innerText = units[newIndex];
}
</script>
<template>
    <button id="settingsButton" @click="openCloseSettings"><i class="fa-solid fa-gear"></i></button>
    <div id="settings" class="closed">
        <table>
            <tr>
                <td>Precision: </td>
                <td><input id="precisionInput" type="number"></td>
            </tr>
            <tr>
                <td>Angle Mode: </td>
                <td><button id="angleInput" type="text" @click="changeAngleUnit">rad</button></td>
            </tr>
        </table>
    </div>
</template>
<style>
button {
    border: none;
}
#settings {
    position: fixed;
    padding: 10px;
    border-radius: 20px;
    border: solid 2px rgb(223, 104, 116);
    transition: all 0.4s;
}

#settings td, #settings tr, #settings table, #settings input {
    border: none;
}

#settings input:focus {
    border: none;
    outline: none;
}

.closed {
    right: -100vw;
    top: 20px;
    bottom: 20px;
}

.open {
    right: 20px;
    top: 20px;
    bottom: 20px;
}

#settingsButton {
    border: none;
    position: fixed;
    top: 30px;
    right: 30px;
    z-index: 5;
    transition: 0.4s all;
}

.openButton {
    rotate: 360deg;
}

.closedButton {
    rotate: 0deg;
}
</style>