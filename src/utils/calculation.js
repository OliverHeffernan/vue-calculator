import { create, all } from 'mathjs'
var prec = 256;
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
const math = create(all, config)

export function replaceSpecialCharacters(e) {
  return e.replaceAll("pi", "π");
}

export function replaceAns(e, prev) {
  if (prev == null) prev = "1";
  return e.replaceAll("ans", `(${prev})`); 
}

function surroundFunction(e) {
  let q = "";
  for (var i = 0; i < e.length; i++) {
    q += e[i];
    
    if (/^\d+$/.test(e[i]) && e[i + 1] == "(") {
      q += "*";
    }

    if (/^\d+$/.test(e[i]) && e[i + 1] == "M") {
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


export function newCalculateAnswer(e) {
  if (e.substring(0, 2) == "//") {
    return ""
  }
  // remove all white space
  e = e.replaceAll(/\s/g, "");

  let supOp = e.replace(/[^^]/g, "").length;
  let supCl = e.replace(/[^;]/g, "").length;
  if (supOp > supCl) {
    return "Syntax error, close powers using ;"
  }
  if (supOp < supCl) {
    return "Syntax error, more power closings than openings"
  }
  e = e.replaceAll("^", "^(");
  e = e.replaceAll(";", ")");

  e = e.replaceAll("{", "(");
  e = e.replaceAll("}", ")");
  e = e.replaceAll("[", "(");
  e = e.replaceAll("]", ")");


  if ("+-*/^(".includes(e[e.length - 1])) {
    return "Syntax error, can't end with an operator, or opening bracket"
  }

  if ("+*/^)".includes(e[0])) {
    return "Syntax error, can't begin with an operator, or closing bracket"
  }

  let numOfOpenings = e.replace(/[^(]/g, "").length;
  let numOfClosings = e.replace(/[^)]/g, "").length;
  if (numOfOpenings != numOfClosings) {
    return "Syntax error, must have equal number of opening and closing brackets"
  }

  // if (numOfOpenings > numOfClosings) {
  //   let times = numOfOpenings - numOfClosings;
  //   for (let i = 0; i < times; i++) {
  //     e += ")";
  //   }
  // }

  if (e.includes("[") || e.includes("]") || e.includes("{") || e.includes("}")) {
    return "Syntax error, square and curly brackets not supported, use regular brackets instead."
  }

  if (e.includes("()")) {
    return "Syntax error, can't have empty brackets."
  }

  if (e.includes("#")) {
    return "Syntax error, remove #"
  }

  if (e.includes("pow")) {
    return "Use ^ for powers. e.g. 5^2=25"
  }

  if (e == "") {
    return "0"
  }

  let ne = e;
  let re = e;

  re = re.replaceAll("π", "(pi)")
  ne = ne.replaceAll("π", "");
  // re = re.replaceAll("sin(", "sin(");
  ne = ne.replaceAll("sin(", "");
  // re = re.replaceAll("cos(", "cos(");
  ne = ne.replaceAll("cos(", "");
  // re = re.replaceAll("cot(", "cot(");
  ne = ne.replaceAll("cot(", "");
  // re = re.replaceAll("tan(", "tan(");
  ne = ne.replaceAll("tan(", "");
  re = re.replaceAll("cosec(", "csc(");
  ne = ne.replaceAll("cosec(", "");
  // re = re.replaceAll("csc(", "MathCoSec(");
  ne = ne.replaceAll("csc(", "");
  ne = ne.replaceAll("cosec(", "");
  // re = re.replaceAll("sec(", "MathSec(");
  ne = ne.replaceAll("sec(", "");

  re = re.replaceAll("log(", "log10(");
  ne = ne.replaceAll("log(", "");
  re = re.replaceAll("ln(", "log(");
  ne = ne.replaceAll("ln(", "");

  // re = re.replaceAll("pow(", "Math.pow(");
  ne = ne.replaceAll("pow(", "");
  ne = ne.replaceAll("i", "");

  let regex = /[a-zA-Z]/g;
  if (regex.test(ne)) {
    return "Syntax error, undefined letters"
  }

  re = surroundFunction(re);

  angleUnit = document.getElementById("angleInput").innerText;

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
  }

  try {
    let answer = math.evaluate(re).toFixed(Number(document.getElementById("precisionInput").value));
    // let answer = math.evaluate(re).toFixed(10);
    let lastSigFig = 0;
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] != "0") {
        lastSigFig = i;
      }
    }

    answer = answer.substring(0, 1+lastSigFig);
    if (answer[answer.length - 1] == ".") {
      answer = answer.substring(0, answer.length - 1);
    }
    return answer;
  } catch (error) {
    if (error.message == "math.evaluate(...).toFixed is not a function") {
      return "Math error, could be a negative log.";
    }
  }
}
