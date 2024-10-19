import gsap from "gsap";
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class EndGamePop extends Container{
    private popupBg !: Graphics;
    private text !: Text;
    private button!: Text;
    private totalScore !: Text;
    private textContainer !: Container;
    private textContanerBg !: Sprite;
    private buttonBg !: Graphics;
    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroy, this);
    }

    destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean; } | undefined): void {
        super.destroy({ children: true,texture : true, baseTexture : true })
    }

    private setPosition() :void{
        if(this.textContainer.width > (window.innerWidth * 0.7) || !CommonConfig.the.isDesktop()){
            this.textContainer.scale.set(0.45);
        }
        if(CommonConfig.the.isPortraitmobile() || CommonConfig.the.isDesktop()){
            this.textContainer.position.set((window.innerWidth - this.textContainer.width) / 2, (window.innerHeight - this.textContainer.height) * 0.55);
        }else{
            this.textContainer.position.set((window.innerWidth - this.textContainer.width) / 2, (window.innerHeight - this.textContainer.height) * 0.8);
        }
    }

    

    private init() :void{
        this.popupBg = new Graphics();
        this.popupBg.beginFill(0x000000,0.8);
        this.popupBg.drawRect(0, 0, 4000,4000);
        this.popupBg.endFill();
        this.addChild(this.popupBg);

        this.textContainer = new Container();
        this.addChild(this.textContainer);
        let textTure : Texture = Game.the.app.loader.resources['popUp'].textures?.[`pop_up.png`] as Texture; 
        this.textContanerBg = new Sprite(textTure);
        // this.textContanerBg.beginFill(0x2786e8,1);
        // this.textContanerBg.drawRoundedRect(0, 0, 550, 320,24);
        // this.textContanerBg.endFill();
        this.textContainer.addChild(this.textContanerBg);
        // this.textContanerBg.position.set(-this.textContanerBg.width/2,-this.textContanerBg.height/2);
        this.textContanerBg.scale.set(1,0.9);

        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center',
            wordWrap : true,
            wordWrapWidth : 500,
        });

        this.text = new Text(`Game Over! You missed Total ${CommonConfig.the.getTotalMissedBalloonsLeftChance()} balloons in total ${CommonConfig.the.getLevelsNo()} level.`, style);

        this.text.x = (this.textContanerBg.width - this.text.width)/2;
        this.text.y = (this.textContanerBg.height - this.text.height)/2 - 20;

        this.textContainer.addChild(this.text);
        this.buttonBg = new Graphics();
        this.buttonBg.beginFill(0xffffff,1);
        this.buttonBg.drawRoundedRect(0, 0, 160, 50, 7);
        this.buttonBg.endFill();
        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: "#327ee3",
            align: 'center',
            fontWeight :'bold'
        });

        this.button = new Text('Play Again', buttonStyle);
        this.buttonBg.position.set((this.textContanerBg.width - this.buttonBg.width)/2,this.text.y + 70);
        this.button.x = this.buttonBg.x + (this.buttonBg.width - this.button.width)/2;
        this.button.y = this.buttonBg.y + (this.buttonBg.height - this.button.height)/2;
        const firstTextStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center',
            fontWeight :'bold'
        });
        this.totalScore = new Text(`Your total score is ${CommonConfig.the.getTotalScore()}`, firstTextStyle);
        this.totalScore.x = (this.textContanerBg.width - this.totalScore.width) / 2;
        this.totalScore.y = this.text.y - 50;
        this.textContainer.addChild(this.totalScore);

        this.buttonBg.on('pointerdown', this.onButtonClick);
        this.textContainer.addChild(this.buttonBg);
        this.textContainer.addChild(this.button);

        this.alpha = 0;
        this.y = this.y - 60;
        this.buttonBg.interactive = false;
        this.buttonBg.buttonMode = false;
        this.visible = true;
    }

    private onButtonClick() {
        // Refresh the page
        window.location.reload();
        // this.buttonBg.interactive = false;
        // this.buttonBg.buttonMode = false;
    }

    show(missed : boolean) :void{
        // if(this.visible = true){
        //     return;
        // }
        if(CommonConfig.the.getIsLevelPopupOpen()){
           return;
        }
        Game.the.app.stage.emit("STOP_BG_SOUND");
        Game.the.app.stage.emit("ENABLE_DISABLE_GIFT_BTN",true);
        this.totalScore.text = `Your total score is ${CommonConfig.the.getTotalScore()}`;
        this.popupBg.interactive = true;
        if(!missed){
            this.text.text = `Game Over! You didn't scored ${CommonConfig.LEVEL_01_THRESHOLD} in level ${CommonConfig.the.getLevelsNo()} level.`;
        }else{
            this.text.text = `Game Over! You missed Total 15 balloons in total ${CommonConfig.the.getLevelsNo()} level.`
        }
        this.visible = true;
        this.alpha = 0;
        gsap.to(this, { alpha: 1, duration: 0.5 });
        this.buttonBg.interactive = true;
        this.buttonBg.buttonMode = true;
        this.text.x = (this.textContanerBg.width - this.text.width)/2;
        this.text.y = (this.textContanerBg.height - this.text.height)/2 - 20;
        this.totalScore.x = (this.textContanerBg.width - this.totalScore.width) / 2;
        // localStorage.removeItem('missed_balloon_count');
        // localStorage.removeItem('balloon_speed');
    }
}