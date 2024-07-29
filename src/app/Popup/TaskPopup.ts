import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import gsap from "gsap";

export class TaskPopup extends Container{
    private popupBg !: Graphics;
    private text !: Text;
    constructor() {
        super();
        this.init();
    }

    private init() :void{
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