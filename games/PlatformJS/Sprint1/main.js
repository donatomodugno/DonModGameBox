const ctx = canvas.getContext('2d')

// GLOBAL VARIABLES

const camera = {
    x:0,
    y:0,
}

const level = {
    w:12,
    h:12,
}

// GENERIC FUNCTIONS

function getCoords(x,y) {
    let coords = []
    coords.push(BLOCKSIZE*x)
    coords.push(HEIGHT-(BLOCKSIZE*(y+1)))
    return coords
}

function getCameraCoords(x,y) {
    return [x-camera.x,y-camera.y]
}

function checkCollision(dir,a,b,diff,a1,a2,b1,b2) {
    function checkCollisionInner() {
        if((dir=='down' || dir=='right') && (a<=b && a+diff>b))
            return true
        if((dir=='up' || dir=='left') && (a>=b && a+diff<b))
            return true
        return false
    }

    switch(arguments.length) {
        case 4:
            return checkCollisionInner()
        case 8:
            if(a1<b2 && a2>b1)
                return checkCollisionInner()
            return false
    }
}

function createGradient(top='#fdd',bottom='#ddf') {
    let gradient = ctx.createLinearGradient(0,0,0,HEIGHT)
    gradient.addColorStop(0,top)
    gradient.addColorStop(1,bottom)
    return gradient
}

// VARIABLES

class Player {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.w = BLOCKSIZE
        this.h = BLOCKSIZE*1.8
        this.vel = {
            x:0,
            y:0,
        },
        this.jumping = true
    }

    render() {
        ctx.fillStyle = 'red'
        ctx.fillRect(...getCameraCoords(this.x,this.y),this.w,this.h)
    }

    reset() {
        this.vel.x = 0
        this.jumping = true
    }

    update() {
        this.y += this.vel.y
        this.vel.y += GRAVITY
        this.x += this.vel.x
        if(this.x<WIDTH/2) camera.x = 0
        else if(this.x>level.w*BLOCKSIZE-WIDTH/2) camera.x = level.w*BLOCKSIZE-WIDTH
        else camera.x = this.x-WIDTH/2
        if((HEIGHT-(this.y+this.h))<HEIGHT/2) camera.y = 0
        else if((HEIGHT-(this.y+this.h))>level.h*BLOCKSIZE-HEIGHT/2) camera.y = HEIGHT-level.h*BLOCKSIZE
        else camera.y = (this.y+this.h)-HEIGHT/2
    }

    stop(dir,pos) {
        if(dir=='x') {
            this.x = pos
            this.vel.x = 0
        }
        if(dir=='y') {
            this.y = pos
            this.vel.y = 0
            this.jumping = false
        }
    }
}

class Block {
    constructor(id,x,y) {
        this.id = id
        this.x = x
        this.y = y
        this.w = BLOCKSIZE
        this.h = BLOCKSIZE
    }

    render() {
        switch(this.id) {
            case 1:
                ctx.fillStyle = '#a50'
                break
            case 2:
                ctx.fillStyle = '#5a5'
                break
        }
        ctx.fillRect(...getCameraCoords(this.x,this.y),this.w,this.h)
    }
}

let player
let blocks = []
let npcs = []

// FUNCTIONS

function parseLevel() {
    level.w = level1.width>=12 ? level1.width : 12
    level.h = level1.height>=12 ? level1.height : 12
    player = new Player(...getCoords(level1.player.x,level1.player.y))
    level1.blocks.forEach(b => {
        blocks.push(new Block(b.id,...getCoords(b.x,b.y)))
    })
}

// GAME CONTROLS

function keyPressOnce(key) {
    switch(key) {
        case 'up':
            if(!player.jumping) {
                player.jumping = true
                player.vel.y = -JUMP
            }
            break
        case 'down':
            break
        case 'left':
            break
        case 'right':
            break
        case 'mouse':
            break
    }
}

function keyReleaseOnce(key) {
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
    }
}

function GameLoop() {
    
    function renderGrid() {
        ctx.globalAlpha = 0.2
        ctx.fillStyle = 'white'
        for(let i=0;i<SIZE+1;i++) ctx.fillRect(0,i*BLOCKSIZE-camera.y%BLOCKSIZE,WIDTH,1)
        for(let j=0;j<SIZE+1;j++) ctx.fillRect(j*BLOCKSIZE-camera.x%BLOCKSIZE,0,1,HEIGHT)
        ctx.globalAlpha = 1
    }
    
    function renderBackground() {
        ctx.fillStyle = createGradient('#b9d','#fc8')
        ctx.fillRect(0,0,WIDTH,HEIGHT)
    }
    
    function renderPlayer() {
        player.render()
        if(mouse.pressed) {
            ctx.fillStyle = 'darkred'
            ctx.fillRect(mouse.x,mouse.y,20,20)
        }
    }
    
    function renderBlocks() {
        blocks.forEach(b => b.render())
    }

    function render() {
        /* z-index: -2 */renderBackground()
        /* z-index: -1 */renderBlocks()
        /* z-index:  0 */renderGrid()
        /* z-index: +1 */renderPlayer()
    }

    player.reset()
    if(keys.left.pressed) player.vel.x -= SPEED
    if(keys.right.pressed) player.vel.x += SPEED
    if(checkCollision('left',player.x,0,player.vel.x))
        player.stop('x',0)
    if(checkCollision('right',player.x+player.w,level.w*BLOCKSIZE,player.vel.x))
        player.stop('x',level.w*BLOCKSIZE-player.w)
    blocks.forEach(b => {
        if(checkCollision('down',player.y+player.h,b.y,player.vel.y,player.x,player.x+player.w,b.x,b.x+b.w))
            player.stop('y',b.y-player.h)
    })
    blocks.filter(b => b.id==1).forEach(b => {
        if(checkCollision('up',player.y,b.y+b.w,player.vel.y,player.x,player.x+player.w,b.x,b.x+b.w))
            player.stop('y',b.y+b.h)
        if(checkCollision('left',player.x,b.x+b.w,player.vel.x,player.y,player.y+player.h,b.y,b.y+b.h))
            player.stop('x',b.x+b.w)
        if(checkCollision('right',player.x+player.w,b.x,player.vel.x,player.y,player.y+player.h,b.y,b.y+b.h))
            player.stop('x',b.x-player.w)
    })
    player.update()

    render()
}

function animate() {
    ctx.clearRect(0,0,WIDTH,HEIGHT)
    GameLoop()
    requestAnimationFrame(animate)//setTimeout(animate,1000/FPS)//
}

function main() {
    parseLevel()
    requestAnimationFrame(animate)//animate()//
}