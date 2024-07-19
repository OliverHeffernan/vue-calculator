<script>

export default {
    name: 'CalcRow',
    data: () => ({
        equation: ""
    }),
    methods: {
        calculate: function () {
            console.log(this.equation);
            this.$refs.answer.innerHTML = calculateAnswer(this.equation);
        }
    }
}

function calculateAnswer(equation) {
    // remove all white space
    equation = equation.replace(/\s/g, '');

    // making sure all subtraction is replaced with '+-' but multiplying or dividing negative numbers is not affected
    let subEquation = equation.replaceAll('-', '+-');
    subEquation = subEquation.replaceAll('*+-', '*-');
    subEquation = subEquation.replaceAll('/+-', '/-');

    console.log(`subEquation${subEquation}`);
    console.log(`splitBrackets${splitBracketsSecond(equation)}`);

    return add(subEquation);
}

function multiply(equation) {
    let multArray = equation.split("*");
    let result = 1;
    multArray.forEach(element => {
        console.log(`element${element}`);
        result *= divide(element);
    });
    console.log(result);
    return result;
}

function divide(equation) {
    let divArray = equation.split("/");
    let result = divArray[0] * divArray[0];
    divArray.forEach(element => {
        console.log(`element${element}`);
        result = result/element;
    });
    result = divArray.length > 1 ? result : divArray[0];
    return result;
}

function add(equation) {
    let addArray = equation.split("+");
    let result = 0;

    addArray.forEach(element => {
        console.log(`element${element}`);
        result += parseFloat(multiply(element));
    });

    return result;
}

// function splitBrackets(equation) {
//     if (!equation.includes("(") || !equation.includes(")")) return equation;

//     let depth = 0;
//     let splitEquation = [];
//     let openPoint = 0;
//     for (let i = 0; i < equation.length; i++) {
//         const element = equation[i];
//         if (element == "(") {
//             depth ++;
//             if (depth == 1) {
//                 openPoint = i;
//             }
//         }

//         if (element == ")") {
//             depth --;
//             if (depth == 0) {
//                 splitEquation.push(equation.substring(openPoint, i+1));
//                 openPoint = i + 1;
//             }
//         }

//         if (i == equation.length - 1) {
//             console.log("last");
//             splitEquation.push(equation.substring(openPoint, i+1));
//         }
//     }

//     for (let i = 0; i < splitEquation.length; i++) {
//         splitEquation[i];
//         if (splitEquation[i][0] == "(") {
//             // remove the first and last letters from the string, because they are brackets.
//             splitEquation[i] = splitEquation[i].substring(1, splitEquation[i].length - 1);
//         }
        
//         if (splitEquation[i].includes("(") && splitEquation[i].includes(")")) {
//             splitEquation[i] = splitBrackets(splitEquation[i]);
//         }
//     }
//     return splitEquation;
// }

function splitBracketsSecond(e) {
    while (e.includes("(") && e.includes(")")) {
        let lastOpen;
        let firstClose;
        for (let i = 0; i < e.length; i++) {
            if (e[i] == "(") {
                lastOpen = i;
            }
            else if (e[i] == ")") {
                firstClose = i;
            }
        }
        console.log("parts");
        console.log(e.substring(0, lastOpen));
        console.log(e.substring(lastOpen + 1, firstClose));
        console.log(e.substring(firstClose + 1, e.length));

        e = e.substring(0, lastOpen) + calculateAnswer(e.substring(lastOpen + 1, firstClose)) + e.substring(firstClose + 1, e.length);
    }
    return e;
}

</script>

<template>
    <tr>
        <td>
            <input type="text" class="inputs" placeholder="|" v-model="equation" v-on:input="calculate" />
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
    font-variation-settings:
        "wdth" 100;
    font-size: 20px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.inputs:focus {
    outline: none;
    border: none;
}

</style>