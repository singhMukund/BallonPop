import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";
import { CommonEvents } from "@/Common/CommonEvents";

export class SoundBtn extends Container{
    private soundOnBtn! : Sprite;
    private soundOffBtn! : Sprite;
    private closeBtn !: Sprite;
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

    private changeTheme(isHalloween : boolean) : void{
        if(isHalloween){
           this.soundOnBtn.texture = Game.the.app.loader.resources['uiPanel_halloween'].textures?.[`sound_on_halloween.png`] as Texture;
           this.soundOffBtn.texture = Game.the.app.loader.resources['uiPanel_halloween'].textures?.[`sound_off_halloween.png`] as Texture;
        }else{
            this.soundOnBtn.texture = Game.the.app.loader.resources['uiPanel'].textures?.[`sound_on.png`] as Texture;
            this.soundOffBtn.texture = Game.the.app.loader.resources['uiPanel'].textures?.[`sound_off.png`] as Texture;
        }
    }

    private onBtnClicked() :void{
        if(!this){
           return;
        }
        if(this.soundOnBtn.visible){
            this.soundOnBtn.visible = false;
            this.soundOffBtn.visible = true;
            CommonConfig.the.setIsSoundMuted(true);
            Game.the.app.stage.emit("STOP_BG_SOUND");
        }else{
            this.soundOnBtn.visible = true;
            this.soundOffBtn.visible = false;
            CommonConfig.the.setIsSoundMuted(false);
            Game.the.app.stage.emit("PLAY_BG_SOUND");
        }
    }

    // private 

    private init() :void{
        let textTure : Texture = Game.the.app.loader.resources['uiPanel'].textures?.[`sound_on.png`] as Texture; 
        this.soundOnBtn = new Sprite(textTure);
        this.addChild(this.soundOnBtn);
        textTure = Game.the.app.loader.resources['uiPanel'].textures?.[`sound_off.png`] as Texture; 
        this.soundOffBtn = new Sprite(textTure);
        this.addChild(this.soundOffBtn);
        this.soundOffBtn.visible = false;
    }

    private destroyAfterGameRemoved() :void{
        this.destroy({ children: true,texture : true, baseTexture : true })
    }

    


}