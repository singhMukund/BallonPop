// Game.ts
import { Application, Container, Filter, Graphics, Loader, Sprite, Text, TextStyle, Texture, Ticker, autoDetectRenderer, filters } from 'pixi.js';
import { CommonConfig } from '../Common/CommonConfig';
import { Balloon } from './GameMech/Balloon';
import { BalloonManager } from './GameMech/BalloonManager';
import { LoadingContainer } from './LoadingIntro/Loading';


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
  }

  private loadImages() {
    this.loader.add('balloon', './assets/StaticImage/balloon.png');

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
    this.loadingContainer.visible =false;
    this.balloonManager = new BalloonManager(1000);
  }


}
