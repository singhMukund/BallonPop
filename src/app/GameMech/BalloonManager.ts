import { Application, Container, Sprite, Ticker } from "pixi.js";
import { Balloon } from "./Balloon";
import { Game } from "../game";
import { CommonConfig } from "../../Common/CommonConfig";
import { EndGamePop } from "../Popup/EndGamePopup";
import { TimerContainer } from "../UI/Timer";
import { Scorecard } from "../UI/Scorecard";
import { Levelcard } from "../UI/LevelCount";
import { LevelPopup } from "../Popup/LevelPopup";
import { TaskPopup } from "../Popup/TaskPopup";
import { SoundBtn } from "../UI/SoundBtn";
import { WeatherBackground } from "../Background/WeatherBackground";
import { ParticleEmitterContainer } from "../Background/ParticleEmitterContainer";
import { CurrentScorecard } from "../UI/CurrentScorecard";
import { MissedCountContainer } from "../UI/MissedCountContainer";
import { LoadingScreenTest } from "../LoadingIntro/LoadingScreenTest";
import { GiftBtn } from "../UI/GiftBtn";
import { PlayPauseBtn } from "../UI/PlayPauseBtn";
import { ResumePopUp } from "../Popup/ResumePopUp";
import { LastBlastBalloon } from "../UI/LastBlastBalloon";
import { ChainReactionBalloonPopup } from "../Popup/ChainReactionBalloonPopup";
import { GiftPopUp } from "../Popup/GiftPopUp";
import { CommonEvents } from "@/Common/CommonEvents";
import { IBalloonData, IBalloonTweenData } from "@/Common/CommonInterface";
import { RainManager } from "./RainManager";
import { SurpriseBigBalloon } from "./SurpriseBigBalloon";
import { GameLockPopup } from "../Popup/GameLockPopup";

export class BalloonManager {
    private ticker: Ticker;
    private balloons: Balloon[] = [];
    private supriseBigBalloon: SurpriseBigBalloon[] = [];
    private score: number = 0;
    private spawnInterval: number;
    private lastSpawnTime: number = 0;
    private app: Application;
    private missedCount: number = 0;
    private gameOver: boolean = false;
    private endGamePop !: EndGamePop;
    private timerContainer !: TimerContainer;
    private scoreCardContainer !: Scorecard;
    private currentScoreCardContainer !: CurrentScorecard;
    private missedCountContainer !: MissedCountContainer;
    private levelNo !: Levelcard;
    private levelPopup !: LevelPopup;
    private pauseForNextLevel: boolean = false;
    private speed: number = 2;
    private taskpopup !: TaskPopup;
    private soundBtn !: SoundBtn;
    private weatherbackround !: WeatherBackground;
    private weatherTimng: number = 1000;
    private particleEmitterContainer !: ParticleEmitterContainer;
    private currentWeather: string = "";
    private balloonContainer !: Container;
    private loadingScreenTest: LoadingScreenTest;
    private bottomPanelBg !: Sprite;
    private playPauseBtn !: PlayPauseBtn;
    private resumePopUp !: ResumePopUp;
    private giftBtn !: GiftBtn;
    private lastBlastBalloon !: LastBlastBalloon;
    private chainReactionBalloonPopup !: ChainReactionBalloonPopup;
    private giftPopUp !: GiftPopUp;
    private gameLockPopup !: GameLockPopup;
    private rainManager !: RainManager;

