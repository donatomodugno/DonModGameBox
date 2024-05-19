const LABEL = "PlatformJS (sprint 2)"
const DEVICE = navigator.userAgent.match(/mobile/i) ? 'mobile' : 'desktop'
const BORDER = 10
const BORDER_RADIUS = BORDER
const SIZES = [[40,12,12],[32,15,15],[32,20,16]]
const SIZE_CONFIG = 2
const BS = SIZES[SIZE_CONFIG][0] /* BLOCK_SIZE */
// const BPS = SIZES[SIZE_CONFIG][1] /* BLOCK_PER_SCREEN */ //todel
const BPW = SIZES[SIZE_CONFIG][1] /* BLOCK_PER_WIDTH */
const BPH = SIZES[SIZE_CONFIG][2] /* BLOCK_PER_HEIGHT */
const WIDTH = BS*BPW
const HEIGHT = BS*BPH
const TICKS = 64
const SPEED = 4/BS
const GRAVITY = -1/BS
const JUMP = 18/BS

const ASSETS_PATH = './assets/'
const PNG_SIZE = 32
const spritefiles = [
    {src:"blocks/SMAS-SMB1-block1",frames:1},
    {src:"blocks/SMAS-SMB1-ground1",frames:1},
    {src:"blocks/SMAS-SMB1-ground2",frames:1},
    {src:"blocks/SMAS-SMB1-ground3",frames:1},
    {src:"blocks/SMAS-SMB1-pipe1",frames:1},
    {src:"blocks/SMAS-SMB1-pipe2",frames:1},
    {src:"blocks/SMAS-SMB1-bridge1",frames:1},
    {src:"blocks/SMAS-SMB1-question1",frames:4},
]
const sprites = []
spritefiles.forEach((file,i) => {
    sprites.push([])
    sprites[i][0] = new Image()
    sprites[i][0].src = ASSETS_PATH+file.src+".png"
    sprites[i][1] = file.frames
})

const canvas = document.getElementById('game')
canvas.width = WIDTH
canvas.height = HEIGHT
canvas.style.border = 'solid '+BORDER+'px'
canvas.style.borderRadius = BORDER_RADIUS+'px'
const p = document.createElement("p")
p.append(LABEL)
canvas.after(p)
const ctx = canvas.getContext('2d')

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
    },
    g: {
        pressed:false
    },
    n: {
        pressed:false
    },
    back: {
        pressed:false
    },
}

const mouse = {
    x:0,
    y:0,
    pressed:false
}

let scene = 'menu'
let tick = 0

const camera = {
    x:0,
    y:0,
}

const level = {
    w:12,
    h:12,
}

function getLevelCoords(x,y) {
    return [...lib.getCoords(...lib.getCameraCoords(x,lib.invertAxis(y,BPH),camera),BS)]
}

class Player {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.w = 1
        this.h = 1.8
        this.vel = {
            x:0,
            y:0,
        }
        this.jumping = true
    }

    render() {
        ctx.fillStyle = 'red'
        ctx.fillRect(...getLevelCoords(this.x,this.y),BS*this.w,-BS*this.h)
    }

    reset() {
        this.vel.x = 0
    }

    update() {
        this.y += this.vel.y
        this.vel.y += GRAVITY
        this.x += this.vel.x
        if(this.x<BPW/2) camera.x = 0
        else if(this.x>level.w-BPW/2) camera.x = level.w-BPW
        else camera.x = this.x-BPW/2
        if(this.y<BPH/2) camera.y = 0
        else if(this.y>level.h-BPH/2) camera.y = level.h-BPH
        else camera.y = this.y-BPH/2
    }

    stop(axis,pos) {
        if(axis=='x') {
            this.x = pos
            this.vel.x = 0
        }
        if(axis=='y') {
            this.y = pos
            this.vel.y = 0
            // this.jumping = false
        }
    }
}

class Block {
    constructor(sprite,id,x,y,w,h,frames=1) {
        this.sprite = sprite
        this.id = id
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.frames = frames
        this.frame = 0
    }

    render() {
        // switch(this.id) {
        //     case 1:
        //         ctx.fillStyle = 'blue'
        //         break
        //     case 2:
        //         ctx.fillStyle = '#5a5'
        //         break
        // }
        // ctx.fillRect(...getLevelCoords(this.x,this.y),BS*this.w,-BS*this.h)
        if(tick%8==0) this.frame++
        this.frame%=this.frames
        ctx.drawImage(this.sprite,0,PNG_SIZE*this.h*this.frame,PNG_SIZE*this.w,PNG_SIZE*this.h,...getLevelCoords(this.x,this.y),BS*this.w,-BS*this.h)
    }
}

let player = false
let blocks = []

function parseLevel() {
    level.w = level1.width>=BPW ? level1.width : BPW
    level.h = level1.height>=BPH ? level1.height : BPH
    player = new Player(level1.player.x,level1.player.y)
    level1.blocks.forEach(b => {
        blocks.push(new Block(sprites[b.id][0],b.id,b.x-1,b.y-1,b.w,b.h,sprites[b.id][1]))
    })
}

function returnToMenu() {
    if(confirm('Are you sure to return to menu?')) {
        scene = 'menu'
        player = false
        blocks = []
    }
}