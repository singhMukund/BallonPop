import { AnimatedSprite, Container, DEG_TO_RAD, Graphics, Loader, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { Game } from "../game";
import { CommonConfig } from "../../Common/CommonConfig";
import gsap from "gsap";
import sound from "pixi-sound";
import MobileDetect from "mobile-detect";

export class Balloon extends Container {
    private balloon!: Sprite;
    private _points: number;
    private _speed: number;
    _destroyed_: boolean = false;
    private _scoreText_ !: Text;
    private textOnBalloon !: Text;
    private stringValueOnBalloon: string;
    private color_code: string[] = ['blue', 'green', 'orange', 'pink', 'red', 'yellow'];
    private randomColorCode: string = "";
    private burstAnimation !: AnimatedSprite;
    private ballonAndAnimContainer !: Container;
    private clickCount: number = 0
    windSpeed: number = 0;
    private direction: string = "leftToright" //''rightToleft
    private rotationTween: gsap.core.Tween | null = null;
    private balloonGraphics !: Graphics;



    constructor(points: number, speed: number, textOnBalloon?: string) {
        super();
        this._points = points;
        this._speed = speed;

        this.stringValueOnBalloon = textOnBalloon ? textOnBalloon : '';
        this.initBalloon();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        this.rotationLooptween();
    }

    private setPosition(): void {
        if (!this || this._destroyed_) {
            return
        }
        if (!this._destroyed_ && (window.innerHeight > window.innerWidth || !CommonConfig.the.isDesktop()) && this && this.balloon) {
            this.scale.set(0.7);
        }

        // this.balloonGraphics.position.set(this.width/3,this.height/3);

    }


    private initBalloon(): void {
        this.ballonAndAnimContainer = new Container();
        this.addChild(this.ballonAndAnimContainer);
        this.randomColorCode = CommonConfig.the.getRandomBalloon();
        this.balloon = new Sprite(Game.the.app.loader.resources[`balloon_${this.randomColorCode}`].texture);
        this.ballonAndAnimContainer.addChild(this.balloon);
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

        this._scoreText_ = new Text(`${this._points}+`, fontStyle);
        this._scoreText_.x = (this.balloon.width - this._scoreText_.width) / 2;
        this._scoreText_.y = (this.balloon.height - this._scoreText_.height) / 2;
        this.addChild(this._scoreText_);


        this.textOnBalloon = new Text(`${this.stringValueOnBalloon}`, fontStyle);
        this.textOnBalloon.x = (this.balloon.width - this.textOnBalloon.width) / 2;
        this.textOnBalloon.y = (this.balloon.height - this.textOnBalloon.height) / 2;
        this.addChild(this.textOnBalloon);
        this.createBurstAnim();
        this._scoreText_.alpha = 0;
        // this.balloonGraphics = new Graphics();
        // this.balloonGraphics.lineStyle(1, 0xff0000);
        // this.balloonGraphics.drawCircle(0, 0, this.height/2);
        // this.balloonGraphics.endFill();
        // this.addChild(this.balloonGraphics);
        // this.hitArea.contains()
        this.on('pointerdown', this.onBalloonClicked, this);
    }

    private createBurstAnim(): void {
        const frames: Texture[] = [];
        for (let i = 1; i <= 7; i++) {
            frames.push(Game.the.app.loader.resources[`BurstAnim_frame_0${i}`].texture);
        }
        this.burstAnimation = new AnimatedSprite(frames);
        this.burstAnimation.animationSpeed = 0.4; // Adjust animation speed as needed
        this.burstAnimation.loop = false;
        this.burstAnimation.visible = false;
        this.ballonAndAnimContainer.addChild(this.burstAnimation);
        this.burstAnimation.position.set(-this.burstAnimation.width / 3 + 5, -this.burstAnimation.height / 3 + 5);
    }



    private onBalloonClicked(event: PIXI.InteractionEvent) {
        event
        if (this.clickCount === 0 && this.randomColorCode === "golden") {
            this.scaleUp();
        } else if (this.clickCount === 0 && this.randomColorCode !== "golden") {
            this.destroyBalloonCalled();
        } else if (this.clickCount === 1 && this.randomColorCode === "golden") {
            this.destroyBalloonCalled();
        } else {
            return
        }
        this.clickCount += 1;
    }

    private scaleUp(): void {
        let finalScore: number = 1.2;
        if (window.innerHeight > window.innerWidth && this) {
            finalScore = 0.9
        } else {
            finalScore = 1.2
        }
        gsap.to(this.scale, { x: finalScore, y: finalScore, duration: 0.5 });
        // sound.play('oops_Sound');
    }

    private destroyBalloonCalled(): void {
        this.calculatePoints();
        this._scoreText_.text = `${this._points}+`;
        if (this._points === -30) {
            this._scoreText_.text = `${this._points}`;
        }
        this.emit('balloonClicked', this._points);
        this.destroyBalloon();
        this.burstAnimation.visible = true;
        this.burstAnimation.play();
        if (sound.exists('BurstSound')) {
            sound.play('BurstSound');
        }
    }

    private destroyBalloon() {
        gsap.to(this.ballonAndAnimContainer, { alpha: 0, duration: 0.25, onComplete: this.upTween.bind(this) });
        gsap.to(this._scoreText_, { alpha: 1, duration: 0.25, onComplete: this.upTween.bind(this) });
    }

    private calculatePoints(): void {
        if (this.stringValueOnBalloon.length) {
            if (CommonConfig.taskSubType[CommonConfig.the.currentSubTaskIndex] === "GREATER") {
                if (Number(this.stringValueOnBalloon) > Number(CommonConfig.the.randomValue)) {
                    this._points = 10;
                } else {
                    this._points = 0;
                }
            } else {
                if (Number(this.stringValueOnBalloon) < Number(CommonConfig.the.randomValue)) {
                    this._points = 10;
                } else {
                    this._points = 0;
                }
            }
        } else {
            this._points = 10;
        }
        if (this.randomColorCode === "golden") {
            let randomScore: number[] = [40, -30];
            this._points = randomScore[Math.floor(Math.random() * randomScore.length)];
            if (this._points === -30) {
                this._scoreText_.text = `${this._points}`;
            }
        } else {
            this._scoreText_.text = `${this._points}+`;
        }
    }

    private upTween(): void {
        gsap.to(this._scoreText_, { y: this._scoreText_.y - 10, duration: 0.25, onStart: this.hideTween.bind(this) })
    }

    private hideTween(): void {
        gsap.to(this._scoreText_, { alpha: 0, duration: 0.5, onComplete: this.completeDestroy.bind(this) });
    }

    private completeDestroy(): void {
        this._destroyed_ = true;
        this.destroy();
        this.removeAllChild();
        this.clickCount = 0;
        this.rotationTween?.kill();
        // this.removeChild();
        // this.removeChildren(1)
    }

    private removeAllChild(): void {
        while (this.children.length) {
            this.removeChildren();
        }
    }

    public get destroyed(): boolean {
        return this._destroyed_;
    }

    private rotationLooptween(): void {
        this.rotationTween = gsap.to(this.balloon, {
            duration: 10,
            rotation: 10 * DEG_TO_RAD,
            repeat: -1
        })
    }

    public update(delta: number) {
        if (CommonConfig.the.getGameOver()) {
            return;
        }
        if (!this._destroyed_) {
            this.y -= this._speed * delta;
            if (this.y < 2 * (window.innerHeight / 3) && this.windSpeed !== 0) {
                this.x += this.windSpeed * delta
            }
            // if(CommonConfig.the.isPortraitmobile()){
            //     if((this.x > (window.innerWidth * 0.25) + (this.balloon.width) || this.direction === "rightToleft") && !(this.x < (window.innerWidth * 0.5) - (this.balloon.width))){
            //         this.x -= this.windSpeed * delta;
            //         this.direction = "rightToleft"
            //     }else if((this.x < (window.innerWidth * 0.5) - (this.balloon.width) || this.direction === "leftToright") && !(this.x > (window.innerWidth * 0.25) + (this.balloon.width))){
            //         this.x += this.windSpeed * delta;
            //         this.direction = "leftToright"
            //     }
            // }else{
            //     if((this.x > (window.innerWidth * 0.5) + (this.balloon.width) || this.direction === "rightToleft") && !(this.x < (window.innerWidth * 0.5) - (this.balloon.width))){
            //         this.x -= this.windSpeed * delta;
            //         this.direction = "rightToleft"
            //     }else if((this.x < (window.innerWidth * 0.5) - (this.balloon.width) || this.direction === "leftToright") && !(this.x > (window.innerWidth * 0.5) + (this.balloon.width))){
            //         this.x += this.windSpeed * delta;
            //         this.direction = "leftToright"
            //     }
            // }
            // if(this.y < 2*(window.innerHeight/3)){
            //     this.x -= this.windSpeed * delta
            // }
            if (this.y + this.height < 0) {
                CommonConfig.the.setMissedBalloons(1);
                this.completeDestroy();
            }
        }

    }

}