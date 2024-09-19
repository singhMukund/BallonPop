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
        this.directionX = 0; // Straight down
        this.directionY = 1; // Straight down
        this.interactive = true;
        this.initRainDrop();
    }

    private initRainDrop(): void {
        this.raindrop = new Sprite(Game.the.app.loader.resources["raindrop"].texture);
        this.raindrop.scale.set(0.1);
        this.addChild(this.raindrop);

        // Set initial position randomly at the top of the screen
        this.x = Math.random() * window.innerWidth;
        this.y = -this.raindrop.height;

        // Define a circular hit area
        // this.hitArea = new Graphics();
        // this.hitArea.beginFill(0x000000, 0.1); // Transparent black fill for visualization
        // this.hitArea.drawCircle(0, 0, this.raindrop.height / 2);
        // this.hitArea.endFill();
        // this.hitArea.alpha = 0.5;
    }

    public update(delta: number, balloons: Balloon[]): void {
        if (this.destroyed) {
            return;
        }
        this.y += this.speed * this.directionY * delta;

        // Check for collision with balloons
        balloons.forEach((balloon) => {
            if (!balloon._destroyed_ && this.checkCollision(balloon)) {
                this.onRainDropHitBalloon(balloon);
            }
        });

        // Remove raindrop if it moves off-screen
        if (!this.destroyed && this.y > window.innerHeight) {
            this.completeDestroy();
        }
    }

    private completeDestroy(): void {
        this.destroyed = true;
        this.destroy();
        this.removeAllChild();
        // this.removeChild();
        // this.removeChildren(1)
    }

    private removeAllChild(): void {
        while (this.children.length) {
            this.removeChildren();
        }
    }

    private checkCollision(balloon: Balloon): boolean {
        // const raindropRadius = this.raindrop.height / 2;
        // const balloonRadius = balloon.height / 2;

        // // Calculate center points of raindrop and balloon
        // const raindropCenterX = this.x + raindropRadius;
        // const raindropCenterY = this.y + raindropRadius;
        // const balloonCenterX = balloon.x + balloonRadius  + this.width/3;
        // const balloonCenterY = balloon.y + balloonRadius  + this.height/3;

        // // Calculate distance between the two centers
        // const distanceX = raindropCenterX - balloonCenterX;
        // const distanceY = raindropCenterY - balloonCenterY;
        // const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // // Check if distance is less than the sum of the radii
        // return distance < (raindropRadius + balloonRadius);

        // const boundsA = this.getBounds();
        // const boundsB = balloon._bounds;

        // {
        //     "minX": 434.2326354980469,
        //     "minY": -10.258979797363281,
        //     "maxX": 444.2326354980469,
        //     "maxY": 6.541019916534424,
        //     "rect": null,
        //     "updateID": 3
        // }

        // {
        //     "minX": 375.3973083496094,
        //     "minY": -154.98800659179688,
        //     "maxX": 517.7897338867188,
        //     "maxY": 14.183349609375,
        //     "rect": null,
        //     "updateID": 7500
        // }
        // Adjust for scaling or transformation
        if((this.x > balloon.x - balloon.width && this.x < balloon.x + balloon.width) && (this.y > balloon.y - balloon.height && this.y < balloon.y + balloon.height) ){
            return true;
        }else{
            return false;
        }
    }

    private onRainDropHitBalloon(balloon: Balloon): void {
        // Remove or destroy the raindrop
        this.completeDestroy();
        this.visible = false;

        // Trigger balloon burst or any custom behavior
        // balloon.emit('balloonClicked', balloon);
    }
}
