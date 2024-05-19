function keyPressOnceGame(key) {
    switch(key) {
        case 'up':
            player.vel.y = JUMP
            break
        case 'down':
            break
        case 'left':
            break
        case 'right':
            break
        case 'mouse':
            break
        case 'back':
            returnToMenu()
            break
    }
}

function keyReleaseOnceGame(key) {
    switch(key) {
        case 'up':
            break
        case 'down':
            break
        case 'left':
            break
        case 'right':
            break
        case 'mouse':
            break
        case 'back':
            break
    }
}

function GameLoop() {
    function renderBackground() {
        ctx.fillStyle = lib.createGradient(ctx,'#fdd','#ddf')
        ctx.fillRect(0,0,WIDTH,HEIGHT)
    }

    function renderBlocks() {
        blocks.forEach(b => b.render())
    }

    function renderPlayer() {
        player.render()
    }

    player.reset()
    if(keys.left.pressed) player.vel.x -= SPEED
    if(keys.right.pressed) player.vel.x += SPEED
    if(checkCollisionBorder('down',player.y,-player.h,player.vel.y)) {
        player.stop('y',level.h-player.h)
        player.stop('x',1)
    }
    if(checkCollisionBorder('left',player.x,0,player.vel.x))
        player.stop('x',0)
    if(checkCollisionBorder('right',player.x+player.w,level.w,player.vel.x))
        player.stop('x',level.w-player.w)
    blocks.forEach(b => {
        if(checkCollisionSolid('down',player.y,b.y+b.h,player.vel.y,player.x,player.x+player.w,b.x,b.x+b.w))
            player.stop('y',b.y+b.h)
    })
    blocks.filter(b => b.id>=0 && b.id<=5 || b.id==7).forEach(b => {
        if(checkCollisionSolid('up',player.y+player.h,b.y,player.vel.y,player.x,player.x+player.w,b.x,b.x+b.w))
            player.stop('y',b.y-player.h)
        if(checkCollisionSolid('left',player.x,b.x+b.w,player.vel.x,player.y,player.y+player.h,b.y,b.y+b.h))
            player.stop('x',b.x+b.w)
        if(checkCollisionSolid('right',player.x+player.w,b.x,player.vel.x,player.y,player.y+player.h,b.y,b.y+b.h))
            player.stop('x',b.x-player.w)
    })
    player.update()

    renderBackground()
    renderBlocks()
    renderPlayer()
}