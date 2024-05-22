const BS = 32 /* BLOCK_SIZE */
const BPW = 20 /* BLOCKS_PER_WIDTH */
const BPH = 15 /* BLOCKS_PER_HEIGHT */
const [W,H] = [BS*BPW,BS*BPH]
const canvas = document.getElementById('surface')
canvas.width = W
canvas.height = H
canvas.style.border = 'solid black 5px'
canvas.style.borderRadius = '10px'
const ctx = canvas.getContext('2d')
// const title = document.createElement('h1')
// const subtitle = document.createElement('p')
// title.style.textAlign = 'center'
// title.innerText = 'PlatformJS (sprint 5)'
// subtitle.innerText = 'by Donato Modugno, 2024-05-01'
const wrapper = document.getElementById('wrapper')
// wrapper.before(title)
// wrapper.after(subtitle)

const keys = {
    ArrowUp:{pressed:false},
    ArrowDown:{pressed:false},
    ArrowLeft:{pressed:false},
    ArrowRight:{pressed:false},
    z:{pressed:false},
    x:{pressed:false},
    c:{pressed:false},
    v:{pressed:false},
    ' ':{pressed:false},
}

const mouse = {
    x:0,
    y:0,
    pressed:false
}

const assets = {
    graphics:{
        players:{
            'SMAS-SMB1-Mario':{ext:'.png'},
        },
        blocks:{
            'SMAS-SMB1-block1':{ext:'.png',w:1,h:1,frames:1,collisions:['T','B','L','R']},
            'SMAS-SMB1-ground1':{ext:'.png',w:1,h:1,frames:1,collisions:['T']},
            'SMAS-SMB1-ground2':{ext:'.png',w:1,h:1,frames:1,collisions:['T','L']},
            'SMAS-SMB1-ground3':{ext:'.png',w:1,h:1,frames:1,collisions:['T','R']},
        },
        backgrounds:{
            'SMAS-SMB1-hills':{ext:'.png',frames:1},
            'SMAS-SMB1-clouds':{ext:'.png',frames:1},
            'SMAS-SMB1-sky':{ext:'.png',frames:1},
        },
        ui:{
            'SMAS-SMB1-font':{},
        },
    },
    music:{
        'SMAS-SMB1-overworld':{ext:'.mp3',volume:0.4,loop:true},
        'TSMBM-PressStart-loop':{ext:'.mp3',volume:0.4,loop:true},
    },
}

const global = {}

const lib = {
    ...utils,
    sceneChange(scene,{type='fade',sleep=1000}={type:'none'}) {
        if(type=='none') {
            global.scene = scene
            window[scene+'SceneInit']()
        } else {
            global.scene = scene
            window[scene+'SceneInit']()
        }
    },
    loadResources() {
        Object.entries(assets.graphics).forEach(([type,list]) => {
            Object.entries(list).forEach(([id,sprite]) => {
                sprite.img = new Image()
                sprite.img.src = 'res/graphics/'+type+'/'+id+sprite.ext
            })
        })
        Object.entries(assets.music).forEach(([id,music]) => {
            music.audio = new Audio('res/music/'+id+music.ext)
            music.audio.volume = music.volume
            music.audio.loop = music.loop
        })
    },
    musicPlay() {
        assets.music['TSMBM-PressStart-loop'].audio.play()
    },
    musicStop() {
        assets.music['TSMBM-PressStart-loop'].audio.pause()
        assets.music['TSMBM-PressStart-loop'].audio.currentTime = 0
    },
    renderRect(x,y,w,h,color) {
        global.ctx.fillStyle = color
        global.ctx.fillRect(x,y,w,h)
    },
    renderCircle(x,y,r,color) {
        global.ctx.fillStyle = color
        global.ctx.beginPath()
        global.ctx.arc(x,y,r,0,2*Math.PI)
        global.ctx.fill()
    },
    renderClear() {
        global.ctx.clearRect(0,0,W,H)
    },
    renderLinearGradient(x,y,w,h,stops) {
        const gradient = global.ctx.createLinearGradient(x,y,x+w,y+h)
        Object.entries(stops).forEach(([offset,color]) => {
            gradient.addColorStop(offset,color)
        })
        lib.renderRect(x,y,w,h,gradient)
    },
    renderRadialGradient(x,y,r,stops) {
        const gradient = global.ctx.createRadialGradient(x,y,0,x,y,r)
        Object.entries(stops).forEach(([offset,color]) => {
            gradient.addColorStop(offset,color)
        })
        lib.renderRect(x-r,y-r,r*2,r*2,gradient)
    },
}