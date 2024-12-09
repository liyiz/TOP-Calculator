// When page loads
document.addEventListener("DOMContentLoaded", (event) => {
    // console.log("DOM fully loaded and parsed");
    setupEventListeners();

    resetDisplay();
});


// state variables
let currDisplay = '';
let isFirstInput = true;
let isShowResult = false;
let isWaitingForOperandB = false;

let operandA = null;
let operandB = null;
let operator = null;
let lastResult = null;


function updateDisplay(char) {
    const display = document.querySelector('#display');
    if (char === 0) {
        currDisplay = '0';
    } else if (isFirstInput && char === '0' ) {
        currDisplay = char;
    } else if (isFirstInput) {
        currDisplay = char;
    } else if (isShowResult) {
        currDisplay = char;
        // isShowResult = false;
    } else {
        currDisplay += char;
    }
    display.textContent = currDisplay;

    // need to differentiate which stage of input
    // refresh display after operator selection
    // refresh display after pressing equals
}

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
    updateDisplay(0); // helps to reset display
}

function manageOperator(input) {
    console.log("Received operator:", input);
    operator = input;

    // const display = document.querySelector('#display');
    // if (operandA === null && operandB === null) {
    //     operandA = parseInt(display.textContent);
    //     isFirstInput = true; // So "first" input for operandB will replace '0' - otherwise it concats
    //     resetDisplay();
    //     return;
    // }

    // operandB is dealt with in handleClick()

}

function handleClick(e) {
    // console.log(e.target.dataset.type);

    // data to assess and pass to functions
    const btnLabel = e.target.dataset.label;
    // data group or type to check
    const btnType = e.target.dataset.type;

    if (btnLabel === 'clear') {
        clearMemory();
    }

    if (btnLabel === '=') {
        inputValidation();
        const display = document.querySelector('#display');
        if (operandA != null && operandB === null) {
            operandB = parseInt(display.textContent);
        }

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

    if (btnType === 'digit' && isFirstInput) {
        operandA = parseInt(btnLabel);
        isFirstInput = false;
        updateDisplay(btnLabel);
    }

    if (btnType === 'digit' && isWaitingForOperandB) {
        operandB = parseInt(btnLabel);
        updateDisplay(btnLabel);
    }

    // What happens when picking an operator on a first calculation
    if (btnType === 'operator' && !isShowResult) {
        manageOperator(btnLabel);
        // reset display to take new input number
        resetDisplay();
        isWaitingForOperandB = true;
    }

    // Once you have calculation result, start next calculation if operand is selected.
    if (btnType === 'digit' && isShowResult) {
        clearMemory();
        isShowResult = false;
        updateDisplay(btnLabel);
    }



    
    // if user wants to operate on a result
    if (btnType === 'operator' && isShowResult) {
        // reset both operand variables
        operandA = null;
        operandB = null;
        // managerOperator will assign operandA with result
        manageOperator(btnLabel);
    }

}


function inputValidation() {
    // function to validate calculator state before proceeding to operate()
    console.table({operandA, operandB, operator, lastResult, currDisplay, isFirstInput, isWaitingForOperandB, isShowResult})
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