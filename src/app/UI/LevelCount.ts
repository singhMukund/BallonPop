import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";
import { CommonEvents } from "@/Common/CommonEvents";

export class Levelcard extends Container{
    private bg! : Sprite;
    private levelTagText !: Text;
    public textContainer !: Container;
    constructor(){
        super();
        this.init();
        // this.setPosition();
        // Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on(CommonEvents.CHANGE_THEME, this.changeTheme, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
    }

    private destroyAfterGameRemoved() :void{
        this.destroy({ children: true,texture : true, baseTexture : true })
    }

    // private 

    private init() :void{
        this.textContainer = new Container();
        this.addChild(this.textContainer);
        let textTure : Texture = Game.the.app.loader.resources['uiPanel'].textures?.[`levelBg.png`] as Texture; 
        this.bg = new Sprite(textTure);
        this.bg.scale.set(1.8);
        this.textContainer.addChild(this.bg);

        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 54,
            fill: 'white',
            align: 'center',
            fontWeight:'bold'
        });
        
        this.levelTagText = new Text(`Level: ${CommonConfig.the.getLevelsNo()}`, buttonStyle);
        this.levelTagText.x = (this.bg.width - this.levelTagText.width)/2;
        this.levelTagText.y = (this.bg.height - this.levelTagText.height)*0.3;
        this.textContainer.addChild(this.levelTagText);
    }

    private changeTheme(isHalloween : boolean) : void{
        if(isHalloween){
           this.bg.texture = Game.the.app.loader.resources['uiPanel_halloween'].textures?.[`levelBg_halloween.png`] as Texture;
        }else{
            this.bg.texture = Game.the.app.loader.resources['uiPanel'].textures?.[`levelBg.png`] as Texture;
        }
    }

    setText() :void{
        this.levelTagText.text = `Level: ${CommonConfig.the.getLevelsNo()}`;
        this.levelTagText.x = (this.bg.width - this.levelTagText.width)/2;
    }


}