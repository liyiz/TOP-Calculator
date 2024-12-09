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
    operandA = null;
    operandB = null;
    operator = null;
    isFirstInput = true;
    resetDisplay(); 
}

function resetDisplay() {
    updateDisplay(0); // helps to reset display
}

function manageOperator(input) {
    console.log("Received operator:", input);
    operator = input;

    const display = document.querySelector('#display');
    if (operandA === null && operandB === null) {
        operandA = parseInt(display.textContent);
        isFirstInput = true;
        resetDisplay();
        return;
    }

    // operandB is dealt with in handleClick()

}

function handleClick(e) {
    console.log(e.target.dataset.type);

    const btnLabel = e.target.dataset.label;
    const btnType = e.target.dataset.type;

    // reference data attribute if it exists
    if (btnType === 'operand') {
        // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
        // appears as DOMStringMap, 
        // and dashes from html are converted to camel case
        // e.g data-my-data -> myData
        // console.log(e.target.dataset);



        updateDisplay(btnLabel);
    }

    // Automatically starts next calculation inputs
    if (btnType === 'operand' && isResult) {
        clearMemory();
        isResult = false;
        updateDisplay(btnLabel);
    }

    if (btnLabel === 'clear') {
        clearMemory();
    }

    if (btnLabel === '=') {

        const display = document.querySelector('#display');
        if (operandA != null && operandB === null) {
            operandB = parseInt(display.textContent);
        }

        // check that arguments exist as variables before calling function
        if (operator && operandA && operandB) {
            const result = operate(operator, operandA, operandB);
            isResult = true;
            updateDisplay(result);
        } else {
            console.log("Cannot perform operation: Operands and/or operator missing.");
            return;
        }
    }
    if (btnType === 'operator') {
        manageOperator(btnLabel);
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