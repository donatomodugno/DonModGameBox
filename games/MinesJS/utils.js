const LABEL = 'MinesJS'
const AUTHOR = 'Donato Modugno'
const DATE = '16/02/2023'
const DEVICE = navigator.userAgent.match(/mobile/i) ? 'mobile' : 'desktop'
const BORDER = 10
const BORDER_RADIUS = BORDER
const SIZES = [[40,12],[20,24],[10,48]]
const SIZE_CONFIG = 0
const CS = SIZES[SIZE_CONFIG][0] /* CELL_SIZE */
const CPS = SIZES[SIZE_CONFIG][1] /* CELL_PER_SCREEN */
const WIDTH = CS*CPS
const HEIGHT = CS*CPS
const DIFFICULTY = 0.1
const NC = ['','blue','green','red','darkblue','darkred','cadetblue','black','darkgrey',''] /* NUMBER_COLORS */

const canvas = document.getElementById('game')
canvas.width = WIDTH
canvas.height = HEIGHT
canvas.style.border = 'solid '+BORDER+'px'
canvas.style.borderRadius = BORDER_RADIUS+'px'
canvas.oncontextmenu = (e) => e.preventDefault()
const h1 = document.createElement('h1')
h1.append(LABEL+(DEVICE=='mobile' ? ' (mobile)' : ''))
h1.style = 'text-align:center; margin-bottom: 5px;'
const p = document.createElement('p')
p.append(AUTHOR+' - '+DATE)
canvas.before(h1)
canvas.after(p)
const ctx = canvas.getContext('2d')

const mouse = {
    x:0,
    y:0,
    left: {
        pressed:false,
    },
    right: {
        pressed:false,
    },
}

addEventListener('mousemove',({pageX,pageY}) => {
    mouse.x = pageX - canvas.offsetLeft - BORDER
    mouse.y = pageY - canvas.offsetTop - BORDER
})

addEventListener('mousedown',({button}) => {
    switch(button) {
        case 0:
            mouse.left.pressed = true
            mousePressOnce('left')
            break
        case 2:
            mouse.right.pressed = true
            mousePressOnce('right')
            break
    }
})

addEventListener('mouseup',({button}) => {
    switch(button) {
        case 0:
            mouse.left.pressed = false
            mouseReleaseOnce('left')
            break
        case 2:
            mouse.right.pressed = false
            mouseReleaseOnce('right')
            break
    }
})

/*addEventListener('touchstart',() => {
    mouse.x = e.changedTouches[0].pageX - canvas.offsetLeft - BORDER
    mouse.y = e.changedTouches[0].pageY - canvas.offsetTop - BORDER
    mouse.left.pressed = true
    mousePressOnce('left')
    setTimeout(() => {
        mouse.right.pressed = true
        mousePressOnce('right')
    },1000)
})

addEventListener('touchend',() => {
    if(mouse.right.pressed) {
        mouse.right.pressed = false
        mouseReleaseOnce('right')
    } else {
        mouse.left.pressed = false
        mouseReleaseOnce('left')
    }
})*/

addEventListener('load',() => {
    main()
})