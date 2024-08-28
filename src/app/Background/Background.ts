import { Application, Container, Graphics, Loader, Sprite, Texture } from "pixi.js";
import { Game } from "../game";

export class Background extends Container{
    private popupBg !: Graphics;

    constructor(){
        super();
        this.intializeBg();
    }

    private intializeBg() :void{
        this.popupBg = new Graphics();
        this.popupBg.beginFill(0x000000,0.6);
        this.popupBg.drawRect(0, 0, 4000,4000);
        this.popupBg.endFill();
        this.addChild(this.popupBg);
    }

}


