const GAME_PLAYER_SIZE = 12
const GAME_PROJ_SIZE = 6
const GAME_NPC_NUM = 7
const GAME_SPEED = 2
const GAME_TICKS = 1024/GAME_SPEED
const GAME_TICKS_SHOOT = GAME_TICKS/64
const GAME_TICKS_NPC_SHOOT = GAME_TICKS/8
const GAME_TICKS_NPC_SPANW = GAME_TICKS/2
const GAME_SPEED_MOVE = 2*GAME_SPEED
const GAME_SPEED_NPC = 1.5*GAME_SPEED
const GAME_SPEED_ROT = (Math.PI*2/180)*GAME_SPEED
const GAME_SPEED_SHOOT = 4*GAME_SPEED
const GAME_SPEED_NPC_SHOOT = 2*GAME_SPEED
const GAME_NPC_SPAWN_PADDING = 40

class Player {
    constructor(x,y,dir) {
        this.x = x
        this.y = y
        this.dir = dir
    }
    render() {
        renderCircle('blue',this.x,this.y,GAME_PLAYER_SIZE)
    }
    update() {
        if(keys.ArrowUp.pressed && this.y>0) this.y -= GAME_SPEED_MOVE
        if(keys.ArrowDown.pressed && this.y<HEIGHT) this.y += GAME_SPEED_MOVE
        if(keys.ArrowLeft.pressed && this.x>0) this.x -= GAME_SPEED_MOVE
        if(keys.ArrowRight.pressed && this.x<WIDTH) this.x += GAME_SPEED_MOVE
        if(keys.a.pressed) this.dir -= GAME_SPEED_ROT
        if(keys.s.pressed) this.dir += GAME_SPEED_ROT
    }
}
class NPC {
    constructor(x,y,dir) {
        this.x = x
        this.y = y
        this.dir = dir
        this.dead = false
    }
    render() {
        renderCircle('#f6a',this.x,this.y,GAME_PLAYER_SIZE)
    }
    update() {
        this.x += Math.cos(this.dir)*GAME_SPEED_NPC
        this.y += Math.sin(this.dir)*GAME_SPEED_NPC
        this.dir = Math.atan2(player.y-this.y,player.x-this.x)
    }
}
class Projectile {
    constructor(x,y,dir,evil=false) {
        this.x = x
        this.y = y
        this.dir = dir
        this.evil = evil
        this.dead = false
    }
    render() {
        if(this.evil) renderRect('magenta',this.x,this.y,GAME_PROJ_SIZE*2,GAME_PROJ_SIZE*2)
        else renderCircle('white',this.x,this.y,GAME_PROJ_SIZE)
    }
    update() {
        const speed = this.evil ? GAME_SPEED_NPC_SHOOT : GAME_SPEED_SHOOT
        this.x += Math.cos(this.dir)*speed
        this.y += Math.sin(this.dir)*speed
    }
}
let player
let npc = []
let projectiles = []
let tick

function sceneInitGame() {
    player = new Player(WIDTH/2,HEIGHT/2,0)
    projectiles = []
    npc = []
    npc_spawn = {x:0,y:0}
    tick = 0
}

function keyPressOnceGame(key) {
    if(key=='m' || key=='Escape') sceneChange('menu')
}
function keyReleaseOnceGame(key) {
    return
}

function animateGame() {
    function render() {
        function renderBG() {
            renderRect('black',0,0,WIDTH,HEIGHT)
        }
        renderBG()
        projectiles.forEach(p => p.render())
        npc.forEach(e => e.render())
        player.render()
    }
    function update() {
        player.update()
        projectiles.forEach(p => p.update())
        npc.forEach(e => e.update())
        projectiles.forEach(p => {
            if(p.evil) {
                if(distance(p.x,player.x,p.y,player.y)<=GAME_PLAYER_SIZE) {
                    const res = messageBox('You lose!\nPress OK to retry, Cancel to return to menu','confirm')
                    if(res) sceneInitGame()
                    else sceneChange('menu')
                }
            } else {
                npc.forEach(e => {
                    if(distance(p.x,e.x,p.y,e.y)<=GAME_PLAYER_SIZE) {
                        p.dead = true
                        e.dead = true
                    }
                })
            }
        })
        if(tick%GAME_TICKS_SHOOT==0) {
            projectiles.push(new Projectile(player.x,player.y,player.dir))
            projectiles = projectiles.filter(p => p.x>=0 && p.x<=WIDTH && p.y>=0 && p.y<=HEIGHT)
        }
        if(tick%GAME_TICKS_NPC_SHOOT==0) {
            npc.forEach(e => {
                projectiles.push(new Projectile(e.x,e.y,e.dir,true))
            })
        }
        if(tick%GAME_TICKS_NPC_SPANW==0) {
            if(npc.length<GAME_NPC_NUM) {
                const corner = Math.floor(Math.random()*4)
                for(let i=0;i<GAME_NPC_NUM;i++) {
                    if(corner==0) npc.push(new NPC(WIDTH,0+i*GAME_NPC_SPAWN_PADDING,0))
                    if(corner==1) npc.push(new NPC(WIDTH-i*GAME_NPC_SPAWN_PADDING,HEIGHT,0))
                    if(corner==2) npc.push(new NPC(0,HEIGHT-i*GAME_NPC_SPAWN_PADDING,0))
                    if(corner==3) npc.push(new NPC(0+i*GAME_NPC_SPAWN_PADDING,0,0))
                }
            }
        }
        tick++
        tick %= GAME_TICKS
        npc = npc.filter(e => !e.dead)
        projectiles = projectiles.filter(p => !p.dead)
    }
    render()
    update()
}