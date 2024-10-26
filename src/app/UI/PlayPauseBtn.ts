import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";
import { CommonEvents } from "@/Common/CommonEvents";

export class PlayPauseBtn extends Container{
    private pauseBtn! : Sprite;
    private playBtn! : Sprite;
    constructor(){
        super();
        this.init();
        // this.setPosition();
        // Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        this.on('pointerdown', this.onBtnClicked, this);
        Game.the.app.stage.on(CommonEvents.CHANGE_THEME, this.changeTheme, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
        this.interactive = true;
    }

    private onBtnClicked() :void{
        if(!this){
           return;
        }
        if(this.pauseBtn.visible){
            this.pauseBtn.visible = false;
            this.playBtn.visible = true;
            Game.the.app.stage.emit("PAUSE_BTN_CLICKED");
        }else{
            this.pauseBtn.visible = true;
            this.playBtn.visible = false;
            Game.the.app.stage.emit("PLAY_BTN_CLICKED");
        }
    }

    showPauseBtn() :void{
        this.playBtn.visible= false;
        this.pauseBtn.visible = true;
    }

    private destroyAfterGameRemoved() :void{
        this.destroy({ children: true,texture : true, baseTexture : true })
    }

    // private 

    private init() :void{
        let textTure : Texture = Game.the.app.loader.resources['uiPanel'].textures?.[`State_Pause.png`] as Texture; 
        this.pauseBtn = new Sprite(textTure);
        this.addChild(this.pauseBtn);
        textTure = Game.the.app.loader.resources['uiPanel'].textures?.[`State_Play.png`] as Texture; 
        this.playBtn = new Sprite(textTure);
        this.addChild(this.playBtn);
        this.playBtn.visible = false;
    }

    private changeTheme(isHalloween : boolean) : void{
        if(isHalloween){
           this.pauseBtn.texture = Game.the.app.loader.resources['uiPanel_halloween'].textures?.[`State_Pause_halloween.png`] as Texture;
           this.playBtn.texture = Game.the.app.loader.resources['uiPanel_halloween'].textures?.[`State_Play_halloween.png`] as Texture;
        }else{
            this.pauseBtn.texture = Game.the.app.loader.resources['uiPanel'].textures?.[`State_Pause.png`] as Texture;
            this.playBtn.texture = Game.the.app.loader.resources['uiPanel'].textures?.[`State_Play.png`] as Texture;
        }
    }

    


}