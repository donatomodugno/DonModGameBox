const scene_menu = {
    init(menu_data) {
        this.initial = menu_data
        this.background = '#EEE'
        this.initButtons()
    },
    initButtons() {
        this.buttons = []
        this.initial.buttons.forEach(button => {
            this.buttons.push(new Button(button.x,button.y,button.action,{text:button.text,size:button.size,centered:button.centered}))
        })
    },
    loop(dt) {
        renderClear()
        renderRect(0,0,W,H,this.background)
        this.buttons.forEach(button => {
            button.render()
        })
    },
    onKeyPress(key) {},
    onKeyRelease(key) {
        if(key=='Enter') this.buttons[0].action()
    },
    onMousePress() {},
    onMouseRelease() {
        this.buttons.forEach(button => {
            if(this.checkCollitionPoint(mouse.x,mouse.y,button.x,button.x+button.w,button.y,button.y+button.h)) {
                button.action()
            }
        })
    },
    checkCollitionPoint(ax,ay,bx1,bx2,by1,by2) {
        return ax>bx1 && ax<bx2 && ay>by1 && ay<by2
    },
}
class Button {
    constructor(x,y,action,{text='',size=2,centered=true}={}) {
        this.LS = 20 /* Letter Size */
        this.PS = 8 /* Padding Size */
        this.SH = 32 /* Sprite Height */
        this.size = size
        this.w = size*(this.LS*text.length+this.PS*2)
        this.h = size*(this.SH)
        this.x = centered ? x-this.w/2 : x
        this.y = centered ? y-this.h/2 : y
        this.xc = centered ? x : x+this.w/2 /* X Center */
        this.yc = centered ? y : y+this.h/2 /* Y Center */
        this.action = action
        this.text = text
    }
    render() {
        let src_y = 0
        if(scene.checkCollitionPoint(mouse.x,mouse.y,this.x,this.x+this.w,this.y,this.y+this.h)) {
            wrapper.style.cursor = 'pointer'
            src_y = 16
            if(mouse.pressed)
                src_y = 32
        }
        renderSprite(
            this.x,
            this.y,
            this.PS*this.size,
            this.h,
            {tileset:'button',src:{x:0,y:src_y,w:4,h:16}}
        )
        for(let i=0;i<this.text.length;i++) renderSprite(
            this.x+(this.PS+i*this.LS)*this.size,
            this.y,
            this.LS*this.size,
            this.h,
            {tileset:'button',src:{x:4,y:src_y,w:4,h:16}}
        )
        renderSprite(
            this.x+(this.PS+this.LS*this.text.length)*this.size,
            this.y,
            this.PS*this.size,
            this.h,
            {tileset:'button',src:{x:8,y:src_y,w:4,h:16}}
        )
        renderTextFilled(
            this.xc,this.yc,this.text,
            {size:2,align:'center',baseline:'middle'}
        )
    }
}

class Tree {
    constructor(x,y,tree) {
        this.x = x
        this.y = y
        this.root = tree
        this.curr = tree
        this.selected = 0
    }
    enter() {
        if(typeof this.curr[this.selected]=='function')
            this.curr[this.selected]()
        if(typeof this.curr[this.selected]=='object')
            this.curr = this.curr[this.selected]
    }
}

const menu_splash = {
    buttons:[
        {x:W/2,y:H/2,action:() => scene.changeScene(scene_menu,menu_main),text:'  Play!  ',size:2,centered:true},
    ]
}
const menu_main = {
    buttons:[
        {x:50,y:50,action:() => transition.init(scene_world,world_1,{speed_in:5,speed_out:5,delay:800}),text:'Start game',size:2,centered:false},
        {x:50,y:160,action:() => {},text:'Start editor',size:2,centered:false},
    ]
}