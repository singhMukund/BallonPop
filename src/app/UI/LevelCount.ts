import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";

export class Levelcard extends Container{
    private bg! : Graphics;
    private levelTagText !: Text;
    constructor(){
        super();
        this.init();
    }

    private init() :void{
        this.bg = new Graphics();
        this.bg.beginFill(0x000000,0.6);
        this.bg.drawRoundedRect(0, 0, 240,80,8);
        this.bg.endFill();
        this.position.set(1560, 10);
        this.addChild(this.bg);

        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center'
        });
        
        this.levelTagText = new Text(`Level : ${CommonConfig.the.getLevelsNo()}`, buttonStyle);
        this.levelTagText.x = (this.bg.width - this.levelTagText.width)/2;
        this.levelTagText.y = (this.bg.height - this.levelTagText.height)/2;
        this.addChild(this.levelTagText);
    }

    setText() :void{
        this.levelTagText.text = `Level : ${CommonConfig.the.getLevelsNo()}`;
        this.levelTagText.x = (this.bg.width - this.levelTagText.width)/2;
    }


}