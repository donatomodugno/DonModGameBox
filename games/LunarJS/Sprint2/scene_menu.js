const MENU_FONT_SIZE = 20
const MENU_FONT_COLOR = 'white'
const MENU_LINE_SPACING = 50
const MENU_LEFT_MARGIN = WIDTH/3
const MENU_TOP_MARGIN = 160
const MENU_FOCUS_COLOR = 'red'
const MENU_LOCK_SCORR = false
const MENU_TITLE_FONT_SIZE = MENU_FONT_SIZE*2
const MENU_TITLE_TOP_MARGIN = 60

class Menu {
    constructor() {
        this.tree = {
            'Start game':{
                '1P game':() => sceneChange('game'),
            },
            'Settings':{
                'Controls':() => alert('Use A and S to rotate\nUse arrows to move\nUse M or Esc to return to menu'),
                'Toggle fullscreen':() => {
                    document.fullscreenElement ? document.exitFullscreen() : canvas.requestFullscreen()
                },
            },
            'Credits':() => sceneChange('credits'),
        }
        this.tree_curr = this.tree
        this.stack = []
        this.focus = 0
    }
}
let menu = null

function sceneInitMenu() {
    menu = new Menu()
}

function keyPressOnceMenu(key) {
    if(key=='Enter' || key=='s') {
        const entry = menu.tree_curr[Object.keys(menu.tree_curr)[menu.focus]]
        if(typeof entry=='function') entry()
        if(typeof entry=='object') {
            menu.stack.push(Object.keys(menu.tree_curr)[menu.focus])
            menu.tree_curr = entry
            menu.focus = 0
        }
    }
    if(key=='Backspace' || key=='a') {
        menu.tree_curr = menu.tree
        menu.stack.pop()
        menu.stack.forEach(entry => menu.tree_curr = menu.tree_curr[entry])
        menu.focus = 0
    }
    const entries = Object.keys(menu.tree_curr)
    if(MENU_LOCK_SCORR) {
        if(key=='ArrowDown' && menu.focus<entries.length-1) menu.focus++
        if(key=='ArrowUp' && menu.focus>0) menu.focus--
    } else {
        if(key=='ArrowDown') {
            menu.focus++
            menu.focus %= entries.length
        }
        if(key=='ArrowUp') {
            menu.focus += entries.length-1
            menu.focus %= entries.length
        }
    }
}
function keyReleaseOnceMenu(key) {
    return
}

function animateMenu() {
    renderRect('black',0,0,WIDTH,HEIGHT)
    renderText('LunarJS',MENU_FONT_COLOR,WIDTH/2,MENU_TITLE_TOP_MARGIN,MENU_TITLE_FONT_SIZE,true)
    Object.keys(menu.tree_curr).forEach((entry,i) => {
        renderText(entry,MENU_FONT_COLOR,MENU_LEFT_MARGIN,MENU_TOP_MARGIN+i*MENU_LINE_SPACING,MENU_FONT_SIZE)
    })
    renderCircle(
        MENU_FOCUS_COLOR,
        MENU_LEFT_MARGIN-MENU_FONT_SIZE,
        MENU_TOP_MARGIN+MENU_FONT_SIZE*3/5+menu.focus*MENU_LINE_SPACING,
        MENU_FONT_SIZE/3
    )
}