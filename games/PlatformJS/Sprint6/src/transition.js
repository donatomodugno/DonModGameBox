const transition = {
    init(
        new_scene,new_data,
        {
            delay=1000, color='black',
            type_in='fade',  speed_in=2,  center_x_in=W/2,  center_y_in=H/2,
            type_out='fade', speed_out=2, center_x_out=W/2, center_y_out=H/2,
        }={}
    ) {
        this.state = 'in'
        this.value = 0
        this.new_scene = new_scene
        this.new_data = new_data
        this.delay = delay
        this.color = color
        this.type = type_in
        this.speed = speed_in
        this.center_x = center_x_in
        this.center_y = center_y_in
        this.out = {
            type:type_out,
            speed:speed_out,
            center_x:center_x_out,
            center_y:center_y_out,
        }
    },
    loop(dt) {
        /* Rendering */
        this.renderClear()
        if(this.type=='fade') {
            this.renderRect(
                0,0,W,H,
                'color-mix(in srgb,'+this.color+' '+this.value+'%,transparent)'
            )
        }
        if(this.type=='circle') {
            ctx_t.globalCompositeOperation = 'source-out'
            this.renderCircle(
                this.center_x,
                this.center_y,
                this.findMaxCorner()*(1-this.value/100),
                'black'
            )
            this.renderRect(
                0,0,W,H,
                'color-mix(in srgb,'+this.color+' '+this.value+'%,transparent)'
            )
            ctx_t.globalCompositeOperation = 'source-over'
        }
        /* Update */
        if(this.state=='in') {
            this.value += this.speed * dt
            if(this.value>=100) {
                this.state = 'sleep'
                this.value = 100
                setTimeout(() => {
                    this.state = 'out'
                    this.type = this.out.type
                    this.speed = this.out.speed
                    this.center_x = this.out.center_x
                    this.center_y = this.out.center_y
                    scene.changeScene(this.new_scene,this.new_data)
                    scene.loop()
                    scene.loop()
                },this.delay)
            }
        }
        if(this.state=='out') {
            this.value -= this.speed * dt
            if(this.value<=0) {
                this.state = 'none'
                this.value = 0
                this.renderClear()
            }
        }
    },
    renderClear(x=0,y=0,w=W,h=H) {
        ctx_t.clearRect(x,y,w,h)
    },
    renderRect(x,y,w,h,color) {
        ctx_t.fillStyle = color
        ctx_t.fillRect(x,y,w,h)
    },
    renderCircle(x,y,r,color) {
        ctx_t.fillStyle = color
        ctx_t.beginPath()
        ctx_t.arc(x,y,r,0,Math.PI*2)
        ctx_t.fill()
    },
    findMaxCorner() {
        return Math.max(
            distance(this.center_x,this.center_y,0,0),
            distance(this.center_x,this.center_y,W,0),
            distance(this.center_x,this.center_y,0,H),
            distance(this.center_x,this.center_y,W,H),
        )
    },
}