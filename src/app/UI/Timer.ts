import { Container, Graphics, Sprite, Text, TextStyle, Ticker } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class TimerContainer extends Container{
    private bg! : Sprite;
    private timerText !: Text;
    private elapsedTime: number = 0;
    private lastTime: number = 0;
    private totalTiming : number = 30;
    private textContainer !: Container;
    constructor() {
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
        this.textContainer.position.set((window.innerWidth - this.textContainer.width)/2 +5,20);
    }

    private init() :void{
        this.textContainer = new Container();
        this.addChild(this.textContainer);
        this.bg = new Sprite(Game.the.app.loader.resources['bg_rectangle'].texture);
        // this.bg.beginFill(0x2786e8,1);
        // this.bg.drawRoundedRect(0, 0, 160,55,8);
        // this.bg.endFill();
        // this.position.set(1920/2 - 120, 10);
        this.textContainer.addChild(this.bg);
        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center',
        });
        
        this.timerText = new Text(`Timing : ${3.00}.00`, buttonStyle);
        this.timerText.x = (this.bg.width - this.timerText.width)/2;
        this.timerText.y = (this.bg.height - this.timerText.height)/2;
        this.textContainer.addChild(this.timerText);
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
        this.timerText.x = (this.bg.width - this.timerText.width)/2;
    }
}