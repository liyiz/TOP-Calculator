// When page loads
document.addEventListener("DOMContentLoaded", (event) => {
    // console.log("DOM fully loaded and parsed");
    setupEventListeners();

    resetDisplay();
});

const display = document.querySelector('#display');

// state variables
let currDisplay = '';
let isFirstInput = true;
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
    isFirstInput = true; // is first input after any event
    isWaitingForOperandB = false;
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

    // display zero to start with

    // if user inputs zero first, display a 0 - but do not concat
    if (/*user inputs a zero*/char === '0' && isFirstInput) {
        // display a zero
        display.textContent = '0';
        currDisplay = display.textContent;
        return;
    }

    // TODO: Stop zeros from concatenating when it is the first digit on display.

    if (/*user inputs any other number AND it is the first input*/char != '0' && isFirstInput) {
        // display the input number
        display.textContent = char;
        isFirstInput = false;
        currDisplay = display.textContent;
        return;
    }

    if (/*user inputs a notFirst number*/!isFirstInput && !isShowResult) {
        // concatenate the notFirst number to the end of the string
        display.textContent += char;
        currDisplay = display.textContent;
        return;
        // console.log(currDisplay);
    }

    if (!isFirstInput && isShowResult && isWaitingForOperandB) {
        display.textContent = char;
        currDisplay = display.textContent;
        isShowResult = false;
        return;        
    }

    if (/*user expects calculation result to display*/isShowResult) {
        display.textContent = char;
        currDisplay = display.textContent;
        return;
    }
    
}

function handleClick(e) {

    // TODO: See about refactoring and breaking up this function into smaller ones

    // console.log(e.target.dataset.type);

    // data to assess and pass to functions
    const btnLabel = e.target.dataset.label;
    // data group or type to check
    const btnType = e.target.dataset.type;


    if (btnLabel === 'clear') {
        clearMemory();
    }

    // User clicks on an operator for first calculation &&
    // User clicks on an operator intending to chain calcuations after an evaluation
    if (btnType === 'operator' && !isFirstInput && !isShowResult && !isWaitingForOperandB) {

        // assign operandA - either by previous input, or lastResult
        operandA = parseInt(currDisplay); // or parseInt(display.textContent);
        // assign to operator
        manageOperator(btnLabel);

        isFirstInput = true;
        isWaitingForOperandB = true;

        // update display to show operator has been parsed
        resetDisplay();

    }
    // User clicks on a digit for either operands
    // or User clicks on a digit for operandA
    // User clicks on a digit for operandB
    // isFirstInput handled in updateDisplay
    if (btnType === 'digit' && !isShowResult && !isWaitingForOperandB ||
        btnType === 'digit' && !isShowResult && isWaitingForOperandB || 
        btnType === 'digit' && isShowResult && isWaitingForOperandB
    ) {
        updateDisplay(btnLabel);
    }

    // User clicks on an operator intending to chain next calculation
    if (btnType === 'operator' && !isFirstInput && !isShowResult && isWaitingForOperandB ) {
        
        // 1. First assign operandB with the latest user input
        operandB = parseInt(currDisplay); // or parseInt(display.textContent);
        // 2. Then operate existing pair of operands and operator
        // 3. Save the result into lastResult
        validateInput();
        // 4. Assign lastResult to operandA
        operandA = lastResult;
        // 5. Clear operandB
        operandB = null;

        isFirstInput = true;

        // 6. Update display with result
        updateDisplay(lastResult);

        isShowResult = true;
        // 7. Assign new operator to operator variable
        manageOperator(btnLabel);

        
    }

    // User clicks on evaluate to end all calculations
    // isShowResult could be true or false for this to fire
    if (btnLabel === '=' && !isFirstInput && isWaitingForOperandB ) {

        // 1. Assign operandB with latest user input
        operandB = parseInt(currDisplay); // or parseInt(display.textContent);
        // 2. Operate existing pair of operands and operator
        // 3. Save the result into lastResult
        validateInput();
        isWaitingForOperandB = false;
        isShowResult = true;
        // 4. Update display with result
        updateDisplay(lastResult);
        // 5. (Optional) clear operator, operandA and operandB variables

        isFirstInput = true;
        
    }

    // User clicks on an operator intending to chain calcuations after an evaluation
    // if (btnType === 'operator' && !isFirstInput && !isWaitingForOperandB && isShowResult) {
    
        // assign to operator
        // isFirstInput = true;
        // isWaitingForOperandB = true;
        // isShowResult = false;
    // }

    console.table({currDisplay, isFirstInput, isShowResult, isWaitingForOperandB, operandA, operandB, operator, lastResult })


}


function validateInput() {
    // function to validate calculator state before proceeding to operate()
    // check that arguments exist as variables before calling function
    if (operator && operandA && operandB) {
        const result = operate(operator, operandA, operandB);
        
        lastResult = result;
        // updateDisplay(result);

        // then clear operandA operandB operator variables?

    } else {
        console.log("Cannot perform operation: Operands and/or operator missing.");
        return;
    }
}


function operate(operation, a, b) {
    
    a = parseInt(a);
    b = parseInt(b);

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
    console.log('result is:', a, operation, b, '=', output)
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