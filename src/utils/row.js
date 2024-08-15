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
    var pos;
    var offset = 0;
    if (rowManager) {
        let row = document.getElementById("row" + rowManager.getFocusRowIndex());
        if (row){
            console.log("index" + index);
            console.log("focus index" + rowManager.getFocusRowIndex());
            if (index == rowManager.getFocusRowIndex()) {
                pos = row.selectionStart;
            }
        }
    }

    if (e.substring(0,2) == "//") {
        return `<comm>${e.substring(2, e.length)}</comm>`;
    }
    e = e.replaceAll(" ", "");
    let d = "";
    let prevD = "";
    let powerDepths = [];
    let depth = 0;
    let add = true;
    // let lastBrackPowDepth = 0;
    let brackPowDepths = [];
    for (let i = 0; i < e.length; i++) {
        add = true;
        if (e[i] == "^") {
            powerDepths.push(depth);
            add = false;
            d += "<sup>";
            offset += 6;
        }
        
        if ("({[".includes(e[i])) {
            depth++
            if (powerDepths.length >= brackPowDepths[brackPowDepths.length - 1] && e[i - 1] != "^") {
                while (powerDepths.length > 0) {
                    powerDepths.pop();
                    d += "</sup>";
                    add = false;
                    offset += 7;
                }
                d += e[i];
            }
            // lastBrackPowDepth = powerDepths.length;
            brackPowDepths.push(powerDepths.length);
        } else if (")}]".includes(e[i])) {
            depth--
            if (powerDepths.length >= brackPowDepths[brackPowDepths.length - 1]) {
                add = false;
                while (powerDepths.length > brackPowDepths[brackPowDepths.length - 1]) {
                    powerDepths.pop();
                    d += "</sup>";
                    offset += 7;
                }
                d += e[i];
            }
            brackPowDepths.pop();
        }

        if (depth == powerDepths[powerDepths.length - 1] && "+-/*".includes(e[i])) {
            while (powerDepths.length > brackPowDepths[brackPowDepths.length - 1]) {
                powerDepths.pop();
                d += "</sup>";
                offset += 7;
            }
        }
        if (add) {
            d += e[i];
        }
        if (d == "undefined") {
            d = prevD;
        }
        prevD = d;
    }

    d = d.substring(0, pos + offset) + "<crs></crs>" + d.substring(pos + offset, d.length);

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
        d = d.replaceAll(operands[i][0], operands[i][1]);
    }

    if (d == "undefined") {
        return "";
    }

    d = colouredBrackets(d);

    return d
}