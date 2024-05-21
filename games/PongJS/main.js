const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
canvas.width = WIDTH
canvas.height = HEIGHT

let running = false
let pause = false
let score = 0
const paddle = {
    x:0
}
const ball = {
    x:0,
    y:0,
    xvel:0,
    yvel:0
}

function gameInit() {
    running = true
    paddle.x = WIDTH/2
    ball.x = WIDTH/2
    ball.y = 0
    ball.xvel = BALLSPEED*Math.cos(45*Math.PI/180)
    ball.yvel = BALLSPEED*Math.sin(45*Math.PI/180)
    score = 0
}

function gameLose() {
    running = false
    ctx.fillStyle = 'white'
    ctx.font = '50px Arial'
    ctx.fillText('You lose!',WIDTH/2-100,HEIGHT/2,200)
    if(keys.any.pressed) gameInit()
}

function gamePause() {
    ctx.fillStyle = 'white'
    ctx.font = '50px Arial'
    ctx.fillText('Pause',WIDTH/2-70,HEIGHT/2)
}

function gameLoop() {
    ctx.clearRect(0,0,WIDTH,HEIGHT)
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,WIDTH,HEIGHT)
    ctx.fillStyle = 'white'
    ctx.font = '20px Arial'
    ctx.fillText('SCORE: '+score,10,HEIGHT-10)

    if(keys.left.pressed && paddle.x-50>0) paddle.x -= PADDLESPEED
    if(keys.right.pressed && paddle.x+50<WIDTH) paddle.x += PADDLESPEED

    ball.x += ball.xvel
    ball.y += ball.yvel
    if(ball.x+5+ball.xvel>=WIDTH || ball.x+ball.xvel<=0) ball.xvel = -ball.xvel
    if(ball.y+ball.yvel<=0) ball.yvel = -ball.yvel
    if(ball.y+5+ball.yvel>=PADDLEY && ball.y+5+ball.yvel<=PADDLEY+5 && ball.x+5>paddle.x-50 && ball.x<paddle.x+50) {
        ball.xvel = Math.cos((90-60*(ball.x-paddle.x)/50)*Math.PI/180)*BALLSPEED
        ball.yvel = -Math.sin((90-60*(ball.x-paddle.x)/50)*Math.PI/180)*BALLSPEED
        score++
    }
    if(ball.y>=HEIGHT) {
        gameLose()
    }

    ctx.fillStyle = 'white'
    ctx.fillRect(paddle.x-50,PADDLEY,100,20)
    ctx.fillRect(ball.x,ball.y,5,5)
}

function animate() {
    requestAnimationFrame(animate)
    if(running && !pause) gameLoop()
    if(running && pause) gamePause()
    if(!running) {
        if(keys.any.pressed) {
            gameInit()
        }
    }
}

function Main() {
    gameInit()
    animate()
}