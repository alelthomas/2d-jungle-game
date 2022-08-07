class Player extends Sprite {
    constructor({
        position,
        velocity,
        imageSrc,
        scale = 1,
        noFrames = 1,
        offset = {
            x: 0,
            y: 0
        },
        sprites,
        attackRange = {
            offset: {},
            width: undefined,
            height: undefined
        }
    }) {
        super({
            position,
            imageSrc,
            scale,
            noFrames,
            offset
        })

        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.prevKey;
        this.attackRange = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackRange.offset,
            width: attackRange.width,
            height: attackRange.height
        }
        this.attacking;
        this.health = 100;
        this.currFrame = 0;
        this.framesSeen = 0;
        this.framePause = 3;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }
    update() {
        this.draw();

        if (!this.dead) this.animateFrames();

        this.attackRange.position.x = this.position.x + this.attackRange.offset.x;
        this.attackRange.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y; //every time we loop, we'll move this amount

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 30) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }
    attack() {
        this.switchImage("hit");
        this.attacking = true;
    }

    getHit() {
        this.health -= 10;
        if (this.health <= 0) {
            this.switchImage("dead");
        } else {
            this.switchImage("attacked");
        }
    }

    switchImage(sprite) {

        if (this.image === this.sprites.dead.image) {
            if (this.currFrame === this.sprites.dead.noFrames - 1) {
                this.dead = true;
            }
            return;
        }

        if (this.image === this.sprites.hit.image &&
            this.currFrame < this.sprites.hit.noFrames - 1) {
            return;
        }

        if (this.image === this.sprites.attacked.image &&
            this.currFrame < this.sprites.attacked.noFrames - 1) {
            return;
        }

        switch (sprite) {
            case "idle":
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.noFrames = this.sprites.idle.noFrames;
                    this.currFrame = 0;
                }
                break;
            case "run":
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.noFrames = this.sprites.run.noFrames;
                    this.currFrame = 0;
                }
                break;
            case "run_left":
                if (this.image !== this.sprites.run_left.image) {
                    this.image = this.sprites.run_left.image;
                    this.noFrames = this.sprites.run_left.noFrames;
                    this.currFrame = 0;
                }
                break;
            case "run_right":
                if (this.image !== this.sprites.run_right.image) {
                    this.image = this.sprites.run_right.image;
                    this.noFrames = this.sprites.run_right.noFrames;
                    this.currFrame = 0;
                }
                break;
            case "jump":
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.noFrames = this.sprites.jump.noFrames;
                    this.currFrame = 0;
                }
                break;
            case "fall":
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.noFrames = this.sprites.fall.noFrames;
                    this.currFrame = 0;
                }
                break;
            case "hit":
                if (this.image !== this.sprites.hit.image) {
                    this.noFrames = this.sprites.hit.noFrames;
                    this.image = this.sprites.hit.image;
                    this.currFrame = 0;
                }
                break;
            case "attacked":
                if (this.image !== this.sprites.attacked.image) {
                    this.noFrames = this.sprites.attacked.noFrames;
                    this.image = this.sprites.attacked.image;
                    this.currFrame = 0;
                }
                break;
            case "dead":
                if (this.image !== this.sprites.dead.image) {
                    this.noFrames = this.sprites.dead.noFrames;
                    this.image = this.sprites.dead.image;
                    this.currFrame = 0;
                }
                break;
        }
    }
}
