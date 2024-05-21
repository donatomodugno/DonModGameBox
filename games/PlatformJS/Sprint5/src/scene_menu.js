class Button {
    constructor(x,y,text,callback = ()=>{}) {
        this.x = x
        this.y = y
        this.w = 400
        this.h = 80
        this.text = text
        this.callback = callback
    }
    render() {
        if(lib.checkIntersectionPoint(this.x,this.y,this.w,this.h,mouse.x,mouse.y))
            lib.renderRect(this.x,this.y,this.w,this.h,'yellow')
        else
            lib.renderRect(this.x,this.y,this.w,this.h,'orange')
    }
    update() {}
}

const menu = {}

function menuSceneInit() {
    menu.buttons = [
        new Button(50,50,'Start game',() => lib.sceneChange('game')),
    ]
    menu.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    lib.musicStop()
}

function menuSceneKeyPress(key) {
    if(key==' ') lib.sceneChange('game')
    if(key=='mouse') {
        menu.buttons.forEach(b => {
            if(lib.checkIntersectionPoint(b.x,b.y,b.w,b.h,mouse.x,mouse.y))
                b.callback()
        })
    }
}

function menuSceneKeyRelease(key) {}

function menuSceneLoop() {
    // lib.renderRect(30,30,300,100,'grey')
    menu.buttons.forEach(b => b.render())
}