// When page loads
document.addEventListener("DOMContentLoaded", (event) => {
    // console.log("DOM fully loaded and parsed");
    setupEventListeners();

    resetDisplay();
});


// state variables
let currDisplay = '';
let isFirstInput = true;
let isAwaitOperand = true;
let isShowResult = false;
let isWaitingForOperandB = false;

let operandA = null;
let operandB = null;
let operator = null;
let lastResult = null;



function clearMemory() {
    operandA = null;
    operandB = null;
    operator = null;
    lastResult = null;
    isShowResult = false;
    isFirstInput = true;
    resetDisplay(); 
}

function resetDisplay() {
    updateDisplay(); // helps to reset display
}

function manageOperator(input) {
    console.log("Received operator:", input);
    operator = input;
}

function updateDisplay(char = '0') {
    const display = document.querySelector('#display');
    
    // Reset scenarios: first input, showing result, or zero as first character
    if (isFirstInput && char === '0') {
        currDisplay = char;
    }
    else if (isFirstInput) {
        currDisplay = char;
        isFirstInput = false;
    } 
    else if (isShowResult) {
        currDisplay = char;
        // isShowResult = false;
    }
    else {
        // Append character for subsequent inputs
        currDisplay += char;
    }
    
    display.textContent = currDisplay;
}

function handleClick(e) {

    // TODO: See about refactoring and breaking up this function into smaller ones

    // console.log(e.target.dataset.type);

    // data to assess and pass to functions
    const btnLabel = e.target.dataset.label;
    // data group or type to check
    const btnType = e.target.dataset.type;

    const display = document.querySelector('#display');

    if (btnLabel === 'clear') {
        clearMemory();
    }

    if (btnLabel === '=') {
        inputValidation(); // TODO: Requirements for input validation phase of a calculation?
        operandB = parseInt(display.textContent)
        isWaitingForOperandB = false;
        // check that arguments exist as variables before calling function
        if (operator && operandA && operandB) {
            const result = operate(operator, operandA, operandB);
            isShowResult = true;
            lastResult = result;
            updateDisplay(result);
        } else {
            console.log("Cannot perform operation: Operands and/or operator missing.");
            return;
        }
    }

    // operandA -> operator -> operandB -> result -> operator

    // operandA -> operator -> operandB -> operator ->

    if (btnType === 'digit') {
        updateDisplay(btnLabel);
    }

    // What happens when picking an operator on a first calculation
    if (btnType === 'operator' && !isShowResult) {

        operandA = parseInt(display.textContent)
        isFirstInput = true;

        manageOperator(btnLabel);
        // reset display to take new input number
        resetDisplay();
        isWaitingForOperandB = true;
    }

    // What happens when picking an operator on a result - user intends to chain calculation
    // TODO: Make sure to show the result, not just another zero
    if (btnType === 'operator' && isShowResult) {
        manageOperator(btnLabel);
        operandA = lastResult; // -> then go to set operandB
        operandB = null;
        isWaitingForOperandB = true;
        isFirstInput = true;
        isShowResult = false; 
        // reset display to take new input number
        resetDisplay();
    }

    // Once you have calculation result, start next calculation if operand is selected.
    if (btnType === 'digit' && isShowResult) {
        clearMemory();
        isShowResult = false;
        updateDisplay(btnLabel);
    }

    console.table({operandA, operandB, operator, lastResult, currDisplay, isFirstInput, isWaitingForOperandB, isShowResult})


}


function inputValidation() {
    // function to validate calculator state before proceeding to operate()
}


function operate(operation, a, b) {
    let output = 0;
    if (operation === '+') {
        output = add(a, b);
    }
    if (operation === '-') {
        output = subtract(a, b);
    }
    if (operation === '*') {
        output = multiply(a, b);
    }
    if (operation === '/') {
        output = divide(a, b);
    }
    return output;
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