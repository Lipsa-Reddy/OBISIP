let currentInput = "";
let previousInput = "";
let operation = null;

const display = document.getElementById("display");

function updateDisplay(val) {
  display.innerText = val || "0";
}

document.querySelectorAll(".num").forEach(button => {
  button.addEventListener("click", () => {
    const num = button.getAttribute("data-num");
    if (num === "." && currentInput.includes(".")) return;
    currentInput += num;
    updateDisplay(currentInput);
  });
});

document.querySelectorAll(".operator").forEach(button => {
  button.addEventListener("click", () => {
    if (!currentInput) return;
    if (previousInput && currentInput) calculate();
    operation = button.getAttribute("data-op");
    previousInput = currentInput;
    currentInput = "";
  });
});

document.getElementById("equals").addEventListener("click", calculate);

function calculate() {
  if (!previousInput || !currentInput || !operation) return;
  let result;
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);

  if (operation === "/" && curr === 0) {
    updateDisplay("Error: Div by 0");
    currentInput = "";
    previousInput = "";
    operation = null;
    return;
  }

  switch (operation) {
    case "+": result = prev + curr; break;
    case "-": result = prev - curr; break;
    case "*": result = prev * curr; break;
    case "/": result = prev / curr; break;
  }

  currentInput = result.toString();
  operation = null;
  previousInput = "";
  updateDisplay(currentInput);
}

document.getElementById("clear").addEventListener("click", () => {
  currentInput = "";
  previousInput = "";
  operation = null;
  updateDisplay("0");
});

document.getElementById("backspace").addEventListener("click", () => {
  currentInput = currentInput.slice(0, -1);
  updateDisplay(currentInput);
});
