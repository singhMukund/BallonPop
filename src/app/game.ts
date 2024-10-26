// Game.ts
import { Application, Container, Filter, Graphics, Loader, Sprite, Text, TextStyle, Texture, Ticker, autoDetectRenderer, filters, utils } from 'pixi.js';
import { CommonConfig } from '../Common/CommonConfig';
import { BalloonManager } from './GameMech/BalloonManager';
import { Background } from './Background/Background';
import { sound } from '@pixi/sound';
import { PlayBurstSound } from './Sound/PlayBurstSound';
import { CommonEvents } from '@/Common/CommonEvents';
import { LoaderScreen } from './LoadingIntro/Loading';
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
  private loaderScreen !: LoaderScreen;
  private isStage: string = "test";//prod
  // private stageUrl : string = ''


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
    const font1 = new FontFace('Creepster_Regular', 'url(./Font/Creepster_Regular.ttf)');
    const font2 = new FontFace('BLOMBERG', 'url(./Font/BLOMBERG.otf)');
    const font3 = new FontFace('helvetica_rounded_bold', 'url(./Font/helvetica_rounded_bold.otf)');

    Promise.all([font1.load(), font2.load(), font3.load()]).then((loadedFonts) => {
      // @ts-ignore: Suppress TypeScript error for add method
      loadedFonts.forEach(font => document.fonts.add(font));
      this.loadPreloadAssets();
      window.addEventListener('beforeunload', (event) => {

      });
    })

  }

  private loadPreloadAssets(): void {
    this.loader.add('game_bg_halloween', './StaticImage/bg_Img_halloween.png');


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

    loadAssets().then(() => {
      new CommonEvents();
      new CommonConfig();
      this.background = new Background();
      this.gameContainer.addChild(this.background);
      this.loaderScreen = new LoaderScreen();
      this.gameContainer.addChild(this.loaderScreen);
      this.resize();
      window.onresize = this.resize.bind(this);
      this.loadAssetsAndInitialize();
    })

  }

  private async loadImages() {
    this.loader.add('game_bg', './StaticImage/bg_Img.png');
    this.loader.add('game_bg_dark', './StaticImage/DarkBg.png');
    this.loader.add('balloons', './StaticImage/balloons.json');
    this.loader.add('bigBalloon', './StaticImage/bigBalloon.json');
    this.loader.add('bottomPanelBg', './StaticImage/Bottom_Card_bg.png');
    this.loader.add('bottomPanelBgDark', './StaticImage/bottomBgDark.png');
    this.loader.add('popUp', './StaticImage/popUp.json');
    this.loader.add('MultiColorBlast', './StaticImage/MultiColorBlast.json');
    this.loader.add('GiftPopup', './StaticImage/GiftPopup.json');
    this.loader.add('raindrop', './StaticImage/raindrop.png');
    this.loader.add('uiPanel', './StaticImage/uiPanel.json');
    this.loader.add('lockedPopup', './StaticImage/lockedPopup.json');

    //
    // this.loader.add('game_bg_halloween', './StaticImage/bg_Img_halloween.png');
    this.loader.add('bottomPanelBg_halloween', './StaticImage/Bottom_Card_bg_halloween.png');
    this.loader.add('balloons_halloween', './StaticImage/halloween_balloon.json');
    this.loader.add('uiPanel_halloween', './StaticImage/uiPanel_halloween.json');
    this.loader.add('Halloween_burst', './StaticImage/Halloween_burst.json');
    this.loader.add('popUp_halloween', './StaticImage/popUp_halloween.json');



    if (this.isIOS()) {
      sound.add('ballon_burst_sound', './audio/ballon_burst.m4a');
      sound.add('BgSound', './audio/bg_sound.m4a');
      sound.add('BgSound_halloween', './audio/bg_halloween_sound.m4a');
    } else {
      sound.add('BgSound', './audio/bg_sound.ogg');
      sound.add('ballon_burst_sound', './audio/ballon_burst.ogg');
      sound.add('BgSound_halloween', './audio/bg_halloween_sound.ogg');
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
          if (result.result.gameScores.length) {
            let highestLevel: number = Math.max(...result.result.gameScores.map((score: { level: any }) => Number(score.level)));
            CommonConfig.the.setLevelsNo(highestLevel + 1);
          } else {
            CommonConfig.the.setLevelsNo(1);
          }
          if (CommonConfig.the.getLevelsNo() > 1 && !CommonConfig.the.getbrokenCase()) {
            CommonConfig.the.setbrokenCase(true);
          } else {
            CommonConfig.the.setbrokenCase(false);
          }
          if (result.result.countOfGift) {
            CommonConfig.the.setTotalGiftCount(result.result.countOfGift);
          } else {
            CommonConfig.the.setTotalGiftCount(0);
          }
          if (result.result.dailyMissedChances) {
            CommonConfig.the.setTotalMissedChance(result.result.dailyMissedChances);
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
            // CommonConfig.the.setTotalMissedChance(46);
            // CommonConfig.the.setbrokenCase(true);
            // CommonConfig.the.setLevelsNo(11);
            // CommonConfig.the.setTotalGiftCount(2);
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
    this.loaderScreen.hide();
    this.gameContainer.addChild(new PlayBurstSound());
    Game.the.app.stage.emit("PLAY_BG_SOUND");
    // this.loadingContainer = new LoadingContainer();
    // this.app.stage.addChild(this.loadingContainer);
    // this.loadingContainer.startLoading();
    // this.gameContainer.addChild(new LoadingScreenTest());
    // this.app.stage.on("START_BUTTON_CLICKED", this.onStartButtonClicked, this)
    this.app.stage.on("UPDATE_SCORE", this.updateScore, this);
    this.app.stage.on("UPDATE_GIFT_POINTS_API", this.updateGiftPoint, this);
    this.app.stage.on(CommonEvents.SENT_MISSED_CHANCE_REQUEST, this.updateMissedChance, this);

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

  private updateMissedChance(): void {
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
        "giftCount": "0",
        "missedChances": 1,
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
        if (result.dailyMissedChances) {
          CommonConfig.the.setTotalMissedChance(result.dailyMissedChances);
          if (CommonConfig.the.getTotalMissedChance() >= 45) {
            this.app.stage.emit("END_GAME_AFTER_MAX_MISS");
          }
        }
      }
    };

    fetchData();
  }

  resize() {
    this.app.stage.emit("RESIZE_THE_APP");
  }


}
