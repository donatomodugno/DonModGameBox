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
        // let bg = sprites.bgs[level.bg]
        let bg = Object.values(mediafiles.backgrounds).filter(bg => bg.id_comp == level.bg)
        ctx.drawImage(bg[2].sprite,0,0,64,239,0,0,WIDTH,HEIGHT)
        ctx.drawImage(bg[1].sprite,0,0,1792,216,...getBackgroundCoord(0,4,80,0),1792*2,216*2)//2*bg[2].naturalWidth,2*bg[2].naturalHeight)
        ctx.drawImage(bg[0].sprite,0,0,1792,216,...getBackgroundCoord(0,2,80,4),1792*2,216*2)
    }

    function renderBlocks() {
        blocks.forEach(b => b.render())
    }

    function renderBGOs() {
        bgos.forEach(b => b.render())
    }

    function renderNPCs() {
        npcs.forEach(n => n.render())
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
        player.die()
    }
    if(lib.checkCollisionBorder('left',player.x,0,player.vel.x))
        player.stop('x',0)
    if(lib.checkCollisionBorder('right',player.x+player.w,level.w,player.vel.x))
        player.stop('x',level.w-player.w)
    blocks.forEach(b => {
        if(lib.checkCollisionSolid('down',player.y,b.y+b.h,player.vel.y,player.x,player.x+player.w,b.x,b.x+b.w))
            player.stop('y',b.y+b.h)
        npcs.forEach(n => {
            if(lib.checkCollisionSolid('down',n.y,b.y+b.h,n.vel.y,n.x,n.x+n.w,b.x,b.x+b.w))
                n.stop('y',b.y+b.h)
        })
    })
    blocks.filter(b => b.collision_type == 0).forEach(b => {
        if(lib.checkCollisionSolid('up',player.y+player.h,b.y,player.vel.y,player.x,player.x+player.w,b.x,b.x+b.w)) {
            player.stop('y',b.y-player.h)
            if(b.id=='SMAS-SMB1-question1') {
                let block = mediafiles.blocks['SMAS-SMB1-question2']
                blocks[86] = new Block(block.sprite,block.src,b.x,b.y,block.w,block.h,block.frames,block.collision_type)
                mediafiles.sounds['coin'].audio.play()
                // DIRTY CODE
            }
            else mediafiles.sounds['block-hit'].audio.play()
        }
        if(lib.checkCollisionSolid('left',player.x,b.x+b.w,player.vel.x,player.y,player.y+player.h,b.y,b.y+b.h))
            player.stop('x',b.x+b.w)
        if(lib.checkCollisionSolid('right',player.x+player.w,b.x,player.vel.x,player.y,player.y+player.h,b.y,b.y+b.h))
            player.stop('x',b.x-player.w)
        npcs.forEach(n => {
            if(lib.checkCollisionSolid('left',n.x,b.x+b.w,n.vel.x,n.y,n.y+n.h,b.y,b.y+b.h))
                n.vel.x = -n.vel.x
            if(lib.checkCollisionSolid('right',n.x+n.w,b.x,n.vel.x,n.y,n.y+n.h,b.y,b.y+b.h))
                n.vel.x = -n.vel.x
        })
    })
    npcs.filter(n => n.type=='goomba' && !n.dead).forEach(n => {
        if(lib.checkCollisionSolid('down',player.y,n.y+n.h,player.vel.y,player.x,player.x+player.w,n.x,n.x+n.w)) {
            player.vel.y = JUMP*3/4
            n.die()
        }
        if(lib.checkCollisionSolid('left',player.x,n.x+n.w,player.vel.x,player.y,player.y+player.h,n.y,n.y+n.h))
            player.die()
        if(lib.checkCollisionSolid('right',player.x+player.w,n.x,player.vel.x,player.y,player.y+player.h,n.y,n.y+n.h))
            player.die()
    })
    npcs.filter(n => n.type=='peach').forEach(n => {
        if(lib.checkIntersection(player.x,player.x+player.w,n.x,n.x+n.w,player.y,player.y+player.h,n.y,n.y+n.h)) {
            alert('Thank you Mario, but the princess is in another castle!   <3')
            keys.left.pressed = false
            keys.right.pressed = false
            player.win()
        }
    })
    npcs.forEach(n => n.update())
    player.update()

    renderBackground()
    renderBlocks()
    renderBGOs()
    renderNPCs()
    renderPlayer()
}