// --- RaycastJS ---
// Donato Modugno 27/01/2024

// 1. Funzioni globali

function distance(ax,ay,bx,by) {
    return Math.sqrt((ax-bx)**2+(ay-by)**2)
}

function toRad(deg) {
    return deg*Math.PI/180
}

function toDeg(rad) {
    return rad/Math.PI*180
}

// 2. Costanti globali

const [W,H] = [960,540]
const PLAYER_SPEED_ROT = 0.4
const PLAYER_SPEED_MOVE = 0.6
const CELL_SIZE = 32
const FOV = toRad(60)
const GRAIN = 1
const COLORS = {
    ceiling:'',
    wall:'',
    floor:'',
    rays:'',
}
const map = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
]
const keys = {
    w:{pressed:false},
    a:{pressed:false},
    s:{pressed:false},
    d:{pressed:false},
    ArrowLeft:{pressed:false},
    ArrowRight:{pressed:false},
    l:{pressed:false},
}

// 3. Funzioni di disegno

const canvas = document.getElementById('game')
canvas.width = W
canvas.height = H
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

function renderClear() {
    ctx.clearRect(0,0,W,H)
}

function renderRect(x,y,w,h,color) {
    ctx.fillStyle = color
    ctx.fillRect(x,y,w,h)
}

function renderCircle(x,y,r,color) {
    ctx.beginPath()
    ctx.arc(x,y,r,0,2*Math.PI)
    ctx.fillStyle = color
    ctx.fill()
}

function renderText(text,x,y,color,size,centered=false,maxw=undefined,font='sans-serif') {
    ctx.font = size+'px '+font
    centered ? ctx.textAlign = 'center' : ctx.textAlign = 'left'
    ctx.fillStyle = color
    ctx.fillText(text,x,y+size,maxw)
}

function renderLine(ax,ay,bx,by,color) {
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(ax,ay)
    ctx.lineTo(bx,by)
    ctx.closePath()
    ctx.stroke()
}

// 4. Main

class Player {
    constructor(x,y,dir) {
        this.x = x*CELL_SIZE
        this.y = y*CELL_SIZE
        this.z = 1
        this.dir = dir
    }
    render() {
        renderCircle(this.x,this.y,5,'red')
        renderLine(
            this.x,
            this.y,
            this.x+Math.cos(this.dir)*20,
            this.y+Math.sin(this.dir)*20,
            'red'
        )
    }
    update() {
        function checkCollision(x,y) {
            let res = true
            if(y<0 || y>map.length*CELL_SIZE) res = false
            if(x<0 || x>map.length[0]*CELL_SIZE) res = false
            map.forEach((row,i) => row.forEach((cell,j) => {
                if(cell==1)
                    if(y>i*CELL_SIZE && y<(i+1)*CELL_SIZE)
                        if(x>j*CELL_SIZE && x<(j+1)*CELL_SIZE)
                            res = false
            }))
            return res
        }
        
        if(keys.ArrowLeft.pressed) {
            this.dir -= PLAYER_SPEED_ROT*4*(Math.PI/180)
            this.dir %= 2*Math.PI
            // this.dir = (this.dir+3*Math.PI)%(2*Math.PI)-Math.PI
        }
        if(keys.ArrowRight.pressed) {
            this.dir += PLAYER_SPEED_ROT*4*(Math.PI/180)
            this.dir %= 2*Math.PI
            // this.dir = (this.dir+Math.PI)%(2*Math.PI)-Math.PI
        }
        if(keys.w.pressed) {
            const x_incr = this.x+PLAYER_SPEED_MOVE*Math.cos(this.dir)
            const y_incr = this.y+PLAYER_SPEED_MOVE*Math.sin(this.dir)
            if(checkCollision(x_incr,this.y)) this.x = x_incr
            if(checkCollision(this.x,y_incr)) this.y = y_incr
        }
        if(keys.s.pressed) {
            const x_incr = this.x-PLAYER_SPEED_MOVE*Math.cos(this.dir)
            const y_incr = this.y-PLAYER_SPEED_MOVE*Math.sin(this.dir)
            if(checkCollision(x_incr,this.y)) this.x = x_incr
            if(checkCollision(this.x,y_incr)) this.y = y_incr
        }
        if(keys.a.pressed) {
            const x_incr = this.x+PLAYER_SPEED_MOVE*Math.cos(this.dir-Math.PI/2)
            const y_incr = this.y+PLAYER_SPEED_MOVE*Math.sin(this.dir-Math.PI/2)
            if(checkCollision(x_incr,this.y)) this.x = x_incr
            if(checkCollision(this.x,y_incr)) this.y = y_incr
        }
        if(keys.d.pressed) {
            const x_incr = this.x+PLAYER_SPEED_MOVE*Math.cos(this.dir+Math.PI/2)
            const y_incr = this.y+PLAYER_SPEED_MOVE*Math.sin(this.dir+Math.PI/2)
            if(checkCollision(x_incr,this.y)) this.x = x_incr
            if(checkCollision(this.x,y_incr)) this.y = y_incr
        }
    }
}

