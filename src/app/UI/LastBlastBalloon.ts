import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";
import { CommonEvents } from "@/Common/CommonEvents";

export class LastBlastBalloon extends Container {
    private textImage !: Sprite;
    private lastballoonImage !: Sprite;
    private count: number = 0;
    private lastTexture: string = "";

    constructor() {
        super();
        this.init();
        // this.setPosition();
        // Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
        Game.the.app.stage.on(CommonEvents.CHANGE_THEME, this.changeTheme, this);
        Game.the.app.stage.on("UPDATE_LASTBALLOON", this.updateLastBalloon, this);
    }

    private onBtnClicked(): void {
        // if(!this){
        //    return;
        // }

    }

    private changeTheme(isHalloween : boolean) : void{
        if(isHalloween){
           this.textImage.texture = Game.the.app.loader.resources['uiPanel_halloween'].textures?.[`Chain_Reaction.png`] as Texture;
        }else{
            this.textImage.texture = Game.the.app.loader.resources['uiPanel'].textures?.[`Chain_Reaction.png`] as Texture;
        }
    }

    private updateLastBalloon(texture: string): void {
        if (this.lastTexture === texture || (texture.includes(this.lastTexture))) {
            this.count++;
        } else {
            this.count = 1;
        }
        this.lastTexture = texture;
        if(texture.includes('halloween_balloon_')){
            if(texture.includes('orange')){
                this.lastTexture = 'orange'
            }else if(texture.includes('white')){
                this.lastTexture = 'white'
            }
        }
        this.lastballoonImage.visible = true;
        if(texture.includes('halloween_balloon_')){
            this.lastballoonImage.texture = Game.the.app.loader.resources['balloons_halloween'].textures?.[`${texture}.png`] as Texture;
        }else{
            this.lastballoonImage.texture = Game.the.app.loader.resources['balloons'].textures?.[`${texture}.png`] as Texture;
        }
        this.lastballoonImage.position.set((this.textImage.width - this.lastballoonImage.width) / 2, this.textImage.height + 15);
        if (this.count >= 2) {
            Game.the.app.stage.emit("show_chainreaction_popup", this.lastTexture, this.count);
            CommonConfig.the.setNormalScore(13);
        }else{
            CommonConfig.the.setNormalScore(10);
        }
    }

    private destroyAfterGameRemoved(): void {
        this.destroy({ children: true, texture: true, baseTexture: true })
    }

    // private 

    private init(): void {
        let textTure: Texture = Game.the.app.loader.resources['uiPanel'].textures?.[`Chain_Reaction.png`] as Texture;
        this.textImage = new Sprite(textTure);
        this.addChild(this.textImage);
        textTure = Game.the.app.loader.resources['balloons'].textures?.[`balloon_orange.png`] as Texture;
        this.lastballoonImage = new Sprite(textTure);
        this.addChild(this.lastballoonImage);
        this.lastballoonImage.visible = false;
        this.lastballoonImage.scale.set(0.4);

        this.lastballoonImage.position.set((this.textImage.width - this.lastballoonImage.width) / 2, this.textImage.height + 15);
    }




}