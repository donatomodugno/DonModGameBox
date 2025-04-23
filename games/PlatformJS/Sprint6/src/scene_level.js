const scene_level = {
    init(level_data) {
        this.initial = level_data
        this.GRAVITY = 0.8
        this.PLAYER_SPEED = 3
        this.JUMP_STRENGTH = 15
        this.MAX_FALL_SPEED = 20
        this.BLOCKS = {
            'SMAS-SMB1-block1-0':{semisolid:false,sprite:{tileset:'SMAS-SMB1-block1',src:{x:0,y:0,w:32,h:32}}},
            'SMAS-SMB1-bridge1-0':{semisolid:true,sprite:{tileset:'SMAS-SMB1-bridge1',src:{x:0,y:0,w:32,h:32}}},
        }
        this.w = this.initial.cw*BS<W ? W : this.initial.cw*BS
        this.h = this.initial.ch*BS<H ? H : this.initial.ch*BS
        this.camera = {x:0,y:0}
        this.grid = false
        this.initPlayer()
        this.initBlocks()
    },
    initPlayer() {
        this.player = new Player(...this.getCoords(this.initial.player.cx,this.initial.player.cy))
    },
    initBlocks() {
        this.blocks = []
        this.initial.blocks.forEach(block => {
            this.blocks.push(new Block(block.id,...this.getCoords(block.cx,block.cy),this.BLOCKS[block.id].semisolid))
        })
    },
    loop(dt) {
        /* Rendering */
        function renderGrid(color) {
            for(let i=0;i<=BPH;i++)
                renderRect(0,i*BS-scene.camera.y%BS,W,1,color)
            for(let j=0;j<=BPW;j++)
                renderRect(j*BS-scene.camera.x%BS,0,1,H,color)
        }
        renderClear()
        renderRect(0,0,W,H,'lightgrey')
        if(this.grid) renderGrid('#FFF4')
        this.blocks.forEach(block => {
            block.render()
        })
        this.player.render()
        /* Update */
        this.player.update(dt)
    },
    onKeyPress(key) {
        if(key=='ArrowUp') this.player.jump()
        if(key=='g') this.grid = !this.grid
    },
    onKeyRelease(key) {},
    onMousePress() {},
    onMouseRelease() {},
    getCoordX(cx) {
        return cx*BS
    },
    getCoordY(cy) {
        return this.h-cy*BS
    },
    getCoords(cx,cy) {
        return [this.getCoordX(cx),this.getCoordY(cy)]
    },
    getCellCoordX(x) {
        return x/BS
    },
    getCellCoordY(y) {
        return (this.h-y)/BS
    },
    getCellCoords(x,y) {
        return [this.getCellCoordX(x),this.getCellCoordY(y)]
    },
    checkCollision1D(ax1,ax2,bx1,bx2) {
        return ax1<bx2 && ax2>bx1
    },
    checkCollision2D(ax1,ax2,bx1,bx2,ay1,ay2,by1,by2) {
        if(this.checkCollision1D(ax1,ax2,bx1,bx2))
            if(this.checkCollision1D(ay1,ay2,by1,by2))
                return true
        return false
    },
    deathScenario() {
        transition.init(
            scene_level,level_1,
            {
                type_in:'circle',
                speed_in:5,
                speed_out:5,
                center_x_in:this.player.x-this.camera.x+BS/2,
                center_y_in:this.player.y-this.player.h-this.camera.y+BS/2,
            }
        )
    },
    winScenario() {},
}
class Player {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.w = BS
        this.h = BS*1.75
        this.dx = 0
        this.dy = 0
        this.vx = 0
        this.vy = 0
        this.on_ground = false
    }
    render() {
        renderRect(this.x-scene.camera.x,this.y-scene.camera.y,this.w,-this.h,'red')
    }
    update(dt) {
        /* X axis */
        this.dx = 0
        if(keys_pressed.ArrowLeft) this.dx -= scene.PLAYER_SPEED*dt
        if(keys_pressed.ArrowRight) this.dx += scene.PLAYER_SPEED*dt
        scene.blocks.filter(block => !block.semisolid).forEach(block => {
            if(scene.checkCollision2D(
                this.x+this.dx,this.x+this.w+this.dx,block.x,block.x+block.w,
                this.y-this.h,this.y,block.y-block.h,block.y
            )) {
                if(this.dx>0) {
                    this.stopX(block.x-this.w)
                }
                if(this.dx<0) {
                    this.stopX(block.x+block.w)
                }
            }
        })
        this.x += this.dx
        if(this.x<W/2) scene.camera.x = 0
        else if(this.x>scene.w-W/2) scene.camera.x = scene.w-W
        else scene.camera.x = this.x-W/2
        /* Y axis */
        this.dy = 0
        if(this.vy<=scene.MAX_FALL_SPEED)
            this.vy += scene.GRAVITY
        this.dy += this.vy
        this.on_ground = false
        scene.blocks.forEach(block => {
            if(scene.checkCollision2D(
                this.x,this.x+this.w,block.x,block.x+block.w,
                this.y-this.h+this.dy,this.y+this.dy,block.y-block.h,block.y
            )) {
                if(!scene.checkCollision2D(
                    this.x,this.x+this.w,block.x,block.x+block.w,
                    this.y-this.h,this.y,block.y-block.h,block.y
                )) {
                    if(this.dy>0) {
                        this.on_ground = true
                        this.stopY(block.y-block.h)
                    }
                    if(this.dy<0) {
                        if(!block.semisolid)
                        this.stopY(block.y+this.h)
                    }
                }
            }
        })
        this.y += this.dy
        /* Pitfall */
        if(this.y-this.h>scene.h) {
            scene.deathScenario()
        }
        /* Camera */
        if(this.y<H/2) scene.camera.y = 0
        else if(this.y>scene.h-H/2) scene.camera.y = scene.h-H
        else scene.camera.y = this.y-H/2
    }
    stopX(x) {
        this.x = x
        this.dx = 0
    }
    stopY(y) {
        this.y = y
        this.dy = 0
        this.vy = 0
    }
    stop(x,y) {
        this.stopX(x)
        this.stopY(y)
    }
    jump() {
        if(this.on_ground || keys_pressed.c)
            this.vy = -scene.JUMP_STRENGTH
    }
}
class Block {
    constructor(id,x,y,semisolid=false) {
        this.id = id
        this.x = x
        this.y = y
        this.w = BS
        this.h = BS
        this.semisolid = semisolid
    }
    render() {
        renderSprite(this.x-scene.camera.x,this.y-scene.camera.y,this.w,-this.h,scene.BLOCKS[this.id].sprite)
    }
}