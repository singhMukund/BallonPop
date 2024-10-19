import { Container, Graphics, Sprite, Text, TextStyle, Ticker } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";
import { LoadingScreenTest } from "../LoadingIntro/LoadingScreenTest";

export class TimerContainer extends Container{
    // private bg! : Sprite;
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
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
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
        this.textContainer.position.set((window.innerWidth - this.textContainer.width),window.innerHeight * 0.18);
    }

    private init() :void{
        this.textContainer = new Container();
        // this.addChild(this.textContainer);
        // this.bg = new Sprite(Game.the.app.loader.resources['bg_rectangle'].texture);
        // this.bg.scale.set(0.8);
        // this.bg.alpha = 0;
        // this.bg.beginFill(0x2786e8,1);
        // this.bg.drawRoundedRect(0, 0, 160,55,8);
        // this.bg.endFill();
        // this.position.set(1920/2 - 120, 10);
        // this.textContainer.addChild(this.bg);
        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: '#671BD4',
            align: 'center',
        });
        
        this.timerText = new Text(`${3.00}`, buttonStyle);
        // this.timerText.x = (this.bg.width - this.timerText.width)/2;
        // this.timerText.y = (this.bg.height - this.timerText.height)/2;
        this.textContainer.addChild(this.timerText);
    }

    resetTimer() :void{
        this.lastTime = 0;
        this.elapsedTime = 0;
    }

    private destroyAfterGameRemoved() :void{
        this.destroy({ children: true,texture : true, baseTexture : true })
    }

    update(delta: number) {
        this.elapsedTime += delta / Ticker.shared.FPS;
        this.lastTime = this.totalTiming - Number(this.elapsedTime.toFixed(2));
        CommonConfig.the.setTimer(this.lastTime);
        if(this.lastTime <= 0){
            CommonConfig.the.setTimer(0);
            // this.timerText.text = `${0}.00 s`;
        //    
            return
        }
        // this.timerText.text = `${this.lastTime.toFixed(2)}s`;
        // this.timerText.x = (this.bg.width - this.timerText.width)/2;
    }
}