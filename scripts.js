/*
TODOS:
- working keyboard button
- multiple operation

*/

//For copying to clipboard, credit:Dean Taylor(SO)
//--------------------START--------------------
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
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}
//--------------------END--------------------

const SYMBOL_DIVIDE = '÷';
const SYMBOL_TIMES = '×';

function evalSingleExp(a, operator, b) {
    a = +a;
    b = +b;
    switch (operator) {
        case '+': 
            return a + b;
        case '-':
            return a - b;
        case SYMBOL_DIVIDE:
            return a / b;
        case SYMBOL_TIMES:
            return a * b;    
        default:
            console.error("Invalid operator");
            break;
    }
}

function evalEveryOperator(tokens, operator){
    while(true){
        let timeIndex = tokens.indexOf(operator);            
        if(timeIndex == -1){
            break;
        }
        let curExpResult = evalSingleExp(tokens[timeIndex-1], tokens[timeIndex], tokens[timeIndex+1]);
        tokens.splice(timeIndex-1, 3, curExpResult);
    }
}


function evalWholeExp(textExp) {
    let tokens = textExp.split(' ');
    while (tokens.length > 1){
        //Evaluate all multiplication and division first
        evalEveryOperator(tokens, SYMBOL_TIMES);
        evalEveryOperator(tokens, SYMBOL_DIVIDE);
        evalEveryOperator(tokens, '+');
        evalEveryOperator(tokens, '-');
    }
    return tokens[0];
}

function evalAllParentheses(testExp){
    while(true){
        let parIndex = testExp.lastIndexOf('(');
        if (parIndex === -1) {
            break;
        }
        
    }
}

const buttonWrapper = document.querySelector(".calcButtonWrapper");
const screenValue = document.querySelector(".screenValue");
const calcHistory = document.querySelector(".calcHistory");
const copyButton = document.querySelector(".rightModelWrapper button")

screenValue.textContent = screenValue.textContent.trim();

buttonWrapper.addEventListener("click", (e) => {
    // console.log(e.target.classList);
    if(e.target.classList.contains("calcButton")){
        let charButton = e.target.textContent.trim();
        if(e.target.classList.contains("number") || charButton === '('||
           charButton === ')'){            
            screenValue.textContent += e.target.textContent;
        }
        else if(e.target.classList.contains("operator")){
            screenValue.textContent += ' ' + e.target.textContent + ' ';
        }
        else if(e.target.classList.contains('function')){
            console.log(e.target.textContent.trim());
            switch (e.target.textContent.trim()) {
                case 'AC':
                    screenValue.textContent = '';
                    calcHistory.textContent = '';
                    break;

                case 'backspace':
                    console.log('eeoo');
                    console.log(screenValue.textContent);
                    screenValue.textContent = screenValue.textContent.slice(0, screenValue.textContent.length-1);
                    break;

                case '=':
                    evalWholeExp(screenValue.textContent.trim());
                    break;

                default:
                    break;
            }
        }
    }
    //for clicking right on the span element itself.
    else if(e.target.classList.contains("material-symbols-outlined")){
        screenValue.textContent = screenValue.textContent.slice(0, screenValue.textContent.length-1);
    }

});

copyButton.addEventListener('click', () => copyTextToClipboard(screenValue.textContent.trim()));

