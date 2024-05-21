const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const WIDTH = 600
const HEIGHT = 400
const EDITORWIDTH = 400
const EDITORHEIGHT = 400
const EDITORCELL = 10
const MENUWIDTH = 200
const MENUHEIGHT = 400
const MENUCELL = 20
const GRIDSIZE = 1
const GRIDCOLOR = 'grey'
canvas.width = WIDTH
canvas.height = HEIGHT

const mouse = {
    x:0,
    y:0,
    pressed:false
}

let grid = true
let selectedColor = 'black'
let tool = 'brush'
const graph = []
for(let i=0;i<EDITORHEIGHT/EDITORCELL;i++) {
    graph.push([])
    for(let j=0;j<EDITORWIDTH/EDITORCELL;j++) {
        graph[i].push('transparent')
    }
}