    constructor(spawnInterval: number) {
        this.app = Game.the.app;
        this.spawnInterval = spawnInterval;
        this.ticker = new Ticker();
        this.balloonContainer = new Container();
        this.weatherbackround = new WeatherBackground();
        this.rainManager = new RainManager(this.balloons); // Pass balloons
        // this.app.stage.addChild(this.rainManager);
        // this.app.stage.addChild(this.weatherbackround);
        this.particleEmitterContainer = new ParticleEmitterContainer();
        this.app.stage.addChild(this.particleEmitterContainer);
        this.app.stage.addChild(this.balloonContainer);
        this.endGamePop = new EndGamePop();
        this.timerContainer = new TimerContainer();
        this.scoreCardContainer = new Scorecard();
        this.currentScoreCardContainer = new CurrentScorecard();
        this.missedCountContainer = new MissedCountContainer();
        this.app.stage.addChild(this.timerContainer);
        this.loadingScreenTest = new LoadingScreenTest();
        this.app.stage.addChild(this.loadingScreenTest);
        this.levelNo = new Levelcard();
        this.app.stage.addChild(this.levelNo);
        this.levelPopup = new LevelPopup();
        this.chainReactionBalloonPopup = new ChainReactionBalloonPopup();
        this.resumePopUp = new ResumePopUp();
        // CommonConfig.the.setTotalScore(10000000000);
        this.soundBtn = new SoundBtn();
        this.app.stage.addChild(this.soundBtn);
        this.playPauseBtn = new PlayPauseBtn();
        this.giftBtn = new GiftBtn();
        this.app.stage.addChild(this.playPauseBtn);
        this.lastBlastBalloon = new LastBlastBalloon();
        this.app.stage.addChild(this.lastBlastBalloon);
        this.taskpopup = new TaskPopup();
        this.giftPopUp = new GiftPopUp();
        Game.the.app.stage.on("RESUME_GAME_FOR_NEXT_LEVEl", this.resumeGameForNextLevel, this);
        this.scoreCardContainer.setText();
        this.currentScoreCardContainer.setText();
        this.score = CommonConfig.the.getTotalScore();
        this.gameLockPopup = new GameLockPopup();
        this.bottomPanelBg = new Sprite(Game.the.app.loader.resources['bottomPanelBg'].texture);
        this.app.stage.addChild(this.bottomPanelBg);
        this.app.stage.addChild(this.currentScoreCardContainer);
        this.app.stage.addChild(this.scoreCardContainer);
        this.app.stage.addChild(this.missedCountContainer);
        this.app.stage.addChild(this.taskpopup);
        this.app.stage.addChild(this.resumePopUp);
        this.app.stage.addChild(this.levelPopup);
        this.app.stage.addChild(this.endGamePop);
        this.app.stage.addChild(this.giftBtn);
        this.app.stage.addChild(this.giftPopUp);
        this.app.stage.addChild(this.chainReactionBalloonPopup);
        this.app.stage.addChild(this.gameLockPopup);
        CommonConfig.the.setIsHalloweenTheme(true);
        Game.the.app.stage.emit(CommonEvents.CHANGE_THEME, true);
        this.changeTheme(CommonConfig.the.getIsHalloweenTheme());
        if (CommonConfig.the.getTotalMissedChance() >= 45) {
            CommonConfig.the.setGameOver(true);
            this.app.stage.emit('SHOW_GAME_LOCK_POPUP');
        } else {
            // this.resumeGameForNextLevel();
            if (CommonConfig.the.getLevelsNo() > 1) {
                this.resumeGameForNextLevel();
            } else {
                this.loadingScreenTest.loadingAnimation();
            }
            this.ticker.add(this.update, this);
            this.ticker.start();
            
        }
        this.setPosition();
        // Game.the.app.stage.on(CommonEvents.CHANGE_THEME, this.changeTheme, this);
        this.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        this.app.stage.on("PAUSE_BTN_CLICKED", this.pauseBtnClicked, this);
        this.app.stage.on("PLAY_BTN_CLICKED", this.playBtnClicked, this);
        this.app.stage.on("REMOVE_TICKER", this.onRemoveTicker, this);
        this.app.stage.on("END_GAME_AFTER_MAX_MISS", this.endGameAfterMaxMiss, this);
        this.app.stage.on(CommonEvents.SPLIT_BALLOON, this.onSplitBalloon, this);
    }

