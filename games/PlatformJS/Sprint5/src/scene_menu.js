function menuSceneInit() {}

function menuSceneKeyPress(key) {
    if(key==' ') lib.sceneChange('game')
}

function menuSceneKeyRelease(key) {}

function menuSceneLoop() {
    lib.renderRect(30,30,300,100,'grey')
}