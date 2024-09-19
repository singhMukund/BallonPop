import { Application, Ticker } from "pixi.js";
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
import { RainManager } from "./RainManager";

export class BalloonManager {
    private ticker: Ticker;
    private balloons: Balloon[] = [];
    private score: number = 0;
    private spawnInterval: number;
    private lastSpawnTime: number = 0;
    private app: Application;
    private missedCount: number = 0;
    private gameOver: boolean = false;
    private endGamePop !: EndGamePop;
    private timerContainer !: TimerContainer;
    private scoreCardContainer !: Scorecard;
    private levelNo !: Levelcard;
    private levelPopup !: LevelPopup;
    private pauseForNextLevel: boolean = false;
    private speed: number = 2;
    private taskpopup !: TaskPopup;
    private soundBtn !: SoundBtn;
    private weatherbackround !: WeatherBackground;
    private weatherTimng : number = 1000;
    private rainManager !: RainManager;

    constructor(spawnInterval: number) {
        this.app = Game.the.app;
        this.spawnInterval = spawnInterval;
        this.ticker = new Ticker();
        this.weatherbackround = new WeatherBackground();
        this.app.stage.addChild(this.weatherbackround);
        this.endGamePop = new EndGamePop();
        this.app.stage.addChild(this.endGamePop);
        this.timerContainer = new TimerContainer();
        this.scoreCardContainer = new Scorecard();
        this.app.stage.addChild(this.scoreCardContainer);
        this.app.stage.addChild(this.timerContainer);
        this.levelNo = new Levelcard();
        this.app.stage.addChild(this.levelNo);
        this.levelPopup = new LevelPopup();
        this.app.stage.addChild(this.levelPopup);
        this.soundBtn = new SoundBtn();
        this.app.stage.addChild(this.soundBtn);
        this.taskpopup = new TaskPopup();
        this.app.stage.addChild(this.taskpopup);
        this.ticker.add(this.update, this);
        this.ticker.start();
        
        this.rainManager = new RainManager(this.balloons); // Pass balloons
        Game.the.app.stage.addChild(this.rainManager);
        Game.the.app.stage.on("RESUME_GAME_FOR_NEXT_LEVEl", this.resumeGameForNextLevel, this);
    }

    private update(delta: number) {
        if (CommonConfig.the.getPauseForNextLevel()) {
            return;
        }
        if (CommonConfig.the.getGameOver()) {
            if (CommonConfig.the.getTotalScore() >= (CommonConfig.LEVEL_01_THRESHOLD * CommonConfig.the.getLevelsNo())) {
                if (!CommonConfig.the.getPauseForNextLevel()) {
                    this.levelPopup.show();
                    CommonConfig.the.setPauseForNextLevel(true);
                    return;
                }

            } else {
                this.endGamePop.show(false);
                return;
            }

        }
        this.rainManager.update(delta);
        if (this.ticker.lastTime - this.lastSpawnTime > this.spawnInterval) {
            this.spawnBalloon();
            this.lastSpawnTime = this.ticker.lastTime;
        }

        for (const balloon of this.balloons) {
            balloon.update(delta);
        }

        this.balloons = this.balloons.filter(balloon => !balloon.destroyed);

        if (CommonConfig.the.getMissedBalloons() >= 15) {
            this.endGame(true);
        }

        this.timerContainer.update(delta);

        this.app.stage.setChildIndex(this.endGamePop, this.app.stage.children.length - 1);
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
        CommonConfig.the.setLevelsNo(1);
        this.levelNo.setText();
        const weahther : string[] = ['left','right'];
        if(CommonConfig.the.getLevelsNo() > 2){
            const currentWeather : string = weahther[CommonConfig.the.getLevelsNo() % 2];
            this.weatherbackround.show(currentWeather);
            for (const balloon of this.balloons) { 
                if(currentWeather === 'left'){
                    balloon.windSpeed = -1;
                }else{
                    balloon.windSpeed = 1;
                }
            }
        }else{
            this.weatherbackround.show('nowind');
            for (const balloon of this.balloons) { 
                balloon.windSpeed = 0;
            }
        }
        if(CommonConfig.the.getLevelsNo() <= 2){
            this.speed += 2;
        }
        this.spawnInterval -= 100;
        this.timerContainer.resetTimer();
        CommonConfig.the.setPauseForNextLevel(false);
    }

    private updateTaskAtInterval() {
        setInterval(() => this.taskpopup.updateTask(), 3000);
    }

    private spawnBalloon() {
        const balloon: Balloon = new Balloon(10, this.speed);
        balloon.position.set(Math.random() * ((window.innerWidth * 0.9) - 100) + 50, window.innerHeight + 50);
        const weahther : string[] = ['left','right'];
        if(CommonConfig.the.getLevelsNo() > 2){
            const currentWeather : string = weahther[CommonConfig.the.getLevelsNo() % 2];
            if(currentWeather === 'left'){
                balloon.windSpeed = -1;
            }else{
                balloon.windSpeed = 1;
            }
        }else{
            balloon.windSpeed = 0;
        }
        // if((window.innerWidth > window.innerHeight) && (window.innerHeight === 1600)){
        //     balloon.position.set(Math.random() * (window.innerWidth - 100) + 100, 1600);
        // }
        this.app.stage.addChild(balloon);
        this.app.stage.setChildIndex(this.endGamePop, this.app.stage.children.length -1);
        this.app.stage.setChildIndex(this.levelPopup, this.app.stage.children.length -1);
        this.app.stage.setChildIndex(this.soundBtn, this.app.stage.children.length -1);
        this.balloons.push(balloon);
        balloon.on('balloonClicked', this.onBalloonClicked, this);
    }

    private generateNumber() : number{
        let randomNumber : number = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
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
        CommonConfig.the.setTotalScore(this.score);
        this.scoreCardContainer.setText();
    }
}