    private endGameAfterMaxMiss() :void{
        // this.endGame(true);
        this.ticker && this.ticker.stop();
        CommonConfig.the.setGameOver(true);
        this.app.stage.emit('SHOW_GAME_LOCK_POPUP');
    }





    private onRemoveTicker(): void {
        this.ticker.stop();
    }

    private pauseBtnClicked(isHidePopup?: boolean): void {
        CommonConfig.the.setPauseForNextLevel(true);
        CommonConfig.the.setGamePaused(true);
        !isHidePopup && this.resumePopUp.show();
        // if(isHidePopup){
        //     Game.the.app.stage.emit("ENABLE_DISABLE_GIFT_BTN",true);
        // }else{
        //     Game.the.app.stage.emit("ENABLE_DISABLE_GIFT_BTN",false);
        // }
    }

    private playBtnClicked(): void {
        CommonConfig.the.setPauseForNextLevel(false);
        this.loadingScreenTest?.resumeTween();
        CommonConfig.the.setGamePaused(false);
        Game.the.app.stage.emit("RESUME_BALLOON_TWEENS");
        this.playPauseBtn.showPauseBtn();
        Game.the.app.stage.emit("ENABLE_DISABLE_GIFT_BTN", true);
    }

    private changeTheme(isHalloween: boolean): void {
        if (isHalloween) {
            this.bottomPanelBg.texture = Game.the.app.loader.resources['bottomPanelBg_halloween'].texture;
        } else {
            this.bottomPanelBg.texture = Game.the.app.loader.resources['bottomPanelBg'].texture;
        }
    }

    private setPosition(): void {
        // if (!this) {
        //     return
        // }

        let scaleX: number = 0;
        this.bottomPanelBg.width = 780;
        this.bottomPanelBg.height = 188;
        if (window.innerHeight > window.innerWidth && this) {
            scaleX = window.innerWidth / this.bottomPanelBg.width;
            this.bottomPanelBg.scale.set(scaleX, 0.5);
        } else {
            scaleX = window.innerWidth / this.bottomPanelBg.width;
            this.bottomPanelBg.scale.set(scaleX, 0.5);
        }
        this.bottomPanelBg.alpha = 1;
        this.bottomPanelBg.position.set((window.innerWidth - this.bottomPanelBg.width) / 2, (window.innerHeight - this.bottomPanelBg.height));
        this.setScorecardUIPosition();
        this.setCurrentScorecardUIPosition();
        this.setmissedCardUIPosition();
        this.setPositionLevelUI();
        this.setPositionSoundBtn();
        this.loadingScreenTest.scale.set(0.5);
        this.loadingScreenTest.x = 10;
        this.loadingScreenTest.y = this.levelNo.textContainer.y + this.levelNo.textContainer.height + 22;
    }

    private setCurrentScorecardUIPosition(): void {
        let scale: number = 1;
        let w = (window.innerWidth - 30) / 3;
        scale = w / this.currentScoreCardContainer.textContainer.width;
        if (this.currentScoreCardContainer.textContainer.width * 3 > (window.innerWidth - 30)) {
            this.currentScoreCardContainer.textContainer.scale.set(scale * 0.75);
        } else {
            this.currentScoreCardContainer.textContainer.scale.set(1);
        }
        this.currentScoreCardContainer.textContainer.position.set((window.innerWidth - this.currentScoreCardContainer.width) / 2, this.scoreCardContainer.textContainer.y);
    }

    private setScorecardUIPosition(): void {
        let scale: number = 1;
        let w = (window.innerWidth - 30) / 3;
        scale = w / this.scoreCardContainer.textContainer.width;
        // if(this.scoreCardContainer.textContainer.width * 3 > (window.innerWidth - 30)){
        //     this.scoreCardContainer.textContainer.scale.set(scale * 0.75);
        // }else{
        //     this.scoreCardContainer.textContainer.scale.set(1);
        // }
        let x = (window.innerWidth) - 40;
        this.scoreCardContainer.textContainer.position.set(x, this.bottomPanelBg.y + (this.bottomPanelBg.height - this.scoreCardContainer.textContainer.height));
    }

