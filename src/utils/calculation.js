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
  console.log(q);
  return q;
}


export function newCalculateAnswer(e) {
  // remove all white space
  e = e.replaceAll(/\s/g, "");

  if ("+-*/^(".includes(e[e.length - 1])) {
    return "Syntax error, can't end with an operand, or opening bracket"
  }

  if ("+*/^)".includes(e[0])) {
    return "Syntax error, can't begin with an operand, or closing bracket"
  }

  if (e.replace(/[^(]/g, "").length != e.replace(/[^)]/g, "").length) {
    return "Syntax error, must have equal number of opening and closing brackets"
  }

  let ne = e;
  let re = e;

  re = re.replaceAll("sin(", "Math.sin(");
  ne = ne.replaceAll("sin(", "");
  re = re.replaceAll("cos(", "Math.cos(");
  ne = ne.replaceAll("cos(", "");
  re = re.replaceAll("cot(", "Math.cot(");
  ne = ne.replaceAll("tan(", "");
  re = re.replaceAll("cosec(", "MathCoSec(");
  ne = ne.replaceAll("cosec(", "");
  re = re.replaceAll("csc(", "MathCoSec(");
  ne = ne.replaceAll("csc(", "");
  re = re.replaceAll("sec(", "MathSec(");
  ne = ne.replaceAll("sec(", "");

  re = re.replaceAll("log(", "Math.log10(");
  ne = ne.replaceAll("log(", "");
  re = re.replaceAll("ln(", "Math.log(");
  ne = ne.replaceAll("ln(", "");

  re = re.replaceAll("pow(", "Math.pow(");
  ne = ne.replaceAll("pow(", "");

  let regex = /[a-zA-Z]/g;
  console.log(ne);
  if (regex.test(ne)) {
    return "Syntax error, undefined letters"
  }
  console.log(re);

  re = surroundFunction(re);

  console.log(re);
  return eval(re);
}

// complex trig ratios

function MathSec(a) {
  return 1/Math.cos(a);
}

function MathCoSec(a) {
  return 1/Math.sin(a);
}

console.log(MathSec(5));
console.log(MathCoSec(5));