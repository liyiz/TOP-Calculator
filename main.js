// When page loads
document.addEventListener("DOMContentLoaded", (event) => {
    // console.log("DOM fully loaded and parsed");
    setupEventListeners();

    updateDisplay(currDisplay);
});

let currDisplay = "0";
let currOperation = {
    operandA: 0,
    operandB: null,
    operator: null
};

// When buttons are pressed

function updateDisplay(char) {
    const display = document.querySelector('#display');

    display.textContent = char;
}

function manageNum(input) {
    // input is a string

    if (!input === "0") {
        currDisplay += input;
        updateDisplay(currDisplay);
    }
    if (input === "0") {
        return;
    }


}

function clearMemory() {
    currOperation.operandA = 0;
    currOperation.operandB = null;
    currOperation.operator = null;
    // updateDisplay();
}

function handleClick(e) {
    console.log("I've been clicked", e);

    // reference data attribute if it exists
    if (e.target.dataset) {
        // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
        // appears as DOMStringMap, 
        // and dashes from html are converted to camel case
        // e.g data-my-data -> myData
        console.log(e.target.dataset);
        manageNum(e.target.dataset.label);
    }
    if (e.target.dataset.label === "clear") {
        clearMemory();
    }
}

function operate(operator, a, b) {
    let output = 0;
    if (operator === 'add') {
        output = add(a, b);
    }
    if (operator === 'subtract') {
        output = subtract(a, b);
    }
    if (operator === 'multiply') {
        output = multiply(a, b);
    }
    if (operator === 'divide') {
        output = divide(a, b);
    }
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function setupEventListeners() {
    // const allBtns = document.querySelector('.calcBtn');
    const allBtns = document.querySelectorAll('.calcBtn');
    allBtns.forEach((el) => {el.addEventListener('click', handleClick);})
}