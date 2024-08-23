import gsap from "gsap";
import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class LevelPopup extends Container{
    private popupBg !: Graphics;
    private text !: Text;
    private button!: Text;
    private totalScore !: Text;
    private textContainer !: Container;
    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
    }

    private setPosition() :void{
        this.textContainer.position.set((window.innerWidth)/2,(window.innerHeight)/2)
    }

    private init() :void{
        this.popupBg = new Graphics();
        this.popupBg.beginFill(0x000000,0.35);
        this.popupBg.drawRect(0, 0, 4000,4000);
        this.popupBg.endFill();
        this.addChild(this.popupBg);

        this.textContainer = new Container();
        this.addChild(this.textContainer);
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 'white',
            align: 'center'
        });

        this.text = new Text(`Ready For Next Ride Level ${CommonConfig.the.getLevelsNo()}`, style);

        // Center the text in the container
        this.text.anchor.set(0.5);
        this.text.x = 0;
        this.text.y = 0;

        this.textContainer.x = window.innerWidth / 2;
        this.textContainer.y = window.innerHeight / 2;

        this.textContainer.addChild(this.text);

        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center'
        });

        this.button = new Text('Next Level', buttonStyle);
        this.button.anchor.set(0.5);
        this.button.x = this.text.x;
        this.button.y = this.text.y + 50;
        this.button.interactive = true;
        this.button.buttonMode = true;

        this.totalScore = new Text(`Your total score is ${CommonConfig.the.getTotalScore()}`, buttonStyle);
        this.totalScore.x = this.text.x - (this.totalScore.width)/2;
        this.totalScore.y = this.text.y - 50;
        this.textContainer.addChild(this.totalScore);

        this.button.on('pointerdown', this.onButtonClick.bind(this));

        this.textContainer.addChild(this.button);

        this.alpha = 0;
        this.y = this.y - 60
    }

    private onButtonClick() {
       this.hide();
    }

    show() :void{
        this.totalScore.text = `Your total score is ${CommonConfig.the.getTotalScore()}`;
        this.text.text = `Ready For Next Ride Level ${CommonConfig.the.getLevelsNo() + 1}`;
        this.visible = true;
        this.alpha = 0;
        gsap.to(this, { alpha: 1, duration: 0.5 });
    }

    private hide() :void{
        this.visible = true;
        this.alpha = 1;
        gsap.to(this, { alpha: 0, duration: 0.5 , onComplete :()=>{
            this.visible = false;
            Game.the.app.stage.emit("RESUME_GAME_FOR_NEXT_LEVEl");
        }});
    }
}