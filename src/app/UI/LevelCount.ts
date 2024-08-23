import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class Levelcard extends Container{
    private bg! : Graphics;
    private levelTagText !: Text;
    private textContainer !: Container;
    constructor(){
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
    }

    private setPosition() :void{
        let scale : number= 1;
        let w = (window.innerWidth -30)/3;
        scale = w / this.textContainer.width ;
        if(this.textContainer.width * 3 > (window.innerWidth - 30)){
            this.textContainer.scale.set(scale * 0.98);
        }else{
            this.textContainer.scale.set(1);
        }
        let x = (window.innerWidth  * 0.99) - (this.textContainer.width + 15);
        this.textContainer.position.set(x,0);
    }

    private init() :void{
        this.textContainer = new Container();
        this.addChild(this.textContainer);

        this.bg = new Graphics();
        this.bg.beginFill(0x000000,0.6);
        this.bg.drawRoundedRect(0, 0, 240,80,8);
        this.bg.endFill();
        this.position.set(0, 10);
        this.textContainer.addChild(this.bg);

        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center'
        });
        
        this.levelTagText = new Text(`Level : ${CommonConfig.the.getLevelsNo()}`, buttonStyle);
        this.levelTagText.x = (this.bg.width - this.levelTagText.width)/2;
        this.levelTagText.y = (this.bg.height - this.levelTagText.height)/2;
        this.textContainer.addChild(this.levelTagText);
    }

    setText() :void{
        this.levelTagText.text = `Level : ${CommonConfig.the.getLevelsNo()}`;
        this.levelTagText.x = (this.bg.width - this.levelTagText.width)/2;
    }


}