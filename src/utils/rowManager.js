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
    removeRowAt(index) {
        if (this.rows.value.length != 1) {
            this.focusRowIndex.value = index != 0 ? index - 1 : 0;
            let temp = this.rows.value;
            this.rows.value = null;
            setTimeout(() => {
                this.rows.value = temp;
                this.rows.value.splice(index, 1);

                for (let i = 0; i < this.rows.value.length; i++) {
                    this.rows.value[i].setIndex(i);
                }
            });
        }
    }
    calculateAllRows() {
        setTimeout(() => {
            this.rows.value.forEach(row => row.calculate());

            for (let i = 0; i < this.rows.value.length; i++) {
                this.rows.value[i].calculate();
            }
        }, 0);
    }
    getFocusRowIndex() { return this.focusRowIndex.value; }
    setFocusRowIndex(index) { this.focusRowIndex.value = index; }
    adjustFocusRowIndex(direction) {
        let oldIndex = this.focusRowIndex.value;
        let newIndex = oldIndex + direction;

        if (newIndex < (this.rows.value.length) && newIndex >= 0) {
            this.focusRowIndex.value = newIndex;
            let cursorPos = document.getElementById(`row${oldIndex}`).selectionStart;
            let newHtmlRow = document.getElementById(`row${this.focusRowIndex.value}`);
            newHtmlRow.focus();

            requestAnimationFrame(() => {
                newHtmlRow.setSelectionRange(cursorPos, cursorPos);
                this.calculateAllRows();
            });
        }
    }
    updateSmoothCursorPosition() {
        // cursor is a floating div, with position set to fixed. It's position is dependent on the screen position of inlineCursor
        let cursor = document.getElementById("cursor");

        // inline Cursor is a div that is injected into the display equations in the getDisplayEquation function based on where the user's type cursor is.
        let start = document.getElementsByTagName("crs")[0];

        if (cursor == null || start == null) {
            requestAnimationFrame(update);
            return
        }

        if (document.activeElement.className !== 'inputs') {
            cursor.style.opacity = 0;
            requestAnimationFrame(update);
            return
        }

        let end = document.getElementsByTagName("crs")[1];
        
        if (end != null) {
            cursor.className = "selection";
            let startPos = start.getBoundingClientRect();
            let endPos = end.getBoundingClientRect();

            let width = Math.abs(startPos.left - endPos.left);
            cursor.style.width = width + "px";
        }
        else {
            cursor.className = "cursor";
            cursor.style.width = "2px";
        }

        // gets the screen location of the inline cursor
        let rect = start.getBoundingClientRect();

        // update position of the cursor
        cursor.style.top = rect.top + "px";
        cursor.style.left = rect.left + "px";

        // make sure that it is visible
        cursor.style.opacity = 1;

        // continue the loop
        requestAnimationFrame(update);
    }
}

const rowManager = Object.freeze(new RowManager());

rowManager.updateSmoothCursorPosition();

function handleEvent(event) {
    if (event.key !== "Enter" && event.keyCode != "38" && event.keyCode != "40") {
        rowManager.calculateAllRows();
    }
}

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == "38") {
        rowManager.adjustFocusRowIndex(-1);
    }
    else if (e.keyCode == "40") {
        rowManager.adjustFocusRowIndex(1);
    }
}

function update() {
    rowManager.updateSmoothCursorPosition();
}


document.addEventListener('keyup', handleEvent);
document.addEventListener('keydown', handleEvent);
document.addEventListener('click', handleEvent);

export default rowManager;