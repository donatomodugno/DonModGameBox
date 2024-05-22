function mainInit() {
    global.ctx = ctx
    lib.sceneChange('menu')
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
    wrapper.style.cursor = 'default'
    window[global.scene+'SceneLoop']()
}