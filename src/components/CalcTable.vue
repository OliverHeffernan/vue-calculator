<script>

import CalcRow from './CalcRow.vue';

export default {
    name: 'CalcTable',
    components: {
        CalcRow
    }
}

</script>

<template>

    <table id="calcTable" ref="calcTable">
        <CalcRow />
    </table>

</template>