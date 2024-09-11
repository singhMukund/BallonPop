import MobileDetect from "mobile-detect";

export class CommonConfig {

    protected static _the: CommonConfig;
    private missedBalloons : number = 0;
    private totalscore : number = 0;
    private gameOver : boolean= false;
    private level : number = 1;
    private pauseForNextLevel : boolean = false;

    public static LEVEL_01_THRESHOLD : number = 200;

    public static taskType : string[] = ["ALPHABET","NUMBER"];
    public static taskSubType : string[] = ["LESS","GREATER"];
    public static task : string = "";
    public currentSubTaskIndex : number = 0;
    public currentTaskIndex : number = 0;
    public randomValue : string = "";
    private colorCodes : string[] = ['blue', 'green', 'orange', 'pink', 'golden','purple','black','blackies'];
    private balloonCount : number = 0;

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

    isPortraitmobile() : boolean{
        return window.innerHeight > window.innerWidth;
    }


    constructor() {
        if (CommonConfig._the == null) CommonConfig._the = this;
        this.balloonCount = 0;
    }

    public setPauseForNextLevel(value : boolean) :void{
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

        const nonRedColors = this.colorCodes.filter(color => color !== 'golden');
        const randomIndex = Math.floor(Math.random() * nonRedColors.length);
        return nonRedColors[randomIndex];
    }


    public getPauseForNextLevel() :boolean{
        return this.pauseForNextLevel;
    }

    public setMissedBalloons(value : number) :void{
        this.missedBalloons += value;
    }

    public setGameOver(value : boolean) {
        this.gameOver = value;
    }

    public getGameOver() : boolean{
        return this.gameOver;
    }

    public getMissedBalloons() : number{
        return this.missedBalloons;
    }

    public setTotalScore(value : number) :void{
        this.totalscore = value;
    }

    public getTotalScore() : number{
        return this.totalscore;
    }

    public setLevelsNo(value : number) :void{
        this.level += value;
    }

    public getLevelsNo() : number{
        return this.level;
    }

    generateTask() : string{
       this.currentSubTaskIndex = Math.floor(Math.random() * 2);
       this.currentTaskIndex = Math.floor(Math.random() * 2);
       
       const tasktype : string = CommonConfig.taskType[this.currentTaskIndex];
       const taskSubTask : string = CommonConfig.taskSubType[this.currentSubTaskIndex];

       if(tasktype === "ALPHABET"){
         let randomAlphaBet : string = this.getRandomAlphabetBetweenEAndT();
         let task : string = `Click On ${tasktype} ${taskSubTask} to ${randomAlphaBet}`;
         this.randomValue = randomAlphaBet;
         return task;
       }else{
         let randomNumber : number = Math.floor(Math.random() * (85 - 15 + 1)) + 15;
         let task : string = `Click On ${tasktype} ${taskSubTask} to ${randomNumber}`;
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