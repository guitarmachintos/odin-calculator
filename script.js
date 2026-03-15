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


const buttonsInnerWrapper = document.querySelector('.buttonsInnerWrapper');

buttonsInnerWrapper.addEventListener('click', (e) => {
    if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SPAN'){
        return;
    }

    let input = e.target.innerText;

    //Change dash to minus
    input = (input === '–') ? '-' : input;

    processInput(input);
    
});

const possibleKeysArr = '1234567890.-+/*Xx=()'.split('').concat(['Enter', 'Backspace', 'Escape']);
const possibleKeys = possibleKeysArr.reduce((convertedObject, current) => {
    convertedObject[current] = null;
    return convertedObject;
}, {});

document.addEventListener('keydown', (e) => {
    if (e.repeat) {
        return;
    }

    let input = e.key;

    if (input in possibleKeys) {
        //Change keyboard possible keys to match mouse inputs
        const keyboardChanger = {
            'X': '×',
            'x': '×',
            '*': '×',
            'Escape': 'AC',
            'Backspace': 'backspace',
            'Enter': '=',
        }
        if (input in keyboardChanger){
            input = keyboardChanger[input];
        }
        processInput(e.key);
    }
});

let stillOperator = false;
const notScreenAddition = {'AC': null, 'backspace': null, '=': null};
const operator = ['+', '-', '÷', '×'];

function processInput(input) {    
    if(!(input in notScreenAddition)){
        if(operator.includes(input)){
            if(stillOperator){
                screen.textContent = screen.textContent.trimEnd().slice(0, -1).trimEnd();
            }            
            screen.textContent += ` ${input} `;
            stillOperator = true;
        }
        else {
            screen.textContent += input;
            stillOperator = false;
        }
    }
    else{
        switch (input) {
            case 'AC':
                screen.textContent = '';
                break;
            
            case 'backspace':
                screen.textContent = screen.textContent.trimEnd().slice(0, -1).trimEnd();
                break;

            case '=':
                screen.textContent = evaluate(screen.textContent);
                break;
        
            default:
                break;
        }
    }

}

function evaluate(calcExpression) {
    
}