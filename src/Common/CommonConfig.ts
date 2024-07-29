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

    static get the(): CommonConfig {
        if (!CommonConfig._the) {
            CommonConfig._the = new CommonConfig();
        }

        return CommonConfig._the;
    }


    constructor() {
        if (CommonConfig._the == null) CommonConfig._the = this;
    }

    public setPauseForNextLevel(value : boolean) :void{
       this.pauseForNextLevel = value;
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