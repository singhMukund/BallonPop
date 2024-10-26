import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Game } from "../game";
import gsap from "gsap";
import { CommonConfig } from "../../Common/CommonConfig";
import { CommonEvents } from "@/Common/CommonEvents";

export class LoaderScreen extends Container {

    private loadingFillContainer !: Container;
    private popupBg !: Graphics;

    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
    }

    private destroyAfterGameRemoved(): void {
        this.destroy({ children: true, texture: true, baseTexture: true })
    }

    private setPosition(): void {
        this.loadingFillContainer.position.set((window.innerWidth - this.loadingFillContainer.width) / 2, (window.innerHeight - this.loadingFillContainer.height) * 0.6)
    }

    private init(): void {
        this.popupBg = new Graphics();
        this.popupBg.beginFill(0x000000, 0.35);
        this.popupBg.drawRect(0, 0, 4000, 4000);
        this.popupBg.endFill();
        this.addChild(this.popupBg);
        this.createLoader();
    }

    createLoader() {
        this.loadingFillContainer = new Container();
        const numDots = 8; // Number of dots
        const dotSize = 4; // Size of each dot
        const spacing = 30; // Space between dots
      
        // Create dots in a line
        for (let i = 0; i < numDots; i++) {
          const dot = new Graphics();
          dot.beginFill(0xFFA500, 0.6);
          dot.drawCircle(0, 0, dotSize * ((i+1)/3));
          dot.endFill();
      
          // Position each dot with spacing in between
          dot.x = i * spacing;
          this.loadingFillContainer.addChild(dot);
      
          // Animate each dot’s scale for a wave effect
          gsap.to(dot.scale, {
            x: 1.5,
            y: 1.5,
            duration: 0.5,
            yoyo: true,
            repeat: -1,
            delay: i * 0.1, // Delays each dot for a cascading effect
          });
        }
      
        this.addChild(this.loadingFillContainer);
    }

    hide() :void{
        this.visible = false;
    }
}