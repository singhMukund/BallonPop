import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class Scorecard extends Container{
    private bg! : Sprite;
    private scoreText !: Text;
    public textContainer !: Container;
    constructor(){
        super();
        this.init();
        this.setPosition();
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
        // Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
    }

    private setPosition() :void{
       
    }

    private init() :void{
        this.textContainer = new Container();
        this.addChild(this.textContainer);
        let textTure : Texture = Game.the.app.loader.resources['uiPanel'].textures?.[`totalTXETxtImg.png`] as Texture; 
        this.bg = new Sprite(textTure);
        // this.bg.beginFill(0x2786e8,1);
        // this.bg.drawRoundedRect(0, 0, 160,55,8);
        // this.bg.endFill();
        this.position.set(0, 10);
        this.bg.scale.set(0.5);
        this.textContainer.addChild(this.bg);

        const buttonStyle = new TextStyle({
            fontFamily: 'Blomberg',
            fontSize: 46,
            fill: '#169D00',
            align: 'left',
            fontWeight :'normal',
            lineHeight : 48,
            wordWrap: true,
            wordWrapWidth: 300
        });
        
        this.scoreText = new Text(`${CommonConfig.the.getTotalScore()}`, buttonStyle);
        // this.scoreText.x = (- this.scoreText.width)/2;
        // this.scoreText.y = (this.bg.height - this.scoreText.height)/2;
        this.bg.y = - this.bg.height - 7;
        this.bg.x = -18;
        // this.scoreText.x = (this.bg.width- this.scoreText.width)/2;
        this.textContainer.addChild(this.scoreText);
    }

    private destroyAfterGameRemoved() :void{
        this.destroy({ children: true,texture : true, baseTexture : true })
    }

    resizeTextToFit() {
        // Start with a base font size
        let fontSize = this.scoreText.style.fontSize;
    
        // Continuously decrease font size until it fits within the maxWidth
        while (this.scoreText.width > 150 && fontSize > 10) {  // Stop at a minimum size
            fontSize--;
            this.scoreText.style.fontSize = fontSize;
            this.scoreText.updateText(true); // Update text rendering after changing font size
        }
    }

    setText() :void{
        this.scoreText.text = `${CommonConfig.the.getTotalScore()}`;
        this.resizeTextToFit();
        this.scoreText.x = -this.scoreText.width + 30;
        // this.scoreText.x = (this.bg.width- this.scoreText.width)/2;
    }


}