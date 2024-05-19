const LABEL = 'PlatformJS (sprint 4)'
const AUTHOR = 'Donato Modugno'
const DATE = '01/05/2023'
const DEVICE = navigator.userAgent.match(/mobile/i) ? 'mobile' : 'desktop'
const BORDER = 10
const BORDER_RADIUS = BORDER
const BS = 32 /* BLOCK_SIZE */
const BPW = 20 /* BLOCK_PER_WIDTH */
const BPH = 15 /* BLOCK_PER_HEIGHT */
const WIDTH = BS*BPW
const HEIGHT = BS*BPH
const TICKS = 64
const SPEED = 4/BS
const SPEED_STEP = SPEED/(BS/2)
const GRAVITY = -0.5/BS
const JUMP = 12.8/BS

const ASSETS_PATH = './assets/'
const PNG_SIZE = 32

const mediafiles = {
    players:{
        'SMAS-SMB1-Mario':
            {sprite:null},
    },
    backgrounds:{
        'SMAS-SMB1-hills':
            {sprite:null, frames:1, layer:2, id_bg:1, id_comp:1},
        'SMAS-SMB1-clouds':
            {sprite:null, frames:1, layer:1, id_bg:2, id_comp:1},
        'SMAS-SMB1-sky':
            {sprite:null, frames:1, layer:0, id_bg:3, id_comp:1},
    },
    blocks:{
        'SMAS-SMB1-block1':
            {sprite:null, frames:1, id_block:0, w:1, h:1, collision_type:0},
        'SMAS-SMB1-ground1':
            {sprite:null, frames:1, id_block:1, w:1, h:1, collision_type:0},
        'SMAS-SMB1-ground2':
            {sprite:null, frames:1, id_block:2, w:1, h:1, collision_type:0},
        'SMAS-SMB1-ground3':
            {sprite:null, frames:1, id_block:3, w:1, h:1, collision_type:0},
        'SMAS-SMB1-pipe1':
            {sprite:null, frames:1, id_block:4, w:2, h:1, collision_type:0},
        'SMAS-SMB1-pipe2':
            {sprite:null, frames:1, id_block:5, w:2, h:1, collision_type:0},
        'SMAS-SMB1-bridge1':
            {sprite:null, frames:1, id_block:6, w:1, h:1, collision_type:1},
        'SMAS-SMB1-question1':
            {sprite:null, frames:4, id_block:7, w:1, h:1, collision_type:0},
        'SMAS-SMB1-question2':
            {sprite:null, frames:1, id_block:8, w:1, h:1, collision_type:0},
    },
    bgos:{
        'SMAS-SMB1-fence1':
            {sprite:null, frames:1, w:1, h:1},
        'SMAS-SMB1-fence2':
            {sprite:null, frames:1, w:1, h:1},
        'SMAS-SMB1-fence3':
            {sprite:null, frames:1, w:1, h:1},
    },
    npcs:{
        'SMAS-SMB1-peach':
            {sprite:null, frames:1, w:1, h:1.8, xvel:0, yvel:0, type:'peach'},
        'SMAS-SMB1-goomba1':
            {sprite:null, frames:2, w:1, h:1, xvel:-0.25, yvel:0, type:'goomba'},
    },
    music:{
        'tsmbm-loop':
            {audio:null},
        'smb-overworld':
            {audio:null},
    },
    sounds:{
        'player-died':
            {audio:null},
        'player-jump':
            {audio:null},
        'player-stomp':
            {audio:null},
        'block-hit':
            {audio:null},
        'coin':
            {audio:null},
    },
    ui:{
        'font':
            {sprite:null},
        'button':
            {sprite:null},
    }
}

Object.keys(mediafiles).forEach(type => {
    if(type=='players' || type=='backgrounds' || type=='blocks' || type=='bgos' || type=='npcs' || type=='ui') {
        Object.keys(mediafiles[type]).forEach(key => {
            mediafiles[type][key].sprite = new Image()
            mediafiles[type][key].sprite.src = ASSETS_PATH+'/'+type+'/'+key+'.png'
        })
    }
    if(type=='music') {
        Object.keys(mediafiles[type]).forEach(key => {
            mediafiles[type][key].audio = new Audio(ASSETS_PATH+'/'+type+'/'+key+'.mp3')
            mediafiles[type][key].audio.loop = true
            mediafiles[type][key].audio.volume = 0.4
        })
    }
    if(type=='sounds') {
        Object.keys(mediafiles[type]).forEach(key => {
            mediafiles[type][key].audio = new Audio(ASSETS_PATH+'/'+type+'/'+key+'.ogg')
        })
    }
})