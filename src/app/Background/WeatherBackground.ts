import { Container, Sprite } from "pixi.js";
import { Game } from "../game";
import gsap from "gsap";
import { Emitter } from "pixi-particles";

export class WeatherBackground extends Container{
    private clouds !: Sprite;
    private clouds2 !: Sprite;
    private clouds3 !: Sprite;
    private tween : gsap.core.Tween | null = null;
    private newFinalX : number=0;
    

    constructor() {
        super();
        this.init();
        this.x = window.innerWidth + 300;
        this.alpha = 0.6;
        this.visible = false;
    }

    private init() :void{
        this.clouds = new Sprite(Game.the.app.loader.resources['clouds'].texture);
        this.clouds2 = new Sprite(Game.the.app.loader.resources['clouds'].texture);
        this.clouds3 = new Sprite(Game.the.app.loader.resources['clouds'].texture);
        this.clouds2.position.set(this.clouds.width/2,this.clouds.height/2);
        this.clouds3.position.set(this.clouds2.x + this.clouds2.width,this.clouds2.y-this.clouds2.height/2);
        this.addChild(this.clouds3);
        this.addChild(this.clouds2);
        this.addChild(this.clouds);
    }

    show(type : string) :void{
     //left // right // nowind
      if(type === 'nowind'){
        this.tween && (this.tween.kill());
        this.visible = false;
        return;
      }else if(type === 'left'){
        this.visible = true;
        this.tween && (this.tween.kill());
        this.x = window.innerWidth + 300;
        this.newFinalX = -(this.width + 200);
        this.wheatherTween();
      }else if(type === 'right'){
        this.visible = true;
        this.tween && (this.tween.kill());
        this.x = -(this.width + 200);
        this.newFinalX = window.innerWidth + this.width + 200;
        this.wheatherTween();
      }
    }

    private wheatherTween() : void{
        this.tween = gsap.to(this,{
            duration : 50,
            x : this.newFinalX,
            repeat: -1
        })
    }
}