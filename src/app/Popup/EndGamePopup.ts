import gsap from "gsap";
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";
import { CommonEvents } from "@/Common/CommonEvents";

export class EndGamePop extends Container{
    private popupBg !: Graphics;
    private text !: Text;
    private button!: Text;
    private totalScore !: Text;
    private textContainer !: Container;
    private textContanerBg !: Sprite;
    private buttonBg !: Graphics;
    private _popupVectorHalloween !: Sprite ;

    private titleImage !: Sprite;
    private bottomLineContainer !: Container;
    private homeButton !: Sprite;
    private watchAnAddButton !: Sprite;
    // private playAgainText !: Text;
    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroy, this);
        Game.the.app.stage.on(CommonEvents.CHANGE_THEME, this.changeTheme, this);
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
        textTure = Game.the.app.loader.resources['popUp_halloween'].textures?.[`popup_vector.png`] as Texture; 
        this._popupVectorHalloween = new Sprite(textTure);
        this._popupVectorHalloween.position.set(this.textContanerBg.x + this.textContanerBg.width - (this._popupVectorHalloween.width/2) - 30, - this._popupVectorHalloween.height/2 + 20);
        this.textContainer.addChild(this.textContanerBg);
        this.textContainer.addChild(this._popupVectorHalloween);
        this._popupVectorHalloween.visible = false;
        this.textContanerBg.scale.set(1,1);

        // textTure = Game.the.app.loader.resources['popUp_halloween'].textures?.[`game_over_text.png`] as Texture; 
        // this.titleImage = new Sprite(textTure);
        
        const style = new TextStyle({
            fontFamily: 'helvetica_rounded_bold',
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
            fontFamily: 'helvetica_rounded_bold',
            fontSize: 24,
            fill: "#327ee3",
            align: 'center',
            fontWeight :'normal'
        });

        this.button = new Text('Play Again', buttonStyle);
        this.buttonBg.position.set((this.textContanerBg.width - this.buttonBg.width)/2,this.text.y + 110);
        this.button.x = this.buttonBg.x + (this.buttonBg.width - this.button.width)/2;
        this.button.y = this.buttonBg.y + (this.buttonBg.height - this.button.height)/2;
        const firstTextStyle = new TextStyle({
            fontFamily: 'helvetica_rounded_bold',
            fontSize: 48,
            fill: 'white',
            align: 'center',
            fontWeight :'normal'
        });
        this.totalScore = new Text(`Total Score : ${CommonConfig.the.getTotalScore()}`, firstTextStyle);
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
        this.totalScore.text = `Total Score : ${CommonConfig.the.getTotalScore()}`;
        this.popupBg.interactive = true;
        if(!missed){
            this.text.text = `Game Over! You didn't scored ${CommonConfig.LEVEL_01_THRESHOLD} in level ${CommonConfig.the.getLevelsNo()} level.`;
        }else{
            this.text.text = `Game Over! You missed Total 15 balloons in total ${CommonConfig.the.getLevelsNo()} level.`
        }
        this.totalScore.x = (this.textContanerBg.width - this.totalScore.width) / 2;
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

    private changeTheme(isHalloween : boolean) : void{
        if(isHalloween){
            this.textContanerBg.texture = Game.the.app.loader.resources['popUp_halloween'].textures?.[`Pop_Up.png`] as Texture;
            this._popupVectorHalloween.visible = true;
        }else{
            this.textContanerBg.texture = Game.the.app.loader.resources['popUp'].textures?.[`popUp.png`] as Texture;
            this._popupVectorHalloween.visible = false;
        }
    }
}