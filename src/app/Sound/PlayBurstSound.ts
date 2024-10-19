import { sound, Sound } from "@pixi/sound";
import { Game } from "../game";
import { Container } from "pixi.js";

export class PlayBurstSound extends Container{
    constructor() {
        super();
        Game.the.app.stage.on("PLAY_BURST_SOUND", this.playSound, this);
    }

    private playSound(){
        if(sound.exists('ballon_burst_sound')){
            sound.play('ballon_burst_sound',{loop: false});
        }
    }
}