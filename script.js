//TODO
//-

//Add texture to the sides of screen
const textureNodes = document.querySelectorAll('.texture');
textureNodes.forEach(e => {
    for (let i = 0; i < 80; i++) {
        e.appendChild(document.createElement('div'));
    }
});

const screen = document.querySelector('.screen');

let isDisabled = false;

const buttonsInnerWrapper = document.querySelector('.buttonsInnerWrapper');

buttonsInnerWrapper.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SPAN') {
        return;
    }

    let input = e.target.innerText;

    if(isDisabled && input !== 'AC'){
        return;
    }

    //Change dash to minus
    input = (input === '–') ? '-' : input;

    processInput(input);
});

const possibleKeysArr = '1234567890.-+/*Xx=()'.split('').concat(['Enter', 'Backspace', 'Escape']);
const possibleKeys = possibleKeysArr.reduce((convertedObject, current) => {
    convertedObject[current] = null;
    return convertedObject;
}, {});
const keyboardChanger = {
    'X': '×',
    'x': '×',
    '*': '×',
    '/': '÷',
    'Escape': 'AC',
    'Backspace': 'backspace',
    'Enter': '=',
};

document.addEventListener('keydown', (e) => {
    if (e.repeat) {
        return;
    }

    let input = e.key;

    if(isDisabled && input !== 'Escape'){
        return;
    }

    if (input in possibleKeys) {
        //To avoid double input
        if (input === 'Enter') {
            e.preventDefault();
        }

        //Change keyboard possible keys to match mouse inputs
        if (input in keyboardChanger) {
            input = keyboardChanger[input];
        }

        processInput(input);
    }
});

let stillOperator = false;
let isLastSpace = false;
let isError = false;
const notScreenAddition = { 'AC': null, 'backspace': null, '=': null };
const operator = ['+', '-', '÷', '×'];
const calculationLog = document.querySelector('.calculationLog')

function processInput(input) {
    if (!(input in notScreenAddition)) {
        if (operator.includes(input)) {
            if (stillOperator) {
                screen.textContent = screen.textContent.trimEnd().slice(0, -1).trimEnd();
            }
            if (isLastSpace) {
                screen.textContent += `${input} `;
            }
            else {
                screen.textContent += ` ${input} `;
            }
            isLastSpace = true;
            stillOperator = true;
        }
        else if (input === '(' || input === ')') {
            if (isLastSpace) {
                screen.textContent += `${input} `;
            }
            else {
                screen.textContent += ` ${input} `;
            }
            isLastSpace = true;
        }
        else {
            screen.textContent += input;
            stillOperator = false;
            isLastSpace = false;
        }
    }
    else {
        switch (input) {
            case 'AC':
                screen.textContent = '';
                stillOperator = false;
                isLastSpace = false;
                isError = false;
                isDisabled = false;
                enableButtons();
                calculationLog.textContent = '';
                break;

            case 'backspace':
                if(operator.includes(screen.textContent.trimEnd().slice(-1))){
                    stillOperator = false;
                }
                isLastSpace = false;
                screen.textContent = screen.textContent.trimEnd().slice(0, -1).trimEnd();
                break;

            case '=':
                if(!checkExpression(screen.textContent) || isError){
                    isError = true;
                    isDisabled = true;
                    disableButtons();
                    screen.textContent = 'ERROR';
                }
                else{
                    const newLog = document.createElement('p');
                    newLog.textContent = screen.textContent;
                    screen.textContent = evaluate(screen.textContent.trim().split(' '));
                    newLog.textContent += ' = ' + screen.textContent;
                    calculationLog.appendChild(newLog);
                }
                break;

            default:
                break;
        }
    }

}

