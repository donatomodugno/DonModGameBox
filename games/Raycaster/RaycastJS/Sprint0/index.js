const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
const CELL_SIZE = 32
const PIXELATION = 5 // 1 to S_W
const FOV = toRadians(60)
const COLORS = {
  floor:'#d52b1e', // '#ff6361'
  ceiling:'#ffffff', // '#012975',
  wall:'#013aa6', // '#58508d'
  wallDark:'#012975', // '#003f5c'
  rays:'#ffa600',
}
const map = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
]
const player = {
  x:CELL_SIZE * 1.5,
  y:CELL_SIZE * 1.5,
  angle:toRadians(0),
  speed:0,
}

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = SCREEN_WIDTH
canvas.height = SCREEN_HEIGHT
const ctx = canvas.getContext('2d')

function clearScreen() {
  ctx.fillStyle = 'red'
  ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT)
}

function renderMinimap(posX=0,posY=0,scale,rays) {
  const cellSize = scale * CELL_SIZE
  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        ctx.fillStyle = 'grey'
        ctx.fillRect(
          posX + x * cellSize,
          posY + y * cellSize,
          cellSize,
          cellSize
        )
      }
    })
  })
  ctx.fillStyle = 'blue'
  ctx.fillRect(
    posX + player.x * scale - 10 / 2,
    posY + player.y * scale - 10 / 2,
    10,
    10
  )

  ctx.strokeStyle = 'blue'
  ctx.beginPath()
  ctx.moveTo(player.x * scale, player.y * scale)
  ctx.lineTo(
    (player.x + Math.cos(player.angle) * 20) * scale,
    (player.y + Math.sin(player.angle) * 20) * scale
  )
  ctx.closePath()
  ctx.stroke()

  ctx.strokeStyle = COLORS.rays
  rays.forEach((ray) => {
    ctx.beginPath()
    ctx.moveTo(player.x * scale, player.y * scale)
    ctx.lineTo(
      (player.x + Math.cos(ray.angle) * ray.distance) * scale,
      (player.y + Math.sin(ray.angle) * ray.distance) * scale
    )
    ctx.closePath()
    ctx.stroke()
  })
}

function toRadians(deg) {
  return (deg * Math.PI) / 180
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function outOfMapBounds(x, y) {
  return x < 0 || x >= map[0].length || y < 0 || y >= map.length
}

function getVCollision(angle) {
  const right = Math.abs(Math.floor((angle-Math.PI/2)/Math.PI)%2)
  const firstX = right
    ? Math.floor(player.x/CELL_SIZE)*CELL_SIZE+CELL_SIZE
    : Math.floor(player.x/CELL_SIZE)*CELL_SIZE
  const firstY = player.y+(firstX-player.x)*Math.tan(angle)
  const xA = right ? CELL_SIZE : -CELL_SIZE
  const yA = xA*Math.tan(angle)
  let wall
  let nextX = firstX
  let nextY = firstY
  let out = false
  while(!wall && !out) {
    const cellX = right
      ? Math.floor(nextX/CELL_SIZE)
      : Math.floor(nextX/CELL_SIZE)-1
    const cellY = Math.floor(nextY/CELL_SIZE)
    if(outOfMapBounds(cellX,cellY)) out = true
    else {
      wall = map[cellY][cellX]
      if(!wall) {
        nextX += xA
        nextY += yA
      }
    }
  }
  return {
    angle,
    distance:distance(player.x,player.y,nextX,nextY),
    vertical:true,
  }
}

function getHCollision(angle) {
  const up = Math.abs(Math.floor(angle/Math.PI)%2)
  const firstY = up
    ? Math.floor(player.y/CELL_SIZE)*CELL_SIZE
    : Math.floor(player.y/CELL_SIZE)*CELL_SIZE+CELL_SIZE
  const firstX = player.x+(firstY-player.y)/Math.tan(angle)
  const yA = up ? -CELL_SIZE : CELL_SIZE
  const xA = yA/Math.tan(angle)
  let wall
  let nextX = firstX
  let nextY = firstY
  let out = false
  while (!wall && !out) {
    const cellX = Math.floor(nextX / CELL_SIZE)
    const cellY = up
      ? Math.floor(nextY / CELL_SIZE) - 1
      :Math.floor(nextY / CELL_SIZE)
    if (outOfMapBounds(cellX, cellY)) out = true
    else {
      wall = map[cellY][cellX]
      if (!wall) {
        nextX += xA
        nextY += yA
      }
    }
  }
  return {
    angle,
    distance:distance(player.x, player.y, nextX, nextY),
    vertical:false,
  }
}

function castRay(angle) {
  const vCollision = getVCollision(angle)
  const hCollision = getHCollision(angle)
  return hCollision.distance>=vCollision.distance ? vCollision : hCollision
}

function getRays() {
  const initialAngle = player.angle-FOV/2
  const numberOfRays = SCREEN_WIDTH/PIXELATION
  const angleStep = FOV/numberOfRays
  return Array.from({length:numberOfRays},(_,i) => {
    const angle = initialAngle+i*angleStep
    const ray = castRay(angle)
    return ray
  })
  // return Array.from(Array(numberOfRays).keys()).map(i => castRay(initialAngle+i*angleStep))
}

function movePlayer() {
  player.x += Math.cos(player.angle)*player.speed
  player.y += Math.sin(player.angle)*player.speed
}

function fixFishEye(distance,angle,playerAngle) {
  const diff = angle-playerAngle
  return distance*Math.cos(diff)
}

function renderScene(rays) {
  rays.forEach((ray,i) => {
    const distance = fixFishEye(ray.distance, ray.angle, player.angle)
    const wallHeight = ((CELL_SIZE * 5) / distance) * 277
    ctx.fillStyle = ray.vertical ? COLORS.wallDark : COLORS.wall
    ctx.fillRect(i*PIXELATION, SCREEN_HEIGHT / 2 - wallHeight / 2, PIXELATION, wallHeight)
    ctx.fillStyle = 'rgba(96,112,128,'+ray.distance/200+')'
    ctx.fillRect(i*PIXELATION, SCREEN_HEIGHT / 2 - wallHeight / 2, PIXELATION, wallHeight)
    ctx.fillStyle = COLORS.floor
    ctx.fillRect(
      i*PIXELATION,
      SCREEN_HEIGHT / 2 + wallHeight / 2,
      1*PIXELATION,
      SCREEN_HEIGHT / 2 - wallHeight / 2
    )
    ctx.fillStyle = COLORS.ceiling
    ctx.fillRect(i*PIXELATION, 0, PIXELATION, SCREEN_HEIGHT / 2 - wallHeight / 2)
  })
}

function gameLoop() {
  clearScreen()
  movePlayer()
  const rays = getRays()
  renderScene(rays)
  renderMinimap(0,0,0.75,rays)
}

canvas.addEventListener('click',() => {
  canvas.requestPointerLock()
})

addEventListener('keydown',({key}) => {
  if(key=='w') player.speed = 2
  if(key=='s') player.speed = -2
})

addEventListener('keyup', ({key}) => {
  if(key=='w' || key=='s') player.speed = 0
})

addEventListener('mousemove',({movementX}) => {
  player.angle += toRadians(movementX/5)
})

addEventListener('load',() => setInterval(gameLoop,1000/60))