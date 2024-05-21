function MainGame() {
    clearScreen()
    drawGraph()
    if(grid) drawGrid()
    drawMenu()
    strokeButtons()
    drawButtons()
}

function animate() {
    requestAnimationFrame(animate)
    MainGame()
}

animate()