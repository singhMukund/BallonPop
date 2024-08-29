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
      // backgroundColor: 0x7F88FD,
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
    this.loader.add('game_bg', './assets/StaticImage/BG_gradient.png');
    this.loader.add('balloon_blue', './assets/StaticImage/balloon_blue.png');
    this.loader.add('balloon_green', './assets/StaticImage/balloon_green.png');
    this.loader.add('balloon_orange', './assets/StaticImage/balloon_orange.png');
    this.loader.add('balloon_pink', './assets/StaticImage/balloon_pink.png');
    this.loader.add('balloon_red', './assets/StaticImage/balloon_red.png');
    this.loader.add('balloon_black', './assets/StaticImage/balloon_black.png');
    this.loader.add('balloon_blackies', './assets/StaticImage/balloon_blackies.png');
    this.loader.add('balloon_mimic', './assets/StaticImage/balloon_mimic.png');
    this.loader.add('balloon_purple', './assets/StaticImage/balloon_purple.png');
    this.loader.add('bg_hexa', './assets/StaticImage/hexa.png');
    this.loader.add('pop_up', './assets/StaticImage/pop_up.png');
    this.loader.add('bg_rectangle', './assets/StaticImage/rectangle_btn.png');

    this.loader.add('BurstAnim_frame_01', './assets/StaticImage/BurstAnimaton/frame_01.png');
    this.loader.add('BurstAnim_frame_02', './assets/StaticImage/BurstAnimaton/frame_02.png');
    this.loader.add('BurstAnim_frame_03', './assets/StaticImage/BurstAnimaton/frame_03.png');
    this.loader.add('BurstAnim_frame_04', './assets/StaticImage/BurstAnimaton/frame_04.png');
    this.loader.add('BurstAnim_frame_05', './assets/StaticImage/BurstAnimaton/frame_05.png');
    this.loader.add('BurstAnim_frame_06', './assets/StaticImage/BurstAnimaton/frame_06.png');
    this.loader.add('BurstAnim_frame_07', './assets/StaticImage/BurstAnimaton/frame_07.png');

    this.loader.add('BurstSound', './assets/audio/ballon_burst.wav');
    this.loader.add('oops_Sound', './assets/audio/oops_.ogg')




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