    private setmissedCardUIPosition(): void {
        let scale: number = 1;
        let w = (window.innerWidth - 30) / 3;
        scale = w / this.missedCountContainer.textContainer.width;
        if (this.missedCountContainer.textContainer.width * 3 > (window.innerWidth - 30)) {
            this.missedCountContainer.textContainer.scale.set(scale * 0.75);
        } else {
            this.missedCountContainer.textContainer.scale.set(1);
        }
        // let x = (window.innerWidth) - (this.textContainer.width + 10);
        let y: number = this.scoreCardContainer.textContainer.y + this.scoreCardContainer.textContainer.height + 10
        this.missedCountContainer.textContainer.position.set(3, this.scoreCardContainer.textContainer.y);
    }

    private setPositionLevelUI(): void {
        let scale: number = 1;
        let w = (window.innerWidth - 30) / 3;
        scale = w / this.levelNo.textContainer.width;
        // this.levelNo.textContainer.scale.set(scale * 0.65);
        // if(this.levelNo.textContainer.width * 3 > (window.innerWidth - 30)){
        //     this.levelNo.textContainer.scale.set(scale * 0.65);
        // }else{
        //     this.levelNo.textContainer.scale.set(0.65);
        // }
        this.levelNo.textContainer.scale.set(0.3);
        let x = (window.innerWidth) - (this.levelNo.textContainer.width + 10);
        x = 3;
        // x = 20;
        this.levelNo.textContainer.position.set(x, (this.levelNo.textContainer.height * 0.7));
    }

    setPositionSoundBtn(): void {
        this.soundBtn.scale.set(0.5);
        this.soundBtn.position.set((window.innerWidth) - (this.soundBtn.width + 10), this.levelNo.textContainer.height * 0.7);
        this.playPauseBtn.scale.set(0.5);
        this.playPauseBtn.position.set(this.soundBtn.x - this.playPauseBtn.width - 10, this.levelNo.textContainer.height * 0.7);
        this.giftBtn.scale.set(0.55);
        this.giftBtn.position.set(this.playPauseBtn.x - this.giftBtn.width - 10, this.levelNo.textContainer.height * 0.7);

        this.lastBlastBalloon.scale.set(0.5);
        this.lastBlastBalloon.position.set((window.innerWidth) - (this.lastBlastBalloon.width + 10), this.giftBtn.y + this.giftBtn.height + 30);
    }

    private update(delta: number) {
        if (CommonConfig.the.getPauseForNextLevel() === true) {
            return;
        }
        if (CommonConfig.the.getGameOver()) {
            if (CommonConfig.the.getCurrentScore() >= CommonConfig.LEVEL_01_THRESHOLD) {
                if (CommonConfig.the.getPauseForNextLevel() === false) {
                    this.scoreCardContainer.setText();
                    this.levelPopup.show();
                    CommonConfig.the.setPauseForNextLevel(true);
                    return;
                }

            } else {
                this.endGamePop.show(false);
                CommonConfig.the.setPauseForNextLevel(true);
                return;
            }

        }

        if (this.ticker.lastTime - this.lastSpawnTime > this.spawnInterval) {
            !CommonConfig.the.getIsBonusLevel() && !CommonConfig.the.getPauseForNextLevel() && this.spawnBalloon();
            this.lastSpawnTime = this.ticker.lastTime;
        }

        if (!CommonConfig.the.getPauseForNextLevel()) {
            for (const balloon of this.balloons) {
                if (!balloon.destroyed) {
                    balloon.update(delta);
                    if (CommonConfig.the.getLevelsNo() > 2) {
                        if (this.currentWeather === 'left' || this.currentWeather === 'tornado') {
                            balloon.windSpeed = 1;
                            balloon.currentWeather = this.currentWeather ? this.currentWeather : "left";
                        } else {
                            balloon.windSpeed = -1;
                            balloon.currentWeather = this.currentWeather ? this.currentWeather : "right";
                        }
                    } else {
                        balloon.windSpeed = 0;
                        balloon.currentWeather = this.currentWeather ? this.currentWeather : "nowind";
                    }
                }
            }
            // this.rainManager.update(delta);    
            this.balloons = this.balloons.filter(balloon => !balloon.destroyed);
            // this.particleEmitterContainer.update(delta);
            if (CommonConfig.the.getMissedBalloons() <= 0) {
                this.endGame(true);
                CommonConfig.the.setGameOver(true);
            }
        }

        if (!CommonConfig.the.getPauseForNextLevel() && CommonConfig.the.getIsBonusLevel()) {
            for (const balloon of this.supriseBigBalloon) {
                if (!balloon.destroyed) {
                    balloon.update(delta);
                }
            }
            this.supriseBigBalloon = this.supriseBigBalloon.filter(balloon => !balloon.destroyed);
            if (CommonConfig.the.getMissedBalloons() <= 0) {
                this.endGame(true);
                CommonConfig.the.setGameOver(true);
            }
        }

        this.timerContainer.update(delta);
    }

