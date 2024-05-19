addEventListener('load',() => {
    main()
})

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
        case key=='f':
            if(!keys.f.pressed) {
                keys.f.pressed = true
                keyPressOnce('f')
            }
            break
        case key=='z':
            if(!keys.z.pressed) {
                keys.z.pressed = true
                keyPressOnce('z')
            }
            break
        case key=='x':
            if(!keys.x.pressed) {
                keys.x.pressed = true
                keyPressOnce('x')
            }
            break
        case key=='c':
            if(!keys.c.pressed) {
                keys.c.pressed = true
                keyPressOnce('c')
            }
            break
        case key=='v':
            if(!keys.v.pressed) {
                keys.v.pressed = true
                keyPressOnce('v')
            }
            break
        case key==' ':
            if(!keys.space.pressed) {
                keys.space.pressed = true
                keyPressOnce('space')
            }
            break
        case key=='Backspace':
            if(!keys.back.pressed) {
                keys.back.pressed = true
                keyPressOnce('back')
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
        case key=='f':
            keys.f.pressed = false
            keyReleaseOnce('f')
            break
        case key=='z':
            keys.z.pressed = false
            keyReleaseOnce('z')
            break
        case key=='x':
            keys.x.pressed = false
            keyReleaseOnce('x')
            break
        case key=='c':
            keys.c.pressed = false
            keyReleaseOnce('c')
            break
        case key=='v':
            keys.v.pressed = false
            keyReleaseOnce('v')
            break
        case key==' ':
            keys.space.pressed = false
            keyReleaseOnce('space')
            break
        case key=='Backspace':
            keys.back.pressed = false
            keyReleaseOnce('back')
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