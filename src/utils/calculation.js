// library to be used for calculations
import { create, all } from 'mathjs'


// the precision of the calculations, this is then rounded using the number that is inputted by the user in settings.
var prec = 256;

// the unit of angles, can be changed to deg or grad in settings
var angleUnit = 'rad';

// configure the default type of numbers as BigNumbers
const config = {
  // Default type of number
  // Available options: 'number' (default), 'BigNumber', or 'Fraction'
  number: 'BigNumber',

  // Number of significant digits for BigNumbers
  precision: prec,
  angles: angleUnit
}

// set up the library
const math = create(all, config);


// used externally to replace pi with the symbol pi when the equation is displayed
export function replaceSpecialCharacters(e) {
  return e.replaceAll("pi", "π");
}

// used externally to replace when the user types "ans", with the previous answer.
export function replaceAns(e, prev) {
  if (prev == null) prev = "1";
  return e.replaceAll("ans", `(${prev})`); 
}

// makes sure that brackets are dealt with properly, for example, two brackets next to each other should be multiplied by each other.
// or other example, a number then a bracket should multiply together. 
function surroundFunction(e) {
  let q = "";
  for (var i = 0; i < e.length; i++) {
    q += e[i];
    
    if (/^\d+$/.test(e[i]) && e[i + 1] == "(") {
      q += "*";
    }

    if (e[i] == ")" && /^\d+$/.test(e[i + 1])) {
      q += "*";
    }
  }
  q = q.replaceAll(")(", ")*(");
  q = q.replaceAll("log10*", "log10");
  return q;
}

// used externally to return the answer to an equation in string form
export function newCalculateAnswer(e, index) {
  if (index == 0) {
    variables = new Map();
  }

  // if a line is commented out using "//", then an answer should not be returned. This can be used by the user to annotate their calculations as they wish
  if (e.substring(0, 2) == "//") {
    return ""
  }
  if (e.includes("=") && /\d/.test(e.split("=")[0])) {
    return "Variable names can't contain numbers"
  }

  if (e.includes("=")) {
    setVariable(e);
    return newCalculateAnswer(e.split("=")[1]);
  }

  e = replaceVariables(e, variables);

  // remove all white space
  e = e.replaceAll(/\s/g, "");

  if (initialErrorChecks(e)[0]) {
    return initialErrorChecks(e)[1];
  }

  // replace superscript opening and closing with opening and closing brackets, so that they are handled correctly
  e = e.replaceAll(";", ")");
  e = e.replaceAll("^", "^(");

  // replace all brackets with regular brackets for calculation
  e = e.replaceAll("{", "(");
  e = e.replaceAll("}", ")");
  e = e.replaceAll("[", "(");
  e = e.replaceAll("]", ")");
  // if the equation is blank, return 0
  if (e == "") {
    return "0"
  }

  // functions replaced with proper syntax to be used in math.js library
  let re = e;

  // array of what will be displayed in the equations, and what they need to be replaced with before parsing the equation.
  let replacements = [
    ["π", "(pi)"],
    ["cosec(", "csc("],
    ["log(", "log10("],
    ["ln(", "log("]
  ];
  re = replaceExpressions(re, replacements, false);

  let definedFunctions = [
    "sin(",
    "cos(",
    "cot(",
    "tan(",
    "csc(",
    "sec(",
    "i",
    "abs("
  ];

  replacements.forEach((replacement) => {
    definedFunctions.push(replacement[0]);
  });


  // all defined functions will be replaced out for blank, after that, if there is any undefined text remaining, an error will be returned.
  let ne = replaceExpressions(e, definedFunctions, true);

  // checking if for any undefined characters, return an error if there are.
  let regex = /[a-zA-Z]/g;
  if (regex.test(ne)) {
    return "Syntax error, undefined letters"
  }

  // evaluating brackets so that no errors are encountered. For example, previously if you had a power within a trig function, an error would occur
  // this function avoids this error.
  console.log(re);
  while (re.includes("(")) {
    re = evaluateBrack(re);
  }

  // the previous function replaces brackets with square brackets so that it knows what brackets it has already evaluated, just replacing them back to normal brackets.
  re = re.replaceAll("[", "(");
  re = re.replaceAll("]", ")");


  // makes sure that brackets are handled correctly, notably making sure that they multiply with eacher other.
  re = surroundFunction(re);

  // grab the unit for angles from settings
  angleUnit = document.getElementById("angleInput").innerText;

  let trigFunctionsReplacements = [
    [/sin\((.*?)\)/g, `sin($1 ${angleUnit})`],
    [/cos\((.*?)\)/g, `cos($1 ${angleUnit})`],
    [/tan\((.*?)\)/g, `tan($1 ${angleUnit}`],
    [/cot\((.*?)\)/g, `cot($1 ${angleUnit})`],
    [/sec\((.*?)\)/g, `sec($1 ${angleUnit})`],
    [/csc\((.*?)\)/g, `csc($1 ${angleUnit})`]
  ];

  for (let i = 0; i < trigFunctionsReplacements.length; i++) {
    re = re.replace(trigFunctionsReplacements[i][0], trigFunctionsReplacements[i][1]);
  }

  try {
    // evaluates the answer, then rounds to the accuracy that the user entered into settings
    let answer = math.evaluate(re).toFixed(Number(document.getElementById("precisionInput").value));

    // makes sure that the answer ends at the last significant figure, rather than displaying a bunch of zeros, for example 5.0000000 would be displayed as 5
    let lastSigFig = 0;
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] != "0") {
        lastSigFig = i;
      }
    }

    // makes sure that there are no unnescessary decimal places, for example 5. would be displayed as 5
    answer = answer.substring(0, 1+lastSigFig);
    if (answer[answer.length - 1] == ".") {
      answer = answer.substring(0, answer.length - 1);
    }

    // then returns the answer to be dispayed if there were no errors
    return answer;
  } catch (error) {
    // if there was an error which was not caught in the try method, just return 
    // if it could be due to a negative log, then returns a preset error message
    if (error.message == "math.evaluate(...).toFixed is not a function") {
      return "Math error, could be a negative log.";
    } else {
      // otherwise, the math.js error message is returned
      return error.message;
    }
  }
}