    private pauseGameForNextLevel(): void {
        this.gameOver = false;
        this.ticker.stop();
    }

    private endGame(missed: boolean) {
        this.gameOver = true;
        this.ticker.stop();
        this.endGamePop.show(missed);
    }

    private resumeGameForNextLevel(): void {    
         CommonConfig.the.setGameOver(false);
         CommonConfig.the.setPlayerElectricBalloon(false);
        !CommonConfig.the.getbrokenCase() && CommonConfig.the.setLevelsNo(CommonConfig.the.getLevelsNo() + 1);
        this.levelNo.setText();
        const weahther: string[] = ['left', 'right', 'tornado'];
        if (CommonConfig.the.getLevelsNo() > 2) {
            this.currentWeather = weahther[Math.floor(Math.random() * weahther.length)];
            for (const balloon of this.balloons) {
                if (this.currentWeather === 'left' || this.currentWeather === 'tornado') {
                    balloon.windSpeed = 1;
                } else {
                    balloon.windSpeed = -1;
                }
                balloon.currentWeather = this.currentWeather;
            }
        } else {
            this.currentWeather = 'nowind';
            for (const balloon of this.balloons) {
                balloon.windSpeed = 0;
                balloon.currentWeather = this.currentWeather;
            }
        }
        if (CommonConfig.the.getbrokenCase()) {
            for (let i: number = 1; i <= CommonConfig.the.getLevelsNo(); i++) {
                if (i <= 2) {
                    this.speed += 0.5;
                } else if (i > 5) {
                    this.speed += 0.15;
                } else {
                    this.speed += 0.35;
                }
            }
        } else {
            if (CommonConfig.the.getLevelsNo() <= 2) {
                this.speed += 0.5;
            } else if (CommonConfig.the.getLevelsNo() > 5) {
                this.speed += 0.15;
            } else {
                this.speed += 0.35;
            }
        }
        CommonConfig.the.setbrokenCase(false);
        this.spawnInterval = this.spawnInterval - (100 * CommonConfig.the.getLevelsNo());
        if (this.spawnInterval < 500) {
            this.spawnInterval = 400;
        }
        this.timerContainer.resetTimer();
        CommonConfig.the.setPauseForNextLevel(false);
        this.loadingScreenTest.loadingAnimation();
        Game.the.app.stage.emit("RESUME_BALLOON_TWEENS");
        // CommonConfig.the.setIsBonusLevel(true);
        CommonConfig.the.getIsBonusLevel() && this.spawnLargeBalloon();
    }

