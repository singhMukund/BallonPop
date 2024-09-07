import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class Scorecard extends Container{
    private bg! : Sprite;
    private scoreText !: Text;
    private textContainer !: Container;
    constructor(){
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
    }

    private setPosition() :void{
        let scale : number= 1;
        let w = (window.innerWidth - 30)/3;
        scale = w / this.textContainer.width ;
        if(this.textContainer.width * 3 > (window.innerWidth - 30)){
            this.textContainer.scale.set(scale * 0.98);
        }else{
            this.textContainer.scale.set(1);
        }
        this.textContainer.position.set(3,10);
    }

    private init() :void{
        this.textContainer = new Container();
        this.addChild(this.textContainer);
        this.bg = new Sprite(Game.the.app.loader.resources['bg_rectangle'].texture);
        // this.bg.beginFill(0x2786e8,1);
        // this.bg.drawRoundedRect(0, 0, 160,55,8);
        // this.bg.endFill();
        this.position.set(0, 10);
        this.bg.scale.set(0.8);
        this.textContainer.addChild(this.bg);

        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center',
        });
        
        this.scoreText = new Text(`Points : ${CommonConfig.the.getTotalScore()}`, buttonStyle);
        this.scoreText.x = (this.bg.width - this.scoreText.width)/2;
        this.scoreText.y = (this.bg.height - this.scoreText.height)/2;
        this.textContainer.addChild(this.scoreText);
    }

    setText() :void{
        this.scoreText.text = `Points : ${CommonConfig.the.getTotalScore()}`;
        this.scoreText.x = (this.bg.width - this.scoreText.width)/2;
    }


}