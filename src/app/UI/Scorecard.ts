import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";

export class Scorecard extends Container{
    private bg! : Graphics;
    private scoreText !: Text;
    constructor(){
        super();
        this.init();
    }

    private init() :void{
        this.bg = new Graphics();
        this.bg.beginFill(0x000000,0.6);
        this.bg.drawRoundedRect(0, 0, 240,80,8);
        this.bg.endFill();
        this.position.set(100, 10);
        this.addChild(this.bg);

        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center'
        });
        
        this.scoreText = new Text(`Points : ${CommonConfig.the.getTotalScore()}`, buttonStyle);
        this.scoreText.x = (this.bg.width - this.scoreText.width)/2;
        this.scoreText.y = (this.bg.height - this.scoreText.height)/2;
        this.addChild(this.scoreText);
    }

    setText() :void{
        this.scoreText.text = `Points : ${CommonConfig.the.getTotalScore()}`;
        this.scoreText.x = (this.bg.width - this.scoreText.width)/2;
    }


}