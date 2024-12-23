// TODO: Round long decimal numbers 
// TODO: Deal with overflow figures (display only shows up to 9 figures before overflowing)

// When page loads
document.addEventListener("DOMContentLoaded", (event) => {
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

    // data to assess and pass to functions
    const btnLabel = e.target.dataset.label;
    // data group or type to check
    const btnType = e.target.dataset.type;

    if (btnLabel === 'clear') {
        clearMemory();
    }

    // User clicks on an operator for first calculation &&
    // User clicks on an operator intending to chain calcuations after an evaluation
    if (btnType === 'operator' && !isFirstInput && !isShowResult && !isWaitingForOperandB ||
        btnType === 'operator' && isFirstInput && !isShowResult && !isWaitingForOperandB
    ) {

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
        btnType === 'digit' && isShowResult && isWaitingForOperandB ||
        btnType === 'digit' && isShowResult && !isWaitingForOperandB // User clicks on a digit after error evaluation
    ) {
        updateDisplay(btnLabel);
    }

    // User clicks on an operator intending to chain next calculation
    // User clicks on an operator intending to chain next calculation after an evaluation end
    if (btnType === 'operator' && !isFirstInput && !isShowResult && isWaitingForOperandB ||
        btnType === 'operator' && isFirstInput && isShowResult && !isWaitingForOperandB 
    ) {
        
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

        isWaitingForOperandB = true;

    }

    // User clicks on evaluate to end all calculations
    // isShowResult could be true or false for this to fire
    if (btnLabel === '=' /* && !isFirstInput */ && isWaitingForOperandB) {

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

        isShowResult = false; // to deal with error evaluation with divide by 0
        isFirstInput = true;

        operandA = null;
        operandB = null;
        operator = null;
        
    }

    console.table({currDisplay, isFirstInput, isShowResult, isWaitingForOperandB, operandA, operandB, operator, lastResult })

}


function validateInput() {
    // function to validate calculator state before proceeding to operate()
    // check that arguments exist as variables before calling function
    if (operator && operandA && operandB || 
        operator && operandA === 0 && operandB ||
        operator && operandA && operandB === 0
    ) {
        let result = operate(operator, operandA, operandB);
        
        let strTypecastToNum = (num) => { 
            return (num === '.') ? '.' : Number(num);
        };

        // let resultArray = Array.from(String(result), strTypecastToNum); // returns as array of numbers
        let resultArray = String(result); // returns as array of strings
        // check if result has long decimals
        if (resultArray.length > 9) {
            console.log("resultArray:", resultArray, result);
            /* //Code for if we want to factor in the integers for figure length too
            const splitFromDot = resultArray.split('.');
            console.log(splitFromDot); // e.g. ['3', '3333333333333335']  */
            // do we need to know where the decimal point is?
            // we need to cut off any figures that leave an array larger than 9 indexes
            // edgecase: What if decimal point is not in the cut off?

            // Simpler approach - just round up to only 2 decimal places only.
            result = Number.parseFloat(result).toFixed(2);
        }
        // How do I check how many figures a number has?
        // Check how many numbers past the decimal point
        // Create a function to round up to as many decimal places as the display can handle

        lastResult = result;
        // updateDisplay(result);

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
        // TODO edgecase for divide by zero
        if (a === 0 || b === 0) {
            return output = 'ERROR';
        }

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
    const allBtns = document.querySelectorAll('.calcBtn');
    allBtns.forEach((el) => {el.addEventListener('click', handleClick);})
}