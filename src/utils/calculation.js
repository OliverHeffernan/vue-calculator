export function replaceSpecialCharacters(e) {
  return e.replaceAll("pi", "π");
}

export function replaceAns(e, prev) {
  if (prev == null) prev = "1";
  return e.replaceAll("ans", `(${prev})`); 
}
  
export function calculateAnswer(e) {
    // remove all white space
    e = e.replace(/\s/g, "");
  
    // making sure all subtraction is replaced with '+-' but multiplying or dividing negative numbers is not affected
    let subEquation = e.replaceAll("-", "+-");
    subEquation = subEquation.replaceAll("*+-", "*-");
    subEquation = subEquation.replaceAll("/+-", "/-");
  
    return add(subEquation);
}
  
function exponents(e) {
    if (!e.includes("^")) return e;
    let expArray = e.split("^");
    let result = expArray[0];
    for (let i = 1; i < expArray.length; i++) {
      const e = expArray[i];
      result = Math.pow(result, e);
    }
    return result;
}
  
function multiply(e) {
    if (!e.includes("*")) return divide(e);
    let multArray = e.split("*");
    let result = 1;
    multArray.forEach((element) => {
      result *= divide(element);
    });
    return result;
}
  
function divide(e) {
    if (!e.includes("/")) return exponents(e);
    let divArray = e.split("/");
    let result = divArray[0] * divArray[0];
    divArray.forEach((element) => {
      result = result / element;
    });
    result = divArray.length > 1 ? result : divArray[0];
    return result;
}
  
function add(e) {
    let addArray = e.split("+");
    let result = 0;
  
    addArray.forEach((element) => {
      result += parseFloat(multiply(element));
    });
  
    return result;
}
  
export function splitBrackets(e) {
    if (e.replace(/[^(]/g, "").length != e.replace(/[^)]/g, "").length) {
      return "maError: uneven brackets";
    }
  
    // replacing pi symbol with actual pi number
    e = e.replaceAll("π", `(${Math.PI}) `);
  
    // replacing % symbol with number
    e = e.replaceAll("%", "/100");
  
    // remove all empty space
    e = e.replaceAll(" ", "");
  
    while (e.includes("(") && e.includes(")")) {
      let lastOpen;
      let firstClose;
      for (let i = 0; i < e.length; i++) {
        if (e[i] == "(") {
          lastOpen = i;
        } else if (e[i] == ")") {
          firstClose = i;
          break;
        }
      }
  
      let firstPart = e.substring(0, lastOpen);
      let middlePart = calculateAnswer(e.substring(lastOpen + 1, firstClose));
      let lastPart = e.substring(firstClose + 1, e.length);
  
      let operator1 = firstPart[firstPart.length - 1];
      if (!"+-/*^".includes(operator1) && firstPart != "") {
        firstPart += "*";
      }
  
      let operator2 = lastPart[0];
      if (!"+-/*)^".includes(operator2) && lastPart != "") {
        lastPart = "*" + lastPart;
      }
  
      e = firstPart + middlePart + lastPart;
    }
    return e;
}