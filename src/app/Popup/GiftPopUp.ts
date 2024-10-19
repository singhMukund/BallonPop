import gsap from "gsap";
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class GiftPopUp extends Container {
    private popupBg !: Graphics;
    private text !: Text;
    private bottomText !: Text;
    private textContainer !: Container;
    private textContanerBg !: Sprite;
    private button !: Sprite;
    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroy, this);
        Game.the.app.stage.on("SHOW_GIFT_POP_UP", this.show, this);
        // this.popupBg.on('pointerdown', this.hide, this);
        Game.the.app.stage.on("HIDE_GIFT_POP_UP", this.hide, this);
    }

    destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean; } | undefined): void {
        super.destroy({ children: true, texture: true, baseTexture: true })
    }

    private setPosition(): void {
        // if (this.textContainer.width > (window.innerWidth * 0.7) || !CommonConfig.the.isDesktop()) {
        //     this.textContainer.scale.set(0.55);
        // }
        this.textContainer.scale.set(0.56);
        this.textContainer.position.set((window.innerWidth - this.textContainer.width) / 2, (window.innerHeight + this.textContainer.height));
    }



    private init(): void {
        this.popupBg = new Graphics();
        this.popupBg.beginFill(0x000000, 0.8);
        this.popupBg.drawRect(0, 0, 4000, 4000);
        this.popupBg.endFill();
        this.addChild(this.popupBg);
        this.textContainer = new Container();
        this.addChild(this.textContainer);
        let textTure: Texture = Game.the.app.loader.resources['GiftPopup'].textures?.[`GiftPopBg.png`] as Texture;
        this.textContanerBg = new Sprite(textTure);
        this.textContainer.addChild(this.textContanerBg);
        this.textContanerBg.scale.set(1);
        const style = new TextStyle({
            fontFamily: 'Helvetica',
            fontSize: 34,
            fill: 'white',
            align: 'center',
            fontWeight: 'normal'
        });

        this.text = new Text(`You have ${CommonConfig.the.getTotalGiftCount()} gift boxes.`, style);

        this.text.x = (this.textContanerBg.width - this.text.width) / 2;
        this.text.y = (this.textContanerBg.height) / 2 + 20;

        this.textContainer.addChild(this.text);
        let textTure2: Texture = Game.the.app.loader.resources['GiftPopup'].textures?.[`GiftNavBtn.png`] as Texture;
        this.button = new Sprite(textTure2);


        const firstTextStyle = new TextStyle({
            fontFamily: 'Helvetica',
            fontSize: 24,
            fill: 'white',
            align: 'center',
            fontWeight: 'normal'
        });
        this.bottomText = new Text(`You can reveal your gift in the rewards section of the mini app.`, firstTextStyle);
        this.bottomText.x = (this.textContanerBg.width - this.bottomText.width) / 2;
        this.bottomText.y = this.text.y + 50;
        this.textContainer.addChild(this.bottomText);
        this.button.scale.set(0.8);
        this.button.position.set((this.textContanerBg.width - this.button.width) / 2, this.bottomText.y + 40);
        this.textContainer.addChild(this.button);

        this.y = this.y - 60;
        this.button.interactive = false;
        this.button.buttonMode = false;
        this.visible = false;
    }

    private show(): void {
        if(this.visible === true){
            this.hide();
            return;
        }
        // Game.the.app.stage.emit("PAUSE_BTN_CLICKED",true);
        Game.the.app.stage.emit("STOP_BG_SOUND");
        this.visible = true;
        this.popupBg.interactive = false;
        this.popupBg.alpha = 0;
        // gsap.to(this.popupBg, { alpha: 1, duration: 0.45 });
        this.text.text = `You have ${CommonConfig.the.getTotalGiftCount()} gift boxes.`
        gsap.to(this.textContainer, {
            y: (window.innerHeight - this.textContainer.height) + 60, duration: 0.5, onComplete: () => {
                // this.hide()
            }
        });
        this.button.interactive = true;
        this.button.buttonMode = true;
    }

    private hide(): void {

        this.popupBg.alpha = 0;
        // Game.the.app.stage.emit("PAUSE_BTN_CLICKED",false);
        gsap.to(this.textContainer, {
            y: (window.innerHeight + this.textContainer.height), duration: 0.5, onComplete: () => {
                this.button.interactive = false;
                this.button.buttonMode = false;
                this.visible = false;
                this.popupBg.interactive = false;
            }
        });
    }
}