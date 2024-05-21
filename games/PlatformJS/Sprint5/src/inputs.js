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
    addEventListener('mousemove',({pageX,pageY}) => {
        const borders = getComputedStyle(canvas)
        mouse.x = pageX - wrapper.offsetLeft - parseInt(borders.borderLeftWidth)
        mouse.y = pageY - wrapper.offsetTop - parseInt(borders.borderTopWidth)
    })
    addEventListener('mousedown',() => {
        mouse.pressed = true
        mainKeyPress('mouse')
    })
    addEventListener('mouseup',() => {
        mouse.pressed = false
        mainKeyRelease('mouse')
    })
})