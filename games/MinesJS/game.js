const level = []
const count = []
let lose = false
let win = false

function levelCreate() {
    for(let i=0;i<CPS;i++) {
        level.push([])
        for(let j=0;j<CPS;j++)
            level[i].push('covered')
    }
}

function levelFill() {
    for(let i=0;i<CPS;i++) {
        count.push([])
        for(let j=0;j<CPS;j++)
            count[i].push(Math.random()>1-DIFFICULTY ? 9 : 0)
    }
}

function levelCount() {
    for(let i=0;i<CPS;i++) {
        for(let j=0;j<CPS;j++) {
            if(count[i][j]!=9) {
                let mines = 0
                if(i>0 && j>0)
                    if(count[i-1][j-1]==9)
                        mines++
                if(i>0)
                    if(count[i-1][j]==9)
                        mines++
                if(i>0 && j<CPS-1)
                    if(count[i-1][j+1]==9)
                        mines++
                if(j<CPS-1)
                    if(count[i][j+1]==9)
                        mines++
                if(i<CPS-1 && j<CPS-1)
                    if(count[i+1][j+1]==9)
                        mines++
                if(i<CPS-1)
                    if(count[i+1][j]==9)
                        mines++
                if(i<CPS-1 && j>0)
                    if(count[i+1][j-1]==9)
                        mines++
                if(j>0)
                    if(count[i][j-1]==9)
                        mines++
                count[i][j] = (mines)
            }
        }
    }
}

function checkWin() {
    win = true
    for(let i=0;i<CPS && win;i++) {
        for(let j=0;j<CPS && win;j++) {
            if(count[i][j]<9 && level[i][j]!='opened')
                win = false
        }
    }
}

function getCellCoord(pos) {
    return Math.floor(pos/CS)
}

function getCellCoords(x,y) {
    return [Math.floor(x/CS),Math.floor(y/CS)]
}

function recursiveFlooding(i,j) {
    if(count[i][j]==9) lose = true
    else level[i][j] = 'opened'
    if(count[i][j]==0) {
        if(i>0 && j>0)
            if(level[i-1][j-1]=='covered')
                recursiveFlooding(i-1,j-1)
        if(i>0)
            if(level[i-1][j]=='covered')
                recursiveFlooding(i-1,j)
        if(i>0 && j<CPS-1)
            if(level[i-1][j+1]=='covered')
                recursiveFlooding(i-1,j+1)
        if(j<CPS-1)
            if(level[i][j+1]=='covered')
                recursiveFlooding(i,j+1)
        if(i<CPS-1 && j<CPS-1)
            if(level[i+1][j+1]=='covered')
                recursiveFlooding(i+1,j+1)
        if(i<CPS-1)
            if(level[i+1][j]=='covered')
                recursiveFlooding(i+1,j)
        if(i<CPS-1 && j>0)
            if(level[i+1][j-1]=='covered')
                recursiveFlooding(i+1,j-1)
        if(j>0)
            if(level[i][j-1]=='covered')
                recursiveFlooding(i,j-1)
    }
}

function checkBounds(i,j) {
    let flags = 0
    if(i>0 && j>0)
        if(level[i-1][j-1]=='flag')
            flags++
    if(i>0)
        if(level[i-1][j]=='flag')
            flags++
    if(i>0 && j<CPS-1)
        if(level[i-1][j+1]=='flag')
            flags++
    if(j<CPS-1)
        if(level[i][j+1]=='flag')
            flags++
    if(i<CPS-1 && j<CPS-1)
        if(level[i+1][j+1]=='flag')
            flags++
    if(i<CPS-1)
        if(level[i+1][j]=='flag')
            flags++
    if(i<CPS-1 && j>0)
        if(level[i+1][j-1]=='flag')
            flags++
    if(j>0)
        if(level[i][j-1]=='flag')
            flags++
    if(count[i][j]==flags) {
        if(i>0 && j>0)
            if(level[i-1][j-1]=='covered')
                recursiveFlooding(i-1,j-1)
        if(i>0)
            if(level[i-1][j]=='covered')
                recursiveFlooding(i-1,j)
        if(i>0 && j<CPS-1)
            if(level[i-1][j+1]=='covered')
                recursiveFlooding(i-1,j+1)
        if(j<CPS-1)
            if(level[i][j+1]=='covered')
                recursiveFlooding(i,j+1)
        if(i<CPS-1 && j<CPS-1)
            if(level[i+1][j+1]=='covered')
                recursiveFlooding(i+1,j+1)
        if(i<CPS-1)
            if(level[i+1][j]=='covered')
                recursiveFlooding(i+1,j)
        if(i<CPS-1 && j>0)
            if(level[i+1][j-1]=='covered')
                recursiveFlooding(i+1,j-1)
        if(j>0)
            if(level[i][j-1]=='covered')
                recursiveFlooding(i,j-1)
    }
}

