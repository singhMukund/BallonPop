// Game.ts
import { Application, Container, Filter, Graphics, Loader, Sprite, Text, TextStyle, Texture, Ticker, autoDetectRenderer, filters, utils } from 'pixi.js';
import { CommonConfig } from '../Common/CommonConfig';
import { BalloonManager } from './GameMech/BalloonManager';
import { Background } from './Background/Background';
import { sound } from '@pixi/sound';
import { PlayBurstSound } from './Sound/PlayBurstSound';
import { CommonEvents } from '@/Common/CommonEvents';
// import { TelegramLoginParsing } from './TelegramLogin/TelegramLoginParsing';
// import { TelegramLogInBtn } from './TelegramLogin/TelegramLogInBtn';


export class Game {
  protected static _the: Game;
  public app: Application;
  private loader!: Loader;
  private gameContainer!: Container;
  private balloonManager !: BalloonManager
  background !: Background;
  private count: number = 0;
  private isLocaltesting: boolean = true;


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
      resolution: 1,
      resizeTo: window,
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
    window.addEventListener('beforeunload', (event) => {
      // console.log('User is about to leave the page.');
      // this.app.stage.emit("REMOVE_TICKER");
      // window.removeEventListener('resize', this.resize);
      // // Clean up resources or show a confirmation dialog
      // // this.app.stage.emit("DESTROY_TEXTURE");
      // // this.app.destroy();
      // utils.clearTextureCache();
      // 



      // clearInterval(myInterval);
      // clearTimeout(myTimeout);

      // Optionally display a confirmation dialog
      // event.returnValue = 'Are you sure you want to leave?';
    });
  }

  private async loadImages() {
    if (utils.TextureCache['game_bg']) {
      const cachedTexture = PIXI.utils.TextureCache['game_bg'];
      cachedTexture.destroy(true);
      this.loader.add('game_bg', './StaticImage/bg_Img.png');
    } else {
      this.loader.add('game_bg', './StaticImage/bg_Img.png');
    }
    if (utils.TextureCache['balloons']) {
      const cachedTexture = PIXI.utils.TextureCache['balloons'];
      cachedTexture.destroy(true);
      this.loader.add('balloons', './StaticImage/balloons.json');
    } else {
      this.loader.add('balloons', './StaticImage/balloons.json');
    }
    if (utils.TextureCache['uiPanel']) {
      const cachedTexture = PIXI.utils.TextureCache['uiPanel'];
      cachedTexture.destroy(true);
      this.loader.add('uiPanel', './StaticImage/uiPanel.json');
    } else {
      this.loader.add('uiPanel', './StaticImage/uiPanel.json');
    }
    if (utils.TextureCache['bottomPanelBg']) {
      const cachedTexture = PIXI.utils.TextureCache['bottomPanelBg'];
      cachedTexture.destroy(true);
      this.loader.add('bottomPanelBg', './StaticImage/Bottom_Card_bg.png');
    } {
      this.loader.add('bottomPanelBg', './StaticImage/Bottom_Card_bg.png');
    }
    if (utils.TextureCache['popUp']) {
      const cachedTexture = PIXI.utils.TextureCache['popUp'];
      cachedTexture.destroy(true);
      this.loader.add('popUp', './StaticImage/popUp.json');
    } else {
      this.loader.add('popUp', './StaticImage/popUp.json');
    }
    if (utils.TextureCache['MultiColorBlast']) {
      const cachedTexture = PIXI.utils.TextureCache['MultiColorBlast'];
      cachedTexture.destroy(true);
      this.loader.add('MultiColorBlast', './StaticImage/MultiColorBlast.json');
    } else {
      this.loader.add('MultiColorBlast', './StaticImage/MultiColorBlast.json');
    }
    if (utils.TextureCache['GiftPopup']) {
      const cachedTexture = PIXI.utils.TextureCache['GiftPopup'];
      cachedTexture.destroy(true);
      this.loader.add('GiftPopup', './StaticImage/GiftPopup.json');
    } else {
      this.loader.add('GiftPopup', './StaticImage/GiftPopup.json');
    }
    if (this.isIOS()) {
      sound.add('ballon_burst_sound', './audio/ballon_burst.m4a');
      sound.add('BgSound', './audio/bg_sound.m4a');
    } else {
      sound.add('BgSound', './audio/bg_sound.ogg');
      sound.add('ballon_burst_sound', './audio/ballon_burst.ogg');
    }

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


    const autoLogInUser = async () => {
      const authToken = this.getAuthToken(window.location.search);
      const baseURL = 'https://bot.trikon.io/v1';
      const stageURL = 'https://devbot.trikon.io/v1';
      CommonConfig.the.setTaken(authToken);

      const login = async () => {
        try {
          const response = await fetch(
            `${stageURL}/user/me`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CommonConfig.the.getTaken()}`
              },
            }
          );

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Unauthorized");
            }
          }

          const result = await response.json();
          return result;
        } catch (error) {
          console.error("Error fetching data:", error);
          throw error;
        }
      };

      try {
        const result = await login();
        if (result) {
          CommonConfig.the.setGameId(result.result.id);
          CommonConfig.the.setUserId(result.result.userId);
          CommonConfig.the.setTotalScore(result.result.point);
          let highestLevel: number = Math.max(...result.result.gameScores.map((score: { level: any }) => Number(score.level)));
          if (result.result.gameScores.length) {
            CommonConfig.the.setLevelsNo(highestLevel);
          } else {
            CommonConfig.the.setLevelsNo(1);
          }
          if (CommonConfig.the.getLevelsNo() > 1 && !CommonConfig.the.getbrokenCase()) {
            CommonConfig.the.setbrokenCase(true);
          } else {
            CommonConfig.the.setbrokenCase(false);
          }
          if(result.result.countOfGift){
             CommonConfig.the.setTotalGiftCount(result.result.countOfGift);
          }else{
            CommonConfig.the.setTotalGiftCount(0);
          }
          CommonConfig.the.setMissedBalloons(15, true);
          // if (localStorage.getItem('missed_balloon_count') !== '0') {
          //   CommonConfig.the.setMissedBalloons(Number(localStorage.getItem('missed_balloon_count')), true);
          // }else{
          //   CommonConfig.the.setMissedBalloons(15, true);
          // }
        }
      } catch (error) {
        console.error("Error logging in:", error);
        throw error;
      }
    };

    try {
      if (this.isLocaltesting) {
        Promise.all([loadAssets()])
          .then(() => {
            // CommonConfig.the.setbrokenCase(true);
            // CommonConfig.the.setLevelsNo(7);
            this.onLoadComplete();
          })
          .catch((error) => {
            console.error("Error during asset loading or login:", error);
          });
      } else {
        Promise.all([loadAssets(), autoLogInUser()])
          .then(() => {
            this.onLoadComplete();
          })
          .catch((error) => {
            console.error("Error during asset loading or login:", error);
          });
      }


    } catch (error) {
      console.error("Error during asset loading or login:", error);
    }
    // loadAssets()
    //   .then(() => {
    //     if (this.isLocaltesting) {
    //       this.onLoadComplete();
    //     } else {
    //       this.autoLogInUser();
    //     }
    //   })
    //   .catch((error) => {
    //   });
  }

  isIOS(): boolean {
    const audio = document.createElement('audio');
    return audio.canPlayType('audio/ogg; codecs="vorbis"') === '';
    return false
  }



  private loadAssetsAndInitialize() {
    this.loadImages();
    new CommonEvents();
    new CommonConfig();
  }

  private getAuthToken(search: string): string {
    let token: string = "";
    token = search.split('&')[0].split('?token=')[1];
    return token
  }

  private onLoadComplete() {
    if (this.count > 0) {
      return
    }
    this.count++;
    this.background = new Background();
    this.gameContainer.addChild(this.background);
    this.gameContainer.addChild(new PlayBurstSound());

    // this.loadingContainer = new LoadingContainer();
    // this.app.stage.addChild(this.loadingContainer);
    // this.loadingContainer.startLoading();
    // this.gameContainer.addChild(new LoadingScreenTest());
    // this.app.stage.on("START_BUTTON_CLICKED", this.onStartButtonClicked, this)
    this.app.stage.on("UPDATE_SCORE", this.updateScore, this);
    this.app.stage.on("UPDATE_GIFT_POINTS_API", this.updateGiftPoint, this);
    this.onStartButtonClicked();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        CommonConfig.the.setPauseForNextLevel(true);
        Game.the.app.stage.emit("STOP_BG_SOUND");
        return;
      } else {
        if (CommonConfig.the.getPauseForNextLevel() && !CommonConfig.the.getGamePaused() && !CommonConfig.the.getIsLevelPopupOpen()) {
          CommonConfig.the.setPauseForNextLevel(false);
          Game.the.app.stage.emit("PLAY_BG_SOUND");
          return;
        }
      }
    });

    // 
  }

  private onStartButtonClicked(): void {
    this.balloonManager = new BalloonManager(900);
    // const TELEGRAM_BOT_TOKEN = '7132134647:AAHj27DA9kHD_2cFANCo-dumSCA-nGm-E3M';
    // const telegramLogin = new TelegramLoginParsing(TELEGRAM_BOT_TOKEN);
    // const loginButton = new TelegramLogInBtn(telegramLogin);
    // loginButton.position.set(300,400);
    // this.gameContainer.addChild(loginButton);
    // console.log(window.onTelegramAuth);
  }

  private updateScore(): void {
    if (this.isLocaltesting) {
      CommonConfig.the.setCurrentScore(0);
      Game.the.app.stage.emit("HIDE_LEVEL_POP_UP");
      return;
    }
    const baseUrl = 'https://bot.trikon.io/v1';
    const stageURL = 'https://devbot.trikon.io/v1';
    const url = '/user/updateGameHighScore'



    const login = async () => {

      // https://t.me/gt_city_bot/shortName?startapp=ravindra
      // startapp can be read as telegram.initDataUnsafe.start_param;

      const data = {
        userId: CommonConfig.the.getUserId(), // 1877938256,
        gameScoreObject: {
          gameId: CommonConfig.the.getGameId(),
          level: CommonConfig.the.getLevelsNo(),
          highScore: CommonConfig.the.getCurrentScore(),
        }
      };

      try {
        const response = await fetch(
          `${stageURL}${url}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${CommonConfig.the.getTaken()}`
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // logOut();
            throw new Error("Unauthorized");
          }
        }

        const result = await response.json();

        return result;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchData = async () => {
      const result = await login();
      console.log(result);
      if (result) {
        CommonConfig.the.setCurrentScore(0);
        Game.the.app.stage.emit("HIDE_LEVEL_POP_UP");
        // CommonConfig.the.setGameId(result.user.id);
        // CommonConfig.the.setUserId(result.user.userId);
        // CommonConfig.the.setTaken(result.tokens);
      }
    };

    fetchData();
  }

  private updateGiftPoint(): void {
    if (this.isLocaltesting) {
      // CommonConfig.the.setCurrentScore(0);
      // Game.the.app.stage.emit("HIDE_LEVEL_POP_UP");
      return;
    }
    const baseUrl = 'https://bot.trikon.io/v1';
    const stageURL = 'https://devbot.trikon.io/v1';
    const url = '/user/updateGiftCount'



    const updateGift = async () => {
      const data = {
        "giftCount": 1
      };

      try {
        const response = await fetch(
          `${stageURL}${url}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${CommonConfig.the.getTaken()}`
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // logOut();
            throw new Error("Unauthorized");
          }
        }

        const result = await response.json();

        return result;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchData = async () => {
      const result = await updateGift();
      console.log(result);
      if (result) {
       
      }
    };

    fetchData();
  }

  resize() {
    this.app.stage.emit("RESIZE_THE_APP");
  }


}
