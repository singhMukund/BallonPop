import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class CurrentScorecard extends Container{
    private bg! : Sprite;
    private scoreText !: Text;
    textContainer !: Container;
    constructor(){
        super();
        this.init();
        this.setPosition();
        // Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
    }

    private destroyAfterGameRemoved() :void{
        this.destroy({ children: true,texture : true, baseTexture : true })
    }

    private setPosition() :void{
       
    }

    private init() :void{
        this.textContainer = new Container();
        this.addChild(this.textContainer);
        let textTure : Texture = Game.the.app.loader.resources['uiPanel'].textures?.[`CurrentTXETextimg.png`] as Texture; 
        this.bg = new Sprite(textTure);
        // this.bg.beginFill(0x2786e8,1);
        // this.bg.drawRoundedRect(0, 0, 160,55,8);
        // this.bg.endFill();
        // this.position.set(0, 10);
        this.bg.scale.set(0.5);
        this.textContainer.addChild(this.bg);

        const buttonStyle = new TextStyle({
            fontFamily: 'Blomberg',
            fontSize: 46,
            fill: '#0092FF',
            align: 'center',
            fontWeight :'normal',
            lineHeight : 48
        });
        
        this.scoreText = new Text(`${CommonConfig.the.getCurrentScore()}`, buttonStyle);
        // this.scoreText.x = (this.bg.width - this.scoreText.width)/2;
        // this.scoreText.y = (this.bg.height - this.scoreText.height)/2;
        this.bg. y = - this.bg.height - 7;
        this.scoreText.x = (this.bg.width - this.scoreText.width)/2;
        this.textContainer.addChild(this.scoreText);
    }

    setText() :void{
        this.scoreText.text = `${CommonConfig.the.getCurrentScore()}`;
        this.scoreText.x = (this.bg.width - this.scoreText.width)/2;
    }


}