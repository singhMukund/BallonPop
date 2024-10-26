import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class GiftBtn extends Container{
    private closeBtn !: Sprite;
    private totalGiftBg !: Sprite;
    private totalGiftText !: Text;

    constructor(){
        super();
        this.init();
        // this.setPosition();
        // Game.the.app.stage.on("RESIZE_THE_APP", this.setPosition, this);
        this.on('pointerdown', this.onBtnClicked, this);
        Game.the.app.stage.on("DESTROY_TEXTURE", this.destroyAfterGameRemoved, this);
        Game.the.app.stage.on("PLAY_GIFT_SCORE", this.updateGiftText, this);
        Game.the.app.stage.on("ENABLE_DISABLE_GIFT_BTN", this.enableDisableGiftBtn, this);
        this.interactive = false;
        this.alpha = 0.35;
        this.enableDisableGiftBtn(true);
    }

    private enableDisableGiftBtn(isEnable : boolean) :void{
        if(CommonConfig.the.getTotalGiftCount() > 0){
            this.interactive = isEnable;
            isEnable ? this.alpha = 1 : this.alpha = 0.35;
        }else{
            this.interactive = false;
            this.alpha = 0.35;
        }
    }

    private onBtnClicked() :void{
        Game.the.app.stage.emit("SHOW_GIFT_POP_UP");
    }
    private destroyAfterGameRemoved() :void{
        this.destroy({ children: true,texture : true, baseTexture : true })
    }

    // private 

    private init() :void{
        let textTure : Texture = Game.the.app.loader.resources['uiPanel'].textures?.[`gift_icon.png`] as Texture; 
        this.closeBtn = new Sprite(textTure);
        this.addChild(this.closeBtn);

        textTure = Game.the.app.loader.resources['uiPanel'].textures?.[`giftCountBg.png`] as Texture; 
        this.totalGiftBg = new Sprite(textTure);
        this.addChild(this.totalGiftBg);
        this.totalGiftBg.scale.set(1.2);

        const firstTextStyle = new TextStyle({
            fontFamily: 'Helvetica',
            fontSize: 28,
            fill: 'white',
            align: 'center',
            fontWeight :'normal'
        });
        this.totalGiftBg.position.set(30,0);
        this.totalGiftText = new Text(`${CommonConfig.the.getTotalGiftCount()}`, firstTextStyle);
        this.totalGiftText.position.set(this.totalGiftBg.x + (this.totalGiftBg.width - this.totalGiftText.width)/2, this.totalGiftBg.y + (this.totalGiftBg.height - this.totalGiftText.height)/2)
        this.addChild(this.totalGiftText);
    }

    private updateGiftText() : void{
        CommonConfig.the.setTotalGiftCount(CommonConfig.the.getTotalGiftCount() + 1);
        if(CommonConfig.the.getTotalGiftCount()){
            this.interactive = true;
            this.alpha = 0.5;
        }
        this.totalGiftText.text = `${CommonConfig.the.getTotalGiftCount()}`;
        this.totalGiftText.position.set(this.totalGiftBg.x + (this.totalGiftBg.width - this.totalGiftText.width)/2, this.totalGiftBg.y + (this.totalGiftBg.height - this.totalGiftText.height)/2)
        Game.the.app.stage.emit("UPDATE_GIFT_POINTS_API");
    }

    


}
