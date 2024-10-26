import { Container, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { Game } from "../game";
import gsap from "gsap";
import { Balloon } from "./Balloon";

export class RainDrop extends Container {
    private raindrop!: Sprite;
    private speed: number;
    private directionX: number;
    private directionY: number;
    destroyed: boolean = false;

    constructor(speed: number) {
        super();
        this.speed = speed;
        this.directionX = 0; 
        this.directionY = 1;
        this.interactive = true;
        this.initRainDrop();
    }

    private initRainDrop(): void {
        this.raindrop = new Sprite(Game.the.app.loader.resources["raindrop"].texture);
        this.raindrop.scale.set(0.1);
        this.addChild(this.raindrop);
        this.x = Math.random() * window.innerWidth;
        this.y = -this.raindrop.height;
    }

    public update(delta: number, balloons: Balloon[]): void {
        if (this.destroyed) {
            return;
        }
        this.y += this.speed * this.directionY * delta;
        if (!this.destroyed && this.y > window.innerHeight) {
            this.completeDestroy();
        }
    }

    private completeDestroy(): void {
        this.destroyed = true;
        this.destroy();
        this.removeAllChild();
    }

    private removeAllChild(): void {
        while (this.children.length) {
            this.removeChildren();
        }
    }

    private checkCollision(balloon: Balloon): boolean {
        if((this.x > balloon.x - balloon.width && this.x < balloon.x + balloon.width) && (this.y > balloon.y - balloon.height && this.y < balloon.y + balloon.height) ){
            return true;
        }else{
            return false;
        }
    }

    private onRainDropHitBalloon(balloon: Balloon): void {
        this.completeDestroy();
        this.visible = false;
    }
}
