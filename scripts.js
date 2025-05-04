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
    let res;
    switch (operator) {
        case '+': 
            res = a + b;
            break;
        case '-':
            res = a - b;
            break;
        case SYMBOL_DIVIDE:
            res = a / b;
            break;
        case SYMBOL_TIMES:
            res = a * b;
            break;  
        default:
            console.error("Invalid operator");
            break;
    }
    return Math.round((res + Number.EPSILON) * 100) / 100
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

function evalAllParentheses(textEXp){
    if(!checkParentheses(textEXp)){
        return "Parentheses ERROR!";
    }
    while(true){
        let parIndexOpen = textEXp.lastIndexOf('(');
        if (parIndexOpen === -1) {
            break;
        }
        let parIndexClose = textEXp.indexOf(')', parIndexOpen);
        if((parIndexClose - parIndexOpen) === 1){
            // textEXp = ((parIndexOpen !== 0) ? textEXp.slice(0, parIndexOpen) : '') + 
            //           textEXp.slice(parIndexOpen+1, parIndexClose) +
            //           ((parIndexClose !== textEXp.length-1) ? textEXp.slice(parIndexClose+1, textEXp.length) : '')
                textEXp = textEXp.slice(0, parIndexOpen) + 
                          textEXp.slice(parIndexClose+1, textEXp.length);
                
            continue;
        }
        else{
            let expRes = evalWholeExp(textEXp.slice(parIndexOpen+1, parIndexClose));
            textEXp = textEXp.slice(0, parIndexOpen) + expRes +
                          textEXp.slice(parIndexClose+1, textEXp.length);
        }        
    }
    return evalWholeExp(textEXp);
}

const buttonWrapper = document.querySelector(".calcButtonWrapper");
const screenValue = document.querySelector(".screenValue");
const calcHistory = document.querySelector(".calcHistory");
const copyButton = document.querySelector(".rightModelWrapper button")
const opList = '-+' + SYMBOL_DIVIDE + SYMBOL_TIMES;


screenValue.textContent = screenValue.textContent.trim();

buttonWrapper.addEventListener("click", (e) => {
    // console.log(e.target.classList);
    if(e.target.classList.contains("calcButton")){
        let charButton = e.target.textContent.trim();
        if(e.target.classList.contains("number") || charButton === '('||
           charButton === ')'){            
            if(opList.includes(screenValue.textContent.at(-1))){
                screenValue.textContent += ' ';
            }            
            screenValue.textContent += e.target.textContent;
        }
        else if(e.target.classList.contains("operator")){
            addOperator(e.target.textContent);
            // screenValue.textContent += ' ' + e.target.textContent + ' ';
        }
        else if(e.target.classList.contains('function')){
            // console.log(e.target.textContent.trim());
            switch (e.target.textContent.trim()) {
                case 'AC':
                    screenValue.textContent = '';
                    calcHistory.textContent = '';
                    break;

                case 'backspace':
                    if(screenValue.textContent.at(-1) === ' '){
                        screenValue.textContent = screenValue.textContent.trimEnd();
                    }
                    screenValue.textContent = screenValue.textContent.slice(0, screenValue.textContent.length-1);
                    if(screenValue.textContent.at(-1) === ' '){
                        screenValue.textContent = screenValue.textContent.trimEnd();
                    }
                    break;

                case '=':
                    // if()
                    let expResult = evalAllParentheses(screenValue.textContent.trim());
                    calcHistory.innerText += screenValue.textContent.trim() + ' = ' + expResult;
                    const linebreak = document.createElement('br');
                    calcHistory.appendChild(linebreak);
                    screenValue.textContent = expResult;
                    break;

                default:
                    break;
            }
        }
    }
    //for clicking right on the span element itself.
    else if(e.target.classList.contains("material-symbols-outlined")){
        if(screenValue.textContent.at(-1) === ' '){
            screenValue.textContent = screenValue.textContent.trimEnd();
        }
        screenValue.textContent = screenValue.textContent.slice(0, screenValue.textContent.length-1);
        if(screenValue.textContent.at(-1) === ' '){
            screenValue.textContent = screenValue.textContent.trimEnd();
        }
    }

});

copyButton.addEventListener('click', () => {
    copyTextToClipboard(screenValue.textContent.trim());
    alert('Value Copied!');
});

function checkParentheses(testExp) {
    testExp = testExp.trim();
    let numOpen = 0;
    let numClose = 0;
    for (const c of testExp) {
        if(c === '('){
            numOpen++;
        }
        if(c === ')'){
            if(numOpen <= numClose){
                return false;
            }
            numClose++;
        }
    }
    if(numOpen !== numClose){
        return false;
    }
    return true;
}

function addOperator(operator){
    let numList = '1234567890';
    let opList = '-+' + SYMBOL_DIVIDE + SYMBOL_TIMES;
    if(numList.includes(screenValue.textContent.trim().at(-1))){
        screenValue.textContent += ' ' + operator + ' ';   
    }
    else if(opList.includes(screenValue.textContent.trim().at(-1))){
        if(screenValue.textContent.at(-1) === ' '){
            screenValue.textContent = screenValue.textContent.trimEnd();
        }
        screenValue.textContent = screenValue.textContent.slice(0, screenValue.textContent.length-1);
        screenValue.textContent += operator + ' ';
    }
}

