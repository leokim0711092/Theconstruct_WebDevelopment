document.onreadystatechange = function (event) {
    if (document.readyState === 'complete') {
        console.log('Hello from JavaScript5555')
        const div1 = document.querySelector('div')
        div1.innerHTML = 'Inside div'
        
    }
}

console.log('Script was loaded')