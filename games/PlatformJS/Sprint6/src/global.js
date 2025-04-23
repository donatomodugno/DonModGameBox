const BS = 32 /* Block Size */
const BPW = 20 /* Blocks Per Width */
const BPH = 15 /* Blocks Per Height */
const [W,H] = [BS*BPW,BS*BPH] /* Width, Height */
const canvas = document.getElementById('surface')
canvas.width = W
canvas.height = H
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
const canvas_t = document.getElementById('transition')
canvas_t.width = W
canvas_t.height = H
const ctx_t = canvas_t.getContext('2d')
const wrapper = document.getElementById('wrapper')

function renderRect(x,y,w,h,color) {
    ctx.fillStyle = color
    ctx.fillRect(x,y,w,h)
}
function renderClear(x=0,y=0,w=W,h=H) {
    ctx.clearRect(x,y,w,h)
}
function renderCircle(x,y,r,color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x+r,y+r,r,0,Math.PI*2)
    ctx.fill()
}
function renderSprite(x,y,w,h,{tileset,src}) {
    ctx.drawImage(
        sprites[tileset].img,
        src.x,src.y,src.w,src.h,
        x,y,w,h
    )
}
function renderText(x,y,text,{color='black',size='100%',font='SMAS',align='left',baseline='alphabetic'}={}) {
    ctx.font = size+' '+font
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.fillStyle = color
    ctx.fillText(text,x,y)
}
function renderTextFilled(x,y,text,{size=1,align='left',baseline='top'}={}) {
    const FONT_FILLED = {
        SW:18, /* Sprite Width */
        SH:18, /* Sprite Height */
        SG:14, /* Sprite Gap */
        CHARS:[
            '!','"','#','$','%','&','\'',
            '(',')','*','+',',','-','.','/',
            '0','1','2','3','4','5','6','7','8','9',
            ':',';','<','=','>','?','@',
            'A','B','C','D','E','F','G','H','I','J','K','L','M',
            'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
            '[',']','^'
        ],
    }
    text = text.toUpperCase().split('')
    if(align=='center') x -= text.length*FONT_FILLED.SW*size/2
    if(align=='right') x -= text.length*FONT_FILLED.SW*size
    if(baseline=='middle') y -= FONT_FILLED.SH*size/2
    if(baseline=='bottom') y -= FONT_FILLED.SH*size
    text.forEach((letter,i) => {
        renderSprite(
            x+i*FONT_FILLED.SW*size,
            y,
            FONT_FILLED.SW*size,
            FONT_FILLED.SH*size,
            {
                tileset:'font',
                src:{
                    x:2,
                    y:FONT_FILLED.CHARS.indexOf(letter)*(FONT_FILLED.SH+FONT_FILLED.SG),
                    w:FONT_FILLED.SW,
                    h:FONT_FILLED.SH
                }
            }
        )
    })
}
function distance(ax,ay,bx,by) {
    return Math.sqrt((bx-ax)**2+(by-ay)**2)
}

const keys_pressed = {
    ArrowUp:false,
    ArrowDown:false,
    ArrowLeft:false,
    ArrowRight:false,
    c:false, /* Cheats */
    d:false, /* Debug */
    g:false, /* Grid */
    Enter:false,
}
const mouse = {
    x:0,
    y:0,
    pressed:false,
    last_pressed:{x:0,y:0},
    last_released:{x:0,y:0},
}