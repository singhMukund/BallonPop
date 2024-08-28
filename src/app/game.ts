// Game.ts
import { Application, Container, Filter, Graphics, Loader, Sprite, Text, TextStyle, Texture, Ticker, autoDetectRenderer, filters } from 'pixi.js';
import { CommonConfig } from '../Common/CommonConfig';
import { Balloon } from './GameMech/Balloon';
import { BalloonManager } from './GameMech/BalloonManager';
import { LoadingContainer } from './LoadingIntro/Loading';
import { Background } from './Background/Background';


export class Game {
  protected static _the: Game;
  public app: Application;
  private loader!: Loader;
  private gameContainer!: Container;
  private balloonManager !: BalloonManager
  private loadingContainer !: LoadingContainer;


  static get the(): Game {
    if (!Game._the) {
      Game._the = new Game();
    }

    return Game._the;
  }

  constructor() {
    if (Game._the == null) Game._the = this;
    this.app = new Application({
      backgroundColor: 0x7F88FD,
      width: window.innerWidth,
      height: window.innerHeight,
      // resolution : 0.985,
      resizeTo : window ,
      autoDensity: true,
    });
    const pixiContainer = document.getElementById('pixi-container');
    if (pixiContainer) {
      pixiContainer.appendChild(this.app.view);
    }
    this.init();
  }

  init(): void {
   
    this.gameContainer = new Container();
    this.app.stage.addChild(this.gameContainer);
    this.loader = this.app.loader;
    this.loadAssetsAndInitialize();
    this.resize();
    window.onresize = this.resize.bind(this);
  }

  private loadImages() {
    this.loader.add('balloon_blue', './assets/StaticImage/balloon_blue.png');
    this.loader.add('balloon_green', './assets/StaticImage/balloon_green.png');
    this.loader.add('balloon_orange', './assets/StaticImage/balloon_orange.png');
    this.loader.add('balloon_pink', './assets/StaticImage/balloon_pink.png');
    this.loader.add('balloon_red', './assets/StaticImage/balloon_red.png');
    this.loader.add('balloon_yellow', './assets/StaticImage/balloon_yellow.png');


    // @ts-ignore
    const loadAssets = () => {
      return new Promise<void>((resolve, reject) => {
        this.loader.load(() => {
          resolve();
        });
        // @ts-ignore
        this.loader.onError.add((error) => {
          console.error("Error loading assets:", error);
          reject(error);
        });
      });
    };


    loadAssets()
      .then(() => {
        this.onLoadComplete();
      })
      .catch((error) => {
      });
  }



  private loadAssetsAndInitialize() {
    this.loadImages();
  }


  private onLoadComplete() {
    new CommonConfig();
    this.loadingContainer = new LoadingContainer();
    this.app.stage.addChild(this.loadingContainer);
    this.loadingContainer.startLoading();
    this.app.stage.on("START_BUTTON_CLICKED", this.onStartButtonClicked, this);
    // 
  }

  private onStartButtonClicked() :void{
    this.gameContainer.addChild(new Background());
    this.loadingContainer.visible =false;
    this.balloonManager = new BalloonManager(900);
  }

  resize() {
    // var size = [1920, 1080];
    // var ratio = (size[0] / size[1])* 0.985;
    // if (window.innerWidth / window.innerHeight >= ratio) {
    //   var w = window.innerHeight * ratio;
    //   var h = window.innerHeight;
    // } else {
    //   var w = window.innerWidth;
    //   var h = window.innerWidth / ratio;
    // }
    // this.app.stage.scale.set(w/size[0],h/size[1]);
    this.app.stage.emit("RESIZE_THE_APP");
  }


}
