import { Application, Container, Graphics, Loader, Sprite, Texture } from "pixi.js";
import { Game } from "../game";

export class Background extends Container{
    private popupBg !: Graphics;
    private gameBg !: Sprite;

    constructor(){
        super();
        this.intializeBg();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
    }

    private setPosition() :void{
        let scaleX : number = 0;
        let scaleY : number = 0;
        if(window.innerHeight > window.innerWidth && this){
            scaleY = window.innerHeight / this.gameBg.height;
            this.gameBg.scale.set(scaleY); 
        }else{
            scaleX = window.innerWidth / this.gameBg.width;
            this.gameBg.scale.set(scaleX); 
        }
        this.gameBg.position.set((window.innerWidth - this.gameBg.width) / 2 , (window.innerHeight - this.gameBg.height) / 2)
    }

    private intializeBg() :void{
        this.gameBg = new Sprite(Game.the.app.loader.resources['game_bg'].texture);
        this.addChild(this.gameBg);
    }

    

}


