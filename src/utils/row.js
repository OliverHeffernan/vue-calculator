import { replaceSpecialCharacters, replaceAns, calculateAnswer, splitBrackets } from './calculation';
import rowManager from './rowManager';

export class Row {
    constructor(e, i) {
        this.equation = e !== null ? e : '';
        this.answer = 0;
        this.index = i;
    }

    calculate() {
        let prevRow;
        if (rowManager) 
            prevRow = rowManager.getRow(this.index - 1);
    
        const prevAnswer = prevRow ? prevRow.getAnswer() : 0;
        this.equation = replaceSpecialCharacters(this.equation);
        this.answer = calculateAnswer(splitBrackets(replaceAns(this.equation, prevAnswer)));
    }

    setEquation(e) {
        this.equation = e;
        rowManager.calculateAllRows();
    }

    setIndex(i) { this.index = i; }

    getEquation() { return this.equation; }
    getAnswer() { return this.answer; }
    getIndex() { return this.index; }
}