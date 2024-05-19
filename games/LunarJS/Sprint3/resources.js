const MOBILE = navigator.userAgent.match(/mobile/i) ? true : false
const [W,H] = [480,480]
const keys = {
    Enter:{pressed:false},
    Backspace:{pressed:false},
    Escape:{pressed:false},
    ' ':{pressed:false},
    ArrowUp:{pressed:false},
    ArrowDown:{pressed:false},
    ArrowLeft:{pressed:false},
    ArrowRight:{pressed:false},
    a:{pressed:false},
    s:{pressed:false},
    m:{pressed:false},
}

const canvas = document.getElementById('game')
canvas.width = W
canvas.height = H
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

function renderRect(x,y,w,h,color) {
    ctx.fillStyle = color
    ctx.fillRect(x,y,w,h)
}
function renderCircle(x,y,r,color) {
    ctx.beginPath()
    ctx.arc(x,y,r,0,2*Math.PI)
    ctx.fillStyle = color
    ctx.fill()
}
function renderText(text,x,y,color,{size=W/24,font='sans-serif',centered=false,maxw=undefined}) {
    ctx.font = size+'px '+font
    centered ? ctx.textAlign = 'center' : ctx.textAlign = 'left'
    ctx.fillStyle = color
    ctx.fillText(text,x,y+size,maxw)
}
function distance(ax,ay,bx,by) {
    return Math.sqrt((ax-bx)**2+(ay-by)**2)
}
function messageBox(text,type='alert',placeholder='') {
    let value
    if(type=='alert') value = alert(text)
    if(type=='confirm') value = confirm(text)
    if(type=='prompt') value = prompt(text,placeholder)
    Object.keys(keys).forEach(k => keys[k].pressed = false)
    return value
}