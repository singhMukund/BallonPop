import gsap from "gsap";
import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";

export class EndGamePop extends Container{
    private popupBg !: Graphics;
    private text !: Text;
    private button!: Text;
    private totalScore !: Text;
    constructor() {
        super();
        this.init();
    }

    private init() :void{
        this.popupBg = new Graphics();
        this.popupBg.beginFill(0x000000,0.35);
        this.popupBg.drawRect(0, 0, 4000,4000);
        this.popupBg.endFill();
        this.addChild(this.popupBg);


        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 'white',
            align: 'center'
        });

        this.text = new Text(`Game Over! You missed Total 15 balloons in total ${CommonConfig.the.getLevelsNo()} level.`, style);

        // Center the text in the container
        this.text.anchor.set(0.5);
        this.text.x = 1920 / 2;
        this.text.y = 1080 / 2;

        this.addChild(this.text);

        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center'
        });

        this.button = new Text('Play Again', buttonStyle);
        this.button.anchor.set(0.5);
        this.button.x = this.text.x;
        this.button.y = this.text.y + 50;
        this.button.interactive = true;
        this.button.buttonMode = true;

        this.totalScore = new Text(`Your total score is ${CommonConfig.the.getTotalScore()}`, buttonStyle);
        this.totalScore.x = this.text.x - (this.totalScore.width)/2;
        this.totalScore.y = this.text.y - 50;
        this.addChild(this.totalScore);

        this.button.on('pointerdown', this.onButtonClick);

        this.addChild(this.button);

        this.alpha = 0;
        this.y = this.y - 60
    }

    private onButtonClick() {
        // Refresh the page
        window.location.reload();
    }

    show(missed : boolean) :void{
        this.totalScore.text = `Your total score is ${CommonConfig.the.getTotalScore()}`;
        if(!missed){
            this.text.text = `Game Over! You didn't scored ${CommonConfig.LEVEL_01_THRESHOLD * CommonConfig.the.getLevelsNo()} in level ${CommonConfig.the.getLevelsNo()} level.`;
        }else{
            this.text.text = `Game Over! You missed Total 15 balloons in total ${CommonConfig.the.getLevelsNo()} level.`
        }
        this.visible = true;
        this.alpha = 0;
        gsap.to(this, { alpha: 1, duration: 0.5 });
    }
}