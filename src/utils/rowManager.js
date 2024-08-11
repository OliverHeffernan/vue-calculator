import { ref } from 'vue';
import { Row } from '../utils/row';

let instance;

class RowManager {
    constructor() {
        if (instance) { throw new Error("RowManager is already initialized"); }
        this.rows = ref([new Row("", 0)]);
        this.focusRowIndex = ref(0);
        instance = this;
    }

    getRows() { return this.rows.value; }
    getRow(index) { return this.rows.value[index]; }
    setRow(index, value) { this.rows.value[index] = value; }
    addRowAt(index) {
        this.focusRowIndex.value = index + 1;
        let temp = this.rows.value;
        this.rows.value = null;
        setTimeout(() => {
            this.rows.value = temp;
            this.rows.value.splice(index + 1, 0, new Row("", index+1));

            for (let i = 0; i < this.rows.value.length; i++) {
                this.rows.value[i].setIndex(i);
            }
        }, 1);
    }
    calculateAllRows() {
        this.rows.value.forEach(row => row.calculate());
    }
    getFocusRowIndex() { return this.focusRowIndex.value; }
    setFocusRowIndex(index) { this.focusRowIndex.value = index; }
}

const rowManager = Object.freeze(new RowManager());

function handleEvent(event) {
    console.log("event");
    if (event.key !== "Enter") {
        rowManager.calculateAllRows();
    }
}

document.addEventListener('keyup', handleEvent);
document.addEventListener('click', handleEvent);

export default rowManager;