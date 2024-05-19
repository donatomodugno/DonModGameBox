class Button {
    constructor(x,y,text='',callback=(() => {})) {
        this.x = x
        this.y = y
        this.size = 20
        this.w = this.size*text.length*1.4
        this.h = this.size*4
        this.text = text
        this.callback = callback
    }

    render() {
        ctx.fillStyle = 'grey'
        if(checkArea(mouse.x,mouse.y,this.x,this.y,this.w,this.h)) {
            canvas.style.cursor = 'pointer'
            ctx.fillStyle = 'lightgrey'
            if(mouse.pressed) ctx.fillStyle = 'black'
        }
        ctx.fillRect(this.x,this.y,this.w,this.h)
        ctx.fillStyle = 'red'
        ctx.font = this.size*2+'px Courier New'
        ctx.fillText(this.text,this.x+this.size,this.y+this.h-this.size)
    }
}

function startGame() {
    parseLevel()
    scene = 'game'
}

function startEditor() {
    parseLevel()
    scene = 'editor'
}

let buttons = [
    new Button(50,50,'Start game',() => startGame()),
    new Button(50,150,'Start editor',() => startEditor()),
]

function keyPressOnceMenu(key) {
    switch(key) {
        case 'up':
            buttons[0].callback()
            break
        case 'down':
            buttons[1].callback()
            break
        case 'left':
            break
        case 'right':
            break
        case 'mouse':
            break
    }
}

function keyReleaseOnceMenu(key) {
    switch(key) {
        case 'up':
            break
        case 'down':
            break
        case 'left':
            break
        case 'right':
            break
        case 'mouse':
            buttons.forEach(b => {
                if(checkArea(mouse.x,mouse.y,b.x,b.y,b.w,b.h))
                    b.callback()
            })
            break
    }
}

function MenuLoop() {
    buttons.forEach(b => b.render())
}