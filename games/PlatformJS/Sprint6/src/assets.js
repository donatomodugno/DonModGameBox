const sprites = {
    'font':{path:'res/graphics/ui/'},
    'button':{path:'res/graphics/ui/'},
    'SMAS-SMB1-grass':{path:'res/graphics/tiles/'},
    'SMAS-SMB1-world-Mario':{path:'res/graphics/players/'},
    'SMAS-SMB1-path1':{path:'res/graphics/paths/'},
    'SMAS-SMB1-path-levels':{path:'res/graphics/paths/'},
    'SMAS-SMB1-block1':{path:'res/graphics/blocks/'},
    'SMAS-SMB1-bridge1':{path:'res/graphics/blocks/'},
}
for(id in sprites) {
    sprites[id].img = new Image()
    sprites[id].img.src = sprites[id].path+id+'.png'
}

const fonts = {
    'SMAS':'url(res/fonts/super-mario-all-stars.otf)',
}
for(id in fonts)
    document.fonts.add(new FontFace(id,fonts[id]))