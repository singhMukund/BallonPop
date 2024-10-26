import MobileDetect from "mobile-detect";
import { IBalloonData } from "./CommonInterface";

export class CommonConfig {

    protected static _the: CommonConfig;
    private missedBalloonsTotalLeft: number = 0;
    private missedBalloons: number = 15;
    private totalscore: number = 0;
    private currentscore: number = 0;
    private gameOver: boolean = false;
    private level: number = 1;
    private pauseForNextLevel: boolean = false;

    public static LEVEL_01_THRESHOLD: number = 200;

    public static taskType: string[] = ["ALPHABET", "NUMBER"];
    public static taskSubType: string[] = ["LESS", "GREATER"];
    public static task: string = "";
    public currentSubTaskIndex: number = 0;
    public currentTaskIndex: number = 0;
    public randomValue: string = "";
    private colorCodes: string[] = ['green', 'orange', 'pink', 'golden', 'sea_green', 'yellow', "timeLimitedBalloon", 'brandedTrikon'];
    private colorCodes_Halloween: string[] = ['02_white', '04_white', '05_white', '06_white', "07_orange", '08_orange','09_orange','10_orange','11_orange'];
    private balloonCount: number = 0;
    private gameId: string = "";
    private userId: string = "";
    private tokens: string = "";
    private timer: number = 0;
    private isSoundMuted: boolean = false;
    private isGamePaused: boolean = false;
    private isPlayerGetElectricBalloon: boolean = false;
    private isBrokenCase: boolean = false;
    private isLevelPopupOpen: boolean = false;
    private normalScore: number = 10;
    private totalGiftCount: number = 0;
    private currentDayGiftCount: number = 0;
    private getFirstGiftRealsed: boolean = false;
    private lastTexture: string = "";
    private isResumePopupOpen: boolean = false;
    private isBonusLevel : boolean = false;
    private isHalloweenTheme : boolean = false;
    private totalDailyMissedChance : number = 0;

    static get the(): CommonConfig {
        if (!CommonConfig._the) {
            CommonConfig._the = new CommonConfig();
        }

        return CommonConfig._the;
    }

    isDesktop(): boolean {
        const md = new MobileDetect(window.navigator.userAgent);
        return !md.mobile();  // Returns true if it's not a mobile device
    }

    isPortraitmobile(): boolean {
        return window.innerHeight > window.innerWidth;
    }


    constructor() {
        if (CommonConfig._the == null) CommonConfig._the = this;
        this.balloonCount = 0;
    }

    public setPauseForNextLevel(value: boolean): void {
        this.pauseForNextLevel = value;
    }

    getRandomBalloon() {
        this.balloonCount++;

        if (this.balloonCount >= 10 && this.balloonCount <= 15) {
            const isMysteryBalloon = Math.random() < 0.5; // 50% chance to be the mystery balloon
            if (isMysteryBalloon) {
                this.balloonCount = 0; // Reset the counter after red balloon appears
                return 'golden';
            }
        }
        if (this.getLevelsNo() >= 12 && this.getLevelsNo() % 12 === 0 && this.getTotalGiftCount() < (Math.floor(this.getLevelsNo() / 12)) && this.getTotalGiftCount() < 4 && !this.getFirstGiftRealsed) {

            this.getFirstGiftRealsed = true;
            return 'brandedTrikon';
        }
        // return 'electric';
        // return 'timeLimitedBalloon';
        let nonRedColors = this.colorCodes.filter(color => color !== 'golden');
        nonRedColors = nonRedColors.filter(color => color !== 'brandedTrikon');
        this.getLevelsNo() < 10 && (nonRedColors = nonRedColors.filter(color => color !== 'timeLimitedBalloon'));
        let randomIndex: number = Math.floor(Math.random() * nonRedColors.length);
        if(nonRedColors[randomIndex] === 'timeLimitedBalloon'){
            return nonRedColors[randomIndex];
        }
        if(this.getIsHalloweenTheme()){
            nonRedColors = this.colorCodes_Halloween;
        }
        randomIndex = Math.floor(Math.random() * nonRedColors.length);
        if (this.getLevelsNo() >= 5 && this.getLevelsNo() % 5 === 0 && this.getTimer() < 7 && !this.getPlayerElectricBalloon()) {
            this.setPlayerElectricBalloon(true);
            return 'electric';
        }
        if(this.getIsHalloweenTheme()){
            return `halloween_balloon_${nonRedColors[randomIndex]}`;
        }else{
            return nonRedColors[randomIndex];
        }
    }

    public setIsLevelPopupOpen(value: boolean): void {
        this.isLevelPopupOpen = value;
    }

    public getIsLevelPopupOpen(): boolean {
        return this.isLevelPopupOpen;
    }
 
    public setTotalMissedChance(value: number): void {
        this.totalDailyMissedChance = value;
    }

    public getTotalMissedChance(): number {
        return this.totalDailyMissedChance;
    }

    public setIsHalloweenTheme(value: boolean): void {
        this.isHalloweenTheme = value;
    }

