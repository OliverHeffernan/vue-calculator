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

        // document.getElementById(`dispRow${this.index}`).innerHTML = displayEquation(this.equation);
    }

    setEquation(e) {
        this.equation = e;
        rowManager.calculateAllRows();
    }

    setIndex(i) { this.index = i; }

    getEquation() { return this.equation; }
    getDispEquation() { return displayEquation(this.equation); }
    getAnswer() { return this.answer; }
    getIndex() { return this.index; }
}

function colouredBrackets(e) {
    let depth = 0;
    let nc = "";
    for (let i = 0; i < e.length; i++) {
        if (e[i] == "(") {
            nc += `<brack class="depth${depth++}">(</brack>`;
        } else if (e[i] == ")") {
            nc += `<brack class="depth${--depth}">)</brack>`;
        } else {
            nc += e[i];
        }
    }
    return nc;
}

function displayEquation(e) {
    e = e.replaceAll(" ", "");
    let d = "";
    let prevD = "";
    let power = false;
    let depth = 0;
    let add = true;
    for (let i = 0; i < e.length; i++) {
        add = true;
        if (!power) {
            if (e.substring(i, i + 4) == "pow(") {
                i += 4;
                power = true;
            }
        }
        else {
            if (e[i] == "(") {
                depth++
            }
            if (e[i] == ")") {
                depth--
                if (depth == -1) {
                    d += "</sup>";
                    add = false;
                    power = false;
                    depth = 0;
                }
            }
            if (e[i] == ",") {
                d += "<sup>";
                add = false;
            }
            console.log(`${depth}, ${d}`);
        }
        if (add) {
            d += e[i];
        }
        if (d == "undefined") {
            d = prevD;
        }
        prevD = d;
    }

    if (d.includes("pow(")) {
        d = displayEquation(d);
    }

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
        ["csc(", "<func>csc</func>("]
    ];

    for (let i = 0; i < operands.length; i++) {
        d = d.replaceAll(operands[i][0], operands[i][1]);
    }

    if (d == "undefined") {
        return "";
    }

    d = colouredBrackets(d);

    return d
}