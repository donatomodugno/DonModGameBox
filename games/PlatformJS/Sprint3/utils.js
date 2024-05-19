const canvas = document.getElementById('game')
canvas.width = WIDTH
canvas.height = HEIGHT
canvas.style.border = 'solid '+BORDER+'px'
canvas.style.borderRadius = BORDER_RADIUS+'px'
const h1 = document.createElement('h1')
h1.append(LABEL)
h1.style = 'text-align:center'
const p = document.createElement("p")
p.append('by '+AUTHOR+' '+DATE)
canvas.before(h1)
canvas.after(p)
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

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
    f: {
        pressed:false
    },
    space: {
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
    bg:0,
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
        this.acc = {
            x:0,
        }
        this.dir = 1
        this.jumping = true
        this.ducking = false
        this.frames = [3,1,2,1]
        this.frame = 0
    }

    render() {
        function selectDir(dir) {
            return 256*(1-dir)/2
        }
        function selectScene(scene) {
            return BS*2*scene
        }
        function selectFrame(slowness) {
            tick%slowness==0 && player.frame++
        }
        // ctx.fillStyle = 'red'
        // ctx.fillRect(...getLevelCoords(this.x,this.y),BS*this.w,-BS*this.h)
        let scene = 0
        if(this.ducking) scene = 3//ctx.drawImage(sprites.player,0+selectDir(this.dir),selectScene(3),BS,BS*2,...getLevelCoords(this.x,this.y),BS,-BS*2)
        else if(this.jumping) scene = 1//ctx.drawImage(sprites.player,0+selectDir(this.dir),selectScene(1),BS,BS*2,...getLevelCoords(this.x,this.y),BS,-BS*2)
        else {
            scene = 0//ctx.drawImage(sprites.player,BS*2*this.frame+selectDir(this.dir),selectScene(0),BS,BS*2,...getLevelCoords(this.x,this.y),BS,-BS*2)
            //
            // if(this.acc.x!=0) {
            //     if(Math.abs(player.vel.x)<Math.abs(player.acc.x))
            //         tick%6==0 && this.frame++
            //     else tick%3==0 && this.frame++
            // }
            // else if(this.acc.x==0 && this.vel.x!=0)
            //     tick%6==0 && this.frame++
            // else this.frame = 0
            //
            // if(this.vel.x==0) this.frame = 0
            // else {
            //     if(this.acc.x==0) tick%6==0 && this.frame++
            //     else {
            //         if(Math.abs(player.vel.x)<Math.abs(player.acc.x)) tick%6==0 && this.frame++
            //         else tick%3==0 && this.frame++
            //     }
            // }
            //
            if(this.vel.x==0) this.frame = 0
            else if(this.vel.x==this.acc.x) selectFrame(1*this.frames[scene])//tick%3==0 && this.frame++
            else selectFrame(2*this.frames[scene])//tick%6==0 && this.frame++
            //
        }
        this.frame%=this.frames[scene]
        ctx.drawImage(sprites.player,BS*2*this.frame+selectDir(this.dir),selectScene(scene),BS,BS*2,...getLevelCoords(this.x,this.y),BS,-BS*2)
    }

    reset() {
        this.acc.x = 0
        this.h = 1.8
        this.jumping = true
        this.ducking = false
    }

    update() {
        this.y += this.vel.y
        if(this.vel.y>-SPEED*6) this.vel.y += GRAVITY
        this.x += this.vel.x
        if(!this.ducking) {
            if(this.acc.x>0 && this.vel.x<this.acc.x) this.vel.x += SPEED_STEP
            if(this.acc.x<0 && this.vel.x>this.acc.x) this.vel.x -= SPEED_STEP
        }
        if((this.acc.x==0 || this.ducking) && this.vel.x>0) this.vel.x -= SPEED_STEP
        if((this.acc.x==0 || this.ducking) && this.vel.x<0) this.vel.x += SPEED_STEP
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
            this.jumping = false
        }
    }

    jump() {
        if(!this.jumping) {
            player.vel.y = JUMP
            sounds.find(s => s.id=='player-jump').audio.currentTime = 0
            sounds.find(s => s.id=='player-jump').audio.play()
        }
    }

    duck() {
        this.ducking = true
        this.h = 1.4
    }
}

class Block {
    constructor(sprite,id,x,y,w,h,frames) {
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
    level.bg = level1.background
    player = new Player(level1.player.x,level1.player.y)
    level1.blocks.forEach(b => {
        let sprite = mediafiles.find(m => m.id==b.src)
        blocks.push(new Block(sprites.blocks[sprite.id_block],sprite.id_block,b.x-1,b.y-1,sprite.w,sprite.h,sprite.frames))
    })
}

function returnToMenu() {
    if(confirm('Are you sure to return to menu?')) {
        scene = 'menu'
        player = false
        blocks = []
    }
}