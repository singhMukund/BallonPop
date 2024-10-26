import gsap from "gsap";
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";
import { CommonEvents } from "@/Common/CommonEvents";

export class LevelPopup extends Container {
    private popupBg !: Graphics;
    private text !: Text;
    private button!: Text;
    private totalScore !: Text;
    private popupContainer !: Container;
    private textContanerBg !: Sprite;
    private buttonBg !: Graphics;
    private textContainer !: Container;
    private _hideClicked : boolean = false;
    private _isGetResultValue : boolean = false;
    private _popupVectorHalloween !: Sprite ;
    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroy, this);
        Game.the.app.stage.on(CommonEvents.CHANGE_THEME, this.changeTheme, this);
        Game.the.app.stage.on("HIDE_LEVEL_POP_UP", this.getResultFromBackedn, this);
    }

    destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean; } | undefined): void {
        super.destroy({ children: true,texture : true, baseTexture : true })
    }

    private setPosition(): void {
        if (this.popupContainer.width > (window.innerWidth * 0.7) || !CommonConfig.the.isDesktop()) {
            this.popupContainer.scale.set(0.45);
        }
        this.popupContainer.position.set((window.innerWidth - this.popupContainer.width) / 2, (window.innerHeight - this.popupContainer.height) * 0.55);
    }

    private init(): void {
        this.popupBg = new Graphics();
        this.popupBg.beginFill(0x000000,0.8);
        this.popupBg.drawRect(0, 0, 4000, 4000);
        this.popupBg.endFill();
        this.addChild(this.popupBg);

        this.popupContainer = new Container();
        this.addChild(this.popupContainer);

        let textTure : Texture = Game.the.app.loader.resources['popUp'].textures?.[`pop_up.png`] as Texture; 
        this.textContanerBg = new Sprite(textTure);
        textTure = Game.the.app.loader.resources['popUp_halloween'].textures?.[`popup_vector.png`] as Texture; 
        this._popupVectorHalloween = new Sprite(textTure);
        this._popupVectorHalloween.position.set(this.textContanerBg.x + this.textContanerBg.width - (this._popupVectorHalloween.width/2) - 30, - this._popupVectorHalloween.height/2 + 20);
        this.popupContainer.addChild(this.textContanerBg);
        this.popupContainer.addChild(this._popupVectorHalloween);
        this._popupVectorHalloween.visible = false;
        this.textContanerBg.scale.set(1,1);
        const style = new TextStyle({
            fontFamily: 'helvetica_rounded_bold',
            fontSize: 36,
            fill: 'white',
            align: 'center'
        });

        this.text = new Text(`Ready For Next Ride Level ${CommonConfig.the.getLevelsNo()}`, style);

        // Center the text in the container
        // this.text.anchor.set(0.5);
        this.text.x = (this.textContanerBg.width - this.text.width)/2;
        this.text.y = (this.textContanerBg.height - this.text.height)/2 - 20;

        // this.popupContainer.x = window.innerWidth / 2;
        // this.popupContainer.y = window.innerHeight / 2;

        this.popupContainer.addChild(this.text);
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

        this.button = new Text('Next Level', buttonStyle);
        // this.button.anchor.set(0.5);
        this.buttonBg.position.set((this.textContanerBg.width - this.buttonBg.width)/2,this.text.y + 70);
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
        this.totalScore.y = this.text.y - 70;
        this.popupContainer.addChild(this.totalScore);

        this.buttonBg.on('pointerdown', this.onButtonClick.bind(this));
        this.popupContainer.addChild(this.buttonBg);
        this.popupContainer.addChild(this.button);

        this.alpha = 0;
        this.y = this.y - 60;
        this.buttonBg.interactive = false;
        this.buttonBg.buttonMode = false;
        this.visible = false;
    }

    private onButtonClick() {
        this.hideClicked();
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

    show(): void {
        if(this.visible){
            return
        }
        this.buttonBg.alpha = 0.4;
        Game.the.app.stage.emit("ENABLE_DISABLE_GIFT_BTN",true);
        CommonConfig.the.setIsLevelPopupOpen(true);
        Game.the.app.stage.emit("UPDATE_SCORE");
        Game.the.app.stage.emit("STOP_BG_SOUND");
        this.totalScore.text = `Total Score : ${CommonConfig.the.getTotalScore()}`;
        this.text.text = `Ready For Next Ride Level ${CommonConfig.the.getLevelsNo() + 1}`;
        this.visible = true;
        this.totalScore.x = (this.textContanerBg.width - this.totalScore.width) / 2;
        this.alpha = 0;
        gsap.to(this, { alpha: 1, duration: 0.5 });
        this.popupBg.interactive = true;
        this.buttonBg.interactive = true;
        this.buttonBg.buttonMode = true;   
    }

    private hideClicked(): void {
        if(!this._isGetResultValue){
            return;
        }
        this.alpha = 1;
        this._hideClicked = true;
        if(this._hideClicked && this._isGetResultValue){
            Game.the.app.stage.emit("HIDE_GIFT_POP_UP");
            gsap.to(this, {
                alpha: 0, duration: 0.5, onComplete: () => {
                    this.visible = false;
                    Game.the.app.stage.emit("RESUME_GAME_FOR_NEXT_LEVEl");
                    this.popupBg.interactive = false;
                    this.buttonBg.interactive = false;
                    this.buttonBg.buttonMode = false;
                    Game.the.app.stage.emit("PLAY_BG_SOUND");
                    CommonConfig.the.setIsLevelPopupOpen(false);
                    Game.the.app.stage.emit("ENABLE_DISABLE_GIFT_BTN",false);
                }
            });
        }
    }

    private getResultFromBackedn(): void {
        this._isGetResultValue = true;
        this.buttonBg.alpha = 1;
    }
}