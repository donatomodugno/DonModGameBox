let last = 0
let scene = {
    changeScene(new_scene,data) {
        new_scene.init(data)
        scene = {...scene,...new_scene}
    }
}

scene.changeScene(scene_menu,menu_splash)
transition.state = 'none'

function loop(now) {
    const dt = now - last
    last = now
    wrapper.style.cursor = 'default'
    if(transition.state!='none')
        transition.loop(dt/10)
    else
        scene.loop(dt/10)
    requestAnimationFrame(loop)
}

addEventListener('load',loop)
addEventListener('keydown',({key}) => {
    if(key in keys_pressed && !keys_pressed[key]) {
        keys_pressed[key] = true
        scene.onKeyPress(key)
    }
})
addEventListener('keyup',({key}) => {
    if(key in keys_pressed) {
        keys_pressed[key] = false
        scene.onKeyRelease(key)
    }
})
addEventListener('mousedown',({clientX,clientY}) => {
    mouse.pressed = true
    mouse.last_pressed.x = clientX
    mouse.last_pressed.y = clientY
    scene.onMousePress()
})
addEventListener('mouseup',({clientX,clientY}) => {
    mouse.pressed = false
    mouse.last_released.x = clientX
    mouse.last_released.y = clientY
    scene.onMouseRelease()
})
addEventListener('mousemove',({clientX,clientY}) => {
    mouse.x = clientX
    mouse.y = clientY
})