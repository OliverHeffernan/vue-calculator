(function(){var e={9083:function(e,t,n){"use strict";var o=n(5130),r=n(6768);function l(e,t,n,o,l,i){const s=(0,r.g2)("CalcSettings"),u=(0,r.g2)("CalcTable"),c=(0,r.g2)("TransitionCursor");return(0,r.uX)(),(0,r.CE)(r.FK,null,[(0,r.bF)(s),(0,r.bF)(u),(0,r.bF)(c)],64)}var i=n(144),s=n(4232),u=(n(4114),n(8490)),c=n(3229),a=256,d="rad";const g={number:"BigNumber",precision:a,angles:d},f=(0,u.v)(c.Q,g);function p(e){return e.replaceAll("pi","π")}function h(e,t){return null==t&&(t="1"),e.replaceAll("ans",`(${t})`)}function w(e){let t="";for(var n=0;n<e.length;n++)t+=e[n],/^\d+$/.test(e[n])&&"("==e[n+1]&&(t+="*"),")"==e[n]&&/^\d+$/.test(e[n+1])&&(t+="*");return t=t.replaceAll(")(",")*("),t=t.replaceAll("log10*","log10"),t}function m(e,t){if(0==t&&(R=new Map),"//"==e.substring(0,2))return"";if(e.includes("=")&&/\d/.test(e.split("=")[0]))return"Variable names can't contain numbers";if(e.includes("="))return I(e),m(e.split("=")[1]);if(e=E(e,R),e=e.replaceAll(/\s/g,""),v(e)[0])return v(e)[1];if(e=e.replaceAll(";",")"),e=e.replaceAll("^","^("),e=e.replaceAll("{","("),e=e.replaceAll("}",")"),e=e.replaceAll("[","("),e=e.replaceAll("]",")"),""==e)return"0";let n=e,o=[["π","(pi)"],["cosec(","csc("],["log(","log10("],["ln(","log("]];n=x(n,o,!1);let r=["sin(","cos(","cot(","tan(","csc(","sec(","i","abs("];o.forEach((e=>{r.push(e[0])}));let l=x(e,r,!0),i=/[a-zA-Z]/g;if(i.test(l))return"Syntax error, undefined letters";console.log(n);while(n.includes("("))n=b(n);n=n.replaceAll("[","("),n=n.replaceAll("]",")"),n=w(n),d=document.getElementById("angleInput").innerText;let s=[[/sin\((.*?)\)/g,`sin($1 ${d})`],[/cos\((.*?)\)/g,`cos($1 ${d})`],[/tan\((.*?)\)/g,`tan($1 ${d}`],[/cot\((.*?)\)/g,`cot($1 ${d})`],[/sec\((.*?)\)/g,`sec($1 ${d})`],[/csc\((.*?)\)/g,`csc($1 ${d})`]];for(let c=0;c<s.length;c++)n=n.replace(s[c][0],s[c][1]);try{let e=f.evaluate(n).toFixed(Number(document.getElementById("precisionInput").value)),t=0;for(let n=0;n<e.length;n++)"0"!=e[n]&&(t=n);return e=e.substring(0,1+t),"."==e[e.length-1]&&(e=e.substring(0,e.length-1)),e}catch(u){return"math.evaluate(...).toFixed is not a function"==u.message?"Math error, could be a negative log.":u.message}}function v(e){let t=e.replace(/[^^]/g,"").length,n=e.replace(/[^;]/g,"").length,o=0;for(let i=0;i<e.length;i++)if("^"==e[i])o++;else if(";"==e[i]&&(o--,o<0))return[!0,"unexpected power closing"];if(t>n)return[!0,"Syntax error, close powers using ;"];if(t<n)return[!0,"Syntax error, more power closings than openings"];if(document.getElementById("precisionInput").value<1)return"set precision to a number greater than 1";if(document.getElementById("precisionInput").value=document.getElementById("precisionInput").value.toString().replaceAll(".",""),e.includes("pow"))return[!0,"Use ^ for powers. e.g. 5^2;=25. Close a power using ';'"];if("+-*/^(".includes(e[e.length-1]))return[!0,"Syntax error, can't end with an operator, or opening bracket"];if("+*/^)".includes(e[0]))return[!0,"Syntax error, can't begin with an operator, or closing bracket"];let r=e.replace(/[^(]/g,"").length,l=e.replace(/[^)]/g,"").length;return r!=l?[!0,"Syntax error, must have equal number of opening and closing brackets"]:e.includes("()")?[!0,"Syntax error, can't have empty brackets."]:e.includes("#")?[!0,"Syntax error, remove #"]:""==e?[!0,"0"]:[!1]}function x(e,t,n){for(let o=0;o<t.length;o++)e=n?e.replaceAll(t[o],""):e.replaceAll(t[o][0],t[o][1]);return e}function b(e){let t,n=0;for(let o=0;o<e.length;o++)if("("==e[o])n++,1==n&&(t=o);else if(")"==e[o]&&(n--,0==n))return e.substring(0,t)+"["+f.evaluate(e.substring(t+1,o))+"]"+e.substring(o+1,e.length)}let y,R=new Map;function I(e){let t=e.split("=")[1];""!=t&&R.set(e.split("=")[0],m(e.split("=")[1]))}function E(e,t){let n=new Map(Array.from(t).sort(((e,t)=>t[0].length-e[0].length)));for(let[o,r]of n)e=e.replaceAll(o,`(${r})`);return e}class k{constructor(e,t){this.equation=null!==e?e:"",this.dispEquation=q(this.equation),this.answer=0,this.index=t}calculate(){let e;F&&(e=F.getRow(this.index-1));const t=e?e.getAnswer():0;this.equation=p(this.equation),this.answer=m(h(this.equation,t),this.index),this.equation+=" ",this.equation=this.equation.substring(0,this.equation.length-1),this.dispEquation=q(this.equation,this.index)}setEquation(e){this.equation=e,F.calculateAllRows()}setIndex(e){this.index=e}getEquation(){return this.equation}getDispEquation(){return q(this.equation,this.index)}getAnswer(){return this.answer}getIndex(){return this.index}}function A(e){let t=0,n="";for(let o=0;o<e.length;o++)"({[".includes(e[o])?n+=`<brack class="depth${t++}">${e[o]}</brack>`:")}]".includes(e[o])?n+=`<brack class="depth${--t}">${e[o]}</brack>`:n+=e[o];return n}function q(e,t){let n=!1;if("//"==e.substring(0,2)&&(n=!0),F){let n=document.getElementById("row"+F.getFocusRowIndex());if(n&&t==F.getFocusRowIndex()){var o=n.selectionStart,r=n.selectionEnd;if(o==r)e=e.substring(0,o)+"<crs></crs>"+e.substring(o,e.length);else{let t=Math.min(o,r),n=Math.max(o,r);e=e.substring(0,t)+"<crs></crs>"+e.substring(t,n)+"<crs></crs>"+e.substring(n,e.length)}}}if(e=C(e),e=e.replaceAll(" ","<space>_</space>"),n)return`<comm>${e}</comm>`;let l=[["+","<op> + </op>"],["-","<op> - </op>"],["*","<op> × </op>"],["=","<op> = </op>"],["sin(","<func>sin</func>("],["cos(","<func>cos</func>("],["tan(","<func>tan</func>("],["log(","<func>log</func>("],["ln(","<func>ln</func>("],["cosec(","<func>cosec</func>("],["sec(","<func>sec</func>("],["csc(","<func>csc</func>("],["cot(","<func>cot</func>("],["pow(","<func>pow</func>("],["abs(","<func>abs</func>("]];for(let i=0;i<l.length;i++)e=e.replaceAll(l[i][0],l[i][1]);return"undefined"==e?"":(e=A(e),e)}function C(e){let t=0,n=0,o="";for(let r=0;r<e.length;r++)"^"==e[r]?(t++,o+="<sup>"):";"==e[r]?(n++,n>t?(o+="<unexpected>;</unexpected>",n=t):o+="</sup>"):o+=e[r];return o}class B{constructor(){if(y)throw new Error("RowManager is already initialized");this.rows=(0,i.KR)([new k("",0)]),this.focusRowIndex=(0,i.KR)(0),y=this}getRows(){return this.rows.value}getRow(e){return this.rows.value[e]}setRow(e,t){this.rows.value[e]=t}addRowAt(e){let t=this.getRow(e).getEquation(),n=document.getElementById(`row${e}`),o=n.selectionStart,r=n.selectionEnd,l=[t.substring(0,o),t.substring(r,t.length)];this.setRow(e,new k(l[0],e)),this.focusRowIndex.value=e+1;let i=this.rows.value;this.rows.value=null,setTimeout((()=>{this.rows.value=i,this.rows.value.splice(e+1,0,new k(l[1],e+1));for(let e=0;e<this.rows.value.length;e++)this.rows.value[e].setIndex(e)}),1)}removeRowAt(e){let t=document.getElementById(`row${e}`),n=t.selectionStart,o=t.selectionEnd;if((0==n||0==o)&&1!=this.rows.value.length){let t=this.getRow(e).getEquation(),n=t.substring(o,t.length),r=this.getRow(e-1).getEquation()+n,l=r.length-n.length;this.setRow(e-1,new k(r,e-1)),this.focusRowIndex.value=0!=e?e-1:0;let i=this.rows.value;this.rows.value=null,setTimeout((()=>{this.rows.value=i,this.rows.value.splice(e,1);for(let e=0;e<this.rows.value.length;e++)this.rows.value[e].setIndex(e)}),1),setTimeout((()=>{document.getElementById(`row${this.focusRowIndex.value}`).setSelectionRange(l,l),this.calculateAllRows()}),1)}}calculateAllRows(){setTimeout((()=>{if(this.rows.value){this.rows.value.forEach((e=>e.calculate()));for(let e=0;e<this.rows.value.length;e++)this.rows.value[e].calculate()}}),1)}getFocusRowIndex(){return this.focusRowIndex.value}setFocusRowIndex(e){this.focusRowIndex.value=e}adjustFocusRowIndex(e){let t=this.focusRowIndex.value,n=t+e;if(n<this.rows.value.length&&n>=0){this.focusRowIndex.value=n;let e=document.getElementById(`row${t}`).selectionStart,o=document.getElementById(`row${this.focusRowIndex.value}`);o.focus(),requestAnimationFrame((()=>{o.setSelectionRange(e,e),this.calculateAllRows()}))}}updateSmoothCursorPosition(){let e=document.getElementById("cursor"),t=document.getElementsByTagName("crs")[0];if(null==e||null==t)return void requestAnimationFrame(T);if("inputs"!==document.activeElement.className)return e.style.opacity=0,void requestAnimationFrame(T);let n=document.getElementsByTagName("crs")[1];if(null!=n){e.className="selection";let o=t.getBoundingClientRect(),r=n.getBoundingClientRect(),l=Math.abs(o.left-r.left);e.style.width=l+"px"}else e.className="cursor",e.style.width="2px";let o=t.getBoundingClientRect();e.style.top=o.top+"px",e.style.left=o.left+"px",e.style.opacity=1,requestAnimationFrame(T)}}const $=Object.freeze(new B);function S(e){"Enter"!==e.key&&"38"!=e.keyCode&&"40"!=e.keyCode&&$.calculateAllRows()}function L(e){e=e||window.event,"38"==e.keyCode?$.adjustFocusRowIndex(-1):"40"==e.keyCode&&$.adjustFocusRowIndex(1)}function T(){$.updateSmoothCursorPosition()}$.updateSmoothCursorPosition(),document.onkeydown=L,document.addEventListener("keyup",S),document.addEventListener("keydown",S),document.addEventListener("click",S);var F=$;const j=["id"],M=["id","innerHTML"],O=["id","innerHTML"];var _={__name:"CalcRow",props:{index:{type:Number,required:!0}},setup(e){const t=e;var n=!1;const l=(0,i.KR)();function u(){F.getRow(t.index).setEquation(l.value),l.value=F.getRow(t.index).getEquation()}function c(){F.addRowAt(t.index)}function a(){F.removeRowAt(t.index)}function d(){n&&(document.getElementById(`row${t.index}`).focus(),F.setFocusRowIndex(t.index))}function g(e){return"//"==F.getRow(e).getEquation().substring(0,2)?"":"<op> = </op>"}function f(){navigator.clipboard.writeText(F.getRow(t.index).getAnswer())}return(0,r.sV)((()=>{l.value=F.getRow(t.index).getEquation(),t.index==F.focusRowIndex.value&&document.getElementById(`row${t.index}`).focus(),n=!0,F.updateSmoothCursorPosition()})),d(),(e,n)=>((0,r.uX)(),(0,r.CE)(r.FK,null,[(0,r.Lk)("tr",null,[(0,r.Lk)("td",null,[(0,r.bo)((0,r.Lk)("input",{class:"inputs",id:"row"+t.index,type:"text","onUpdate:modelValue":n[0]||(n[0]=e=>l.value=e),onInput:u,onKeyup:[(0,o.jR)(c,["enter"]),(0,o.jR)(a,["backspace"])],onKeypress:(0,o.jR)(a,["backspace"]),onKeydown:(0,o.jR)(a,["backspace"])},null,40,j),[[o.Jo,l.value]])])]),(0,r.Lk)("tr",null,[(0,r.Lk)("td",{onClick:d,id:"dispRow"+t.index,innerHTML:(0,i.R1)(F).getRow(t.index).getDispEquation()},null,8,M),(0,r.Lk)("td",{id:"equal"+t.index,innerHTML:g(t.index)},null,8,O),(0,r.Lk)("td",{onClick:f,class:"answer"},(0,s.v_)((0,i.R1)(F).getRow(t.index).getAnswer()),1)])],64))}};const K=_;var N=K;const P={id:"calcTable",ref:"calcTable"};var X={__name:"CalcTable",setup(e){return(e,t)=>((0,r.uX)(),(0,r.CE)("table",P,[((0,r.uX)(!0),(0,r.CE)(r.FK,null,(0,r.pI)((0,i.R1)(F).getRows(),(e=>((0,r.uX)(),(0,r.Wv)(N,{key:e.getIndex(),index:e.getIndex()},null,8,["index"])))),128))],512))}};const H=X;var V=H;const z=(0,r.Lk)("i",{class:"fa-solid fa-gear"},null,-1),D=[z],U=(0,r.Lk)("tr",null,[(0,r.Lk)("td",null,"Precision: "),(0,r.Lk)("td",null,[(0,r.Lk)("input",{id:"precisionInput",type:"number"})])],-1),J=(0,r.Lk)("td",null,"Angle Mode: ",-1);var Q={__name:"CalcSettings",setup(e){var t=!0;function n(){t=!t,document.getElementById("settings").className=t?"open":"closed",document.getElementById("settingsButton").className=t?"openButton":"closedButton"}function o(){let e=["rad","deg","grad"],t=document.getElementById("angleInput"),n=e.indexOf(t.innerText)+1;n=n>2?0:n,t.innerText=e[n]}return(0,r.sV)((()=>{document.getElementById("precisionInput").value=10,document.getElementById("angleInput").value="rad"})),(e,t)=>((0,r.uX)(),(0,r.CE)(r.FK,null,[(0,r.Lk)("button",{id:"settingsButton",onClick:n},D),(0,r.Lk)("div",{id:"settings",class:"closed"},[(0,r.Lk)("table",null,[U,(0,r.Lk)("tr",null,[J,(0,r.Lk)("td",null,[(0,r.Lk)("button",{id:"angleInput",type:"text",onClick:o},"rad")])])])])],64))}};const W=Q;var Z=W;const G={id:"cursor"};function Y(e,t){return(0,r.uX)(),(0,r.CE)("div",G)}var ee=n(1241);const te={},ne=(0,ee.A)(te,[["render",Y]]);var oe=ne,re={name:"App",components:{CalcTable:V,CalcSettings:Z,TransitionCursor:oe}};const le=(0,ee.A)(re,[["render",l]]);var ie=le;(0,o.Ef)(ie).mount("#app")},1234:function(){}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var l=t[o]={id:o,loaded:!1,exports:{}};return e[o].call(l.exports,l,l.exports,n),l.loaded=!0,l.exports}n.m=e,function(){n.amdD=function(){throw new Error("define cannot be used indirect")}}(),function(){n.amdO={}}(),function(){var e=[];n.O=function(t,o,r,l){if(!o){var i=1/0;for(a=0;a<e.length;a++){o=e[a][0],r=e[a][1],l=e[a][2];for(var s=!0,u=0;u<o.length;u++)(!1&l||i>=l)&&Object.keys(n.O).every((function(e){return n.O[e](o[u])}))?o.splice(u--,1):(s=!1,l<i&&(i=l));if(s){e.splice(a--,1);var c=r();void 0!==c&&(t=c)}}return t}l=l||0;for(var a=e.length;a>0&&e[a-1][2]>l;a--)e[a]=e[a-1];e[a]=[o,r,l]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){var e={524:0};n.O.j=function(t){return 0===e[t]};var t=function(t,o){var r,l,i=o[0],s=o[1],u=o[2],c=0;if(i.some((function(t){return 0!==e[t]}))){for(r in s)n.o(s,r)&&(n.m[r]=s[r]);if(u)var a=u(n)}for(t&&t(o);c<i.length;c++)l=i[c],n.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return n.O(a)},o=self["webpackChunkvue_calculator"]=self["webpackChunkvue_calculator"]||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var o=n.O(void 0,[504],(function(){return n(9083)}));o=n.O(o)})();
//# sourceMappingURL=app.c80f9199.js.map