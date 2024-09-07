import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class SoundBtn extends Container{
    private soundOnBtn! : Sprite;
    private soundOffBtn! : Sprite;
    constructor(){
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        this.on('pointerdown', this.onBtnClicked, this);
        this.interactive = true;
    }

    private onBtnClicked() :void{
        if(!this){
           return;
        }
        if(this.soundOnBtn.visible){
            this.soundOnBtn.visible = false;
            this.soundOffBtn.visible = true;
            Game.the.app.stage.emit("STOP_BG_SOUND");
        }else{
            this.soundOnBtn.visible = true;
            this.soundOffBtn.visible = false;
            Game.the.app.stage.emit("PLAY_BG_SOUND");
        }
    }

    private setPosition() :void{
       this.position.set((window.innerWidth - this.width)*0.9, (window.innerHeight - this.height)*0.9)
    }

    private init() :void{
        this.soundOnBtn = new Sprite(Game.the.app.loader.resources['soundOnBtn'].texture);
        this.addChild(this.soundOnBtn);
        this.soundOffBtn = new Sprite(Game.the.app.loader.resources['soundOffBtn'].texture);
        this.addChild(this.soundOffBtn);
        this.soundOffBtn.visible = false;
    }

    


}