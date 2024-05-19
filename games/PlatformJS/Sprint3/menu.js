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
        if(lib.checkArea(mouse.x,mouse.y,this.x,this.y,this.w,this.h)) {
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
    music.find(m => m.id=='Loop').audio.play()
    scene = 'game'
}

let buttons = [
    new Button(50,50,'Start game',() => startGame()),
]

function keyPressOnceMenu(key) {
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
        case 'space':
            buttons[0].callback()
            break
        case 'mouse':
            buttons.forEach(b => {
                if(lib.checkArea(mouse.x,mouse.y,b.x,b.y,b.w,b.h))
                    b.callback()
            })
            break
    }
}

function MenuLoop() {
    buttons.forEach(b => b.render())
}