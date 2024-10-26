import { Application, Container, Graphics, Loader, Sprite, Texture } from "pixi.js";
import { Game } from "../game";
import { sound } from "@pixi/sound";
import { CommonConfig } from "../../Common/CommonConfig";
import { CommonEvents } from "@/Common/CommonEvents";
// import sound from "pixi-sound";

export class Background extends Container {
    private gameBg !: Sprite;

    constructor() {
        super();
        this.intializeBg();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        Game.the.app.stage.on("STOP_BG_SOUND", this.stopSound, this);
        Game.the.app.stage.on("PLAY_BG_SOUND", this.playBgSound, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
        Game.the.app.stage.on(CommonEvents.CHANGE_THEME, this.changeTheme, this);
    }

    private destroyAfterGameRemoved(): void {
        this.destroy({ children: true, texture: true, baseTexture: true })
    }

    private setPosition(): void {
        let scaleX: number = 0;
        let scaleY: number = 0;
        this.width = 390;
        this.height = 844;
        if (window.innerHeight > window.innerWidth && this) {
            scaleX = window.innerWidth / this.width;
            scaleY = window.innerHeight / this.height;
            this.scale.set(scaleX, scaleY);
        } else {
            scaleX = window.innerWidth / this.width;
            this.scale.set(scaleX);
        }
        this.position.set((window.innerWidth - this.width) / 2, (window.innerHeight - this.height) / 2);
    }

    private intializeBg(): void {
        this.gameBg = new Sprite(Game.the.app.loader.resources['game_bg_halloween'].texture);
        this.gameBg.scale.set(0.5);
        this.addChild(this.gameBg);
        // this.playBgSound();
    }

    private stopSound(): void {
        if (!this) {
            return
        }
        // if (sound.exists('BgSound')) {
        //     sound.stop('BgSound');
        // }
        sound.stop('BgSound_halloween');
        // if(sound.exists('BgSound_halloween')){
        //     sound.stop('BgSound_halloween'); 
        // }
    }

    private changeTheme(isHalloween: boolean): void {
        if (isHalloween) {
            this.gameBg.texture = Game.the.app.loader.resources['game_bg_halloween'].texture;
            this.gameBg.scale.set(0.5);
            // if (sound.exists('BgSound')) {
            //     sound.stop('BgSound');
            // }
            // if (sound.exists('BgSound_halloween')) {
            //     sound.play('BgSound_halloween', {
            //         loop: true
            //     });
            // }
        } else {
            this.gameBg.texture = Game.the.app.loader.resources['game_bg'].texture;
            // if(sound.exists('BgSound_halloween')){
            //     sound.stop('BgSound_halloween'); 
            // }
            // if (sound.exists('BgSound')) {
            //     sound.play('BgSound', {
            //         loop: true
            //     });
            // }
        }
    }

    private playBgSound(): void {
        if (!this || CommonConfig.the.getIsSoundMuted()) {
            return
        }
        if (sound.exists('BgSound_halloween')) {
            sound.play('BgSound_halloween', {
                loop: true
            });
        }
        // if(CommonConfig.the.getIsHalloweenTheme()){
        //     if (sound.exists('BgSound_halloween')) {
        //         sound.play('BgSound_halloween', {
        //             loop: true
        //         });
        //     }
        // }else{
        //     if (sound.exists('BgSound')) {
        //         sound.play('BgSound', {
        //             loop: true
        //         });
        //     }
        // }
    }


}


