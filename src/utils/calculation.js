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
const math = create(all, config)

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
export function newCalculateAnswer(e) {
  // if a line is commented out using "//", then an answer should not be returned. This can be used by the user to annotate their calculations as they wish
  if (e.substring(0, 2) == "//") {
    return ""
  }
  if (e.includes("=")) {
    setVariable(e);
    return newCalculateAnswer(e.split("=")[1]);
  }

  e = replaceVariables(e, variables);

  if (document.getElementById("precisionInput").value < 1) {
    return "set precision to a number greater than 1"
  }

  // make sure that only intergers are entered into precision
  document.getElementById("precisionInput").value = document.getElementById("precisionInput").value.toString().replaceAll(".", "");


  // remove all white space
  e = e.replaceAll(/\s/g, "");

  // checks that all superscripts are closed, otherwise an error is returned
  let supOp = e.replace(/[^^]/g, "").length;
  let supCl = e.replace(/[^;]/g, "").length;
  if (supOp > supCl) {
    return "Syntax error, close powers using ;"
  }
  if (supOp < supCl) {
    return "Syntax error, more power closings than openings"
  }

  // replace superscript opening and closing with opening and closing brackets, so that they are handled correctly
  e = e.replaceAll(";", ")");
  e = e.replaceAll("^", "^(");

  // replace all brackets with regular brackets for calculation
  e = e.replaceAll("{", "(");
  e = e.replaceAll("}", ")");
  e = e.replaceAll("[", "(");
  e = e.replaceAll("]", ")");


  // makes sure that the equation does not end unexpectedly
  if ("+-*/^(".includes(e[e.length - 1])) {
    return "Syntax error, can't end with an operator, or opening bracket"
  }

  // makes sure that the equation does not begin unexpectedly
  if ("+*/^)".includes(e[0])) {
    return "Syntax error, can't begin with an operator, or closing bracket"
  }

  // makes sure that the number of closing brackets is the same as the number of opening brackets
  let numOfOpenings = e.replace(/[^(]/g, "").length;
  let numOfClosings = e.replace(/[^)]/g, "").length;
  if (numOfOpenings != numOfClosings) {
    return "Syntax error, must have equal number of opening and closing brackets"
  }

  // makes sure that the equation does not have empty brackets
  if (e.includes("()")) {
    return "Syntax error, can't have empty brackets."
  }

  // unexpected character
  if (e.includes("#")) {
    return "Syntax error, remove #"
  }

  // pow not supported, show the user how to powers properly
  if (e.includes("pow")) {
    return "Use ^ for powers. e.g. 5^2=25. Close a power using ';'"
  }

  // if the equation is blank, return 0
  if (e == "") {
    return "0"
  }

  // all defined functions will be replaced out for blank, after that, if there is any undefined text remaining, an error will be returned.
  let ne = e;

  // functions replaced with proper syntax to be used in math.js library
  let re = e;

  // re = re.replaceAll("π", "(pi)")
  // ne = ne.replaceAll("π", "");
  // ne = ne.replaceAll("sin(", "");
  // ne = ne.replaceAll("cos(", "");
  // ne = ne.replaceAll("cot(", "");
  // ne = ne.replaceAll("tan(", "");
  // re = re.replaceAll("cosec(", "csc(");
  // ne = ne.replaceAll("cosec(", "");
  // ne = ne.replaceAll("csc(", "");
  // ne = ne.replaceAll("cosec(", "");
  // ne = ne.replaceAll("sec(", "");

  // re = re.replaceAll("log(", "log10(");
  // ne = ne.replaceAll("log(", "");
  // re = re.replaceAll("ln(", "log(");
  // ne = ne.replaceAll("ln(", "");

  // re = re.replaceAll("e", "(e)");
  // ne = ne.replaceAll("e", "");

  let replacements = [
    ["π", "(pi)"],
    ["cosec(", "csc("],
    ["log(", "log10("],
    ["ln(", "log("],
    ["e", "(e)"]
  ];
  re = replaceExpressions(re, replacements, false);
  console.log(re);

  let definedFunctions = [
    "sin(",
    "cos(",
    "cot(",
    "tan(",
    "csc(",
    "sec(",
    "i"
  ];

  replacements.forEach((replacement) => {
    definedFunctions.push(replacement[0]);
  });

  ne = replaceExpressions(ne, definedFunctions, true);

  // imaginary numbers
  // ne = ne.replaceAll("i", "");

  // evaluating brackets so that no errors are encountered. For example, previously if you had a power within a trig function, an error would occur
  // this function avoids this error.
  while (re.includes("(")) {
    re = evaluateBrack(re);
  }

  // the previous function replaces brackets with square brackets so that it knows what brackets it has already evaluated, just replacing them back to normal brackets.
  re = re.replaceAll("[", "(");
  re = re.replaceAll("]", ")");

  // checking if for any undefined characters, return an error if there are.
  let regex = /[a-zA-Z]/g;
  if (regex.test(ne)) {
    return "Syntax error, undefined letters"
  }

  // makes sure that brackets are handled correctly, notably making sure that they multiply with eacher other.
  re = surroundFunction(re);

  // grab the unit for angles from settings
  angleUnit = document.getElementById("angleInput").innerText;

  // replaces trig functions with the correct unit
  if (angleUnit === "deg") {
    re = re.replace(/sin\((.*?)\)/g, "sin($1 deg)");
    re = re.replace(/cos\((.*?)\)/g, "cos($1 deg)");
    re = re.replace(/tan\((.*?)\)/g, "tan($1 deg)");
    re = re.replace(/cot\((.*?)\)/g, "cot($1 deg)");
    re = re.replace(/sec\((.*?)\)/g, "sec($1 deg)");
    re = re.replace(/csc\((.*?)\)/g, "csc($1 deg)");
    // Repeat for other trigonometric functions as needed
  } else if (angleUnit === "rad") {
    re = re.replace(/sin\((.*?)\)/g, "sin($1 rad)");
    re = re.replace(/cos\((.*?)\)/g, "cos($1 rad)");
    re = re.replace(/tan\((.*?)\)/g, "tan($1 rad)");
    re = re.replace(/cot\((.*?)\)/g, "cot($1 rad)");
    re = re.replace(/sec\((.*?)\)/g, "sec($1 rad)");
    re = re.replace(/csc\((.*?)\)/g, "csc($1 rad)");
  } else if (angleUnit === "grad") {
    re = re.replace(/sin\((.*?)\)/g, "sin($1 grad)");
    re = re.replace(/cos\((.*?)\)/g, "cos($1 grad)");
    re = re.replace(/tan\((.*?)\)/g, "tan($1 grad)");
    re = re.replace(/cot\((.*?)\)/g, "cot($1 grad)");
    re = re.replace(/sec\((.*?)\)/g, "sec($1 grad)");
    re = re.replace(/csc\((.*?)\)/g, "csc($1 grad)");
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