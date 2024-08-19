import { replaceSpecialCharacters, newCalculateAnswer, replaceAns } from './calculation';
import rowManager from './rowManager';

export class Row {
    constructor(e, i) {
        this.equation = e !== null ? e : '';
        this.dispEquation = displayEquation(this.equation);
        this.answer = 0;
        this.index = i;
    }

    calculate() {
        let prevRow;
        if (rowManager) 
            prevRow = rowManager.getRow(this.index - 1);
    
        const prevAnswer = prevRow ? prevRow.getAnswer() : 0;
        this.equation = replaceSpecialCharacters(this.equation);
        //this.answer = calculateAnswer(splitBrackets(replaceAns(this.equation, prevAnswer)));
        this.answer = newCalculateAnswer(replaceAns(this.equation, prevAnswer));

        this.equation += " ";
        this.equation = this.equation.substring(0, this.equation.length - 1);
        this.dispEquation = displayEquation(this.equation, this.index);

        // document.getElementById(`dispRow${this.index}`).innerHTML = displayEquation(this.equation);
    }

    setEquation(e) {
        this.equation = e;
        rowManager.calculateAllRows();
    }

    setIndex(i) { this.index = i; }

    getEquation() { return this.equation; }
    getDispEquation() { return displayEquation(this.equation, this.index); }
    getAnswer() { return this.answer; }
    getIndex() { return this.index; }
}

function colouredBrackets(e) {
    let depth = 0;
    let nc = "";
    for (let i = 0; i < e.length; i++) {
        // if (e[i] == "(") {
        if ("({[".includes(e[i])) {
            nc += `<brack class="depth${depth++}">${e[i]}</brack>`;
        //} else if (e[i] == ")") {
        } else if (")}]".includes(e[i])) {
            nc += `<brack class="depth${--depth}">${e[i]}</brack>`;
        } else {
            nc += e[i];
        }
    }
    return nc;
}

function displayEquation(e, index) {
    if (e.substring(0,2) == "//") {
        return `<comm>${e.substring(2, e.length)}</comm>`;
    }
    e = e.replaceAll(" ", "");
    let offset = 0;
    if (rowManager) {
        let row = document.getElementById("row" + rowManager.getFocusRowIndex());
        if (row){
            if (index == rowManager.getFocusRowIndex()) {
                var pos = row.selectionStart;
                e = e.substring(0, pos + offset) + "<crs/>" + e.substring(pos + offset, e.length);
            }
        }
    }
    e = convertToSuperscript(e);

    let operands = [
        ["+", "<op> + </op>"],
        ["-", "<op> - </op>"],
        ["*", "<op> × </op>"],
        ["sin(", "<func>sin</func>("],
        ["cos(", "<func>cos</func>("],
        ["tan(", "<func>tan</func>("],
        ["log(", "<func>log</func>("],
        ["ln(", "<func>ln</func>("],
        ["cosec(", "<func>cosec</func>("],
        ["sec(", "<func>sec</func>("],
        ["csc(", "<func>csc</func>("],
        ["cot(", "<func>cot</func>("],
        ["pow(", "<func>pow</func>("]
    ];

    for (let i = 0; i < operands.length; i++) {
        e = e.replaceAll(operands[i][0], operands[i][1]);
    }

    if (e == "undefined") {
        return "";
    }

    e= colouredBrackets(e);

    return e
}

function convertToSuperscript(e) {
    e = e.replaceAll("^", "<sup>");
    e = e.replaceAll(";", "</sup> ");
    return e;
}
