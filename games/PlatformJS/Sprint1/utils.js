const FPS = 60
const DEVICE = navigator.userAgent.match(/mobile/i) ? 'mobile' : 'desktop'
const BORDER = 10
const BORDERRADIUS = BORDER
const BLOCKSIZE = 40//32
const SIZE = 12//15
const WIDTH = BLOCKSIZE*SIZE
const HEIGHT = BLOCKSIZE*SIZE
const SPEED = 4
const GRAVITY = 1
const JUMP = 18

const canvas = document.getElementById('game')
canvas.width = WIDTH
canvas.height = HEIGHT
canvas.style.border = 'solid '+BORDER+'px'
canvas.style.borderRadius = BORDERRADIUS+'px'

const keys = {
    left: {
        pressed:false
    },
    right: {
        pressed:false
    },
    up: {
        pressed:false
    },
    down: {
        pressed:false
    }
}

const mouse = {
    x:0,
    y:0,
    pressed:false
}

addEventListener('keydown',({key}) => {
    switch(true) {
        case key=='ArrowUp' || key=='w':
            if(!keys.up.pressed) {
                keys.up.pressed = true
                keyPressOnce('up')
            }
            break
        case key=='ArrowDown' || key=='s':
            if(!keys.down.pressed) {
                keys.down.pressed = true
                keyPressOnce('down')
            }
            break
        case key=='ArrowLeft' || key=='a':
            if(!keys.left.pressed) {
                keys.left.pressed = true
                keyPressOnce('left')
            }
            break
        case key=='ArrowRight' || key=='d':
            if(!keys.right.pressed) {
                keys.right.pressed = true
                keyPressOnce('right')
            }
            break
    }
})

addEventListener('keyup',({key}) => {
    switch(true) {
        case key=='ArrowUp' || key=='w':
            keys.up.pressed = false
            keyReleaseOnce('up')
            break
        case key=='ArrowDown' || key=='s':
            keys.down.pressed = false
            keyReleaseOnce('down')
            break
        case key=='ArrowLeft' || key=='a':
            keys.left.pressed = false
            keyReleaseOnce('left')
            break
        case key=='ArrowRight' || key=='d':
            keys.right.pressed = false
            keyReleaseOnce('right')
            break
    }
})

addEventListener('mousemove',({pageX,pageY}) => {
    mouse.x = pageX - canvas.offsetLeft - BORDER
    mouse.y = pageY - canvas.offsetTop - BORDER
})

addEventListener('mousedown',() => {
    mouse.pressed = true
    keyPressOnce('mouse')
})

addEventListener('mouseup',() => {
    mouse.pressed = false
    keyReleaseOnce('mouse')
})

addEventListener('load',() => {
    main()
})