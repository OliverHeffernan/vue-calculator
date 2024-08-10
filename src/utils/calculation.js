export function replaceSpecialCharacters(e) {
  return e.replaceAll("pi", "π");
}

export function replaceAns(e, prev) {
  if (prev == null) prev = "1";
  return e.replaceAll("ans", `(${prev})`); 
}

function surroundFunction(e) {
  let q = "";
  let prevNumber = false;
  let prevBracket = false;
  for (var i = 0; i < e.length; i++) {
    if (e[i] == "M" && prevNumber) {
      q += "*";
    }

    if (/\d/.test(e[i])) {
      prevNumber = true;
    }
    else
    {
      prevNumber = false;
    }

    if (prevNumber && prevBracket) {
      q += "*";
    }

    if (e[i] == ")") {
      prevBracket = true;
    }
    else
    {
      prevBracket = false;
    }
    
    q += e[i];
  }
  return q;
}


export function newCalculateAnswer(e) {
  // remove all white space
  e = e.replaceAll(/\s/g, "");

  if ("+-*/^(".includes(e[e.length - 1])) {
    return "Syntax error"
  }

  if ("+*/^)".includes(e[0])) {
    return "Syntax error"
  }

  if (e.replace(/[^(]/g, "").length != e.replace(/[^)]/g, "").length) {
    return "Syntax error"
  }

  let ne = e;

  e = e.replaceAll("sin(", "Math.sin(");
  ne = e.replaceAll("sin(", "");
  e = e.replaceAll("cos(", "Math.cos(");
  ne = ne.replaceAll("cos(", "");
  e = e.replaceAll("cot(", "Math.cot(");
  ne = ne.replaceAll("tan(", "");

  e = e.replaceAll("log(", "Math.log10(");
  ne = ne.replaceAll("log(", "");
  e = e.replaceAll("ln(", "Math.log(");
  ne = ne.replaceAll("ln(", ")");

  e = e.replaceAll("pow(", "Math.pow(");
  ne = ne.replaceAll("pow(", "");

  let regex = /[a-zA-Z]/g;
  if (regex.test(ne)) {
    return "Syntax error, undefined"
  }
  console.log(e);

  e = surroundFunction(e);

  

  console.log(e);
  return eval(e);
}