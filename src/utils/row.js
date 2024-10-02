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
        this.answer = newCalculateAnswer(replaceAns(this.equation, prevAnswer), this.index);

        this.equation += " ";
        console.log(`'${this.equation}'`);
        this.equation = this.equation.substring(0, this.equation.length - 1);
        this.dispEquation = displayEquation(this.equation, this.index);
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
    let commented = false;
    
    if (e.substring(0, 2) == "//") {
        commented = true;
    }
    if (rowManager) {
        let row = document.getElementById("row" + rowManager.getFocusRowIndex());
        if (row) {
            if (index == rowManager.getFocusRowIndex()) {
                var start = row.selectionStart;
                var end = row.selectionEnd;
                if (start == end)
                    e = e.substring(0, start) + "<crs></crs>" + e.substring(start, e.length);
                else {
                    let first = Math.min(...[start, end]);
                    let second = Math.max(...[start, end]);
                    e = e.substring(0, first) + "<crs></crs>" + e.substring(first, second) + "<crs></crs>" + e.substring(second, e.length);
                }
            }
        }
    }
    e = convertToSuperscript(e);

    e = e.replaceAll(" ", "<space>_</space>");
    if (commented) {
        return `<comm>${e}</comm>`;
    }

    let operands = [
        ["+", "<op> + </op>"],
        ["-", "<op> - </op>"],
        ["*", "<op> × </op>"],
        ["=", "<op> = </op>"],
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

    e = colouredBrackets(e);

    return e;
}

function convertToSuperscript(e) {
    e = e.replaceAll("^", "<sup>");
    e = e.replaceAll(";", "</sup> ");
    return e;
}
