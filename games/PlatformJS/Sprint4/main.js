function keyPressOnce(key) {
    switch(scene) {
        case 'menu':
            keyPressOnceMenu(key)
            break
        case 'game':
            keyPressOnceGame(key)
            break
    }
}

function keyReleaseOnce(key) {
    switch(scene) {
        case 'menu':
            keyReleaseOnceMenu(key)
            break
        case 'game':
            keyReleaseOnceGame(key)
            break
    }
}

function animate() {
    ctx.clearRect(0,0,WIDTH,HEIGHT)
    canvas.style.cursor = 'default'
    tick++
    tick%=TICKS
    switch(scene) {
        case 'menu':
            MenuLoop()
            break
        case 'game':
            GameLoop()
            break
    }
    requestAnimationFrame(animate)
}

function main() {
    if(DEVICE!='mobile') requestAnimationFrame(animate)
    else alert('This game is not available from mobile devices')
}