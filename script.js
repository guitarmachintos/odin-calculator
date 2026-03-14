const textureNodes = document.querySelectorAll('.texture');

//Add texture to the sides of screen
textureNodes.forEach(e => {
    for (let i = 0; i < 80; i++) {        
        e.appendChild(document.createElement('div'));
    }
});

// const designText = document.querySelector('.referenceLink div');
// const refLink = document.querySelector('.referenceLink a');

// refLink.addEventListener('mouseover', () => {
//     console.log('tes');    
//     designText.style.marginTop = "3px";
// });