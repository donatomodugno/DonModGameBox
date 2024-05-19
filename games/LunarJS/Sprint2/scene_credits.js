const CREDITS_BG_SQUARE_SIZE = 40
const CREDITS_BG_COLOR_1 = '#9bf'
const CREDITS_BG_COLOR_2 = '#acf'
const CREDITS_MARGIN = WIDTH/8
const CREDITS_FONT_SIZE = 20
const CREDITS_FONT_COLOR = 'white'
const CREDITS_LINE_SPACING = 50
let bg_tick = null
let credits = []

function sceneInitCredits() {
    bg_tick = 0.0
    credits = [
        'LunarJS',
        '',
        'Developed by Donato A. Modugno',
        'A cross-platform clone of Lunar Limit',
        '',
        'Donato Modugno (c) 2024'
    ]
}

function keyPressOnceCredits(key) {
    if(key=='m' || key=='Escape') sceneChange('menu')
}
function keyReleaseOnceCredits(key) {
    return
}

function animateCredits() {
    function renderBG() {
        for(let i=0;i<WIDTH/CREDITS_BG_SQUARE_SIZE+1;i++)
            for(let j=0;j<HEIGHT/CREDITS_BG_SQUARE_SIZE+1;j++)
                renderRect(
                    (i+j)%2==0 ? CREDITS_BG_COLOR_1 : CREDITS_BG_COLOR_2,
                    j*CREDITS_BG_SQUARE_SIZE-bg_tick,
                    i*CREDITS_BG_SQUARE_SIZE-bg_tick,
                    CREDITS_BG_SQUARE_SIZE,
                    CREDITS_BG_SQUARE_SIZE
                )
        bg_tick += 0.4
        bg_tick %= CREDITS_BG_SQUARE_SIZE
    }
    function renderCreditsBG() {
        renderRect('#000a',CREDITS_MARGIN,CREDITS_MARGIN,WIDTH-CREDITS_MARGIN*2,HEIGHT-CREDITS_MARGIN*2)
    }
    function renderCredits() {
        credits.forEach((line,i) => {
            renderText(
                line,
                CREDITS_FONT_COLOR,
                WIDTH/2,
                CREDITS_MARGIN*2+CREDITS_FONT_SIZE*i,
                CREDITS_FONT_SIZE,
                true,
                WIDTH-CREDITS_MARGIN*3
            )
        })
    }
    renderBG()
    renderCreditsBG()
    renderCredits()
}