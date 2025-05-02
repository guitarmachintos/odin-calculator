/*
TODOS:
- working keyboard button
- multiple operation

*/

const buttonWrapper = document.querySelector(".calcButtonWrapper");
const screenValue = document.querySelector(".screenValue");
const calcHistory = document.querySelector(".calcHistory");
const copyButton = document.querySelector(".rightModelWrapper button")

screenValue.textContent = screenValue.textContent.trim();

// console.log(buttonWrapper);

buttonWrapper.addEventListener("click", (e) => {
    console.log(e.target.classList);
    if(e.target.classList.contains("calcButton")){
        if(!e.target.classList.contains("symbols") || e.target.classList.contains("operator")){
            screenValue.textContent += e.target.textContent;
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