    public getIsHalloweenTheme(): boolean {
        return this.isHalloweenTheme;
    }

    public setIsResumePopupOpen(value: boolean): void {
        this.isResumePopupOpen = value;
    }

    public getIsResumePopupOpen(): boolean {
        return this.isResumePopupOpen;
    }

    public setIsBonusLevel(value: boolean): void {
        this.isBonusLevel = value;
    }

    public getIsBonusLevel(): boolean {
        return this.isBonusLevel;
    }

    public setLastTexture(value: string): void {
        this.lastTexture = value;
    }

    public getLastTexture(): string {
        return this.lastTexture;
    }

    public setIsSoundMuted(value: boolean): void {
        this.isSoundMuted = value;
    }

    public getIsSoundMuted(): boolean {
        return this.isSoundMuted;
    }

    public setPlayerElectricBalloon(value: boolean): void {
        this.isPlayerGetElectricBalloon = value;
    }

    public getPlayerElectricBalloon(): boolean {
        return this.isPlayerGetElectricBalloon;
    }

    private startingLevelOfDay: number = 0;

    public setStartingLevelOfDay(value: number): void {
        this.startingLevelOfDay = value;
    }

    public getStartingLevelOfDay(): number {
        return this.startingLevelOfDay;
    }


    public setGamePaused(value: boolean): void {
        this.isGamePaused = value;
    }

    public getGamePaused(): boolean {
        return this.isGamePaused;
    }

    public setGameId(value: string): void {
        this.gameId = value;
    }

    public getGameId(): string {
        return this.gameId;
    }

    public setUserId(value: string): void {
        this.userId = value;
    }

    public getUserId(): string {
        return this.userId;
    }

    public setTaken(value: string): void {
        this.tokens = value;
    }

    public getTaken(): string {
        return this.tokens;
    }

    public getPauseForNextLevel(): boolean {
        return this.pauseForNextLevel;
    }

    public setTotalMissedBalloonsLeftChance(value: number): void {
        this.missedBalloonsTotalLeft += value;
    }


    public getTotalMissedBalloonsLeftChance(): number {
        return this.missedBalloonsTotalLeft;
    }

    public setNormalScore(value: number): void {
        if(value === 13){
            value = value;
        }
        this.normalScore = value;
    }


    public getNormalScore(): number {
        return this.normalScore;
    }


    public setTotalGiftCount(value: number): void {
        this.totalGiftCount = value;
    }

    public getTotalGiftCount(): number {
        return this.totalGiftCount;
    }

    public setTotalCurrentDayGiftCount(value: number): void {
        this.currentDayGiftCount = value;
    }

    public getTotalCurrentDayGiftCount(): number {
        return this.currentDayGiftCount;
    }

    public setMissedBalloons(value: number, isOnlySet?: boolean): void {
        if (isOnlySet) {
            this.missedBalloons = value;
        } else {
            this.missedBalloons += value;
        }
    }


    public getMissedBalloons(): number {
        return this.missedBalloons;
    }

    public setTimer(value: number): void {
        this.timer = value;
    }

    public setbrokenCase(value: boolean): void {
        this.isBrokenCase = value;
    }

    public getbrokenCase(): boolean {
        return this.isBrokenCase;
    }


    public getTimer(): number {
        return this.timer;
    }

    public setGameOver(value: boolean) {
        this.gameOver = value;
    }



    public getGameOver(): boolean {
        return this.gameOver;
    }

    public setTotalScore(value: number): void {
        this.totalscore = value;
    }

    public getTotalScore(): number {
        return this.totalscore;
    }

    public setCurrentScore(value: number): void {
        this.currentscore = value;
    }

    public getCurrentScore(): number {
        return this.currentscore;
    }

    public setLevelsNo(value: number): void {
        this.getFirstGiftRealsed = false;
        this.level = value;
    }

    public getLevelsNo(): number {
        return this.level;
    }

    generateTask(): string {
        this.currentSubTaskIndex = Math.floor(Math.random() * 2);
        this.currentTaskIndex = Math.floor(Math.random() * 2);

        const tasktype: string = CommonConfig.taskType[this.currentTaskIndex];
        const taskSubTask: string = CommonConfig.taskSubType[this.currentSubTaskIndex];

        if (tasktype === "ALPHABET") {
            let randomAlphaBet: string = this.getRandomAlphabetBetweenEAndT();
            let task: string = `Click On ${tasktype} ${taskSubTask} to ${randomAlphaBet}`;
            this.randomValue = randomAlphaBet;
            return task;
        } else {
            let randomNumber: number = Math.floor(Math.random() * (85 - 15 + 1)) + 15;
            let task: string = `Click On ${tasktype} ${taskSubTask} to ${randomNumber}`;
            this.randomValue = `${randomNumber}`;
            return task;
        }
    }

    private getRandomAlphabetBetweenEAndT(): string {
        const min = 69; // Unicode value for 'E'
        const max = 84; // Unicode value for 'T'
        const randomCharCode = Math.floor(Math.random() * (max - min + 1)) + min;
        return String.fromCharCode(randomCharCode);
    }




}