function evaluate(expArr) {
    if(isError){
        return 'ERROR';
    }

    if(expArr.length == 1){
        return expArr[0];
    }

    //Do recursion evaluation on parentheses
    for (let i = 0; i < expArr.length; i++) {
        if (expArr[i] === '('){
            let curParDepth = 0;
            let leftParIndex = i;
            let rightParIndex = i+1;
            while(rightParIndex < expArr.length){
                if(expArr[rightParIndex] === ')' && curParDepth === 0){
                    break;
                }

                if(expArr[rightParIndex] === '('){
                    curParDepth++;
                }
                else if(expArr[rightParIndex] === ')'){
                    curParDepth--;
                }                

                rightParIndex++;
            }

            return evaluate(expArr.slice(0, leftParIndex).concat(evaluate(expArr.slice(leftParIndex+1, rightParIndex))).concat(expArr.slice(rightParIndex+1)));            
        }
    }

    //evaluate high precedence operator
    for (let i = 0; i < expArr.length; i++) {
        if(expArr[i] === '÷' || expArr[i] === '×'){
            expArr.splice(i-1, 3, solveArithmetic(expArr[i-1], expArr[i], expArr[i+1]));
            i--;
        }        
    }

    for (let i = 0; i < expArr.length; i++) {
        if(expArr[i] === '+' || expArr[i] === '-'){
            expArr.splice(i-1, 3, solveArithmetic(expArr[i-1], expArr[i], expArr[i+1]));
            i--;
        }        
    }

    if(isError){
        return 'ERROR';
    }

    if(expArr.length > 1){
        isError = true;
        isDisabled = true;
        disableButtons();
        console.error('length error');
        return 'ERROR';
    }

    return expArr[0];

}

//const operator = ['+', '-', '÷', '×'];
function solveArithmetic(a, operator, b) {
    //check no operator without 2 numbers
    if(isNaN(a) || isNaN(b)){
        isError = true;
        isDisabled = true;
        disableButtons();
        console.log('error expression');        
        return -773; //just random prime number
    }
    a = +a;
    b = +b;
    switch (operator) {
        case '+':
            return a + b;

        case '-':
            return a - b;

        case '÷':
            return a / b;

        case '×':
            return a * b;
    
        default:
            console.error('Arithmetic failed!')
            break;
    }
}

function checkExpression(calcExpression) {
    let expArr = calcExpression.trim().split(' ');

    //check no multiple comma (.3.4, 3..14)
    if(expArr.find(i => {
        let nDots = 0;
        for (const c of i) {
            if(c === '.'){
                nDots++;
            }
            if (nDots > 1){
                return true;
            }
        }
        return false;
    }) !== undefined){
        console.log('error multiple dots');
        return false;
    }

    //check no misplaced comma (.37, 7., .)
    if(expArr.find(i => {
        return i.at(0) === '.' || i.at(-1) === '.';
    }) !== undefined){
        console.log('error dots position');
        return false;
    }

    //correct parentheses number
    const parentCount = {
        '(': 0,
        ')': 0,
    };

    for (const e of expArr) {
        if(e in parentCount){
            parentCount[e]++;
        }
    }
    console.log(parentCount);
    
    if(parentCount['('] !== parentCount[')']){
        console.log('error parentheses count');        
        return false;
    }

    //check parentheses order
    let nLeftPar = 0;
    let nRightPar = 0;
    for (const element of expArr) {
        if(nRightPar > nLeftPar) {
            console.log('error parentheses order');
            return false;
        }
        if(element === '('){
            nLeftPar++;
        }
        if(element === ')'){
            nRightPar++;
        }
    }

    return true;
}

function disableButtons() {
    const allButtons = document.querySelectorAll('.calcButtons');
    allButtons.forEach(e => {
        if(!e.classList.contains('acButton')){
            e.classList.toggle('disabled');
        }
    });
}

function enableButtons(params) {
    const allButtons = document.querySelectorAll('.calcButtons');
    allButtons.forEach(e => {
        if(!e.classList.contains('acButton')){
            e.classList.remove('disabled');
        }
    });
}

// Source START - https://stackoverflow.com/a/30810322
// Posted by Dean Taylor, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-19, License - CC BY-SA 4.0
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

const copyButton = document.querySelector('.rightModel button');

copyButton.addEventListener('click', () => {
  copyTextToClipboard(screen.textContent);
  alert('Value Copied')
});
//Source END - https://stackoverflow.com/a/30810322

