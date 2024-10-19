import { Container } from "pixi.js";
import { Game } from "../game";

export class ParticleEmitterContainer extends Container{
    // private emitter !: Emitter;
    private elapsed: number = 0;
    currentWeather : string = "";

    constructor(){
        super();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        this.setupEmitter();
        this.visible = false;
    }

    private setPosition() :void{
    //    this.scale.set(1.5,2);
    //    this.position.set((window.innerWidth-this.width)/2,(window.innerHeight))
    }


    private setupEmitter(): void {
        // const emitterConfig = {
        //     "alpha": {
        //         "start": 0.01,
        //         "end": 0.03
        //     },
        //     "scale": {
        //         "start": 0.17,
        //         "end": 1,
        //         "minimumScaleMultiplier": 1
        //     },
        //     "color": {
        //         "start": "#ffffff",
        //         "end": "#ffffff"
        //     },
        //     "speed": {
        //         "start": 300,
        //         "end": 700,
        //         "minimumSpeedMultiplier": 1
        //     },
        //     "acceleration": {
        //         "x": 0,
        //         "y": 0
        //     },
        //     "maxSpeed": 0,
        //     "startRotation": {
        //         "min": 250,
        //         "max": 290
        //     },
        //     "noRotation": false,
        //     "rotationSpeed": {
        //         "min": 0,
        //         "max": 0
        //     },
        //     "lifetime": {
        //         "min": 0.5,
        //         "max": 1
        //     },
        //     "blendMode": "normal",
        //     "frequency": 0.001,
        //     "emitterLifetime": -1,
        //     "maxParticles": 500,
        //     "pos": {
        //         "x": 0,
        //         "y": 0,
        //     },
        //     "addAtBack": true,
        //     "spawnType": "point"
        // };

        // this.emitter = new Emitter(
        //     this,
        //     [Game.the.app.loader.resources['smokeparticle'].texture],
        //     emitterConfig
        // );

        // this.emitter.updateOwnerPos(Game.the.app.screen.width / 2, Game.the.app.screen.height / 2);
    }

    show() :void{
        if(this.currentWeather === 'tornado'){
            this.visible = true;
        }else{
            this.visible = false;
        }
    }

    update(delta: number) {
        // if(this.currentWeather !== "tornado"){
        //     this.visible = false;
        //    return;
        // }
        // const now = Date.now();
        // if (!this.emitter) {
        //     return
        // }
        // if (this.elapsed === 0) {
        //     this.elapsed = now;
        // }
        // const elapsedTime = (now - this.elapsed) * 0.009;
        // this.emitter.update(elapsedTime);
        // this.elapsed = now;
    }

}