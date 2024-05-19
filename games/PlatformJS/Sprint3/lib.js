const lib = {
    invertAxis: function (pos,offset) {
        return offset-pos
    },
    getCoords: function (x,y,cellsize) {
        return [cellsize*x,cellsize*y]
    },
    getCameraCoords: function (x,y,camera) {
        return [x-camera.x,y+camera.y]
    },
    createGradient: function (ctx,top='white',bottom='black',height) {
        let gradient = ctx.createLinearGradient(0,0,0,height)
        gradient.addColorStop(0,top)
        gradient.addColorStop(1,bottom)
        return gradient
    },
    checkCollisionBorder: function (dir,a,b,diff) {
        if((dir=='up' || dir=='right') && (a<=b && a+diff>b))
            return true
        if((dir=='down' || dir=='left') && (a>=b && a+diff<b))
            return true
        return false
    },
    checkCollisionSolid: function (dir,a,b,diff,a1,a2,b1,b2) {
        if(a1<b2 && a2>b1)
            return this.checkCollisionBorder(dir,a,b,diff)
        return false
    },
    checkIntersection: function (xa1,xa2,xb1,xb2,ya1,ya2,yb1,yb2) {
        if(xa1<xb2 && xa2>xb1)
            if(ya1<yb2 && ya2>yb1)
                return true
        return false
    },
    checkArea: function (ax,ay,bx,by,bw,bh) {
        if(ax>bx && ax<bx+bw)
            if(ay>by && ay<by+bh)
                return true
        return false
    },
}