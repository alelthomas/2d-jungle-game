class Sprite {

    constructor({
        position,
        imageSrc,
        scale = 1,
        noFrames = 1,
        offset = {
            x: 0,
            y: 0
        }
    }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.noFrames = noFrames;
        this.currFrame = 0;
        this.framesSeen = 0;
        this.framePause = 3;
        this.offset = offset;
    }

    draw() {

        c.drawImage(
            this.image,
            this.currFrame * (this.image.width / this.noFrames),
            0,
            this.image.width / this.noFrames,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.noFrames) * this.scale,
            this.image.height * this.scale);
    }

    animateFrames() {

        this.framesSeen++;

        if (this.framesSeen % this.framePause === 0) {
            if (this.currFrame < this.noFrames - 1) {
                this.currFrame++;
            } else {
                this.currFrame = 0;
            }
        }
    }

    update() {

        this.draw();
        this.animateFrames();

    }
}
