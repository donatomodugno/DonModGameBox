addEventListener('keydown',({key}) => {
    if(Object.keys(keys).includes(key) && !keys[key].pressed) {
        keys[key].pressed = true
        keyPressOnce(key)
    }
})

addEventListener('keyup',({key}) => {
    if(Object.keys(keys).includes(key)) {
        keys[key].pressed = false
        keyReleaseOnce(key)
    }
})

addEventListener('load',() => {
    if(MOBILE) messageBox('This game is not available on mobile devices')
    else {
        sceneInitMain()
        requestAnimationFrame(animate)
    }
})