const GAME_PLAYER_W = BS
const GAME_PLAYER_H = BS*1.75
const GAME_PLAYER_SPEED = 4
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
        this.vel.x = 0
        this.vel.y = 0
        if(keys.ArrowLeft.pressed) this.vel.x -= GAME_PLAYER_SPEED
        if(keys.ArrowRight.pressed) this.vel.x += GAME_PLAYER_SPEED
        if(keys.ArrowUp.pressed) this.vel.y -= GAME_PLAYER_SPEED
        if(keys.ArrowDown.pressed) this.vel.y += GAME_PLAYER_SPEED
        this.x += this.vel.x
        this.y += this.vel.y
    }
}

const game = {}

function gameSceneInit() {
    game.player = new Player(100,100)
    game.camera = {x:0,y:0}
    game.level = {
        w:W*6,
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
            function renderBackgroundFull(sprite) {
                ctx.drawImage(sprite.img,0,0,W,H)
            }
            function renderBackgroundParallax(sprite,{zoom=sprite.zoom,slowness_x=1,slowness_y=1}={}) {
                ctx.drawImage(
                    sprite.img,
                    (0-game.camera.x)/slowness_x,
                    (game.level.h-sprite.img.naturalHeight*zoom-game.camera.y)/slowness_y,
                    sprite.img.naturalWidth*zoom,
                    sprite.img.naturalHeight*zoom
                )
                // console.log(game.level.h,sprite.img.naturalHeight*zoom,game.camera.y)
            }
            renderBackgroundFull(assets.graphics.backgrounds['SMAS-SMB1-sky'])
            // ctx.drawImage(
            //     assets.graphics.backgrounds['SMAS-SMB1-clouds'].img,
            //     0-game.camera.x/2,
            //     game.level.h-assets.graphics.backgrounds['SMAS-SMB1-clouds'].img.naturalHeight*2-game.camera.y/2,
            //     assets.graphics.backgrounds['SMAS-SMB1-clouds'].img.naturalWidth*2,
            //     assets.graphics.backgrounds['SMAS-SMB1-clouds'].img.naturalHeight*2
            // )
            renderBackgroundParallax(assets.graphics.backgrounds['SMAS-SMB1-clouds'],{slowness_x:4,slowness_y:4})
            // ctx.drawImage(
            //     assets.graphics.backgrounds['SMAS-SMB1-hills'].img,
            //     0-game.camera.x,
            //     game.level.h-assets.graphics.backgrounds['SMAS-SMB1-hills'].img.naturalHeight*2-game.camera.y,
            //     assets.graphics.backgrounds['SMAS-SMB1-hills'].img.naturalWidth*2,
            //     assets.graphics.backgrounds['SMAS-SMB1-hills'].img.naturalHeight*2
            // )
            renderBackgroundParallax(assets.graphics.backgrounds['SMAS-SMB1-hills'],{slowness_x:2,slowness_y:2})
            renderBackgroundParallax(assets.graphics.blocks['SMAS-SMB1-block1'],{slowness_x:1,slowness_y:1,zoom:1})
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