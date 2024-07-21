<script>
export default {
  name: "CalcRow",
  data() {
    return {
      equation: this.value,
    };
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("update:value", newValue);
      },
    },
  },
  methods: {
    calculate: function () {
      this.$refs.equation.value = replaceSpecialCharacters(
        this.$refs.equation.value
      );
      this.$refs.answer.innerHTML = calculateAnswer(
        splitBrackets(this.$refs.equation.value)
      );
    },
    onInput(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
  mounted() {
    this.$refs.equation.focus();
  },
};

function replaceSpecialCharacters(equation) {
  equation = equation.replaceAll("pi", "π");
  return equation;
}

function calculateAnswer(equation) {
  // remove all white space
  equation = equation.replace(/\s/g, "");

  // making sure all subtraction is replaced with '+-' but multiplying or dividing negative numbers is not affected
  let subEquation = equation.replaceAll("-", "+-");
  subEquation = subEquation.replaceAll("*+-", "*-");
  subEquation = subEquation.replaceAll("/+-", "/-");

  return add(subEquation);
}

function exponents(equation) {
  if (!equation.includes("^")) return equation;
  let expArray = equation.split("^");
  let result = expArray[0];
  for (let i = 1; i < expArray.length; i++) {
    const e = expArray[i];
    result = Math.pow(result, e);
  }
  return result;
}

function multiply(equation) {
  if (!equation.includes("*")) return divide(equation);
  let multArray = equation.split("*");
  let result = 1;
  multArray.forEach((element) => {
    result *= divide(element);
  });
  return result;
}

function divide(equation) {
  if (!equation.includes("/")) return exponents(equation);
  let divArray = equation.split("/");
  let result = divArray[0] * divArray[0];
  divArray.forEach((element) => {
    result = result / element;
  });
  result = divArray.length > 1 ? result : divArray[0];
  return result;
}

function add(equation) {
  let addArray = equation.split("+");
  let result = 0;

  addArray.forEach((element) => {
    result += parseFloat(multiply(element));
  });

  return result;
}

function splitBrackets(e) {
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
    if (!"+-/*".includes(operator1) && firstPart != "") {
      firstPart += "*";
    }

    let operator2 = lastPart[0];
    if (!"+-/*".includes(operator2) && lastPart != "") {
      lastPart = "*" + lastPart;
    }

    e = firstPart + middlePart + lastPart;
  }
  return e;
}
</script>

<template>
  <tr>
    <td>
      <input
        class="inputs"
        ref="equation"
        type="text"
        placeholder="|"
        v-on:input="calculate"
        v-model="internalValue"
        @keydown="handleKeydown"
      />
    </td>
    <td class="answer" ref="answer"></td>
  </tr>
</template>

<style>
.inputs {
  width: 50vw;
  border: none;
  background-color: black;
  color: white;
  font-family: "Inconsolata", monospace;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
  font-variation-settings: "wdth" 100;
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.inputs:focus {
  outline: none;
  border: none;
}
</style>
