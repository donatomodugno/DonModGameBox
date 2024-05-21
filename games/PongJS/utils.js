const WIDTH = 500
const HEIGHT = 500
const PADDLEY = 440
const PADDLESPEED = 4
const BALLSPEED = 4

const keys = {
    left: {
        pressed:false
    },
    right: {
        pressed:false
    },
    space: {
        pressed:false
    },
    any: {
        pressed:false
    }
}

addEventListener('keydown',({key}) => {
    keys.any.pressed = true
    switch(true) {
        case key=='ArrowLeft':
            keys.left.pressed = true
            break
        case key=='ArrowRight':
            keys.right.pressed = true
            break
        case key==' ':
            keys.space.pressed = true
            if(running) pause = !pause
            break
    }
})

addEventListener('keyup',({key}) => {
    keys.any.pressed = false
    switch(true) {
        case key=='ArrowLeft':
            keys.left.pressed = false
            break
        case key=='ArrowRight':
            keys.right.pressed = false
            break
        case key==' ':
            keys.space.pressed = false
            break
    }
})

addEventListener('load',() => {
    Main()
})