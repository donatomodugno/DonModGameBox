const canvas_t = document.getElementById('transition')
canvas_t.width = W
canvas_t.height = H
canvas_t.style.border = 'solid black 5px'
canvas_t.style.borderRadius = '10px'
const ctx_t = canvas_t.getContext('2d')

function renderMaskTest() {
    global.ctx = ctx_t
    lib.renderClear()
    lib.renderRect(120,120,400,200,'#0008')
    global.ctx = ctx
}