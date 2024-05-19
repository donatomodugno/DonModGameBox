lib.loadResources()
addEventListener('load',() => {
    mainInit()
    mainLoop()

    addEventListener('keydown',({key}) => {
        if(key in keys && !keys[key].pressed) {
            keys[key].pressed = true
            mainKeyPress(key)
        }
    })
    addEventListener('keyup',({key}) => {
        if(key in keys && keys[key].pressed) {
            keys[key].pressed = false
            mainKeyRelease(key)
        }
    })
})