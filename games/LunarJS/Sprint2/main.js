function sceneInitMain() {
    sceneChange('menu')
}

function keyPressOnce(key) {
    if(scene=='menu') keyPressOnceMenu(key)
    if(scene=='game') keyPressOnceGame(key)
    if(scene=='credits') keyPressOnceCredits(key)
}
function keyReleaseOnce(key) {
    if(scene=='menu') keyReleaseOnceMenu(key)
    if(scene=='game') keyReleaseOnceGame(key)
    if(scene=='credits') keyReleaseOnceCredits(key)
}

function animate() {
    ctx.clearRect(0,0,WIDTH,HEIGHT)
    if(scene=='menu') animateMenu()
    if(scene=='game') animateGame()
    if(scene=='credits') animateCredits()
    requestAnimationFrame(animate)
}