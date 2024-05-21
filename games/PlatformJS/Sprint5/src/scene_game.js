const GAME_PLAYER_W = 32
const GAME_PLAYER_H = 64
const GAME_PLAYER_SPEED = 0.1
const GAME_PLAYER_SPEED_LIMIT = 5
const GAME_PLAYER_SPEED_STEP = 1

class Player {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.w = GAME_PLAYER_W
        this.h = GAME_PLAYER_H
        this.vel = {
            x:0,
            y:0,
        }
        this.acc = {
            x:0,
            y:0,
        }
    }
    render() {
        lib.renderRect(this.x-game.camera.x,this.y-game.camera.y,this.w,this.h,'red')
    }
    update() {
        this.acc.x = 0
        this.acc.y = 0
        if(keys.ArrowUp.pressed) this.acc.y -= GAME_PLAYER_SPEED
        else if(this.vel.y<0) this.acc.y += GAME_PLAYER_SPEED
        if(keys.ArrowDown.pressed) this.acc.y += GAME_PLAYER_SPEED
        else if(this.vel.y>0) this.acc.y -= GAME_PLAYER_SPEED
        if(keys.ArrowLeft.pressed) this.acc.x -= GAME_PLAYER_SPEED
        else if(this.vel.x<0) this.acc.x += GAME_PLAYER_SPEED
        if(keys.ArrowRight.pressed) this.acc.x += GAME_PLAYER_SPEED
        else if(this.vel.x>0) this.acc.x -= GAME_PLAYER_SPEED

        this.vel.x += this.acc.x
        this.vel.y += this.acc.y
        if(this.vel.x>GAME_PLAYER_SPEED_LIMIT) this.vel.x = GAME_PLAYER_SPEED_LIMIT
        if(this.vel.y>GAME_PLAYER_SPEED_LIMIT) this.vel.y = GAME_PLAYER_SPEED_LIMIT
        if(this.vel.x<-GAME_PLAYER_SPEED_LIMIT) this.vel.x = -GAME_PLAYER_SPEED_LIMIT
        if(this.vel.y<-GAME_PLAYER_SPEED_LIMIT) this.vel.y = -GAME_PLAYER_SPEED_LIMIT
        this.x += this.vel.x
        this.y += this.vel.y
    }
}

const game = {}

function gameSceneInit() {
    game.player = new Player(100,100)
    game.camera = {x:0,y:0}
    game.level = {
        w:W*2,
        h:H*2,
    }
    lib.musicPlay()
}

function gameSceneKeyPress(key) {
    if(key==' ') lib.sceneChange('menu')
}

function gameSceneKeyRelease(key) {}

function gameSceneLoop() {
    function render() {
        function renderBackground() {
            // lib.renderLinearGradient(
            //     -game.camera.x,-game.camera.y,game.level.w,game.level.h,
            //     {0:'black',0.2:'green',0.5:'yellow',0.7:'purple',1:'blue'}
            // )

            // lib.renderRadialGradient(
            //     game.level.w/2-game.camera.x,game.level.h/2-game.camera.y,lib.distance(0,0,game.level.w/2,game.level.h/2),
            //     {0:'white',0.2:'lightblue',1:'purple'}
            // )
            
            lib.renderRadialGradient(
                game.level.w/2-game.camera.x,game.level.h/2-game.camera.y,lib.distance(0,0,game.level.w/2,game.level.h/2),
                [
                    {offset:0,color:'white'},
                    {offset:0.2,color:'lightblue'},
                    {offset:1,color:'purple'},
                ]
            )
        }
        renderBackground()
        game.player.render()
    }
    function update() {
        function updateCamera() {
            if(game.player.x+game.player.w/2<W/2) game.camera.x = 0
            else if(game.player.x+game.player.w/2>game.level.w-W/2) game.camera.x = game.level.w-W
            else game.camera.x = game.player.x+game.player.w/2-W/2
            if(game.player.y+game.player.h/2<H/2) game.camera.y = 0
            else if(game.player.y+game.player.h/2>game.level.h-H/2) game.camera.y = game.level.h-H
            else game.camera.y = game.player.y+game.player.h/2-H/2
        }
        game.player.update()
        updateCamera()
    }
    render()
    update()
}