const MOBILE = navigator.userAgent.match(/mobile/i) ? true : false
const WIDTH = 480
const HEIGHT = 480
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
const gamekeys = {
    up:{key:'ArrowUp',editable:false},
    down:{key:'ArrowDown',editable:false},
    left:{key:'ArrowLeft',editable:false},
    right:{key:'ArrowRight',editable:false},
    menu:{key:'m',editable:true},
    rotcw:{key:'s',editable:true},
    rotccw:{key:'a',editable:true},
}
let scene = null
function sceneChange(scene_new) {
    if(scene_new=='menu') sceneInitMenu()
    if(scene_new=='game') sceneInitGame()
    if(scene_new=='credits') sceneInitCredits()
    scene = scene_new
}

const canvas = document.getElementById('game')
canvas.width = WIDTH
canvas.height = HEIGHT
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

function renderRect(color,x,y,w,h) {
    ctx.fillStyle = color
    ctx.fillRect(x,y,w,h)
}
function renderCircle(color,x,y,r) {
    ctx.beginPath()
    ctx.arc(x,y,r,0,2*Math.PI)
    ctx.fillStyle = color
    ctx.fill()
}
function renderText(text,color,x,y,size,centered=false,maxw=undefined,font='sans-serif') {
    ctx.font = size+'px '+font
    centered ? ctx.textAlign = 'center' : ctx.textAlign = 'left'
    ctx.fillStyle = color
    ctx.fillText(text,x,y+size,maxw)
}
function distance(x1,x2,y1,y2) {
    return Math.sqrt((x1-x2)**2+(y1-y2)**2)
}
function messageBox(text,type='alert',placeholder='') {
    let value
    if(type=='alert') value = alert(text)
    if(type=='confirm') value = confirm(text)
    if(type=='prompt') value = prompt(text,placeholder)
    Object.keys(keys).forEach(k => keys[k].pressed = false)
    return value
}