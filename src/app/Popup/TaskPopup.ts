import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import gsap from "gsap";
import { Game } from "../game";

export class TaskPopup extends Container{
    private popupBg !: Graphics;
    private text !: Text;
    private textContainer !: Container;

    constructor() {
        super();
        // this.setPosition();
        // Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
    }

    private setPosition() :void{
        this.textContainer.position.set((window.innerWidth)/2,(window.innerHeight)/2)
    }
    private init() :void{
        this.textContainer = new Container();
        this.addChild(this.textContainer);
        this.popupBg = new Graphics();
        this.popupBg.beginFill(0x000000,0.35);
        this.popupBg.drawRect(0, 0, 400,400);
        this.popupBg.endFill();
        this.addChild(this.popupBg);
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 72,
            fill: 'white',
            align: 'center'
        });
        this.text = new Text(`Task Locked`, style);
        this.x = 1920 / 2;
        this.y = 300;
        this.addChild(this.text);
        this.alpha = 0;
    }

    updateTask() :void{
        this.alpha = 0;
        this.text.text = `${CommonConfig.the.generateTask()}`
    }

    
}