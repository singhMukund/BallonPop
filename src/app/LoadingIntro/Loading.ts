import gsap from "gsap";
import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { IntroContainer } from "./Intro";
import { Game } from "../game";

export class LoadingContainer extends Container{
    private loadingBg !: Graphics;
    private gameName !: Text;

    private loadingFillContainer !: Container;
    private loadingFillBg !: Graphics;
    private loadingFill !: Graphics;
    constructor(){
        super();
        this.init();
    }

    private init() :void{
        this.loadingBg = new Graphics();
        this.loadingBg.beginFill(0x000000,0.9);
        this.loadingBg.drawRect(0, 0, 4000,4000);
        this.loadingBg.endFill();
        this.addChild(this.loadingBg);

        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 72,
            fill: 'white',
            align: 'center'
        });

        this.gameName = new Text("Balloon Rush", style);

        // Center the text in the container
        this.gameName.anchor.set(0.5);
        this.gameName.x = 1920 / 2 ;
        this.gameName.y = 90;

        this.addChild(this.gameName);

        this.loadingFillContainer = new Container();
        this.addChild(this.loadingFillContainer);

        this.loadingFillContainer.x = 1920/2 - 190;
        this.loadingFillContainer.y = 660;


        this.loadingFillBg = new Graphics();
        this.loadingFillBg.beginFill(0x000000);
        this.loadingFillBg.drawRoundedRect(0, 0, 400, 40, 5);
        this.loadingFillBg.endFill();

        this.loadingFill = new Graphics();
        this.loadingFill.beginFill(0xffffff);
        this.loadingFill.drawRoundedRect(0, 0, 400, 40, 5);
        this.loadingFill.endFill();
        this.loadingFill.scale.x = 0;

        this.loadingFillContainer.addChild(this.loadingFillBg);
        this.loadingFillContainer.addChild(this.loadingFill);
    }

    startLoading(duration: number = 2) {
        // Animate fill from 0% to 100%
        gsap.to(this.loadingFill.scale, { x: 1, duration });
        gsap.delayedCall(0.5,this.createIntro.bind(this));
    }

    private createIntro() :void{
        const introScreen = new IntroContainer();
        Game.the.app.stage.addChild(introScreen);
    }
}