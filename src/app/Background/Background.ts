import { Application, Container, Graphics, Loader, Sprite, Texture } from "pixi.js";
import { Game } from "../game";
import sound from "pixi-sound";

export class Background extends Container{
    private popupBg !: Graphics;
    private gameBg !: Sprite;

    constructor(){
        super();
        this.intializeBg();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("STOP_BG_SOUND", this.stopSound, this);
        Game.the.app.stage.on("PLAY_BG_SOUND", this.playBgSound, this);
    }

    private setPosition() :void{
        let scaleX : number = 0;
        let scaleY : number = 0;
        this.gameBg.width = 786;
        this.gameBg.height = 1650;
        if(window.innerHeight > window.innerWidth && this){
            scaleX = window.innerWidth / this.gameBg.width;
            scaleY = window.innerHeight / this.gameBg.height;
            this.gameBg.scale.set(scaleX,scaleY); 
        }else{
            scaleX = window.innerWidth / this.gameBg.width;
            this.gameBg.scale.set(scaleX); 
        }
        this.gameBg.position.set((window.innerWidth - this.gameBg.width) / 2 , (window.innerHeight - this.gameBg.height) / 2)
    }

    private intializeBg() :void{
        this.gameBg = new Sprite(Game.the.app.loader.resources['game_bg'].texture);
        this.addChild(this.gameBg);
        this.playBgSound();
    }

    private stopSound() :void{
        sound.stop('BgSound');  
    }

    private playBgSound() :void{
        if(sound.exists('BgSound')){
            sound.play('BgSound',{
                loop : true
            });      
        }
    }

    

}


