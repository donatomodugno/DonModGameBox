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
        let scene = 0
        if(this.ducking) scene = 3
        else if(this.jumping) scene = 1
        else {
            scene = 0
            if(this.vel.x==0) this.frame = 0
            else if(this.vel.x==this.acc.x) selectFrame(1*this.frames[scene])
            else selectFrame(2*this.frames[scene])
        }
        this.frame%=this.frames[scene]
        ctx.drawImage(mediafiles.players['SMAS-SMB1-Mario'].sprite,BS*2*this.frame+selectDir(this.dir),selectScene(scene),BS,BS*2,...getLevelCoords(this.x,this.y),BS,-BS*2)
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

    die() {
        this.stop('y',level1.player.y)
        this.stop('x',level1.player.x)
        mediafiles.sounds['player-died'].audio.play()
        mediafiles.music['smb-overworld'].audio.currentTime = 0
        parseLevel() // DIRTY CODE!!
    }

    win() {
        this.stop('y',level1.player.y)
        this.stop('x',level1.player.x)
        mediafiles.music['smb-overworld'].audio.currentTime = 0
        parseLevel() // DIRTY CODE!!
    }

    jump() {
        if(!this.jumping) {
            this.vel.y = JUMP
            mediafiles.sounds['player-jump'].audio.currentTime = 0
            mediafiles.sounds['player-jump'].audio.play()
        }
    }

    duck() {
        this.ducking = true
        this.h = 1.4
    }
}

class Block {
    constructor(sprite,id,x,y,w,h,frames,collision_type) {
        this.sprite = sprite
        this.id = id
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.frames = frames
        this.frame = 0
        this.collision_type = collision_type
    }

    render() {
        if(tick%8==0) this.frame++
        this.frame%=this.frames
        ctx.drawImage(this.sprite,0,PNG_SIZE*this.h*this.frame,PNG_SIZE*this.w,PNG_SIZE*this.h,...getLevelCoords(this.x,this.y),BS*this.w,-BS*this.h)
    }
}

class BGO {
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

class NPC {
    constructor(sprite,id,x,y,w,h,xvel,yvel,frames,type) {
        this.sprite = sprite
        this.id = id
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.vel = {
            x:xvel,
            y:yvel,
        }
        this.frames = frames
        this.frame = 0
        this.type = type
        this.dead = false
        this.visible = true
    }

    render() {
        if(this.dead) {
            this.frame = 2
            if(this.visible)
                ctx.drawImage(this.sprite,0,PNG_SIZE*this.h*this.frame,PNG_SIZE*this.w,PNG_SIZE*this.h,...getLevelCoords(this.x,this.y),BS*this.w,-BS*this.h)
        }
        else {
            if(tick%8==0) this.frame++
            this.frame%=this.frames
            ctx.drawImage(this.sprite,0,PNG_SIZE*this.h*this.frame,PNG_SIZE*this.w,PNG_SIZE*this.h,...getLevelCoords(this.x,this.y),BS*this.w,-BS*this.h)
        }
    }

    update() {
        this.y += this.vel.y
        if(this.vel.y>-SPEED*6) this.vel.y += GRAVITY
        this.x += this.vel.x
    }

    stop(axis,pos) {
        if(axis=='x') {
            this.x = pos
            this.vel.x = 0
        }
        if(axis=='y') {
            this.y = pos
            this.vel.y = 0
        }
    }

    die() {
        mediafiles.sounds['player-stomp'].audio.currentTime = 0
        mediafiles.sounds['player-stomp'].audio.play()
        this.vel.x = 0
        this.dead = true
        setTimeout(() => this.visible = false,500)
    }
}

let player = false
let blocks = []
let bgos = []
let npcs = []

function parseLevel() {
    player = false
    blocks = []
    bgos = []
    npcs = []
    level.w = level1.width>=BPW ? level1.width : BPW
    level.h = level1.height>=BPH ? level1.height : BPH
    level.bg = level1.background
    player = new Player(level1.player.x,level1.player.y)
    level1.blocks.forEach(obj => {
        let block = mediafiles.blocks[obj.src]
        blocks.push(new Block(block.sprite,obj.src,obj.x-1,obj.y-1,block.w,block.h,block.frames,block.collision_type))
    })
    level1.bgos.forEach(obj => {
        let bgo = mediafiles.bgos[obj.src]
        bgos.push(new BGO(bgo.sprite,obj.src,obj.x-1,obj.y-1,bgo.w,bgo.h,bgo.frames))
    })
    level1.npcs.forEach(obj => {
        let npc = mediafiles.npcs[obj.src]
        npcs.push(new NPC(npc.sprite,obj.src,obj.x-1,obj.y-1,npc.w,npc.h,npc.xvel*SPEED,npc.yvel,npc.frames,npc.type))
    })
}

function returnToMenu() {
    if(confirm('Are you sure to return to menu?')) {
        scene = 'menu'
        player = false
        blocks = []
        mediafiles.music['smb-overworld'].audio.pause()
        mediafiles.music['smb-overworld'].audio.currentTime = 0
    }
}