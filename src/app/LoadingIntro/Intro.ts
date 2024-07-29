import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { Game } from "../game";
import gsap from "gsap";

export class IntroContainer extends Container {

    private page1 !: Container;
    private page2 !: Container;
    private page3 !: Container;

    private description!: Text;
    private startButton!: Text;

    private page1FilledButton !: Graphics;
    private page2FilledButton !: Graphics;
    private page3FilledButton !: Graphics;
    private page1UnFilledButton !: Graphics;
    private page2UnFilledButton !: Graphics;
    private page3UnFilledButton !: Graphics;

    private pages: Container[] = [];
    private currentIndex: number = 0;


    constructor() {
        super();
        this.init();
    }

    private init() :void{
       

        this.page1UnFilledButton = new Graphics();
        this.page1UnFilledButton.lineStyle(1, 0xffffff);
        this.page1UnFilledButton.drawCircle(0, 0, 12);
        this.addChild(this.page1UnFilledButton);
        this.page1UnFilledButton.position.set(840,600);

        this.page2UnFilledButton = new Graphics();
        this.page2UnFilledButton.lineStyle(1, 0xffffff);
        this.page2UnFilledButton.drawCircle(0, 0, 12);
        this.addChild(this.page2UnFilledButton);
        this.page2UnFilledButton.position.set(970,600);

       
        this.page3UnFilledButton = new Graphics();
        this.page3UnFilledButton.lineStyle(1, 0xffffff);
        this.page3UnFilledButton.drawCircle(0, 0, 12);
        this.addChild(this.page3UnFilledButton);
        this.page3UnFilledButton.position.set(1090,600);

        this.initPage1();
        this.initPage2();
        this.initPage3();

        this.page1FilledButton = new Graphics();
        this.page1FilledButton.beginFill(0xffffff);
        this.page1FilledButton.drawCircle(0, 0, 12);
        this.page1FilledButton.endFill();
        this.page1FilledButton.position.set(840,600);

        this.page1.addChild(this.page1FilledButton);

        this.page2FilledButton = new Graphics();
        this.page2FilledButton.beginFill(0xffffff);
        this.page2FilledButton.drawCircle(0, 0, 12);
        this.page2FilledButton.endFill();
        this.page2FilledButton.position.set(970,600);

        this.page2.addChild(this.page2FilledButton);

        this.page3FilledButton = new Graphics();
        this.page3FilledButton.beginFill(0xffffff);
        this.page3FilledButton.drawCircle(0, 0, 12);
        this.page3FilledButton.endFill();
        this.page3FilledButton.position.set(1090,600);

        this.page3.addChild(this.page3FilledButton);
        this.pages[this.currentIndex].alpha = 1;

        // Start the page update loop
        setInterval(() => this.updatePages(), 6000);

        const buttonStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center'
        });

        this.startButton = new Text('Start Game', buttonStyle);
        this.startButton.anchor.set(0.5);
        this.startButton.position.set(Game.the.app.renderer.width / 2, 770 );
        this.startButton.interactive = true;
        this.startButton.buttonMode = true;

        this.startButton.on('pointerdown', this.startButtonClicked.bind(this));

        this.addChild(this.startButton);
    }

   

    private initPage1(): void {
        this.page1 = new Container();

        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 600
        });

        const descriptionText = `
Welcome to Balloon Pop!

In this exciting game, balloons will float up from the bottom of the screen. Your goal is to pop as many balloons as you can by clicking on them. Each balloon you pop will earn you points. But be careful! If you miss 15 balloons in a row, the game will end.

Are you ready to test your reflexes and have some fun? Click the "Start Game" button to begin!
        `;

        const description : Text = new Text(descriptionText, style);
        description.anchor.set(0.5);
        description.position.set(Game.the.app.renderer.width / 2, Game.the.app.renderer.height / 2 - 50);

        this.page1.addChild(description);

        this.addChild(this.page1);
        this.pages.push(this.page1);

        this.page1.alpha = 0;
      
    }

    private updatePages() {
        gsap.to(this.pages[this.currentIndex], { alpha: 0, duration: 1 });
        this.currentIndex = (this.currentIndex + 1) % this.pages.length;
        gsap.to(this.pages[this.currentIndex], { alpha: 1, duration: 1 });
    }

    private initPage2(): void {
        this.page2 = new Container();

        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 1200
        });

        const descriptionText = `
Here are the rules:
1. If you miss a total of 15 balloons in any level, the game will be over.
2. You need to score 200 points times the level count in total score to pass each level. For example, 200 points for level 1, 400 points for level 2, 600 points for level 3, and so on.
3. The speed of the balloons will increase with every level.

Are you ready to test your reflexes and have some fun? Click the "Start Game" button to begin!
        `;

        const description : Text = new Text(descriptionText, style);
        description.anchor.set(0.5);
        description.position.set(Game.the.app.renderer.width / 2, Game.the.app.renderer.height / 2 - 50);

        this.page2.addChild(description);

       
        this.addChild(this.page2);
        this.pages.push(this.page2);
        this.page2.alpha = 0;
    }

    private initPage3(): void {
        this.page3 = new Container();

        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 1200
        });

        const descriptionText = `
Future Aspects of the Game:
1. Task-oriented gameplay where tasks will pop up every 5 seconds, and players will need to click on the suitable balloons to complete the tasks.
2. More game modes will be added for increased excitement and variety for players.
3. Introduction of power-ups and special balloons that provide bonus points or special abilities.
4. Multiplayer mode where players can compete against each other in real-time.
5. Customizable balloons and backgrounds to enhance the visual experience.
        `;

        const description : Text = new Text(descriptionText, style);
        description.anchor.set(0.5);
        description.position.set(Game.the.app.renderer.width / 2, Game.the.app.renderer.height / 2 - 50);

        this.page3.addChild(description);

        this.addChild(this.page3);
        this.page3.alpha = 0;
        this.pages.push(this.page3);
    }

    private startButtonClicked() :void{
       this.visible = false;
       Game.the.app.stage.emit("START_BUTTON_CLICKED");
    }
}