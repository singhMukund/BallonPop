import gsap from "gsap";
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class ChainReactionBalloonPopup extends Container {
    private totalScore !: Text;
    private popupContainer !: Container;
    private textContanerBg !: Sprite;
    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroy, this);
        Game.the.app.stage.on("show_chainreaction_popup", this.show, this);
    }

    destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean; } | undefined): void {
        super.destroy({ children: true,texture : true, baseTexture : true })
    }

    private setPosition(): void {
        if (this.popupContainer.width > (window.innerWidth * 0.7) || !CommonConfig.the.isDesktop()) {
            this.popupContainer.scale.set(0.55);
        }
        this.popupContainer.position.set((window.innerWidth - this.popupContainer.width) / 2, -100);
    }

    private init(): void {

        this.popupContainer = new Container();
        this.addChild(this.popupContainer);

        let textTure : Texture = Game.the.app.loader.resources['popUp'].textures?.[`ChainReactionBalloon.png`] as Texture; 
        this.textContanerBg = new Sprite(textTure);
        this.popupContainer.addChild(this.textContanerBg);
        this.textContanerBg.scale.set(1);

        const firstTextStyle = new TextStyle({
            fontFamily: 'Helvetica',
            fontSize: 24,
            fill: 'black',
            align: 'center',
            fontWeight :'normal'
        });
        this.totalScore = new Text(`You’ve popped 3 blue balloons,\nkeep popping blue balloons to gain extra TXEs`, firstTextStyle);
        this.totalScore.position.set((this.textContanerBg.width - this.totalScore.width)/2 -5,26)
        this.popupContainer.addChild(this.totalScore);

        this.alpha = 1;
        this.visible = true;
    }

    private show(texture:string,count:number): void {
        this.visible = true;
        texture = texture.replace('balloon_', '');
        this.totalScore.text = `You’ve popped ${count} ${texture} balloons,\nkeep popping ${texture} balloons to gain extra TXEs`;
        this.totalScore.position.set((this.textContanerBg.width - this.totalScore.width)/2 -5,26);
        this.alpha = 1;
        gsap.to(this.popupContainer, { y: 60, duration: 0.5 ,onComplete :()=>{
            this.hide()
        }});
    }

    private hide(): void {
        this.alpha = 1;
        gsap.to(this.popupContainer, {
            y: -100, duration: 0.5, delay : 2, onComplete: () => {
                this.visible = false;
            }
        });
    }
}