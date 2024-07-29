import { Container, Graphics, Text, TextStyle, Ticker } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";

export class TimerContainer extends Container{
    private bg! : Graphics;
    private timerText !: Text;
    private elapsedTime: number = 0;
    private lastTime: number = 0;
    private totalTiming : number = 30;
    constructor() {
        super();
        this.init();
    }

    private init() :void{
        this.bg = new Graphics();
        this.bg.beginFill(0x000000,0.6);
        this.bg.drawRoundedRect(0, 0, 240,80,8);
        this.bg.endFill();
        this.position.set(1920/2 - 120, 10);
        this.addChild(this.bg);

        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center'
        });
        
        this.timerText = new Text(`Timing : ${3.00}.00`, buttonStyle);
        this.timerText.x = (this.bg.width - this.timerText.width)/2;
        this.timerText.y = (this.bg.height - this.timerText.height)/2;
        this.addChild(this.timerText);
    }

    resetTimer() :void{
        this.lastTime = 0;
        this.elapsedTime = 0;
    }

    update(delta: number) {
        this.elapsedTime += delta / Ticker.shared.FPS;
        this.lastTime = this.totalTiming - Number(this.elapsedTime.toFixed(2));
        if(this.lastTime <= 0){
            this.timerText.text = `Time: ${0}.00 s`;
            CommonConfig.the.setGameOver(true);
            return
        }
        this.timerText.text = `Time: ${this.lastTime.toFixed(2)}s`;
    }
}