    private onSplitBalloon(data: IBalloonData): void {
        let tweenData: IBalloonTweenData = {
            x: data.x + 50,
            y: data.y - 50
        }
        let balloon: Balloon = new Balloon(data.points, data.speed, data, tweenData);
        balloon.position.set(data.x, data.y);
        this.balloonContainer.addChild(balloon);
        this.balloons.push(balloon);
        balloon.on('balloonClicked', this.onBalloonClicked, this);
        balloon.on('balloonClickedAndUpdateMissedChance', this.onBalloonClickedUpdateMissedChance, this);

        tweenData = {
            x: data.x - 50,
            y: data.y + 50
        }
        balloon = new Balloon(data.points, data.speed, data, tweenData);
        balloon.position.set(data.x, data.y);
        this.balloonContainer.addChild(balloon);
        this.balloons.push(balloon);
        balloon.on('balloonClicked', this.onBalloonClicked, this);
        balloon.on('balloonClickedAndUpdateMissedChance', this.onBalloonClickedUpdateMissedChance, this);

        tweenData = {
            x: data.x + 50,
            y: data.y + 50
        }
        balloon = new Balloon(data.points, data.speed, data, tweenData);
        balloon.position.set(data.x, data.y);
        this.balloonContainer.addChild(balloon);
        this.balloons.push(balloon);
        balloon.on('balloonClicked', this.onBalloonClicked, this);
        balloon.on('balloonClickedAndUpdateMissedChance', this.onBalloonClickedUpdateMissedChance, this);

        tweenData = {
            x: data.x - 50,
            y: data.y - 50
        }
        balloon = new Balloon(data.points, data.speed, data, tweenData);
        balloon.position.set(data.x, data.y);
        this.balloonContainer.addChild(balloon);
        this.balloons.push(balloon);
        balloon.on('balloonClicked', this.onBalloonClicked, this);
        balloon.on('balloonClickedAndUpdateMissedChance', this.onBalloonClickedUpdateMissedChance, this);
    }

    private spawnBalloon() {
        const balloon: Balloon = new Balloon(10, this.speed);
        balloon.position.set(Math.random() * ((window.innerWidth * 0.9) - 100) + 50, window.innerHeight + 50);
        if (CommonConfig.the.getLevelsNo() > 2) {
            if (this.currentWeather === 'left' || this.currentWeather === 'tornado') {
                balloon.windSpeed = 1;
            } else {
                balloon.windSpeed = -1;
            }
            balloon.currentWeather = this.currentWeather;
        } else {
            balloon.windSpeed = 0;
            balloon.currentWeather = this.currentWeather ? this.currentWeather : "nowind";
        }
        this.balloonContainer.addChild(balloon);
        this.balloons.push(balloon);
        balloon.on('balloonClicked', this.onBalloonClicked, this);
        balloon.on('balloonClickedAndUpdateMissedChance', this.onBalloonClickedUpdateMissedChance, this);
    }

    private spawnLargeBalloon() {
        const balloon: SurpriseBigBalloon = new SurpriseBigBalloon(10, 2);
        balloon.position.set((window.innerWidth - balloon.width) / 2, window.innerHeight - balloon.height);
        this.supriseBigBalloon.push(balloon);
        this.balloonContainer.addChild(balloon);
        balloon.on('balloonClicked', this.onBalloonClicked, this);
        balloon.on('balloonClickedAndUpdateMissedChance', this.onBalloonClickedUpdateMissedChance, this);
    }

    private generateNumber(): number {
        let randomNumber: number = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
        return randomNumber;
    }

    private getRandomAlphabet(): string {
        const min = 65;
        const max = 90;
        const randomCharCode = Math.floor(Math.random() * (max - min + 1)) + min;
        return String.fromCharCode(randomCharCode);
    }

    private onBalloonClicked(points: number) {
        this.score += points;
        let currentScore = CommonConfig.the.getCurrentScore() + points;
        CommonConfig.the.setTotalScore(this.score);
        CommonConfig.the.setCurrentScore(currentScore);
        this.currentScoreCardContainer.setText();
    }

    private onBalloonClickedUpdateMissedChance() {
        let currentScore = 5;
        CommonConfig.the.setMissedBalloons(currentScore);
        this.missedCountContainer.setText();
    }
}
