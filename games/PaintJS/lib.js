class Button {
    constructor(x,y,text,callback=(() => {}),size=16,font='Arial',bg='lightblue') {
        this.x = x
        this.y = y
        this.width = size*text.length*0.6
        this.height = size
        this.text = text
        this.callback = callback
        this.size = size
        this.font = font
        this.bg = bg
    }

    draw() {
        ctx.fillStyle = this.bg
        ctx.fillRect(this.x,this.y,this.width,this.height)
        ctx.fillStyle = 'black'
        ctx.font = this.size+'px '+this.font
        ctx.fillText(this.text,this.x+1,this.y+this.size*0.9)
    }

    stroke() {
        ctx.lineWidth = 4
        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.x,this.y,this.width,this.height)
    }
}

class ColorPalette {
    constructor(x,y,colors) {
        this.x = x
        this.y = y
        this.width = colors[0].length*MENUCELL
        this.height = colors.length*MENUCELL
        this.colors = colors
    }

    draw() {
        this.colors.forEach((r,i) => {
            r.forEach((c,j) => {
                ctx.fillStyle = c
                ctx.fillRect(
                    this.x+j*MENUCELL,
                    this.y+i*MENUCELL,
                    MENUCELL,
                    MENUCELL
                )
            })
        })
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.strokeRect(
            this.x,
            this.y+(this.colors.length+1)*MENUCELL,
            MENUCELL*2,
            MENUCELL*2
        )
        ctx.fillStyle = selectedColor
        ctx.fillRect(
            this.x,
            this.y+(this.colors.length+1)*MENUCELL,
            MENUCELL*2,
            MENUCELL*2
        )
        if(selectedColor == 'transparent') {
            ctx.strokeStyle = 'red'
            ctx.beginPath()
            ctx.moveTo(
                this.x,
                this.y+(this.colors.length+1)*MENUCELL
            )
            ctx.lineTo(
                this.x+MENUCELL*2,
                this.y+(this.colors.length+1)*MENUCELL+MENUCELL*2
            )
            ctx.stroke()
        }
    }
}

class Rectangle {
    constructor(xcell,ycell) {
        this.xcell = xcell
        this.ycell = ycell
        this.widthcell = 1
        this.heightcell = 1
    }

    draw() {
        ctx.fillStyle = selectedColor
        for(let i=0;i<Math.abs(this.heightcell);i++) {
            for(let j=0;j<Math.abs(this.widthcell);j++) {
                ctx.fillRect(
                    (this.xcell+j*Math.sign(this.widthcell))*EDITORCELL,
                    (this.ycell+i*Math.sign(this.heightcell))*EDITORCELL,
                    EDITORCELL,
                    EDITORCELL
                )
            }
        }
    }

    complete() {
        for(let i=0;i<Math.abs(this.heightcell);i++) {
            for(let j=0;j<Math.abs(this.widthcell);j++) {
                graph[this.ycell+i*Math.sign(this.heightcell)][this.xcell+j*Math.sign(this.widthcell)] = selectedColor
            }
        }
    }
}

const buttons = [
    new Button(450,200,'Brush',() => {tool='brush'},20),
    new Button(450,230,'Rectangle',() => {tool='rect'},20),
    new Button(450,260,'Erase',() => {tool='erase'},20),
    new Button(450,290,'Pick',() => {tool='pick'},20),
    new Button(550,370,'GRID',() => {grid=!grid},16,'Monospace','pink')
]
const palette = new ColorPalette(450,50,[
    ['white','pink','lightyellow','lightgreen','lightblue'],
    ['grey','red','yellow','green','blue'],
    ['black','darkred','orange','darkgreen','darkblue']
])
const rectangles = []

function clearScreen() {
    ctx.clearRect(0,0,WIDTH,HEIGHT)
    ctx.fillStyle = 'lightgrey'
    ctx.fillRect(0,0,WIDTH,HEIGHT)
    canvas.style.cursor = 'default'
}

function getCellCoord(pos) {
    return Math.floor(pos/EDITORCELL)
}

function getPaletteXCoord(x) {
    return Math.floor((x-palette.x)/MENUCELL)
}

function getPaletteYCoord(y) {
    return Math.floor((y-palette.y)/MENUCELL)
}

function drawGrid() {
    ctx.fillStyle = GRIDCOLOR
    for(let i=0;i<EDITORHEIGHT;i+=EDITORCELL) ctx.fillRect(0,i,EDITORWIDTH,GRIDSIZE)
    for(let j=0;j<EDITORWIDTH;j+=EDITORCELL) ctx.fillRect(j,0,GRIDSIZE,EDITORHEIGHT)
}

