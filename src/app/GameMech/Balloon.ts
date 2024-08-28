import { Container, Loader, Sprite, Text, TextStyle } from "pixi.js";
import { Game } from "../game";
import { CommonConfig } from "../../Common/CommonConfig";
import gsap from "gsap";

export class Balloon extends Container{
    private balloon!: Sprite;
    private _points: number;
    private _speed: number;
    private _destroyed_: boolean = false;
    private _scoreText_ !: Text;
    private textOnBalloon !:Text;
    private stringValueOnBalloon : string;
    private color_code : string[] = ['blue','green','orange','pink','red','yellow'];
    private randomColorCode : string = "";



    constructor(points: number, speed: number, textOnBalloon ?: string) {
        super();
        this._points = points;
        this._speed = speed;

        this.stringValueOnBalloon = textOnBalloon ? textOnBalloon : '';
        this.initBalloon();     
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
    }

    private setPosition() :void{
        if(window.innerHeight > window.innerWidth &&  this){
            this.scale.set(0.7);
        }
    }

    private initBalloon() :void{
        this.randomColorCode = CommonConfig.the.getRandomBalloon();
        this.balloon = new Sprite(Game.the.app.loader.resources[`balloon_${this.randomColorCode}`].texture);
        this.addChild(this.balloon);
        // this.balloon.anchor.set(0.5); 
        // this.balloon.position.set(this.balloon.width, this.balloon.height) // Center the symbol
        this.balloon.scale.set(0.5);

        this.interactive = true;
        this.buttonMode = true;

        const fontStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 'white',
            align: 'center'
        });

        this._scoreText_ = new Text(`${this._points}+`,fontStyle);
        this._scoreText_.x = (this.balloon.width - this._scoreText_.width)/2;
        this._scoreText_.y = (this.balloon.height - this._scoreText_.height)/2;
        this.addChild(this._scoreText_);


        this.textOnBalloon = new Text(`${this.stringValueOnBalloon}`,fontStyle);
        this.textOnBalloon.x =  (this.balloon.width - this.textOnBalloon.width)/2;
        this.textOnBalloon.y = (this.balloon.height - this.textOnBalloon.height)/2;
        this.addChild(this.textOnBalloon);
        this._scoreText_.alpha = 0;
        this.on('pointerdown', this.onBalloonClicked, this);
    }

    private onBalloonClicked() {
        this.calculatePoints();
        this._scoreText_.text = `${this._points}+`;
        this.emit('balloonClicked', this._points);
        this.destroyBalloon();
    }

    private destroyBalloon() {
        gsap.to(this.balloon, { alpha: 0, duration: 0.25, onComplete : this.upTween.bind(this) });
        gsap.to(this._scoreText_, { alpha: 1, duration: 0.25, onComplete : this.upTween.bind(this) });
    }

    private calculatePoints() :void{
        if(this.stringValueOnBalloon.length){
            if(CommonConfig.taskSubType[CommonConfig.the.currentSubTaskIndex] === "GREATER"){
                if(Number(this.stringValueOnBalloon) > Number(CommonConfig.the.randomValue)){
                    this._points = 10;
                }else{
                    this._points = 0;
                }
            }else{
                if(Number(this.stringValueOnBalloon) < Number(CommonConfig.the.randomValue)){
                    this._points = 10;
                }else{
                    this._points = 0;
                }
            }
        }else{
            this._points = 10;
        }
        if(this.randomColorCode === "red"){
            let randomScore : number[] = [40,-30];
            this._points = randomScore[Math.floor(Math.random() * randomScore.length)];
        }
    }

    private upTween() :void{
        gsap.to(this._scoreText_,{ y: this._scoreText_.y - 10, duration: 0.25, onStart : this.hideTween.bind(this)})
    }

    private hideTween() :void{
        gsap.to(this._scoreText_, { alpha: 0, duration: 0.5 , onComplete : this.completeDestroy.bind(this)});
    }

    private completeDestroy() :void{
        this._destroyed_ = true;
        this.destroy();
        this.removeAllChild();
        // this.removeChild();
        // this.removeChildren(1)
    }

    private removeAllChild():void{
        while(this.children.length){
            this.removeChildren();
        }
    }

    public get destroyed(): boolean {
        return this._destroyed_;
    }

    public update(delta: number) {
        if(CommonConfig.the.getGameOver()){
            return;
        }
        if(!this._destroyed_){
            this.y -= this._speed * delta;
            if (this.y + this.height < 0) {
                CommonConfig.the.setMissedBalloons(1);
                this.completeDestroy();
            }
        }
        
    }

}