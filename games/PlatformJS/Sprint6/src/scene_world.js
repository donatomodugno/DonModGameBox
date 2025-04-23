const scene_world = {
    init(world_data) {
        this.initial = world_data
        this.PLAYER_SPEED = 2
        this.TILES = {
            'SMAS-SMB1-grass-0':{sprites:[{tileset:'SMAS-SMB1-grass',src:{x:0,y:0,w:16,h:16}}]},
            'SMAS-SMB1-grass-1':{sprites:[{tileset:'SMAS-SMB1-grass',src:{x:16,y:0,w:16,h:16}}]},
            'SMAS-SMB1-grass-2':{sprites:[{tileset:'SMAS-SMB1-grass',src:{x:32,y:0,w:16,h:16}}]},
            'SMAS-SMB1-grass-3':{sprites:[{tileset:'SMAS-SMB1-grass',src:{x:0,y:16,w:16,h:16}}]},
            'SMAS-SMB1-grass-4':{sprites:[{tileset:'SMAS-SMB1-grass',src:{x:16,y:16,w:16,h:16}}]},
            'SMAS-SMB1-grass-5':{sprites:[{tileset:'SMAS-SMB1-grass',src:{x:32,y:16,w:16,h:16}}]},
            'SMAS-SMB1-grass-6':{sprites:[{tileset:'SMAS-SMB1-grass',src:{x:0,y:32,w:16,h:16}}]},
            'SMAS-SMB1-grass-7':{sprites:[{tileset:'SMAS-SMB1-grass',src:{x:16,y:32,w:16,h:16}}]},
            'SMAS-SMB1-grass-8':{sprites:[{tileset:'SMAS-SMB1-grass',src:{x:32,y:32,w:16,h:16}}]},
        }
        this.PATHS = {
            /* Two directions */
            'SMAS-SMB1-path1-0':{allow:['left','right'],is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:0,y:0,w:16,h:16}}]},
            'SMAS-SMB1-path1-1':{allow:['up','down']   ,is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:0,y:16,w:16,h:16}}]},
            'SMAS-SMB1-path1-2':{allow:['down','right'],is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:16,y:0,w:16,h:16}}]},
            'SMAS-SMB1-path1-3':{allow:['down','left'] ,is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:32,y:0,w:16,h:16}}]},
            'SMAS-SMB1-path1-4':{allow:['up','right']  ,is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:16,y:16,w:16,h:16}}]},
            'SMAS-SMB1-path1-5':{allow:['up','left']   ,is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:32,y:16,w:16,h:16}}]},
            /* Three directions */
            'SMAS-SMB1-path1-6':{allow:['down','left','right'],is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:48,y:0,w:16,h:16}}]},
            'SMAS-SMB1-path1-7':{allow:['up','left','right']  ,is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:48,y:16,w:16,h:16}}]},
            'SMAS-SMB1-path1-8':{allow:['up','down','right']  ,is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:64,y:0,w:16,h:16}}]},
            'SMAS-SMB1-path1-9':{allow:['up','down','left']   ,is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:80,y:0,w:16,h:16}}]},
            /* Four directions */
            'SMAS-SMB1-path1-10':{allow:['up','down','left','right'],is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:64,y:16,w:16,h:16}}]},
            /* Two directions with end */
            'SMAS-SMB1-path1-11':{allow:['left','right'],is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:96,y:0,w:16,h:16}}]},
            'SMAS-SMB1-path1-12':{allow:['left','right'],is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:112,y:0,w:16,h:16}}]},
            'SMAS-SMB1-path1-13':{allow:['up','down']   ,is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:96,y:16,w:16,h:16}}]},
            'SMAS-SMB1-path1-14':{allow:['up','down']   ,is_level:false,sprites:[{tileset:'SMAS-SMB1-path1',src:{x:112,y:16,w:16,h:16}}]},
            /* Levels */
            'SMAS-SMB1-path-level-1':{
                allow:['up','down','left','right'],is_level:true,sprites:[
                    {tileset:'SMAS-SMB1-path-levels',src:{x:0,y:0,w:16,h:16}},
                    {tileset:'SMAS-SMB1-path-levels',src:{x:16,y:0,w:16,h:16}},
                    {tileset:'SMAS-SMB1-path-levels',src:{x:32,y:0,w:16,h:16}},
                    {tileset:'SMAS-SMB1-path-levels',src:{x:48,y:0,w:16,h:16}},
                ]},
        }
        this.w = this.initial.cw*BS<W ? W : this.initial.cw*BS
        this.h = this.initial.ch*BS<H ? H : this.initial.ch*BS
        this.camera = {x:0,y:0}
        this.grid = false
        this.initPlayer()
        this.initTiles()
        this.initPaths()
    },
    initPlayer() {
        this.player = {
            x:this.getCoordX(this.initial.player.cx),
            y:this.getCoordY(this.initial.player.cy),
            w:BS,
            h:BS,
            direction:'idle',
            sprite:{tileset:'SMAS-SMB1-world-Mario',src:{x:0,y:0,w:16,h:16}}
        }
    },
    initTiles() {
        this.tiles = []
        this.initial.tiles.forEach(tile => {
            this.tiles.push(new Tile(this.TILES[tile.id],...this.getCoords(tile.cx,tile.cy)))
        })
    },
    initPaths() {
        this.paths = []
        this.initial.paths.forEach(path => {
            this.paths.push(new Path(this.PATHS[path.id],...this.getCoords(path.cx,path.cy)))
        })
        this.paths.forEach(path => {
            if(!this.paths.some(p => p.x==path.x && p.y==path.y-BS)) path.allow_up = false
            if(!this.paths.some(p => p.x==path.x && p.y==path.y+BS)) path.allow_down = false
            if(!this.paths.some(p => p.x==path.x-BS && p.y==path.y)) path.allow_left = false
            if(!this.paths.some(p => p.x==path.x+BS && p.y==path.y)) path.allow_right = false
        })
    },
    loop(dt=0) {
        /* Rendering */
        function renderGrid(color) {
            for(let i=0;i<=BPH;i++)
                renderRect(0,i*BS-scene.camera.y%BS,W,1,color)
            for(let j=0;j<=BPW;j++)
                renderRect(j*BS-scene.camera.x%BS,0,1,H,color)
        }
        renderClear()
        // renderRect(0,0,W,H,'black')
        renderRect(-this.camera.x,-this.camera.y,this.w,this.h,'#46F')
        this.tiles.forEach(tile => tile.render())
        this.paths.forEach(path => path.render())
        if(this.grid) renderGrid('grey')
        renderSprite(this.player.x-scene.camera.x,this.player.y-scene.camera.y,this.player.w,this.player.h,this.player.sprite)
        /* Update */
        if(this.player.direction=='left') this.player.x -= this.PLAYER_SPEED*Math.floor(dt)
        if(this.player.direction=='right') this.player.x += this.PLAYER_SPEED*Math.floor(dt)
        if(this.player.direction=='up') this.player.y -= this.PLAYER_SPEED*Math.floor(dt)
        if(this.player.direction=='down') this.player.y += this.PLAYER_SPEED*Math.floor(dt)
        if(this.player.x%BS==0 && this.player.y%BS==0)
            if(
                (   this.player.direction=='left'  && (!keys_pressed.ArrowLeft  || (!this.isAllowed('left')  && !keys_pressed.c)))
                || (this.player.direction=='right' && (!keys_pressed.ArrowRight || (!this.isAllowed('right') && !keys_pressed.c)))
                || (this.player.direction=='up'    && (!keys_pressed.ArrowUp    || (!this.isAllowed('up')    && !keys_pressed.c)))
                || (this.player.direction=='down'  && (!keys_pressed.ArrowDown  || (!this.isAllowed('down')  && !keys_pressed.c)))
            )
                this.player.direction = 'idle'
        // this.tiles.forEach(tile => tile.update(dt))
        this.paths.forEach(path => path.update(dt))
        if(this.player.x+BS/2<W/2) scene.camera.x = 0
        else if(this.player.x+BS/2>scene.w-W/2) scene.camera.x = scene.w-W
        else scene.camera.x = this.player.x+BS/2-W/2
        if(this.player.y+BS/2<H/2) scene.camera.y = 0
        else if(this.player.y+BS/2>scene.h-H/2) scene.camera.y = scene.h-H
        else scene.camera.y = this.player.y+BS/2-H/2
    },
    onKeyPress(key) {
        if(this.player.direction=='idle') {
            if(key=='ArrowUp'    && (this.isAllowed('up')    || keys_pressed.c)) this.player.direction = 'up'
            if(key=='ArrowDown'  && (this.isAllowed('down')  || keys_pressed.c)) this.player.direction = 'down'
            if(key=='ArrowLeft'  && (this.isAllowed('left')  || keys_pressed.c)) this.player.direction = 'left'
            if(key=='ArrowRight' && (this.isAllowed('right') || keys_pressed.c)) this.player.direction = 'right'
        }
        if(key=='g') this.grid = !this.grid
    },
    onKeyRelease(key) {
        if(key=='Enter' && this.isLevel()) transition.init(
            scene_level,level_1,
            {
                type_in:'circle',
                center_x_in:this.player.x-this.camera.x+BS/2,
                center_y_in:this.player.y-this.camera.y+BS/2
            }
        )
    },
    onMousePress() {},
    onMouseRelease() {},
    getCoordX(cx) {
        return cx*BS
    },
    getCoordY(cy) {
        return cy*BS
    },
    getCoords(cx,cy) {
        return [this.getCoordX(cx),this.getCoordY(cy)]
    },
    findPath() {
        if(this.player.x%BS!=0 || this.player.y%BS!=0) return false
        return this.paths.find(path => path.x==this.player.x && path.y==this.player.y)
    },
    isAllowed(direction) {
        const path = this.findPath()
        if(!path) return false
        if(direction=='up') return path.allow_up
        if(direction=='down') return path.allow_down
        if(direction=='left') return path.allow_left
        if(direction=='right') return path.allow_right
    },
    isLevel() {
        const path = this.findPath()
        if(!path) return false
        return path.is_level
    },
}
class Tile {
    constructor(tile,x,y) {
        this.tile = tile
        this.x = x
        this.y = y
        this.w = BS
        this.h = BS
    }
    render() {
        renderSprite(this.x-scene.camera.x,this.y-scene.camera.y,this.w,this.h,this.tile.sprites[0])
    }
}
class Path {
    constructor(path,x,y) {
        this.path = path
        this.x = x
        this.y = y
        this.w = BS
        this.h = BS
        this.ct = 0 /* Current Time */
        this.cf = 0 /* Current Frame */
        this.mf = path.sprites.length /* Max Frame */
        this.fps = 8 /* Frames per Second */
        this.allow_up = path.allow.includes('up')
        this.allow_down = path.allow.includes('down')
        this.allow_left = path.allow.includes('left')
        this.allow_right = path.allow.includes('right')
        this.is_level = path.is_level
    }
    render() {
        renderSprite(this.x-scene.camera.x,this.y-scene.camera.y,this.w,this.h,this.path.sprites[this.cf])
    }
    update(dt) {
        this.ct += dt*10
        if(this.ct>=1000/this.fps) {
            this.ct = 0
            this.cf += 1
            this.cf %= this.mf
        }
    }
}