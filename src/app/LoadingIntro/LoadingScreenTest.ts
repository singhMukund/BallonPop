import { Container, Graphics, Sprite } from "pixi.js";
import { Game } from "../game";
import gsap from "gsap";

export class LoadingScreenTest extends Container{

    private loadingText !: Sprite;
    private loadingBarEmpty !: Sprite;
    private loadingBarFill !: Sprite;
    private LoadingBarDesign !: Sprite;
    private loadingFillContainer !: Container;
    private maskContainer !: Graphics;

    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        this.loadingAnimation();
    }

    private setPosition() :void{
        this.loadingBarEmpty.position.set((window.innerWidth - this.loadingBarEmpty.width)*0.5,window.innerHeight *0.6);
        this.loadingBarFill.position.set((window.innerWidth - this.loadingBarFill.width)*0.5,window.innerHeight *0.6);
        this.LoadingBarDesign.position.set((window.innerWidth - this.LoadingBarDesign.width)*0.5,window.innerHeight *0.6);
        this.loadingText.position.set((window.innerWidth - this.loadingText.width)*0.5,this.loadingBarEmpty.y + 75);
        this.maskContainer.position.set(this.LoadingBarDesign.x, this.LoadingBarDesign.y);
    }

    private init(): void {

        this.loadingText = new Sprite(Game.the.app.loader.resources['Loading_text'].texture);
        this.loadingBarEmpty = new Sprite(Game.the.app.loader.resources['Loading_bar_empty_1'].texture);
        this.loadingFillContainer = new Container();
        this.loadingBarFill = new Sprite(Game.the.app.loader.resources['Loading_bar_fill_2'].texture);
        this.LoadingBarDesign = new Sprite(Game.the.app.loader.resources['Loading_bar_design_3'].texture);
        this.loadingBarEmpty.scale.set(0.4,0.5);
        this.loadingBarFill.scale.set(0.4,0.5);
        this.LoadingBarDesign.scale.set(0.4,0.5);

       


        this.addChild(this.loadingText);
        this.addChild(this.loadingBarEmpty);
        this.addChild(this.loadingFillContainer);
        this.loadingFillContainer.addChild(this.loadingBarFill);
        this.addChild(this.LoadingBarDesign);

        this.maskContainer = new Graphics();
        this.maskContainer.beginFill(0x000000);
        this.maskContainer.drawRect(0, 0, this.LoadingBarDesign.width, this.LoadingBarDesign.height-10);
        this.maskContainer.endFill();
        this.addChild(this.maskContainer);

        this.loadingFillContainer.mask = this.maskContainer; 



    }

    private loadingAnimation() :void{
        let x = this.maskContainer.x;
        this.maskContainer.x = -500;
        gsap.to(this.maskContainer,{
            x : x,
            duration : 5
        })
    }
}