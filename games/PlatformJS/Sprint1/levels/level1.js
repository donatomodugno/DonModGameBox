const level1 = {
    width: 15,
    height: 15,
    player: {
        x: 1,
        y: 2,
    },
    blocks: [],
    npcs: [],
}

for(let i=0;i<9;i++) level1.blocks.push({
    id:1,
    x:i,
    y:0,
})
for(let i=0;i<9;i++) level1.blocks.push({
    id:1,
    x:11+i,
    y:0,
})
level1.blocks.push({id:1,x:7,y:1})
for(let i=0;i<3;i++) level1.blocks.push({
    id:2,
    x:3+i,
    y:5,
})
level1.blocks.push({id:1,x:4,y:9})