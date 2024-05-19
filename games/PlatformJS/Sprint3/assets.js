const LABEL = 'PlatformJS (sprint 3)'
const AUTHOR = 'Donato Modugno'
const DATE = '22/02/2023'
const DEVICE = navigator.userAgent.match(/mobile/i) ? 'mobile' : 'desktop'
const BORDER = 10
const BORDER_RADIUS = BORDER
const SIZES = [[40,12,12],[32,15,15],[32,20,16]]
const SIZE_CONFIG = 2
const BS = SIZES[SIZE_CONFIG][0] /* BLOCK_SIZE */
const BPW = SIZES[SIZE_CONFIG][1] /* BLOCK_PER_WIDTH */
const BPH = SIZES[SIZE_CONFIG][2] /* BLOCK_PER_HEIGHT */
const WIDTH = BS*BPW
const HEIGHT = BS*BPH
const TICKS = 64
const SPEED = 4/BS
const SPEED_STEP = SPEED/16 //SPEED/BS
const GRAVITY = -0.5/BS //-1/BS
const JUMP = 12.8/BS //18/BS

const ASSETS_PATH = './assets/'
const PNG_SIZE = 32

const mediafiles = [
    {type:'players',id:'SMAS-SMB1-Mario'},
    {type:'backgrounds',id:'SMAS-SMB1-hills',frames:1,id_bg:1},
    {type:'backgrounds',id:'SMAS-SMB1-clouds',frames:1,id_bg:2},
    {type:'backgrounds',id:'SMAS-SMB1-sky',frames:1,id_bg:3},
    {type:'blocks',id:'SMAS-SMB1-block1',frames:1,id_block:0 ,w:1 ,h:1},
    {type:'blocks',id:'SMAS-SMB1-ground1',frames:1,id_block:1 ,w:1 ,h:1},
    {type:'blocks',id:'SMAS-SMB1-ground2',frames:1,id_block:2 ,w:1 ,h:1},
    {type:'blocks',id:'SMAS-SMB1-ground3',frames:1,id_block:3 ,w:1 ,h:1},
    {type:'blocks',id:'SMAS-SMB1-pipe1',frames:1,id_block:4 ,w:2 ,h:1},
    {type:'blocks',id:'SMAS-SMB1-pipe2',frames:1,id_block:5 ,w:2 ,h:1},
    {type:'blocks',id:'SMAS-SMB1-bridge1',frames:1,id_block:6 ,w:1 ,h:1},
    {type:'blocks',id:'SMAS-SMB1-question1',frames:4,id_block:7 ,w:1 ,h:1},
    {type:'music',id:'Loop'},
    {type:'sounds',id:'player-died'},
    {type:'sounds',id:'player-jump'},
    {type:'sounds',id:'block-hit'},
]

const sprites = {
    player: null,
    blocks: [],
    npcs: [],
    bgs: [],
    bgcomp: [[1,2,3]],
}
const music = []
const sounds = []

// mediafiles.forEach(s => {
//     switch(s.type) {
//         case 'backgrounds':
//             if(!Array.isArray(spritebgs[s.id])) spritebgs[s.id] = []
//             spritebgs[s.id][s.layer] = new Image()
//             spritebgs[s.id][s.layer].src = ASSETS_PATH+s.type+'/'+s.src+'.png'
//             break
//         case 'blocks':
//             spriteblocks[s.id] = new Image()
//             spriteblocks[s.id].src = ASSETS_PATH+s.type+'/'+s.src+'.png'
//             break
//     }
// })


mediafiles.filter(m => m.type=='players').forEach(m => {
    sprites.player = new Image()
    sprites.player.src = ASSETS_PATH+m.type+'/'+m.id+'.png'
})
mediafiles.filter(m => m.type=='blocks').forEach(m => {
    sprites.blocks[m.id_block] = new Image()
    sprites.blocks[m.id_block].src = ASSETS_PATH+m.type+'/'+m.id+'.png'
})
sprites.bgcomp.forEach((bgs,i) => {
    sprites.bgs[i+1] = []
    bgs.forEach(bg => {
        sprites.bgs[i+1][bg] = new Image()
        sprites.bgs[i+1][bg].src = ASSETS_PATH+'backgrounds/'+mediafiles.find(m => m.id_bg==bg).id+'.png'
    })
})
mediafiles.filter(m => m.type=='music').forEach(m => {
    let audio = new Audio(ASSETS_PATH+'music/'+m.id+'.mp3')
    audio.loop = true
    audio.volume = 0.4
    music.push({id:m.id, audio:audio})
})
mediafiles.filter(m => m.type=='sounds').forEach(m => {
    let audio = new Audio(ASSETS_PATH+'sounds/'+m.id+'.ogg')
    sounds.push({id:m.id, audio:audio})
})