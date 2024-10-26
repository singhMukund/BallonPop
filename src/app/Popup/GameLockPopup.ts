import gsap from "gsap";
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class GameLockPopup extends Container {
    private popupBg !: Graphics;
    private textContainer !: Container;
    private lockTextPopup !: Sprite;
    private lockImg !: Sprite;
    private lockbar !: Sprite;
    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroy, this);
        Game.the.app.stage.on("SHOW_GAME_LOCK_POPUP", this.show, this);
    }

    destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean; } | undefined): void {
        super.destroy({ children: true, texture: true, baseTexture: true })
    }

    private setPosition(): void {
        // if (this.textContainer.width > (window.innerWidth * 0.7) || !CommonConfig.the.isDesktop()) {
        //     this.textContainer.scale.set(0.55);
        // }
        this.lockTextPopup.position.set((window.innerWidth - this.lockTextPopup.width)/2, window.innerHeight * 0.3);
        this.lockbar.position.set(this.lockTextPopup.x + (this.lockTextPopup.width - this.lockbar.width)/2, window.innerHeight * 0.8);
        this.lockImg.position.set(this.lockTextPopup.x + (this.lockTextPopup.width - this.lockImg.width)/2, this.lockbar.y - this.lockImg.height);

        // this.textContainer.position.set((window.innerWidth - this.width) / 2, 0);
    }



    private init(): void {
        this.popupBg = new Graphics();
        this.popupBg.beginFill(0x000000, 0.8);
        this.popupBg.drawRect(0, 0, 4000, 4000);
        this.popupBg.endFill();
        this.addChild(this.popupBg);
        this.textContainer = new Container();
        this.addChild(this.textContainer);
        let textTure: Texture = Game.the.app.loader.resources['lockedPopup'].textures?.[`gameLocktext.png`] as Texture;
        this.lockTextPopup = new Sprite(textTure);
        this.textContainer.addChild(this.lockTextPopup);
        this.lockTextPopup.scale.set(0.25);

        textTure = Game.the.app.loader.resources['lockedPopup'].textures?.[`Lock.png`] as Texture;
        this.lockImg = new Sprite(textTure);
        this.textContainer.addChild(this.lockImg);
        this.lockImg.scale.set(0.5);


        textTure = Game.the.app.loader.resources['lockedPopup'].textures?.[`gameLockBar.png`] as Texture;
        this.lockbar = new Sprite(textTure);
        this.textContainer.addChild(this.lockbar);
        this.lockbar.scale.set(0.5);


        this.visible = false;
    }

    private show(): void {
        Game.the.app.stage.emit("STOP_BG_SOUND");
        this.visible = true;
        this.popupBg.alpha = 0;
        Game.the.app.stage.emit("PAUSE_BTN_CLICKED", true);
        this.popupBg.interactive = true;
        gsap.to(this.popupBg, { alpha: 1, duration: 0.45 });
    }

}