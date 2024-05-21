const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const WIDTH = 400 //360
const HEIGHT = 600 //540
const CELL = 40
const FPS = 60
canvas.width = WIDTH
canvas.height = HEIGHT

function drawGrid() {
 ctx.fillStyle = 'black'
 for(let i=0;i<(HEIGHT/CELL);i++) ctx.fillRect(0,CELL-1+i*CELL,WIDTH,1)
 for(let i=0;i<(WIDTH/CELL);i++) ctx.fillRect(i*CELL,0,1,HEIGHT)
}

class Block {
 constructor(shape) {
  this.shape = shape
  this.position = {
   x:8,
   y:0
  }
 }

 draw() {
  switch(this.shape) {
   case 'O':
    ctx.fillStyle = 'yellow'
    ctx.fillRect(this.position.x*CELL,this.position.y*CELL,CELL*2,CELL*2)
    break;
   case 'I':
    ctx.fillStyle = 'green'
    ctx.fillRect(this.position.x*CELL,this.position.y*CELL,CELL,CELL*4)
    break;
   default:
    break;
  }
 }
}

const block = new Block('I')
let tick = 0
let then = Date.now()

function MainGame() {
 ctx.clearRect(0,0,WIDTH,HEIGHT)
 //if(tick<60) tick++
 //else tick=0
 //tick=(++tick)%60
 tick=(tick+1)%60
 //console.log(tick)

 ctx.fillStyle = '#ace'
 ctx.fillRect(0,0,WIDTH,HEIGHT)
 ctx.fillStyle = 'black'
 ctx.font = '30px Arial'
 ctx.fillText("Tetrjs",50,50)
 block.draw()
 if(tick==0) console.log(Date.now())//block.position.y += 1
 drawGrid()
 //console.log(Math.floor(Math.random()*10))
}

function animate() {
 if(Date.now()-then>500/FPS) {
  MainGame()
  then = Date.now()
 }
 requestAnimationFrame(animate)
}

animate()

addEventListener('keydown',({key}) => {
    switch(true) {
        //up
        case key=='ArrowUp' || key=='w':
            break
        //left
        case key=='ArrowLeft' || key=='a':
            block.position.x -= 1
            break
        //down
        case key=='ArrowDown' || key=='s':
            break
        //right
        case key=='ArrowRight' || key=='d':
            block.position.x += 1
            break
    }
})