// When page loads
document.addEventListener("DOMContentLoaded", (event) => {
    // console.log("DOM fully loaded and parsed");
    setupEventListeners();

    updateDisplay(currDisplay);
});

let currDisplay = "0";
let state = {
    operandA: 0,
    operandB: null,
    operator: null,
    operandSubmits: 0 // do I need to track how many submissions made?
};

// When buttons are pressed

function updateDisplay(char) {
    const display = document.querySelector('#display');

    display.textContent = char;
}

function manageState(input) {
    // check if we are on first or second input
    // if first input,
    if(state.operandSubmits === 0) {
        // we are on first input
        // check if first input is a zero
        // if first input is a zero
        if (operandA === 0) {

        } else {
            // if first input is not a zero

        }
        
    }

    // if second input,
    if(state.operandSubmits === 1) {
        // we are on second input
    }

    updateDisplay();

}


function clearMemory() {
    state.operandA = 0;
    state.operandB = null;
    state.operator = null;
    // updateDisplay();
}

function handleClick(e) {
    console.log(e.target.dataset.label);

    // reference data attribute if it exists
    if (e.target.dataset.operand) {
        // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
        // appears as DOMStringMap, 
        // and dashes from html are converted to camel case
        // e.g data-my-data -> myData
        // console.log(e.target.dataset);
        manageState(e.target.dataset.operand);
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