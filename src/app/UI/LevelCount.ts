import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class Levelcard extends Container{
    private bg! : Sprite;
    private levelTagText !: Text;
    public textContainer !: Container;
    constructor(){
        super();
        this.init();
        // this.setPosition();
        // Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
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
        // this.bg.beginFill(0x2786e8,1);
        // this.bg.drawPolygon([-50,-45,
        //     0,-65,
        //     50,-45,
        //     50,-5,
        //     0,15,
        //     -50,-5
        //   ]);
        // this.bg.endFill();
        // this.bg.pivot.set(0.5,0.5);
        // this.bg.position.set(this.bg.width, this.bg.height -10);
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

    setText() :void{
        this.levelTagText.text = `Level: ${CommonConfig.the.getLevelsNo()}`;
        this.levelTagText.x = (this.bg.width - this.levelTagText.width)/2;
    }


}