class Button {
    constructor(x,y,text='',callback=(() => {})) {
        this.x = x
        this.y = y
        this.zoom = 2 //TODEL
        this.w = this.zoom*2*(text.length+2)*9
        this.h = this.zoom*32
        this.text = text
        this.callback = callback
        this.status = 'default'
    }

    render() {
        this.status = 'default'
        if(lib.checkArea(mouse.x,mouse.y,this.x-this.w/2,this.y-this.h/2,this.w,this.h)) {
            canvas.style.cursor = 'pointer'
            this.status = 'active'
            if(mouse.pressed) this.status = 'pressed'
        }
        renderBlock(this.text,this.x,this.y,this.zoom*2,true,['default','active','pressed'].indexOf(this.status))
        renderText(this.text,this.x,this.y,this.zoom,true)
    }
}

function renderBlock(text,x,y,zoom=1,centered=true,status=0) {
    if(centered) {
        for(let i=0;i<=text.length;i++) {
            ctx.drawImage(mediafiles.ui.button.sprite,4,16*status,4,16,x+(i-text.length/2-0.5)*9*zoom,y-8*zoom,9*zoom,16*zoom)
        }
        ctx.drawImage(mediafiles.ui.button.sprite,0,16*status,4,16,x-(text.length/2+0.5)*9*zoom-4*zoom,y-8*zoom,4*zoom,16*zoom)
        ctx.drawImage(mediafiles.ui.button.sprite,8,16*status,4,16,x+(text.length/2+0.5)*9*zoom,y-8*zoom,4*zoom,16*zoom)
    }
    // else {
    //     //TODO
    // }
}
        
function renderText(text,x,y,zoom=1,centered=true) {
    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    text.split('').forEach((c,i) => {
        const j = alphabet.indexOf(c.toUpperCase())
        if(j>=0) {
            if(centered) ctx.drawImage(mediafiles.ui.font.sprite,2,(j+32)*32,18,16,x+(i*18-text.length/2*18)*zoom,y-8*zoom,18*zoom,16*zoom)
            else ctx.drawImage(mediafiles.ui.font.sprite,2,(j+32)*32,18,16,x+i*18*zoom,y,18*zoom,16*zoom)
        }
    })
}

function startGame() {
    parseLevel()
    mediafiles.music['smb-overworld'].audio.play()
    scene = 'game'
}

let buttons = [
    new Button(WIDTH/2,HEIGHT/2,'Start game',() => startGame()),
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
                if(lib.checkArea(mouse.x,mouse.y,b.x-b.w/2,b.y-b.h/2,b.w,b.h))
                    b.callback()
            })
            break
    }
}

function MenuLoop() {
    buttons.forEach(b => b.render())
}