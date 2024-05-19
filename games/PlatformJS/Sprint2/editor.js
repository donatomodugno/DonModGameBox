let grid = true
let numbers = false

function keyPressOnceEditor(key) {
    switch(key) {
        case 'up':
            break
        case 'down':
            break
        case 'left':
            break
        case 'right':
            break
        case 'g':
            grid = !grid
            if(!grid) numbers = false
            break
        case 'n':
            if(grid) numbers = !numbers
            break
        case 'mouse':
            break
        case 'back':
            returnToMenu()
            break
    }
}

function keyReleaseOnceEditor(key) {
    switch(key) {
        case 'up':
            break
        case 'down':
            break
        case 'left':
            break
        case 'right':
            break
        case 'g':
            break
        case 'n':
            break
        case 'mouse':
            break
        case 'back':
            break
    }
}

function EditorLoop() {
    function renderBackground() {
        ctx.fillStyle = 'lightgrey'
        ctx.fillRect(0,0,WIDTH,HEIGHT)
    }

    function renderGrid() {
        ctx.globalAlpha = 0.2
        ctx.fillStyle = 'white'
        for(let i=0;i<BPW+1;i++) ctx.fillRect(0,i*BS-camera.y*BS%BS,WIDTH,1)
        for(let j=0;j<BPW+1;j++) ctx.fillRect(j*BS-camera.x*BS%BS,0,1,HEIGHT)
        ctx.globalAlpha = 1
    }

    function renderCellsNumbers() {
        ctx.fillStyle = 'black'
        ctx.font = '10px Arial'
        for(let i=0;i<level.h;i++)
            for(let j=0;j<level.w;j++)
                ctx.fillText((j+1)+','+(i+1),(j-camera.x)*BS,(BPH-i+camera.y)*BS)
    }

    function renderBlocks() {
        blocks.forEach(b => b.render())
    }

    function renderPlayer() {
        player.render()
    }

    if(keys.up.pressed && camera.y<level.h-BPH) camera.y -= -SPEED*2
    if(keys.down.pressed && camera.y>0) camera.y += -SPEED*2
    if(keys.left.pressed && camera.x>0) camera.x -= SPEED*2
    if(keys.right.pressed && camera.x<level.w-BPW) camera.x += SPEED*2

    renderBackground()
    renderBlocks()
    renderPlayer()
    grid && renderGrid()
    numbers && renderCellsNumbers()
}