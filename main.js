// When page loads
document.addEventListener("DOMContentLoaded", (event) => {
    // console.log("DOM fully loaded and parsed");
    setupEventListeners();

    resetDisplay();
});

let currDisplay = '';
let isFirstInput = true;
let isResult = false;

let operandA = null;
let operandB = null;
let operator = null;
let lastResult = null;

let calcState = {
    operandA: null,
    operandB: null,
    operator: null,
    lastResult: null,
    numOfCalcs: 0
}

// keep state as strings
let displayState = {
    content: ''
}


// When buttons are pressed

function updateDisplay(char) {
    const display = document.querySelector('#display');
    if (char === 0) {
        currDisplay = '0';
    } else if (isFirstInput && char === '0' ) {
        currDisplay = char;
    } else if (isFirstInput) {
        currDisplay = char;
        isFirstInput = false;
    } else if (isResult) {
        currDisplay = char;
        // isResult = false;
    } else {
        currDisplay += char;
    }
    display.textContent = currDisplay;

    // need to differentiate which stage of input
    // refresh display after operator selection
    // refresh display after pressing equals
}

// function manageState(input) {
//     // Do calculator logic here

//     updateDisplay();

// }


function manageNum(num) {
    console.log(num);
    if(operandA == 0) {
        operandA = 0;
    } else {
        operandA = parseInt(num);
    }

    updateDisplay(operandA);

    console.table([operandA, operandB, operator]);
}

function clearMemory() {
    calcState.operandA = null;
    calcState.operandB = null;
    calcState.operator = null;
    calcState.lastResult = null;
    calcState.numOfCalcs = 0;
    resetDisplay(); 
}

function resetDisplay() {
    updateDisplay(0); // helps to reset display
}

function manageOperator(input) {
    console.log("Received operator:", input);
    calcState.operator = input;

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

    // reference data attribute if it exists
    if (btnType === 'operand') {
        // update the displayState
        // update the calcState
    }

    // if evaluate button pressed
    if (btnLabel === '=') {
        // Go on to evaluate the calculation

        // if operandA and operandB are empty
        if (calcState.operandA === null && calcState.operandB === null) {
            // return, no effect - can't operate without operands
            return;
        }

        // if only operandA is filled
        if (!isNaN(calcState.operandA)) {
            // 
        }

        // if only operandB is filled
        if (!isNaN(calcState.operandB)) {
            // error out, that shouldn't happen
        }
        
        // if operandA and operandB are filled
        if (!isNaN(calcState.operandA) && !isNaN(calcState.operandB)) {
            // continue to operate function
        }

    }

    // If operator button pressed
    if (btnType === 'operator') {
        // go to function that will check which operator to select

        // if operandA and operandB are empty
        if (calcState.operandA === null && calcState.operandB === null) {
            // return, no effect - can't operate without operands
            return;
        }

        // if only operandA is filled
        // 

        // if only operandB is filled
        // error out, that shouldn't happen

        // if operandA and operandB are filled
        // continue to operate function

        manageOperator(btnLabel);
    }

    // If we have finished a calculation, and user clicks an operand button
    if (btnType === 'operand' && isResult) {
        // Start a new calculation, clear memory and clear display
        clearMemory();
        isResult = false;
        updateDisplay(btnLabel);
    }
}

function evaluate() {

    // check that arguments exist as variables before calling function
    if (operator && operandA && operandB) {
        const result = operate(operator, operandA, operandB);
        isResult = true;
        updateDisplay(result);
        lastResult = result;
        return result;
    } else {
        console.log("Cannot perform operation: Operands and/or operator missing.");
        return 0;
    }
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