function drawGraph() {
    graph.forEach((r,i) => {
        r.forEach((c,j) => {
            ctx.fillStyle = c
            ctx.fillRect(
                j*EDITORCELL,
                i*EDITORCELL,
                EDITORCELL,
                EDITORCELL
            )
        })
    })
    rectangles.forEach(r => {
        r.draw()
    })
}

function drawMenu() {
    ctx.fillStyle = 'grey'
    ctx.fillRect(EDITORWIDTH,0,MENUWIDTH,MENUHEIGHT)
    palette.draw()
    if(mouse.x>palette.x && mouse.x<palette.x+palette.width) {
        if(mouse.y>palette.y && mouse.y<palette.y+palette.height) {
            canvas.style.cursor = 'pointer'
        }
    }
    if(tool == 'pick') pickingColor()
}

function drawButtons() {
    buttons.forEach(b => {
        b.draw()
        if(mouse.x>b.x && mouse.x<b.x+b.width) {
            if(mouse.y>b.y && mouse.y<b.y+b.height) {
                canvas.style.cursor = 'pointer'
            }
        }
    })
}

function selectColor() {
    if(mouse.x>palette.x && mouse.x<palette.x+palette.width) {
        if(mouse.y>palette.y && mouse.y<palette.y+palette.height) {
            selectedColor = palette.colors[getPaletteYCoord(mouse.y)][getPaletteXCoord(mouse.x)]
        }
    }
}

function drawColor(color=selectedColor) {
    if(mouse.x>0 && mouse.x<EDITORWIDTH) {
        if(mouse.y>0 && mouse.y<EDITORHEIGHT) {
            graph[getCellCoord(mouse.y)][getCellCoord(mouse.x)] = color
        }
    }
}

function startRect() {
    if(mouse.x>0 && mouse.x<EDITORWIDTH) {
        if(mouse.y>0 && mouse.y<EDITORHEIGHT) {
            rectangles.push(new Rectangle(getCellCoord(mouse.x),getCellCoord(mouse.y)))
        }
    }
}

function drawRect() {
    rectangles.forEach(r => {
        if(mouse.x>0 && mouse.x<EDITORWIDTH) {
            if(mouse.y>0 && mouse.y<EDITORHEIGHT) {
                r.widthcell = getCellCoord(mouse.x)-r.xcell
                r.heightcell = getCellCoord(mouse.y)-r.ycell
            }
        }
    })
}

function finishRect() {
    rectangles.forEach(r => {
        if(mouse.x>0 && mouse.x<EDITORWIDTH) {
            if(mouse.y>0 && mouse.y<EDITORHEIGHT) {
                r.complete()
            }
        }
    })
    rectangles.pop()
}

function pickingColor() {
    if(mouse.x>0 && mouse.x<EDITORWIDTH) {
        if(mouse.y>0 && mouse.y<EDITORHEIGHT) {
            canvas.style.cursor = 'crosshair'
        }
    }
}

function pickColor() {
    if(mouse.x>0 && mouse.x<EDITORWIDTH) {
        if(mouse.y>0 && mouse.y<EDITORHEIGHT) {
            selectedColor = graph[getCellCoord(mouse.y)][getCellCoord(mouse.x)]
        }
    }
}

function pushButtons() {
    buttons.forEach(b => {
        if(mouse.x>b.x && mouse.x<b.x+b.width) {
            if(mouse.y>b.y && mouse.y<b.y+b.height) {
                b.callback()
            }
        }
    })
}

function strokeButtons() {
    switch(tool) {
        case 'brush':
            buttons[0].stroke()
            break
        case 'rect':
            buttons[1].stroke()
            break
        case 'erase':
            buttons[2].stroke()
            break
        case 'pick':
            buttons[3].stroke()
            break
        default:
            break
    }
    if(grid) buttons[4].stroke()
}

function mouseDown() {
    selectColor()
    pushButtons()
    switch(tool) {
        case 'brush':
            drawColor()
            break
        case 'rect':
            startRect()
            break
        case 'erase':
            drawColor('transparent')
            break
        case 'pick':
            pickColor()
        default:
            break
    }
}

function mouseUp() {
    finishRect()
}

function mouseMove() {
    if(mouse.pressed) {
        switch(tool) {
            case 'brush':
                drawColor()
                break
            case 'rect':
                drawRect()
                break
            case 'erase':
                drawColor('transparent')
                break
            case 'pick':
                pickColor()
                break
            default:
                break
        }
    }
}

addEventListener('mousedown',({pageX,pageY}) => {
    mouse.pressed = true
    mouseDown()
})

addEventListener('mouseup',({pageX,pageY}) => {
    mouse.pressed = false
    mouseUp()
})

addEventListener('mousemove',({pageX,pageY}) => {
    mouse.x = pageX
    mouse.y = pageY
    mouseMove()
})