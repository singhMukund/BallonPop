import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Game } from "../game";
import gsap from "gsap";
import { CommonConfig } from "../../Common/CommonConfig";
import { CommonEvents } from "@/Common/CommonEvents";

export class LoadingScreenTest extends Container {

    private loadingBarEmpty !: Sprite;
    private loadingBarFill !: Sprite;
    private loadingFillContainer !: Container;
    private maskContainer !: Graphics;
    private loadingBarFill_red !: Sprite;
    private TimeRemainingTextImg !: Sprite;
    private isTweenpause !: Boolean;
    private timeTween!: gsap.core.Tween

    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on(CommonEvents.CHANGE_THEME, this.changeTheme, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
    }

    private changeTheme(isHalloween : boolean) : void{
        if(isHalloween){
           this.TimeRemainingTextImg.texture = Game.the.app.loader.resources['uiPanel_halloween'].textures?.[`TimeRemainingTextImg.png`] as Texture;
        }else{
            this.TimeRemainingTextImg.texture = Game.the.app.loader.resources['uiPanel'].textures?.[`TimeRemainingTextImg.png`] as Texture;
        }
    }

    private destroyAfterGameRemoved() :void{
        this.destroy({ children: true,texture : true, baseTexture : true })
    }

    private setPosition(): void {
        this.loadingBarEmpty.position.set(0, 30);
        this.loadingBarFill.position.set(0, 30);
        this.TimeRemainingTextImg.position.set(0, - 5);
        this.maskContainer.position.set(this.loadingBarFill.x, this.loadingBarFill.y);
    }

    private init(): void {
        let textTure : Texture = Game.the.app.loader.resources['uiPanel'].textures?.[`TimeRemainingTextImg.png`] as Texture; 
        this.TimeRemainingTextImg = new Sprite(textTure);
        textTure = Game.the.app.loader.resources['uiPanel'].textures?.[`emptyBar.png`] as Texture;
        this.loadingBarEmpty = new Sprite(textTure);
        this.loadingFillContainer = new Container();
        textTure = Game.the.app.loader.resources['uiPanel'].textures?.[`filledBar.png`] as Texture;
        this.loadingBarFill = new Sprite(textTure);
        textTure = Game.the.app.loader.resources['uiPanel'].textures?.[`filledBar_red.png`] as Texture;
        this.loadingBarFill_red = new Sprite(textTure);
        this.loadingBarEmpty.scale.set(1, 1);
        this.loadingBarFill.scale.set(1);
        this.loadingBarFill_red.y = this.loadingBarFill_red.height - 7;
        this.loadingBarFill_red.scale.set(1.05);

        this.addChild(this.TimeRemainingTextImg);
        this.addChild(this.loadingBarEmpty);
        this.addChild(this.loadingFillContainer);
        this.loadingFillContainer.addChild(this.loadingBarFill);
        this.loadingFillContainer.addChild(this.loadingBarFill_red);
        this.loadingBarFill_red.visible = false;

        this.maskContainer = new Graphics();
        this.maskContainer.beginFill(0x000000);
        this.maskContainer.drawRect(0, 0, 296, 37);
        this.maskContainer.endFill();
        this.addChild(this.maskContainer);

        this.loadingFillContainer.mask = this.maskContainer;



    }

    resumeTween() :void{
        if(this.isTweenpause && !CommonConfig.the.getPauseForNextLevel()){
            this.timeTween?.resume();
            this.isTweenpause = false;
        }
    }

    loadingAnimation(): void {
        let x_pos = this.maskContainer.x;
        this.loadingBarFill_red.visible = false;
        this.loadingBarFill.visible = true;
        this.isTweenpause = false;
        // this.maskContainer.x = this.maskContainer.x + this.maskContainer.width;
        this.timeTween = gsap.to(this.maskContainer, {
            x: this.maskContainer.x - this.maskContainer.width + 6,
            duration: 32,
            onComplete: () => {
                this.timeTween?.kill();
                this.maskContainer.x = x_pos;
                this.loadingBarFill_red.visible = false;
                this.loadingBarFill.visible = true;
                CommonConfig.the.setGameOver(true);
            },
            onUpdate: () => {
                if (CommonConfig.the.getGameOver()) {
                    this.timeTween?.kill();
                    this.maskContainer.x = x_pos;
                    this.loadingBarFill_red.visible = false;
                    this.loadingBarFill.visible = true;
                }

                if(CommonConfig.the.getPauseForNextLevel()){
                    this.timeTween?.pause();
                    this.isTweenpause = true;
                }
                if (this.timeTween?.progress() > 0.6) {
                    this.loadingBarFill_red.visible = true;
                    this.loadingBarFill.visible = false;
                }
            }
        })

    }
}