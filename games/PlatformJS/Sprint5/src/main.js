function mainInit() {
    global.scene = 'menu'
    global.ctx = ctx
}

function mainKeyPress(key) {
    window[global.scene+'SceneKeyPress'](key)
}

function mainKeyRelease(key) {
    window[global.scene+'SceneKeyRelease'](key)
}

function mainLoop() {
    requestAnimationFrame(mainLoop)
    lib.renderClear()
    window[global.scene+'SceneLoop']()
}