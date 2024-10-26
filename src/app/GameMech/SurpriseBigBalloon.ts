import { AnimatedSprite, Container, DEG_TO_RAD, Graphics, Loader, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { Game } from "../game";
import { CommonConfig } from "../../Common/CommonConfig";
import gsap from "gsap";
import { CommonEvents } from "@/Common/CommonEvents";
import { IBalloonData, IBalloonTweenData } from "@/Common/CommonInterface";
// import { sound } from "@pixi/sound";

export class SurpriseBigBalloon extends Container {
    private balloon!: Sprite;
    private _points: number;
    private _speed: number;
    private _destroyed_: boolean = false;
    private _scoreText_ !: Text;
    private randomColorCode: string = "";
    private multiColorburstAnimation !: AnimatedSprite;
    private ballonAndAnimContainer !: Container;
    private clickCount: number = 0
    currentWeather: string = "";
    private xTween!: gsap.core.Tween;
    private isTweenpause: boolean = false;
    private timerLoader !: Container
    private xPositions: number[] = [200, -200];

    constructor(points: number, speed: number) {
        super();
        this._points = points;
        this._speed = speed;
        this.initBalloon();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("RESUME_BALLOON_TWEENS", this.resumeBalloonTween, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
        if (CommonConfig.the.getLevelsNo() > 10) {
            this.startXTween();
        }
        // this.startXTween();
    }


    private destroyAfterGameRemoved(): void {
        this.destroy({ children: true })
    }

    // destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean; } | undefined): void {
    //     super.destroy({ children: true,texture : true, baseTexture : true })
    // }

    private resumeBalloonTween(): void {
        if (this._destroyed_) {
            return
        }
        if (CommonConfig.the.getLevelsNo() > 10 && this.xTween?.paused()) {
            this.resumeTween();
        }
    }

    private resumeTween(): void {
        if (this.isTweenpause && !CommonConfig.the.getPauseForNextLevel()) {
            this.xTween?.resume();
            this.isTweenpause = false;
        }
    }

    private setPosition(): void {
        if (!this || this._destroyed_) {
            return
        }
        if (!this._destroyed_ && (window.innerHeight > window.innerWidth || !CommonConfig.the.isDesktop()) && this && this.balloon) {
            this.scale.set(1.6);
        }
    }

    private triggerVibration() {
        // Check if the browser supports vibration (mobile devices)
        if (navigator.vibrate) {
            // Trigger a vibration for 200 milliseconds
            navigator.vibrate(80);
        }
    }

    private startXTween(): void {
        if (this.randomColorCode === 'timeLimitedBalloon') {
            return;
        }
        let x_pos = this.x;
        if (this._destroyed_) {
            return;
        }
        let durations = [0.4, 2, 1, 3, 0.8, 1.2, 0.3, 0.5];
        let randomX = this.xPositions[Math.floor(Math.random() * 2)];
        let duration = durations[Math.floor(Math.random() * 2)];
        let finalX: number = 0;
        if (randomX > 0) {
            finalX = this.x + this.width + this.width;
        } else {
            finalX = this.x - this.width - this.width;
        }
        if (this.x + this.width + 40 > window.innerWidth) {
            finalX = this.x - this.width - 60;
        } else if (this.x - this.width < 0) {
            finalX = this.x + this.width + 60;
        }
        console.log(this.x + "Balloon X" + finalX);
        this.isTweenpause = false;
        // this.maskContainer.x = this.maskContainer.x + this.maskContainer.width;
        this.xTween = gsap.to(this, {
            x: finalX,
            duration: duration,
            onComplete: () => {
                this.xTween?.kill();
                !this._destroyed_ && (this.startXTween());
            },
            onUpdate: () => {
                if (CommonConfig.the.getGameOver()) {
                    this.xTween?.kill();
                }
                if (this._destroyed_ === true) {
                    this.xTween?.kill();
                } else {
                    this.xTween
                }
                if (CommonConfig.the.getPauseForNextLevel()) {
                    this.xTween?.pause();
                    this.isTweenpause = true;
                }
            }
        })
    }


    private initBalloon(): void {
        this.ballonAndAnimContainer = new Container();
        this.addChild(this.ballonAndAnimContainer);
        this.randomColorCode = CommonConfig.the.getRandomBalloon();
        let textTure: Texture = Game.the.app.loader.resources['bigBalloon'].textures?.[`balloon_big.png`] as Texture;
        this.balloon = new Sprite(textTure);
        this.ballonAndAnimContainer.addChild(this.balloon);
        this.balloon.scale.set(0.5);
        this.interactive = true;
        this.buttonMode = true;
        let fontStyle = new TextStyle({
            fontFamily: 'Helvetica',
            fontSize: 18,
            fill: 'black',
            align: 'center',
            fontWeight: "normal"
        });
        this._scoreText_ = new Text(`${this._points} +`, fontStyle);
        this._scoreText_.x = (this.balloon.width - this._scoreText_.width) / 2;
        this._scoreText_.y = (this.balloon.height - this._scoreText_.height) / 2;
        this.addChild(this._scoreText_);
        this.createElectricAnim();
        this._scoreText_.alpha = 0;
        this.on('pointerdown', this.onBalloonClicked, this);

        
    }

    private splitBalloon(): void {
        const data: IBalloonData = {
            speed: this._speed,
            x: this.x,
            y: this.y,
            randomColor: this.randomColorCode,
            points: this._points
        }
        Game.the.app.stage.emit(CommonEvents.SPLIT_BALLOON, data);
    }

    private createElectricAnim(): void {
        const frames: Texture[] = [];
        for (let i = 103; i <= 127; i++) {
            let textTure: Texture = Game.the.app.loader.resources['MultiColorBlast'].textures?.[`${i}.png`] as Texture;
            frames.push(textTure);
        }
        this.multiColorburstAnimation = new AnimatedSprite(frames);
        this.multiColorburstAnimation.animationSpeed = 0.8; // Adjust animation speed as needed
        this.multiColorburstAnimation.loop = false;
        this.multiColorburstAnimation.scale.set(1.2);
        this.multiColorburstAnimation.visible = false;
        this.ballonAndAnimContainer.addChild(this.multiColorburstAnimation);
        this.multiColorburstAnimation.position.set(-this.multiColorburstAnimation.width / 3 + 5, -this.multiColorburstAnimation.height / 3 + 5);
    }



    private onBalloonClicked() {
        if (CommonConfig.the.getPauseForNextLevel()) {
            return;
        }
        if (this.clickCount < 30) {
            this.scaleDown();
        } else if (this.clickCount === 11) {
            this.destroyBalloonCalled();
        } else {
            return
        }
        this.clickCount += 1;
        this.triggerVibration();
    }

    createCircle(x: number, y: number, radius: number): Graphics {
        const circle = new Graphics();
        circle.beginFill(0xFFFFFF); // White color
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        circle.x = x;
        circle.y = y;
        return circle;
    }

    private scaleDown(): void {
        let finalScale: number = this.scale.x - 0.05;
        gsap.to(this.scale, {
            x: finalScale, y: finalScale, duration: 0.5, onUpdate: () => {
                this.x = (window.innerWidth - this.width) / 2
            }, onComplete: () => {
                this.x = (window.innerWidth - this.width) / 2
            }
        });
    }

    private destroyBalloonCalled(): void {
        this.calculatePoints();
        Game.the.app.stage.emit("UPDATE_LASTBALLOON", "Big Balloon");
        let isSplit: boolean = false;
        if (isSplit) {
            this.splitBalloon();
            gsap.to(this, {
                alpha: 0, duration: 0.25, onComplete: () => {
                    this.completeDestroy.bind(this)
                }
            });
        } else {
            this._scoreText_.text = `${this._points} +`;
            if (this.randomColorCode === "electric") {
                this.emit('balloonClickedAndUpdateMissedChance');
            } else if (this.randomColorCode !== "brandedTrikon") {
                this.emit('balloonClicked', this._points);
            }

            this.destroyBalloon();
        }
    }

    private destroyBalloon() {
        Game.the.app.stage.emit("PLAY_BURST_SOUND");
        if (this.randomColorCode === "brandedTrikon") {
            Game.the.app.stage.emit("PLAY_GIFT_SCORE");
        }
        gsap.to(this.balloon, {
            alpha: 0, duration: 0.25, onComplete: () => {
                // this.upTween.bind(this);
                this.multiColorburstAnimation.visible = true;
                this.multiColorburstAnimation.play();
            }
        });
        gsap.to(this._scoreText_, { alpha: 1, duration: 0.25, onComplete: this.upTween.bind(this) });
    }

    private calculatePoints(): void {
        this._points = CommonConfig.the.getNormalScore();
        if (this.randomColorCode === "golden") {
            let randomScore: number[] = [40, -30];
            this._points = randomScore[Math.floor(Math.random() * randomScore.length)];
            if (this._points === -30) {
                this._scoreText_.text = `${this._points}`;
            }
        } else if (this.randomColorCode === "timeLimitedBalloon") {
            this._points = 15;
            this._scoreText_.text = `${this._points}+`;
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
        this.ballonAndAnimContainer.visible = false;
        this.xTween?.pause();
        this.xTween?.kill();
        this._destroyed_ = true;
        this.destroy();
        this.removeAllChild();
        this.clickCount = 0;
    }

    private removeAllChild(): void {
        while (this.children.length) {
            this.removeChildren();
        }
    }

    public get destroyed(): boolean {
        return this._destroyed_;
    }

    public update(delta: number) {
        if (CommonConfig.the.getPauseForNextLevel()) {
            return;
        }
        if (CommonConfig.the.getGameOver()) {
            return;
        }
        if (!this._destroyed_) {
            // this.y -= 0.2  * delta;
            if (this.y + this.height < 0) {
                CommonConfig.the.setMissedBalloons(-1);
                CommonConfig.the.setTotalMissedBalloonsLeftChance(1);
                Game.the.app.stage.emit("UPDATE_MISSED_COUNT");
                this.completeDestroy();
            }
        }

    }

}