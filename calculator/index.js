const tempDisplay = document.querySelector("#temp");
const resultDisplay = document.querySelector("#result");
const historyParent = document.querySelector("ul");
const clearButton = document.querySelector("#clear-all");
const historyList = [];
const operations = ["+", "-", "/", "*", "x", "%", "√x", "x²"];
let tempInput = "0";
const deleteOne = document.getElementById("deletOne");

// --- helpers (NEW) ---
const isBinaryOp = (ch) => /[+\-/*x%]/.test(ch);          // single-char ops only
const endsWithBinaryOp = (s) => /[+\-/*x%]$/.test(s);

// --- CHANGED: conversion kept inside calc without touching tempInput ---
const calcResults = (saveToHistory) => {
  const lastInput = tempInput[tempInput.length - 1];

  const isBinaryOp = (ch) => /[+\-/*x%]/.test(ch);
  if (isBinaryOp(lastInput)) return;

  if (saveToHistory) {
    historyList.push(tempInput);
    historyParent.innerHTML = "";
    historyList.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = ` <div class="p-5 pb-0 text-white/50 text-right text-3xl">
        ${item}
      </div>`;
      historyParent.appendChild(li);
    });
  }

  // ---- convert pretty input to valid JS (WITHOUT changing tempInput) ----
  let expr = tempInput;

  // x² after number or ')'  =>  (value)**2
  expr = expr.replace(/(\d+(?:\.\d+)?|\))\s*x²/g, "($1)**2");

  // √(...) / √9 / √x(...)/ √x9 -> Math.sqrt(...)
  expr = expr.replace(/√x\s*\(/g, "Math.sqrt(");
  expr = expr.replace(/√\s*\(/g, "Math.sqrt(");
  expr = expr.replace(/√x\s*(\d+(?:\.\d+)?)/g, "Math.sqrt($1)");
  expr = expr.replace(/√\s*(\d+(?:\.\d+)?)/g, "Math.sqrt($1)");

  // visual multiply 'x' or '×' between terms => '*'
  expr = expr.replace(/(?<=\d|\))\s*[x×]\s*(?=\d|\()/g, "*");

  // IMPLICIT MULTIPLY rules:
  // number or ')' directly before '('  =>  insert '*'
  expr = expr.replace(/(\d|\))\s*\(/g, "$1*(");

  // ')' directly before a number or '(' => insert '*'
  expr = expr.replace(/\)\s*(\d|\()/g, ")*$1");

  // number or ')' directly before Math.sqrt => insert '*'
  expr = expr.replace(/(\d|\))\s*(Math\.sqrt)/g, "$1*$2");

  // fallback: any remaining 'x' (not inside Math.sqrt) -> '*'
  expr = expr.replace(/x/g, "*");

  // console.log("JS expr:", expr);
  resultDisplay.textContent = eval(expr);
};



// Rerender function
const _reRender = () => {
  tempDisplay.textContent = tempInput;

  calcResults();
};

// Rerender by default
_reRender();

// --- CHANGED: minimal tweak to prevent two operators in a row ---
const handleButtonPress = (input) => {
  const isOperationPressed = operations.includes(input);
  const isEmptyOutput = resultDisplay.innerHTML === "0";
  const displayText = tempDisplay.innerText;

  const isBinaryOp = (ch) => /[+\-/*x%]/.test(ch);
  const endsWithBinaryOp = (s) => /[+\-/*x%]$/.test(s);
  const hasOpenParen = (s) =>
    (s.match(/\(/g) || []).length > (s.match(/\)/g) || []).length;
  const last = displayText.at(-1) || "";

  // ==== PARENS LOGIC (NEW) ====
  if (input === "(") {
    // implicit multiply if previous is number or ')'
    if (displayText !== "0" && /[\d\)]$/.test(displayText)) {
      tempInput = displayText + "*(";
    } else if (displayText === "0") {
      tempInput = "(";
    } else {
      tempInput = displayText + "(";
    }
    _reRender();
    return;
  }

  if (input === ")") {
    // must have an open '(' and last token cannot be an operator or '('
    if (!hasOpenParen(displayText)) return;
    if (endsWithBinaryOp(displayText) || last === "(") return;

    tempInput = displayText + ")";
    _reRender();
    return;
  }
  // ==== END PARENS LOGIC ====

  // existing operator-replace guard (prevents "++", "*/", ...)
  if (isOperationPressed && isBinaryOp(input)) {
    if (displayText === "0") return;
    if (endsWithBinaryOp(displayText)) {
      tempInput = displayText.slice(0, -1) + input;  // replace last op
    } else {
      tempInput = displayText + input;               // append normally
    }
    _reRender();
    return;
  }

  if (displayText === "0") {
    // allow starting with sqrt nicely
    if (input === "√x") {
      tempInput = "√(";
    } else {
      tempInput = input;
    }
    _reRender();
    return;
  }

  if (isOperationPressed && !isEmptyOutput) {
    tempInput = resultDisplay.innerText + input;
    _reRender();
    return;
  }

  tempInput = displayText + input;
  _reRender();
};


const scrollable = document.querySelector("#scrollable");

function scrollToBottom() {
  scrollable.scrollTop = scrollable.scrollHeight;
}
function DeleteAll() {
  tempInput = "0";
  resultDisplay.textContent = "0";
  historyList.length = 0;
  historyParent.innerHTML = "";
  _reRender();
}
clearButton.addEventListener("click", DeleteAll);

// scroll once on page load
scrollToBottom();

// scroll every time content changes
const observer = new MutationObserver(scrollToBottom);
observer.observe(scrollable, { childList: true, subtree: true });

deleteOne.addEventListener("click", () => {
  if (tempInput.length > 1) {
    tempInput = tempInput.slice(0, -1);
  } else {
    tempInput = "0";
  }
  _reRender();
});
