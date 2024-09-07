import gsap from "gsap";
import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { IntroContainer } from "./Intro";
import { Game } from "../game";

export class LoadingContainer extends Container{
    private loadingBg !: Graphics;

    private loadingFillContainer !: Container;
    private loadingFillBg !: Graphics;
    private loadingFill !: Graphics;
    
    constructor(){
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        // window.onresize = this.setPosition.bind(this);
    }

    private init() :void{
        // this.loadingBg = new Graphics();
        // // this.loadingBg.beginFill(0x000000,0.9);
        // this.loadingBg.drawRect(0, 0, 4000,4000);
        // this.loadingBg.endFill();
        // this.addChild(this.loadingBg);

        

        

        // this.loadingFillContainer = new Container();
        // this.addChild(this.loadingFillContainer);

        // this.loadingFillContainer.x = 1920/2 - 190;
        // this.loadingFillContainer.y = 660;


        // this.loadingFillBg = new Graphics();
        // this.loadingFillBg.beginFill(0x000000);
        // this.loadingFillBg.drawRoundedRect(0, 0, 400, 40, 5);
        // this.loadingFillBg.endFill();

        // this.loadingFill = new Graphics();
        // this.loadingFill.beginFill(0xffffff);
        // this.loadingFill.drawRoundedRect(0, 0, 400, 40, 5);
        // this.loadingFill.endFill();
        // this.loadingFill.scale.x = 0;

        // this.loadingFillContainer.addChild(this.loadingFillBg);
        // this.loadingFillContainer.addChild(this.loadingFill);
    }

    startLoading(duration: number = 2) {
        // // Animate fill from 0% to 100%
        // gsap.to(this.loadingFill.scale, { x: 1, duration });
        // gsap.delayedCall(0.5,this.createIntro.bind(this));
        this.createIntro();
    }

    private createIntro() :void{
        const introScreen = new IntroContainer();
        Game.the.app.stage.addChild(introScreen);
    }

    private setPosition() :void{
        // if(this.loadingFillContainer.width > (window.innerWidth * 0.8)){
        //     this.loadingFillContainer.scale.set(0.5);
        // }
        // if(window.innerWidth > window.innerHeight && (this.loadingFillContainer.width > window.innerWidth * 0.5)){
        //     this.loadingFillContainer.scale.set(0.5);
        // }
        // this.loadingFillContainer.position.set((window.innerWidth - this.loadingFillContainer.width)/2, (window.innerHeight - this.loadingFillContainer.height)*0.86);
    }

}