function mousePressOnce(key) {
    switch(key) {
        case 'left':
            break
        case 'right':
            if(level[getCellCoord(mouse.y)][getCellCoord(mouse.x)]=='covered')
                level[getCellCoord(mouse.y)][getCellCoord(mouse.x)] = 'flag'
            else if(level[getCellCoord(mouse.y)][getCellCoord(mouse.x)]=='flag')
                level[getCellCoord(mouse.y)][getCellCoord(mouse.x)] = 'covered'
            break
    }
}

function mouseReleaseOnce(key) {
    switch(key) {
        case 'left':
            if(level[getCellCoord(mouse.y)][getCellCoord(mouse.x)]!='opened') {
                if(count[getCellCoord(mouse.y)][getCellCoord(mouse.x)]<9)
                    recursiveFlooding(getCellCoord(mouse.y),getCellCoord(mouse.x))
                if(count[getCellCoord(mouse.y)][getCellCoord(mouse.x)]==9)
                    lose = true
            } else checkBounds(getCellCoord(mouse.y),getCellCoord(mouse.x))
            checkWin()
            break
        case 'right':
            break
    }
}

function GameLoop() {
    function renderGrid() {
        ctx.globalAlpha = 0.2
        ctx.fillStyle = 'white'
        for(let i=0;i<CPS;i++) ctx.fillRect(0,i*CS,WIDTH,1)
        for(let j=0;j<CPS;j++) ctx.fillRect(j*CS,0,1,HEIGHT)
        ctx.globalAlpha = 1
    }

    function renderCells() {
        for(let i=0;i<CPS;i++) {
            for(let j=0;j<CPS;j++) {
                switch(level[i][j]) {
                    case 'covered':
                        ctx.fillStyle = 'grey'
                        if(mouse.left.pressed && getCellCoord(mouse.x)==j && getCellCoord(mouse.y)==i)
                            ctx.fillStyle = 'darkgrey'
                        break
                    case 'opened':
                        ctx.fillStyle = 'lightgrey'
                        break
                    case 'flag':
                        ctx.fillStyle = 'yellow'
                        break
                }
                if(lose && count[i][j]==9) ctx.fillStyle = 'red'
                ctx.fillRect(j*CS,i*CS,CS,CS)
            }
        }
    }

    function renderCount() {
        for(let i=0;i<CPS;i++) {
            for(let j=0;j<CPS;j++) {
                if(level[i][j]=='opened' && count[i][j]>0 && count[i][j]<9) {
                    ctx.fillStyle = NC[count[i][j]]
                    ctx.font = CS+'px Arial'
                    ctx.fillText(count[i][j],j*CS+CS*0.2,(i+1)*CS-CS*0.1)
                }
            }
        }
    }

    renderCells()
    renderGrid()
    renderCount()
    if(lose) setTimeout(() => alert("You lose!"),1)
    if(win) setTimeout(() => alert("You win!"),1)
}

function animate() {
    ctx.clearRect(0,0,WIDTH,HEIGHT)
    GameLoop()
    if(!lose && !win) requestAnimationFrame(animate)
}

function main() {
    levelCreate()
    levelFill()
    levelCount()
    requestAnimationFrame(animate)
}