let player

function getRays() {
    function outOfMapBounds(x,y) {
        return y<0 || y>=map.length || x<0 || x>=map[0].length
    }
    function getHCollision(angle) {
        const up = Math.abs(Math.floor(angle/Math.PI)%2)//angle<0//
        const y_start = up
            ? Math.floor(player.y/CELL_SIZE)*CELL_SIZE
            : Math.floor(player.y/CELL_SIZE)*CELL_SIZE+CELL_SIZE
        const x_start = player.x+(y_start-player.y)/Math.tan(angle)
        const y_incr = CELL_SIZE*(up ? -1 : 1)
        const x_incr = y_incr/Math.tan(angle)
        let wall = false
        let out = false
        let x_next = x_start
        let y_next = y_start
        while(!wall && !out) {
            const x_cell = Math.floor(x_next/CELL_SIZE)
            const y_cell = Math.floor(y_next/CELL_SIZE)-(up && 1)
            if(outOfMapBounds(x_cell,y_cell)) out = true
            else {
                wall = map[y_cell][x_cell]
                if(!wall) {
                    x_next += x_incr
                    y_next += y_incr
                }
            }
        }
        return {
            dir:angle,
            dist:distance(player.x,player.y,x_next,y_next),
            vertical:false,
        }
    }
    function getVCollision(angle) {
        const right = Math.abs(Math.floor((angle-Math.PI/2)/Math.PI)%2)//Math.abs(angle)<Math.PI/2//
        const x_start = right
            ? Math.floor(player.x/CELL_SIZE)*CELL_SIZE+CELL_SIZE
            : Math.floor(player.x/CELL_SIZE)*CELL_SIZE
        const y_start = player.y+(x_start-player.x)*Math.tan(angle)
        const x_incr = CELL_SIZE*(right ? 1 : -1)
        const y_incr = x_incr*Math.tan(angle)
        let wall = false
        let out = false
        let x_next = x_start
        let y_next = y_start
        while(!wall && !out) {
            const x_cell = Math.floor(x_next/CELL_SIZE)-(!right && 1)
            const y_cell = Math.floor(y_next/CELL_SIZE)
            if(outOfMapBounds(x_cell,y_cell)) out = true
            else {
                wall = map[y_cell][x_cell]
                if(!wall) {
                    x_next += x_incr
                    y_next += y_incr
                }
            }
        }
        return {
            dir:angle,
            dist:distance(player.x,player.y,x_next,y_next),
            vertical:true,
        }
    }
    function castRay(angle) {
        const h_coll = getHCollision(angle)
        const v_coll = getVCollision(angle)
        return h_coll.dist<v_coll.dist ? h_coll : v_coll
    }

    const rays_num = W/GRAIN
    const angle_start = player.dir-FOV/2
    const angle_step = FOV/rays_num
    return Array.from({length:rays_num},(_,i) => castRay(angle_start+i*angle_step))
}

function animationInit() {
    player = new Player(1.5,1.5,0)
}

function animationLoop() {
    function renderViewport() {
        function fixFishEye(dist,angle) {
            return dist*Math.cos(angle)
        }

        renderRect(0,0,W,H,'darkblue')
        const rays = getRays()
        rays.forEach((r,i) => {
            const dist_fix = fixFishEye(r.dist,player.dir-r.dir)
            renderRect(i*GRAIN,0,GRAIN,H/2+H/dist_fix*10,r.vertical?'red':'darkred')
            renderRect(i*GRAIN,0,GRAIN,H/2+H/dist_fix*10,'rgba(80,50,80,'+dist_fix/160+')')
            renderRect(i*GRAIN,0,GRAIN,H/2-H/dist_fix*10,'blue')
        })
    }
    function renderMinimap() {
        map.forEach((row,i) => row.forEach((cell,j) => {
            if(cell==1) renderRect(
                j*CELL_SIZE,
                i*CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE,
                'grey'
            )
        }))
        const rays = getRays()
        rays.forEach(r => 
            renderLine(
                player.x,
                player.y,
                player.x+Math.cos(r.dir)*r.dist,
                player.y+Math.sin(r.dir)*r.dist,
                'orange'
            ))
        player.render()
        renderRect(100*CELL_SIZE,100*CELL_SIZE+5,player.dir/Math.PI*100,20,'green')
    }
    function update() {
        player.update()
    }

    renderClear()
    renderViewport()
    renderMinimap()
    update()
    requestAnimationFrame(animationLoop)
}

// 5. Input

canvas.addEventListener('click',() => {
    // canvas.requestPointerLock()
})

addEventListener('keydown',({key}) => {
    if(Object.keys(keys).includes(key) && !keys[key].pressed)
        keys[key].pressed = true
})

addEventListener('keyup',({key}) => {
    if(Object.keys(keys).includes(key))
        keys[key].pressed = false
})

addEventListener('load',() => {
    animationInit()
    animationLoop()
})