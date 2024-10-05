import { replaceSpecialCharacters, newCalculateAnswer, replaceAns } from './calculation';
import rowManager from './rowManager';

export class Row {
    // Row class is a class that is found in the rowManager's rows array. It contains a Row class for each calculation row.
    constructor(e, i) {
        this.equation = e !== null ? e : '';
        this.dispEquation = displayEquation(this.equation);
        this.answer = 0;
        this.index = i;
    }

    calculate() {
        let prevRow;
        // if the row manager exists, then set prevRow to the previous row
        if (rowManager) 
            prevRow = rowManager.getRow(this.index - 1);
    
        // if prevRow is not null, then prevAnswer is set to prevRow.getAnswer(), otherwise it defaults to 0
        const prevAnswer = prevRow ? prevRow.getAnswer() : 0;

        // replaces pi with the pi symbol
        this.equation = replaceSpecialCharacters(this.equation);

        // sets the answer to the function, replacing ans with previous answer first.
        this.answer = newCalculateAnswer(replaceAns(this.equation, prevAnswer), this.index);

        // this.equation += " ";
        // this.equation = this.equation.substring(0, this.equation.length - 1);

        // displays the equation
        this.dispEquation = displayEquation(this.equation, this.index);
    }

    setEquation(e) {
        // sets the equation to e, and calculates all rows, so that variables and ans update
        this.equation = e;
        rowManager.calculateAllRows();
    }

    // sets the index of the row to the parameter
    setIndex(i) { this.index = i; }

    // returns the equation
    getEquation() { return this.equation; }
    // returns the display equation
    getDispEquation() { return displayEquation(this.equation, this.index); }
    // returns the answer to the equation
    getAnswer() { return this.answer; }
    // returns the index of the row
    getIndex() { return this.index; }
}

// returns the equation with bracket pair highlighting
function colouredBrackets(e) {
    let depth = 0;
    let nc = "";
    let opBrackTypes = [];
    let brackTypes = {
        "{" : "}",
        "(" : ")",
        "[" : "]"
    };
    // iterates through each character in e, implementing coloured brackets
    for (let i = 0; i < e.length; i++) {
        // if the character is any type of opening bracket, surround it with a brack tag, with a class indication it's depth, while increasing the depth by 1
        if ("({[".includes(e[i])) {
            opBrackTypes.push(e[i]);
            nc += `<brack class="depth${depth++}">${e[i]}</brack>`;
        // if the character is any type of closing bracket, surround it with a brack tag, with a class indication it's depth, while decreasing the depth by 1
        } else if (")}]".includes(e[i])) {
            depth--;
            let dDepth = e[i] == brackTypes[opBrackTypes.pop()] ? depth : -1;
            nc += `<brack class="depth${dDepth}">${e[i]}</brack>`;
        // if the character is not a bracket, just add the character to the string
        } else {
            nc += e[i];
        }
    }
    return nc;
}

function displayEquation(e, index) {
    if (e == "") {
        return `<crs></crs><comm>type equation here</comm>`;
    }
    let commented = false;
    
    // check if the equation is a comment
    if (e.substring(0, 2) == "//") {
        commented = true;
    }
    // check that rowManager is not null
    if (rowManager) {
        // get the input field of the row
        let row = document.getElementById("row" + rowManager.getFocusRowIndex());
        // check that row is not null, and that the row is focussed on
        if (row && index === rowManager.getFocusRowIndex()) {
            // get the start and end of the cursor selection in the input field
            var start = row.selectionStart;
            var end = row.selectionEnd;

            // add crs tags to display the cursor
            e = insertCursor(e, start, end);
        }
    }

    // converts ^ and ; to sup tag opening and closings, also accounts for unexpected;
    e = convertToSuperscript(e);

    // ensures that spaces are displayed correctly
    e = e.replaceAll(" ", "<space>_</space>");
    // now that all the necessary formatting has been done, if the row is commented, it is displayed as a comment
    if (commented) {
        return `<comm>${e}</comm>`;
    }

    // an array of strings, and what they will be replaced with when displayed.
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
        ["pow(", "<func>pow</func>("],
        ["abs(", "<func>abs</func>("]
    ];

    // doing replacements based on operands array
    for (let i = 0; i < operands.length; i++) {
        e = e.replaceAll(operands[i][0], operands[i][1]);
    }

    // if there were any uncaught errors that lead to the e being undefined, it is displayed as blank
    if (e == "undefined") {
        return "";
    }

    // implements bracket pair highlighting
    e = colouredBrackets(e);

    return e;
}

function convertToSuperscript(e) {
    // number of opening "^"`
    let op = 0;
    // number of closings ";"
    let cl = 0;
    // the string that will be returned
    let q = "";
    // iterate through each character in e
    for (let i = 0; i < e.length; i++) {
        if (e[i] == "^") {
            // if the character is ^, then add an opening, and add sup tag opening to the string
            op++;
            q += "<sup>";
        } else if (e[i] == ";") {
            // otherwise add a closing
            cl++;
            if (cl > op) {
                // if there are more closings than openings, add a semicolon, marked as unexpected
                q += "<unexpected>;</unexpected>";
                // reset the number of closings and openings, so that the rest of the equation is displayed as if the unexpected semicolon was ignored
                cl = 0;
                op = 0;
            } else {
                // if the semicolon was espected, then add a sup tag closing to the string
                q += "</sup>";
            }
        } else {
            // if the character is neither ^ or ;, then just add the character to the string
            q += e[i];
        }
    }

    return q;
}

function insertCursor(e, start, end) {
    if (start == end)
        // if the cursor is not a selection, and just a cursor then add the crs tag to where the cursor is.
        e = e.substring(0, start) + "<crs></crs>" + e.substring(start, e.length);
    else {
        // if it is a selection, then add crs tags at the start and end of the selection
        e = e.substring(0, start) + "<crs></crs>" + e.substring(start, end) + "<crs></crs>" + e.substring(end, e.length);
    }
    return e
}