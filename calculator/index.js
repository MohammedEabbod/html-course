const tempDisplay = document.querySelector("#temp");
const resultDisplay = document.querySelector("#result");
const historyParent = document.querySelector("ul");
const clearButton = document.querySelector("#clear-all");
const historyList = [];
const operations = ["+", "-", "/", "*"];
let tempInput = "0";

const calcResults = (saveToHistory) => {
  const lastInput = tempInput[tempInput.length - 1];

  if (operations.includes(lastInput)) {
    return;
  }

  //  add to the history list

  if (saveToHistory) {
    historyList.push(tempInput);
    console.log(historyList);

    historyParent.innerHTML = "";
    historyList.forEach((item) => {
      const li = document.createElement("li");

      li.innerHTML = ` <div class="p-5 pb-0 text-white/50 text-right text-3xl">
    ${item}
                    </div>`;

      historyParent.appendChild(li);
    });
  }

  resultDisplay.textContent = eval(tempInput.replace("x", "*"));
};

// Rerender function
const _reRender = () => {
  tempDisplay.textContent = tempInput;

  calcResults();
};

// Rerender by default
_reRender();

const handleButtonPress = (input) => {
  const isOperationPressed = operations.includes(input);
  const isEmptyOutput = resultDisplay.innerHTML === "0";
  const displayText = tempDisplay.innerText;

  if (displayText === "0") {
    tempInput = input;
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