// checks for any errors in calculation. Returns array [error?, message]
function initialErrorChecks(e) {
  // iterates through e, checking for unexpected semicolons
  if (checkNegativeDepth(e, "^", ";")) {
    return [true, "Unexpected power closing (;)."];
  }

  // double checks for any power errors that the previous check may have missed
  let supOp = e.replace(/[^^]/g, "").length;
  let supCl = e.replace(/[^;]/g, "").length;

  if (supOp > supCl) {
    return [true, "Syntax error, close powers using ;"]
  }
  
  if (supOp < supCl) {
    return [true, "Syntax error, more power closings than openings"]
  }

  // check if precison is set to a positive number, more than one
  if (document.getElementById("precisionInput").value < 1) {
    return "set precision to a number greater than 1"
  }

  // make sure that only integers are entered into precision
  document.getElementById("precisionInput").value = document.getElementById("precisionInput").value.toString().replaceAll(".", "");

  // pow not supported, show the user how to use powers properly
  if (e.includes("pow")) {
    return [true, "Use ^ for powers. e.g. 5^2;=25. Close a power using ';'"]
  }

  // makes sure that the equation does not end unexpectedly
  if ("+-*/^(".includes(e[e.length - 1])) {
    return [true, "Syntax error, can't end with an operator, or opening bracket"]
  }

  // makes sure that the equation does not begin unexpectedly
  if ("+*/^)".includes(e[0])) {
    return [true, "Syntax error, can't begin with an operator, or closing bracket"]
  }

  // checks for any unexpected closing brackets
  if (checkNegativeDepth(e, "(", ")")) {
    return [true, "Unexpected closing bracket (')')."];
  }
  if (checkNegativeDepth(e, "{", "}")) {
    return [true, "Unexpected closing curly bracket ('}')."];
  }
  if (checkNegativeDepth(e, "[", "]")) {
    return [true, "Unexpected closing square bracket (']')."];
  }

  // makes sure that the number of closing brackets is the same as the number of opening brackets
  let numOfOpenings = e.replace(/[^(]/g, "").length;
  let numOfClosings = e.replace(/[^)]/g, "").length;
  if (numOfOpenings != numOfClosings) {
    return [true, "Syntax error, must have equal number of opening and closing brackets"]
  }

  // makes sure that the equation does not have empty brackets
  if (e.includes("()")) {
    return [true, "Syntax error, can't have empty brackets."]
  }

  // unexpected character
  if (e.includes("#")) {
    return [true, "Syntax error, remove #"]
  }

  // if the equation is blank, return 0
  if (e == "") {
    return [true, "0"]
  }
  return [false]
}

function checkNegativeDepth(e, op, cl) {
  let depth = 0;
  for (let i = 0; i < e.length; i++) {
    if (e[i] == op) {
      depth++;
    } else if (e[i] == cl) {
      depth--;
      if (depth < 0) {
        return true;
      }
    }
  }
  return false;
}

function replaceExpressions(e, replacements, replaceWithBlank) {
  for (let i = 0; i < replacements.length; i++) {
    e = replaceWithBlank ? e.replaceAll(replacements[i], "") : e.replaceAll(replacements[i][0], replacements[i][1]);
  }
  return e;
}

// used to evaluate complex brackets before putting the equation into math.js. Avoids erros that occur when you have pwoers iwthin a trig function
function evaluateBrack(e) {
  // depth of nested brackets
  let depth = 0;
  // the index of the first opening bracket
  let startOfBrackets;
  // iterating through to find the index of the corresponding closing bracket
  for (let i = 0; i < e.length; i++) {
    if (e[i] == "(") {
      depth ++;
      if (depth == 1) {
        startOfBrackets = i;
      }
    } else if (e[i] == ")") {
      depth --;
      // when the corresponding closing bracket is found, return the equation with that brakcet evaluated, replacing the brackets with square brackets. This function will repeat until all brackets are replaced with square brackets. The square brackets tell the computer that it has already evaluated that bracket.
      if (depth == 0) {
        return e.substring(0, startOfBrackets) + "[" + math.evaluate(e.substring(startOfBrackets + 1, i)) + "]" + e.substring(i + 1, e.length);
      }
    }
  }
}

let variables = new Map();

function setVariable(equation) {
  let calculation = equation.split("=")[1];
  if (calculation != "") {
    variables.set(equation.split("=")[0], newCalculateAnswer(equation.split("=")[1]));
  }
}

function replaceVariables(equation, variables) {
  let sortedVariables = new Map(
    Array.from(variables).sort((a, b) => b[0].length - a[0].length)
  );

  for (let [key,value] of sortedVariables) {
    equation = equation.replaceAll(key, `(${value})`);
  }
  return equation;
}