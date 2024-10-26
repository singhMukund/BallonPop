import { Container } from "pixi.js";
import { RainDrop } from "./RainDrop";
import { Balloon } from "./Balloon";

export class RainManager extends Container {
    private raindrops: RainDrop[] = [];
    private balloonList: Balloon[];
    
    constructor(balloonList: Balloon[]) {
        super();
        this.balloonList = balloonList;
        this.startRain();
    }

    private startRain(): void {
        setInterval(() => {
            const rainDrop = new RainDrop(Math.random() * 5 + 2); // Random speed
            this.raindrops.push(rainDrop);
            this.addChild(rainDrop);
        }, 300);
    }

    public update(delta: number): void {
        this.raindrops.forEach((rainDrop, index) => {
            rainDrop.update(delta, this.balloonList);
            if (rainDrop.destroyed) {
                this.raindrops.splice(index, 1);
            }
        });
    }
}
