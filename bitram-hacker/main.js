function increaseHeat(amnt){
    let counter = +document.getElementById('heat-counter').textContent.split(' ')[1].split('/')[0]
    document.getElementById('heat-counter').textContent = `Heat: ${counter + amnt}/100`
}

function decreaseHeat(amnt){
    let counter = +document.getElementById('heat-counter').textContent.split(' ')[1].split('/')[0]
    document.getElementById('heat-counter').textContent = `Heat: ${counter - amnt}/100`
}