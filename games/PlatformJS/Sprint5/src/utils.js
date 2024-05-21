const utils = {
    distance(ax,ay,bx,by) {
        return Math.sqrt((bx-ax)**2+(by-ay)**2)
    },
    checkIntersection1D(ax1,ax2,bx1,bx2) {
        if(ax2>bx1&&ax1<bx2) return true
        return false
    },
    checkIntersection2D(ax,ay,aw,ah,bx,by,bw,bh) {
        if(utils.checkIntersection1D(ax,ax+aw,bx,bx+bw))
            if(utils.checkIntersection1D(ay,ay+ah,by,by+bh))
                return true
        return false
    },
    checkIntersectionPoint(ax,ay,aw,ah,px,py) {
        if(utils.checkIntersection2D(ax,ay,aw,ah,px,py,0,0))
            return true
        return false
    },
}