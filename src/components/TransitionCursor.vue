<template>
    <div id="cursor"></div>
</template>

<style>

#cursor {
    height: 23px;
    width: 2px;
    position: fixed;
    transition: all 0.1s;
}

.cursor {
    border-radius: 1px;
    background-color: white;
}

.selection {
    border-radius: 5px;
    background-color: rgba(0, 145, 255, 0.409);
}

</style>