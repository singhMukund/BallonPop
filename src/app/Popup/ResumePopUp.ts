import gsap from "gsap";
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class ResumePopUp extends Container {
    private popupBg !: Graphics;
    private button!: Sprite;
    private totalScore !: Text;
    private popupContainer !: Container;
    private textContanerBg !: Sprite;
    private textContainer !: Container;
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
        this.popupContainer.addChild(this.textContanerBg);
        this.textContanerBg.scale.set(1,0.9);
        const style = new TextStyle({
            fontFamily: 'Helvetica',
            fontSize: 36,
            fill: 'white',
            align: 'center'
        });

        let textTureBtn : Texture = Game.the.app.loader.resources['uiPanel'].textures?.[`State_Play.png`] as Texture; 

        this.button = new Sprite(textTureBtn);
        // this.button.anchor.set(0.5);
        this.button.x = this.textContanerBg.x + (this.textContanerBg.width - this.button.width)/2;
        this.button.y = this.textContanerBg.y + (this.textContanerBg.height - this.button.height)/2 + 60;

        const firstTextStyle = new TextStyle({
            fontFamily: 'Helvetica',
            fontSize: 48,
            fill: 'white',
            align: 'center',
            fontWeight :'normal'
        });
        this.totalScore = new Text(`Your total score is ${CommonConfig.the.getTotalScore()}`, firstTextStyle);
        this.totalScore.x = (this.textContanerBg.width - this.totalScore.width) / 2;
        this.totalScore.y = this.button.y - 70;
        this.popupContainer.addChild(this.totalScore);

        this.button.on('pointerdown', this.onButtonClick.bind(this));
        this.popupContainer.addChild(this.button);

        this.alpha = 0;
        this.y = this.y - 60;
        this.button.interactive = false;
        this.visible = false;
    }

    private onButtonClick() {
        this.hide();
    }

    show(): void {
        if(this.visible){
            return
        }
        Game.the.app.stage.emit("STOP_BG_SOUND");
        this.totalScore.text = `Your total score is ${CommonConfig.the.getTotalScore()}`;
        this.visible = true;
        this.alpha = 0;
        gsap.to(this, { alpha: 1, duration: 0.5 });
        this.popupBg.interactive = true;
        this.button.interactive = true;
    }

    private hide(): void {
        this.alpha = 1;
        gsap.to(this, {
            alpha: 0, duration: 0.5, onComplete: () => {
                this.visible = false;
                Game.the.app.stage.emit("PLAY_BTN_CLICKED");
                this.popupBg.interactive = false;
                this.button.interactive = false;
                Game.the.app.stage.emit("PLAY_BG_SOUND");
            }
        });
    }
}