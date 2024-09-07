import { Container, Graphics, Sprite, Text, TextStyle, utils } from "pixi.js";
import { Game } from "../game";
import gsap from "gsap";
import MobileDetect from "mobile-detect";

export class IntroContainer extends Container {
    private intro_Ballons_img !: Sprite;
    private page1 !: Container;
    private page2 !: Container;
    private page3 !: Container;

    private description!: Text;
    private startButton!: Text;

    private page1FilledButton !: Graphics;
    private page2FilledButton !: Graphics;
    private page1UnFilledButton !: Graphics;
    private page2UnFilledButton !: Graphics;

    private pages: Container[] = [];
    private currentIndex: number = 0;
    private indicatorBtn !: Container;
    private text1!: Container;
    private text2!: Container;
    private gameName !: Text;
    private play_btn !: Sprite;

    private topContainer !: Container;



    constructor() {
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
    }

    private init(): void {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 'white',
            align: 'center'
        });
        this.topContainer = new Container();
        this.addChild(this.topContainer);
        this.intro_Ballons_img = new Sprite(Game.the.app.loader.resources['Ballons_img'].texture);
        this.topContainer.addChild(this.intro_Ballons_img);
        this.gameName = new Text("Balloon Pop", style);
        this.topContainer.addChild(this.gameName);
        const style_Heading = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'center'
        });

        this.indicatorBtn = new Container();
        this.addChild(this.indicatorBtn);
        this.page1UnFilledButton = new Graphics();
        this.page1UnFilledButton.lineStyle(1, 0xffffff);
        this.page1UnFilledButton.drawCircle(0, 0, 12);
        this.indicatorBtn.addChild(this.page1UnFilledButton);
        this.page1UnFilledButton.position.set(-24, 0);

        this.page2UnFilledButton = new Graphics();
        this.page2UnFilledButton.lineStyle(1, 0xffffff);
        this.page2UnFilledButton.drawCircle(0, 0, 12);
        this.indicatorBtn.addChild(this.page2UnFilledButton);
        this.page2UnFilledButton.position.set(24, 0);
        // this.indicatorBtn.pivot.set(0.5,0.5);
        this.initPage1();
        this.initPage2();

        this.page1FilledButton = new Graphics();
        this.page1FilledButton.beginFill(0xffffff);
        this.page1FilledButton.drawCircle(0, 0, 12);
        this.page1FilledButton.endFill();
        this.page1FilledButton.position.set(-24, 0);

        this.page1.addChild(this.page1FilledButton);

        this.page2FilledButton = new Graphics();
        this.page2FilledButton.beginFill(0xffffff);
        this.page2FilledButton.drawCircle(0, 0, 12);
        this.page2FilledButton.endFill();
        this.page2FilledButton.position.set(0, 0);

        this.page2.addChild(this.page2FilledButton);

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
        this.play_btn = new Sprite(Game.the.app.loader.resources['Play_btn'].texture);
        this.addChild(this.play_btn);
        this.play_btn.interactive = true;
        this.play_btn.buttonMode = true;
        this.play_btn.on('pointerdown', this.startButtonClicked.bind(this));
    }

    private setPosition(): void {
        let ratio = window.innerWidth / window.innerHeight
        this.intro_Ballons_img.position.set(0, 40 * ratio);
        this.gameName.position.set(0, this.intro_Ballons_img.y + this.intro_Ballons_img.height);
        this.topContainer.scale.set(1);
        if(window.innerWidth < window.innerHeight){
            if (ratio <= 0.5625) {
                this.topContainer.scale.set(this.topContainer.scale.x * 0.9);
                this.topContainer.position.set((window.innerWidth - this.topContainer.width) / 2, 0);
                this.indicatorBtn.position.set((window.innerWidth - (this.indicatorBtn.width)) / 2 + 30, window.innerHeight * 0.82);
                this.page1FilledButton.position.set(this.indicatorBtn.x - (24) + this.page1.x, this.indicatorBtn.y + this.page1.y);
                this.page2FilledButton.position.set(this.indicatorBtn.x + this.page2.x + 24, this.indicatorBtn.y + this.page2.y);
                this.play_btn.position.set(this.indicatorBtn.x + (this.indicatorBtn.width - this.play_btn.width), this.indicatorBtn.y + this.indicatorBtn.height / 2);
                this.text1.scale.set(0.6);
                this.text2.scale.set(0.6);
                let gameTextheight = this.indicatorBtn.y - (this.gameName.y + this.gameName.height / 2);
                let textY = this.gameName.y + (this.gameName.height/2);
                this.text1.position.set((window.innerWidth - this.text1.width) * 0.5, (textY + ((gameTextheight - this.text1.height) * 0.5)));
                this.text2.position.set((window.innerWidth - this.text2.width) * 0.5, (textY + ((gameTextheight - this.text2.height) * 0.5)));
            } else if (ratio > 0.5625 && ratio <= 0.625) {
                this.topContainer.scale.set(this.topContainer.scale.x * 1.2);
                this.topContainer.position.set((window.innerWidth - this.topContainer.width) / 2, 20);
                this.indicatorBtn.position.set((window.innerWidth - (this.indicatorBtn.width)) / 2 + 30, window.innerHeight * 0.86);
                this.page1FilledButton.position.set(this.indicatorBtn.x - (24) + this.page1.x, this.indicatorBtn.y + this.page1.y);
                this.page2FilledButton.position.set(this.indicatorBtn.x + this.page2.x + 24, this.indicatorBtn.y + this.page2.y);
                this.play_btn.position.set(this.indicatorBtn.x + (this.indicatorBtn.width - this.play_btn.width), this.indicatorBtn.y + this.indicatorBtn.height / 2);
    
                let gameTextheight = this.indicatorBtn.y - (this.gameName.y + this.gameName.height / 2);
                let textY = this.gameName.y + (this.gameName.height/2);
                this.text1.scale.set(0.7);
                this.text2.scale.set(0.7);
                this.text1.position.set((window.innerWidth - this.text1.width) * 0.5, (textY + ((gameTextheight - this.text1.height) * 0.5)));
                this.text2.position.set((window.innerWidth - this.text2.width) * 0.5, (textY + ((gameTextheight - this.text2.height) * 0.5)));
    
               
            } else if (ratio > 0.625) {
                this.topContainer.scale.set(this.topContainer.scale.x * 0.9);
                this.topContainer.position.set((window.innerWidth - this.topContainer.width) / 2, 0);
                this.indicatorBtn.position.set((window.innerWidth - (this.indicatorBtn.width)) / 2 + 30, window.innerHeight * 0.86);
                this.page1FilledButton.position.set(this.indicatorBtn.x - (24) + this.page1.x, this.indicatorBtn.y + this.page1.y);
                this.page2FilledButton.position.set(this.indicatorBtn.x + this.page2.x + 24, this.indicatorBtn.y + this.page2.y);
                this.play_btn.position.set(this.indicatorBtn.x + (this.indicatorBtn.width - this.play_btn.width), this.indicatorBtn.y + this.indicatorBtn.height / 2);
                let gameTextheight = this.indicatorBtn.y - (this.gameName.y + this.gameName.height / 2);
                let textY = this.gameName.y + (this.gameName.height/2);
                this.text1.scale.set(0.7);
                this.text2.scale.set(0.7);
                this.text1.position.set((window.innerWidth - this.text1.width) * 0.5, (textY + ((gameTextheight - this.text1.height) * 0.5)));
                this.text2.position.set((window.innerWidth - this.text2.width) * 0.5, (textY + ((gameTextheight - this.text2.height) * 0.5)));      
            }
        }else if(!this.isDesktop()){
           if(ratio >= 1.77){
                this.intro_Ballons_img.position.set(0, 0 * ratio);
                this.gameName.position.set(0, this.intro_Ballons_img.y + this.intro_Ballons_img.height);
                this.topContainer.scale.set(1);
                this.topContainer.scale.set(this.topContainer.scale.x * 0.5);
                this.topContainer.position.set((window.innerWidth - this.topContainer.width) / 2, 0);
                this.page1UnFilledButton.scale.set(1 * 0.6);
                this.page2UnFilledButton.scale.set(1 * 0.6);
                this.page1FilledButton.scale.set(1 * 0.6);
                this.page2FilledButton.scale.set(1 * 0.6);
                this.play_btn.scale.set(1 * 0.6);

                this.indicatorBtn.position.set((window.innerWidth - (this.indicatorBtn.width)) / 2 + 30, window.innerHeight * 0.88);
                this.page1FilledButton.position.set(this.indicatorBtn.x - (24) + this.page1.x, this.indicatorBtn.y + this.page1.y);
                this.page2FilledButton.position.set(this.indicatorBtn.x + this.page2.x + 24, this.indicatorBtn.y + this.page2.y);
                this.play_btn.position.set(this.indicatorBtn.x + (this.indicatorBtn.width - this.play_btn.width) - 20, this.indicatorBtn.y + this.indicatorBtn.height / 2 -10);
                this.text1.scale.set(0.4);
                this.text2.scale.set(0.4);
                let gameTextheight = this.indicatorBtn.y - (this.gameName.y + this.gameName.height / 2);
                let textY = this.gameName.y + (this.gameName.height/2);
                this.text1.position.set((window.innerWidth - this.text1.width) * 0.5, (textY + ((gameTextheight - this.text1.height) * 0.5)) - 30);
                this.text2.position.set((window.innerWidth - this.text2.width) * 0.5, (textY + ((gameTextheight - this.text2.height) * 0.5)) - 30);
            }else if(ratio >= 1.6 && ratio < 1.77){
                this.intro_Ballons_img.position.set(0, 0 * ratio);
                this.gameName.position.set(0, this.intro_Ballons_img.y + this.intro_Ballons_img.height);
                this.topContainer.scale.set(1);
                this.topContainer.scale.set(this.topContainer.scale.x * 0.7);
                this.topContainer.position.set((window.innerWidth - this.topContainer.width) / 2, 0);
                this.page1UnFilledButton.scale.set(1 * 0.8);
                this.page2UnFilledButton.scale.set(1 * 0.8);
                this.page1FilledButton.scale.set(1 * 0.8);
                this.page2FilledButton.scale.set(1 * 0.8);
                this.play_btn.scale.set(1 * 0.8);

                this.indicatorBtn.position.set((window.innerWidth - (this.indicatorBtn.width)) / 2 + 30, window.innerHeight * 0.88);
                this.page1FilledButton.position.set(this.indicatorBtn.x - (24) + this.page1.x, this.indicatorBtn.y + this.page1.y);
                this.page2FilledButton.position.set(this.indicatorBtn.x + this.page2.x + 24, this.indicatorBtn.y + this.page2.y);
                this.play_btn.position.set(this.indicatorBtn.x + (this.indicatorBtn.width - this.play_btn.width) - 20, this.indicatorBtn.y + this.indicatorBtn.height / 2 -10);
                this.text1.scale.set(0.6);
                this.text2.scale.set(0.6);
                let gameTextheight = this.indicatorBtn.y - (this.gameName.y + this.gameName.height / 2);
                let textY = this.gameName.y + (this.gameName.height/2);
                this.text1.position.set((window.innerWidth - this.text1.width) * 0.5, (textY + ((gameTextheight - this.text1.height) * 0.5)) - 30);
                this.text2.position.set((window.innerWidth - this.text2.width) * 0.5, (textY + ((gameTextheight - this.text2.height) * 0.5)) - 30);
            }else{
                this.intro_Ballons_img.position.set(0, 0 * ratio);
                this.gameName.position.set(0, this.intro_Ballons_img.y + this.intro_Ballons_img.height);
                this.topContainer.scale.set(1);
                this.topContainer.scale.set(this.topContainer.scale.x * 0.8);
                this.topContainer.position.set((window.innerWidth - this.topContainer.width) / 2, 0);
                this.page1UnFilledButton.scale.set(1 * 1);
                this.page2UnFilledButton.scale.set(1 * 1);
                this.page1FilledButton.scale.set(1 * 1);
                this.page2FilledButton.scale.set(1 * 1);
                this.play_btn.scale.set(1 * 1);

                this.indicatorBtn.position.set((window.innerWidth - (this.indicatorBtn.width)) / 2 + 30, window.innerHeight * 0.85);
                this.page1FilledButton.position.set(this.indicatorBtn.x - (24) + this.page1.x, this.indicatorBtn.y + this.page1.y);
                this.page2FilledButton.position.set(this.indicatorBtn.x + this.page2.x + 24, this.indicatorBtn.y + this.page2.y);
                this.play_btn.position.set(this.indicatorBtn.x + (this.indicatorBtn.width - this.play_btn.width), this.indicatorBtn.y + this.indicatorBtn.height / 2 -10);
                this.text1.scale.set(0.5);
                this.text2.scale.set(0.5);
                let gameTextheight = this.indicatorBtn.y - (this.gameName.y + this.gameName.height / 2);
                let textY = this.gameName.y + (this.gameName.height/2);
                this.text1.position.set((window.innerWidth - this.text1.width) * 0.5, (textY + ((gameTextheight - this.text1.height) * 0.5)) - 30);
                this.text2.position.set((window.innerWidth - this.text2.width) * 0.5, (textY + ((gameTextheight - this.text2.height) * 0.5)) - 30);
            }
        }else if(this.isDesktop()){
            if(ratio > 2){
                this.intro_Ballons_img.position.set(0, 0 * ratio);
                this.gameName.position.set(0, this.intro_Ballons_img.y + this.intro_Ballons_img.height);
                this.topContainer.scale.set(1);
                this.topContainer.scale.set(this.topContainer.scale.x * 0.8);
                this.topContainer.position.set((window.innerWidth - this.topContainer.width) / 2, 0);
                this.page1UnFilledButton.scale.set(1 * 1);
                this.page2UnFilledButton.scale.set(1 * 1);
                this.page1FilledButton.scale.set(1 * 1);
                this.page2FilledButton.scale.set(1 * 1);
                this.play_btn.scale.set(1 * 1);

                this.indicatorBtn.position.set((window.innerWidth - (this.indicatorBtn.width)) / 2 + 30, window.innerHeight * 0.88);
                this.page1FilledButton.position.set(this.indicatorBtn.x - (24) + this.page1.x, this.indicatorBtn.y + this.page1.y);
                this.page2FilledButton.position.set(this.indicatorBtn.x + this.page2.x + 24, this.indicatorBtn.y + this.page2.y);
                this.play_btn.position.set(this.indicatorBtn.x + (this.indicatorBtn.width - this.play_btn.width), this.indicatorBtn.y + this.indicatorBtn.height / 2 -10);
                this.text1.scale.set(0.65);
                this.text2.scale.set(0.65);
                let gameTextheight = this.indicatorBtn.y - (this.gameName.y + this.gameName.height / 2);
                let textY = this.gameName.y + (this.gameName.height/2);
                this.text1.position.set((window.innerWidth - this.text1.width) * 0.5, (textY + ((gameTextheight - this.text1.height) * 0.5)) - 20);
                this.text2.position.set((window.innerWidth - this.text2.width) * 0.5, (textY + ((gameTextheight - this.text2.height) * 0.5)) - 20);
            }
            else if(ratio > 1.77){
                this.intro_Ballons_img.position.set(0, 0 * ratio);
                this.gameName.position.set(0, this.intro_Ballons_img.y + this.intro_Ballons_img.height);
                this.topContainer.scale.set(1);
                this.topContainer.scale.set(this.topContainer.scale.x * 0.8);
                this.topContainer.position.set((window.innerWidth - this.topContainer.width) / 2, 0);
                this.page1UnFilledButton.scale.set(1 * 1);
                this.page2UnFilledButton.scale.set(1 * 1);
                this.page1FilledButton.scale.set(1 * 1);
                this.page2FilledButton.scale.set(1 * 1);
                this.play_btn.scale.set(1 * 1);

                this.indicatorBtn.position.set((window.innerWidth - (this.indicatorBtn.width)) / 2 + 30, window.innerHeight * 0.88);
                this.page1FilledButton.position.set(this.indicatorBtn.x - (24) + this.page1.x, this.indicatorBtn.y + this.page1.y);
                this.page2FilledButton.position.set(this.indicatorBtn.x + this.page2.x + 24, this.indicatorBtn.y + this.page2.y);
                this.play_btn.position.set(this.indicatorBtn.x + (this.indicatorBtn.width - this.play_btn.width), this.indicatorBtn.y + this.indicatorBtn.height / 2 -10);
                this.text1.scale.set(0.9);
                this.text2.scale.set(0.9);
                let gameTextheight = this.indicatorBtn.y - (this.gameName.y + this.gameName.height / 2);
                let textY = this.gameName.y + (this.gameName.height/2);
                this.text1.position.set((window.innerWidth - this.text1.width) * 0.5, (textY + ((gameTextheight - this.text1.height) * 0.5)) - 30);
                this.text2.position.set((window.innerWidth - this.text2.width) * 0.5, (textY + ((gameTextheight - this.text2.height) * 0.5)) - 30);
            }else {
                    this.intro_Ballons_img.position.set(0, 0 * ratio);
                    this.gameName.position.set(0, this.intro_Ballons_img.y + this.intro_Ballons_img.height);
                    this.topContainer.scale.set(1);
                    this.topContainer.scale.set(this.topContainer.scale.x * 0.8);
                    this.topContainer.position.set((window.innerWidth - this.topContainer.width) / 2, 0);
                    this.page1UnFilledButton.scale.set(1 * 1);
                    this.page2UnFilledButton.scale.set(1 * 1);
                    this.page1FilledButton.scale.set(1 * 1);
                    this.page2FilledButton.scale.set(1 * 1);
                    this.play_btn.scale.set(1 * 1);
    
                    this.indicatorBtn.position.set((window.innerWidth - (this.indicatorBtn.width)) / 2 + 30, window.innerHeight * 0.88);
                    this.page1FilledButton.position.set(this.indicatorBtn.x - (24) + this.page1.x, this.indicatorBtn.y + this.page1.y);
                    this.page2FilledButton.position.set(this.indicatorBtn.x + this.page2.x + 24, this.indicatorBtn.y + this.page2.y);
                    this.play_btn.position.set(this.indicatorBtn.x + (this.indicatorBtn.width - this.play_btn.width), this.indicatorBtn.y + this.indicatorBtn.height / 2 -10);
                    this.text1.scale.set(0.7);
                    this.text2.scale.set(0.7);
                    let gameTextheight = this.indicatorBtn.y - (this.gameName.y + this.gameName.height / 2);
                    let textY = this.gameName.y + (this.gameName.height/2);
                    this.text1.position.set((window.innerWidth - this.text1.width) * 0.5, (textY + ((gameTextheight - this.text1.height) * 0.5)) - 10);
                    this.text2.position.set((window.innerWidth - this.text2.width) * 0.5, (textY + ((gameTextheight - this.text2.height) * 0.5)) - 10);
            }
        }
    }

    isDesktop(): boolean {
        const md = new MobileDetect(window.navigator.userAgent);
        return !md.mobile();  // Returns true if it's not a mobile device
    }



    private initPage1(): void {
        this.page1 = new Container();
        this.text1 = new Container();
        this.page1.addChild(this.text1);


        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 'white',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 600,
            lineHeight: 32,
        });

        const descriptionText =
            `Welcome to Balloon Pop!

Get ready for a burst of excitement with Trikon’s “Pop to Earn” game on our Telegram Mini App! Balloons are Rising, 
And it’s up to you to pop them 
Before They Escape. 
Each Pop Scores you Points, 
But Miss 15 Balloons, and it’s Game Over. As You Level Up, The Challenge—And The Speed—Intensifies. Plus, Keep An Eye Out For The Tricky Golden Mimic Balloon—It Could Either Boost Your Score Or Set You Back!
Ready To Dive In And Start Earning? Let’s Pop Some Balloons And Rack Up Those Points!`;

        const description: Text = new Text(descriptionText, style);
        // description.anchor.set(0.5);
        // description.position.set(Game.the.app.renderer.width / 2, Game.the.app.renderer.height / 2 - 50);

        this.text1.addChild(description);

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
        this.text2 = new Container();
        this.page2.addChild(this.text2);
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 'white',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 600,
            lineHeight: 42,
        });

        const descriptionText =
            `Welcome to Balloon Pop!


New features coming soon:
	•	Weather Challenges
	•	Tiered Rewards
	•	Daily Popping Tasks
	•	Visual Customization
Hit Play And Get Popping!
        `;

        const description: Text = new Text(descriptionText, style);
        // description.anchor.set(0.5);
        // description.position.set(Game.the.app.renderer.width / 2, Game.the.app.renderer.height / 2 - 50);

        this.text2.addChild(description);


        this.addChild(this.page2);
        this.pages.push(this.page2);
        this.page2.alpha = 0;
    }


    private startButtonClicked(): void {
        this.visible = false;
        Game.the.app.stage.emit("START_BUTTON_CLICKED");
    }
}