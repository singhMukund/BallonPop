import gsap from "gsap";
import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class LevelPopup extends Container {
    private popupBg !: Graphics;
    private text !: Text;
    private button!: Text;
    private totalScore !: Text;
    private popupContainer !: Container;
    private textContanerBg !: Sprite;
    private buttonBg !: Graphics;
    private textContainer !: Container;
    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
    }

    private setPosition(): void {
        if (this.popupContainer.width > (window.innerWidth * 0.7)) {
            this.popupContainer.scale.set(0.55);
        }
        this.popupContainer.position.set((window.innerWidth - this.popupContainer.width) / 2, (window.innerHeight - this.popupContainer.height) / 2);
    }

    private init(): void {
        this.popupBg = new Graphics();
        this.popupBg.beginFill(0x000000,0.8);
        this.popupBg.drawRect(0, 0, 4000, 4000);
        this.popupBg.endFill();
        this.addChild(this.popupBg);

        this.popupContainer = new Container();
        this.addChild(this.popupContainer);

        this.textContanerBg = new Sprite(Game.the.app.loader.resources['pop_up'].texture);
        // this.textContanerBg.beginFill(0x2786e8,1);
        // this.textContanerBg.drawRoundedRect(0, 0, 550, 320,24);
        // this.textContanerBg.endFill();
        this.popupContainer.addChild(this.textContanerBg);
        // this.textContanerBg.anchor.set(0.5);
        // this.textContanerBg.position.set(-this.textContanerBg.width/2,-this.textContanerBg.height/2);
        this.textContanerBg.scale.set(1,0.9);
        const style = new TextStyle({
            fontFamily: 'Arial',
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
            fontFamily: 'Arial',
            fontSize: 24,
            fill: "#327ee3",
            align: 'center',
            fontWeight :'bold'
        });

        this.button = new Text('Next Level', buttonStyle);
        // this.button.anchor.set(0.5);
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
        this.totalScore.y = this.text.y - 70;
        this.popupContainer.addChild(this.totalScore);

        this.buttonBg.on('pointerdown', this.onButtonClick.bind(this));
        this.popupContainer.addChild(this.buttonBg);
        this.popupContainer.addChild(this.button);

        this.alpha = 0;
        this.y = this.y - 60;
        this.buttonBg.interactive = false;
        this.buttonBg.buttonMode = false;
    }

    private onButtonClick() {
        this.hide();
    }

    show(): void {
        this.totalScore.text = `Your total score is ${CommonConfig.the.getTotalScore()}`;
        this.text.text = `Ready For Next Ride Level ${CommonConfig.the.getLevelsNo() + 1}`;
        this.visible = true;
        this.alpha = 0;
        gsap.to(this, { alpha: 1, duration: 0.5 });
        this.popupBg.interactive = true;
        this.buttonBg.interactive = true;
        this.buttonBg.buttonMode = true;
    }

    private hide(): void {
        this.visible = true;
        this.alpha = 1;
        gsap.to(this, {
            alpha: 0, duration: 0.5, onComplete: () => {
                this.visible = false;
                Game.the.app.stage.emit("RESUME_GAME_FOR_NEXT_LEVEl");
                this.popupBg.interactive = false;
                this.buttonBg.interactive = false;
                this.buttonBg.buttonMode = false;
            }
        });
    }
}