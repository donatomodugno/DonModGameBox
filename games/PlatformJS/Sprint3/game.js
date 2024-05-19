function keyPressOnceGame(key) {
    switch(key) {
        case 'up':
            player.jump()
            break
        case 'down':
            break
        case 'left':
            break
        case 'right':
            break
        case 'f':
            canvas.requestFullscreen()
            document.exitFullscreen()
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
        case 'f':
            break
        case 'mouse':
            break
        case 'back':
            break
    }
}

function GameLoop() {
    function renderBackground() {
        function getBackgroundCoord(xoff,xslowness,yoff,yslowness) {
            return [xoff-(xslowness>0 && camera.x*BS/xslowness),yoff+(yslowness>0 && camera.y*BS/yslowness)]
        }
        // function renderBackgroundInfinite(img) {
        //     ctx.drawImage(img,0,0,1792,216,...getBackgroundCoord(0,2,80,4),1792*2,216*2)
        //     ctx.drawImage(img,0,0,1792,216,...getBackgroundCoord(0,2,80,4),1792*2,216*2)
        // }
        let bg = sprites.bgs[level.bg]
        ctx.drawImage(bg[3],0,0,64,239,0,0,WIDTH,HEIGHT)
        ctx.drawImage(bg[2],0,0,1792,216,...getBackgroundCoord(0,4,80,0),1792*2,216*2)//2*bg[2].naturalWidth,2*bg[2].naturalHeight)
        ctx.drawImage(bg[1],0,0,1792,216,...getBackgroundCoord(0,2,80,4),1792*2,216*2)
    }

    function renderBlocks() {
        blocks.forEach(b => b.render())
    }

    function renderPlayer() {
        player.render()
    }

    player.reset()
    if(keys.down.pressed) player.duck()
    if(keys.left.pressed) player.acc.x -= SPEED
    if(keys.right.pressed) player.acc.x += SPEED
    if(player.acc.x>0) player.dir = 1
    if(player.acc.x<0) player.dir = -1
    if(!keys.up.pressed && player.jumping && player.vel.y>0) player.vel.y -= 1/BS
    if(lib.checkCollisionBorder('down',player.y,-player.h,player.vel.y)) {
        player.stop('y',level.h-player.h)
        player.stop('x',1)
        sounds.find(s => s.id=='player-died').audio.play()
    }
    if(lib.checkCollisionBorder('left',player.x,0,player.vel.x))
        player.stop('x',0)
    if(lib.checkCollisionBorder('right',player.x+player.w,level.w,player.vel.x))
        player.stop('x',level.w-player.w)
    blocks.forEach(b => {
        if(lib.checkCollisionSolid('down',player.y,b.y+b.h,player.vel.y,player.x,player.x+player.w,b.x,b.x+b.w))
            player.stop('y',b.y+b.h)
    })
    blocks.filter(b => [0,1,2,3,4,5,7].includes(b.id)).forEach(b => {
        if(lib.checkCollisionSolid('up',player.y+player.h,b.y,player.vel.y,player.x,player.x+player.w,b.x,b.x+b.w)) {
            player.stop('y',b.y-player.h)
            sounds.find(s => s.id=='block-hit').audio.play()
        }
        if(lib.checkCollisionSolid('left',player.x,b.x+b.w,player.vel.x,player.y,player.y+player.h,b.y,b.y+b.h))
            player.stop('x',b.x+b.w)
        if(lib.checkCollisionSolid('right',player.x+player.w,b.x,player.vel.x,player.y,player.y+player.h,b.y,b.y+b.h))
            player.stop('x',b.x-player.w)
    })
    player.update()

    renderBackground()
    renderBlocks()
    renderPlayer()
}