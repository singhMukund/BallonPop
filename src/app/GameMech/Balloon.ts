import { AnimatedSprite, Container, DEG_TO_RAD, Graphics, Loader, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { Game } from "../game";
import { CommonConfig } from "../../Common/CommonConfig";
import gsap from "gsap";
import { CommonEvents } from "@/Common/CommonEvents";
import { IBalloonData } from "@/Common/CommonInterface";
// import { sound } from "@pixi/sound";

export class Balloon extends Container {
    private balloon!: Sprite;
    private _points: number;
    private _speed: number;
    private _destroyed_: boolean = false;
    private _scoreText_ !: Text;
    private randomColorCode: string = "";
    private multiColorburstAnimation !: AnimatedSprite;
    private ballonAndAnimContainer !: Container;
    private clickCount: number = 0
    windSpeed: number = 0;
    private rotationTween: gsap.core.Tween | null = null;
    currentWeather: string = "";
    private xTween!: gsap.core.Tween;
    private isTweenpause: boolean = false;
    private timerLoader !: Container
    private xPositions: number[] = [200, -200];

    private loadingBarEmpty !: Sprite;
    private loadingBarFill !: Sprite;
    private loadingFillContainer !: Container;
    private maskContainer !: Graphics;
    private loadingBarFill_red !: Sprite;
    private isTweenpause_loader !: Boolean;
    private timeTween!: gsap.core.Tween;
    private _textureString : string ="";
    private _balloonClicked : boolean = false;



    constructor(points: number, speed: number , data ? : IBalloonData) {
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
        if (CommonConfig.the.getLevelsNo() > 10 && this.randomColorCode !== 'timeLimitedBalloon' && this.xTween?.paused()) {
            this.resumeTween();
        }
        if (this.randomColorCode === 'timeLimitedBalloon') {
            this.resumeTweenLoader();
        }
    }

    private resumeTween(): void {
        if (this.isTweenpause && !CommonConfig.the.getPauseForNextLevel()) {
            this.xTween?.resume();
            this.isTweenpause = false;
        }
    }

    private burstTimeLimitedBalloon(): void {
        if (this._destroyed_ && this.randomColorCode !== 'timeLimitedBalloon') {
            return;
        }
        if (this.randomColorCode === 'timeLimitedBalloon') {
            CommonConfig.the.setMissedBalloons(-1);
            CommonConfig.the.setTotalMissedBalloonsLeftChance(1);
            Game.the.app.stage.emit("UPDATE_MISSED_COUNT");
            this.completeDestroy();
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
        let durations = [0.4, 2, 1, 3, 0.8, 1.2,0.3,0.5];
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
        this._textureString = this.randomColorCode === 'timeLimitedBalloon' ? `balloon_orange` : `balloon_${this.randomColorCode}`;
        let textTure: Texture = Game.the.app.loader.resources['balloons'].textures?.[`${this._textureString}.png`] as Texture;
        this.balloon = new Sprite(textTure);
        this.ballonAndAnimContainer.addChild(this.balloon);
        this.balloon.scale.set(0.5);
        if (this.randomColorCode === 'timeLimitedBalloon') {
            this.timerLoader = new Container();
            this.initLoader();
            this.setPositionLoader();
            this.timerLoader.scale.set(0.2);
            this.ballonAndAnimContainer.addChild(this.timerLoader);
            this.timerLoader.position.set((this.balloon.width - this.timerLoader.width) / 2, (this.balloon.height * 0.6));
            this.loadingAnimation();
        }
        this.interactive = true;
        this.buttonMode = true;

        const fontStyle = new TextStyle({
            fontFamily: 'Helvetica',
            fontSize: 18,
            fill: 'black',
            align: 'center',
            fontWeight: "normal"
        });
        if (this.randomColorCode === "electric") {
            this._scoreText_ = new Text(`5 Missed Chance +`, fontStyle);
        } else if(this.randomColorCode === "brandedTrikon"){
            this._scoreText_ = new Text(`Gift+`, fontStyle);
        }else{
            this._scoreText_ = new Text(`${this._points} +`, fontStyle);
        }

        this._scoreText_.x = (this.balloon.width - this._scoreText_.width) / 2;
        this._scoreText_.y = (this.balloon.height - this._scoreText_.height) / 2;
        this.addChild(this._scoreText_);
        this.createElectricAnim();
        this._scoreText_.alpha = 0;
        this.on('pointerdown', this.onBalloonClicked, this);

    }

    private splitBalloon() :void{
        const data : IBalloonData = {
            speed : this._speed,
            x : this.x,
            y : this.y,
            randomColor : this.randomColorCode,
            points : this._points
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
        // this.multiColorburstAnimation.play();
        if (this.randomColorCode === "golden") {
            this.ballonAndAnimContainer.addChild(this.multiColorburstAnimation);
        }
        this.ballonAndAnimContainer.addChild(this.multiColorburstAnimation);
        this.multiColorburstAnimation.position.set(-this.multiColorburstAnimation.width / 3 + 5, -this.multiColorburstAnimation.height / 3 + 5);
    }



    private onBalloonClicked() {
        if (CommonConfig.the.getPauseForNextLevel()) {
            return;
        }
        if (this.clickCount === 0 && this.randomColorCode === "golden") {
            this.scaleUp();
        } else if (this.clickCount === 0 && this.randomColorCode !== "golden") {
            this._balloonClicked = true;
            this.destroyBalloonCalled();
        } else if (this.clickCount === 1 && this.randomColorCode === "golden") {
            this._balloonClicked = true;
            this.destroyBalloonCalled();
        } else {
            return
        }
        this.clickCount += 1;
        this.triggerVibration();
    }

    private scaleUp(): void {
        let finalScore: number = 1.2;
        if (window.innerHeight > window.innerWidth && this) {
            finalScore = 1.8
        } else {
            finalScore = 1.2
        }
        gsap.to(this.scale, { x: finalScore, y: finalScore, duration: 0.5 });
        // sound.play('oops_Sound');
    }

    private destroyBalloonCalled(): void {
        this.calculatePoints();
        Game.the.app.stage.emit("UPDATE_LASTBALLOON",this._textureString);
        if (this.randomColorCode === "electric") {
            this._scoreText_.text = "5 Missed Chance +";
        } else if(this.randomColorCode === "brandedTrikon"){
            this._scoreText_.text = "Gift+";
        }else {
            this._scoreText_.text = `${this._points} +`;
        }
        if (this._points === -30) {
            this._scoreText_.text = `${this._points}`;
        }
        if (this.randomColorCode === "electric") {
            this.emit('balloonClickedAndUpdateMissedChance');
        } else if(this.randomColorCode !== "brandedTrikon"){
            this.emit('balloonClicked', this._points);
        }

        this.destroyBalloon();
        // if (sound.exists('BurstSound')) {
        //     sound.play('BurstSound');
        // }
    }

    private destroyBalloon() {
        // if (this.randomColorCode === "golden") {
           
        // } else {
        //     this.whiteburstAnimation.visible = true;
        //     this.whiteburstAnimation.play();
        // }
        Game.the.app.stage.emit("PLAY_BURST_SOUND");
        if(this.randomColorCode === "brandedTrikon"){
            Game.the.app.stage.emit("PLAY_GIFT_SCORE");
        }
        gsap.to(this.balloon, {
            alpha: 0, duration: 0.25, onComplete: () => {
                this.upTween.bind(this);
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
        }else {
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
        if (this.randomColorCode === 'timeLimitedBalloon') {
            this.timeTween?.kill();
        }
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
        // this.rotationTween = gsap.to(this.balloon, {
        //     duration: 10,
        //     rotation: 10 * DEG_TO_RAD,
        //     repeat: -1
        // })
    }

    public update(delta: number) {
        if (CommonConfig.the.getPauseForNextLevel()) {
            return;
        }
        if (CommonConfig.the.getGameOver()) {
            return;
        }
        if (!this._destroyed_) {
            this.y -= this._speed * delta;
            if (this.y + this.height < 0) {
                CommonConfig.the.setMissedBalloons(-1);
                CommonConfig.the.setTotalMissedBalloonsLeftChance(1);
                Game.the.app.stage.emit("UPDATE_MISSED_COUNT");
                this.completeDestroy();
            }
        }

    }


    private setPositionLoader(): void {
        this.loadingBarEmpty.position.set(0, 30);
        this.loadingBarFill.position.set(0, 30);
        this.maskContainer.position.set(this.loadingBarFill.x, this.loadingBarFill.y);
    }

    private initLoader(): void {
        let textTure: Texture = Game.the.app.loader.resources['uiPanel'].textures?.[`emptyBar.png`] as Texture;
        this.loadingBarEmpty = new Sprite(textTure);
        this.loadingFillContainer = new Container();
        textTure = Game.the.app.loader.resources['uiPanel'].textures?.[`filledBar.png`] as Texture;
        this.loadingBarFill = new Sprite(textTure);
        textTure = Game.the.app.loader.resources['uiPanel'].textures?.[`filledBar_red.png`] as Texture;
        this.loadingBarFill_red = new Sprite(textTure);
        this.loadingBarEmpty.scale.set(1, 1);
        this.loadingBarFill.scale.set(1);
        this.loadingBarFill_red.y = this.loadingBarFill_red.height - 7;
        this.loadingBarFill_red.scale.set(1.05);
        this.timerLoader.addChild(this.loadingBarEmpty);
        this.timerLoader.addChild(this.loadingFillContainer);
        this.loadingFillContainer.addChild(this.loadingBarFill);
        this.loadingFillContainer.addChild(this.loadingBarFill_red);
        this.loadingBarFill_red.visible = false;
        this.maskContainer = new Graphics();
        this.maskContainer.beginFill(0x000000);
        this.maskContainer.drawRect(0, 0, 296, 37);
        this.maskContainer.endFill();
        this.timerLoader.addChild(this.maskContainer);
        this.loadingFillContainer.mask = this.maskContainer;
    }

    resumeTweenLoader(): void {
        if (this.isTweenpause_loader && !CommonConfig.the.getPauseForNextLevel()) {
            this.timeTween?.resume();
            this.isTweenpause_loader = false;
        }
    }

    loadingAnimation(): void {
        let x_pos = this.maskContainer.x;
        this.loadingBarFill_red.visible = false;
        this.loadingBarFill.visible = true;
        this.isTweenpause = false;
        // this.maskContainer.x = this.maskContainer.x + this.maskContainer.width;
        this.timeTween = gsap.to(this.maskContainer, {
            x: this.maskContainer.x - this.maskContainer.width + 6,
            duration: 2,
            onComplete: () => {
                this.timeTween?.kill();
                this.maskContainer.x = x_pos;
                this.loadingBarFill_red.visible = false;
                this.loadingBarFill.visible = true;
                !this._balloonClicked && this.burstTimeLimitedBalloon();
            },
            onUpdate: () => {
                // if (CommonConfig.the.getGameOver()) {
                //     this.timeTween?.kill();
                //     this.maskContainer.x = x_pos;
                //     this.loadingBarFill_red.visible = false;
                //     this.loadingBarFill.visible = true;
                // }

                if (CommonConfig.the.getPauseForNextLevel()) {
                    this.timeTween?.pause();
                    this.isTweenpause_loader = true;
                }
                if (this.timeTween?.progress() > 0.6) {
                    this.loadingBarFill_red.visible = true;
                    this.loadingBarFill.visible = false;
                }
            }
        })

    }

}