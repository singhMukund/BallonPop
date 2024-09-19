import { TelegramLoginParsing, TelegramUser } from './TelegramLoginParsing';
import { Container, Graphics, Text } from 'pixi.js';

// Declare the global function for Telegram authentication
declare global {
    interface Window {
        onTelegramAuth: (user: TelegramUser) => void;
        Telegram?: any; 
    }
}

export class TelegramLogInBtn extends Container {
    private button: Graphics;
    private text: Text;
    private telegramLogin: TelegramLoginParsing;

    constructor(telegramLogin: TelegramLoginParsing) {
        super();
        this.telegramLogin = telegramLogin;

        this.button = new Graphics();
        this.button.beginFill(0x3498db);
        this.button.drawRect(0, 0, 200, 60);
        this.button.endFill();

        this.text = new Text('Login with Telegram', { fontSize: 20, fill: 0xffffff });
        this.text.anchor.set(0.5);
        this.text.position.set(this.button.width / 2, this.button.height / 2);

        this.button.interactive = true;
        this.button.buttonMode = true;
        this.button.addChild(this.text);

        this.button.on('pointerdown', this.onButtonClick.bind(this));

        this.addChild(this.button);

        // Register the onTelegramAuth function globally
        window.onTelegramAuth = this.handleTelegramAuth.bind(this);
        console.log('onTelegramAuth function set globally');
        this.simulateTelegramAuth();

    }

    private simulateTelegramAuth(): void {
     
    }

    

    private handleTelegramAuth(user: TelegramUser): void {
        console.log('Authenticated user:', user);

        // Verify the user's data
        this.telegramLogin.verifyTelegramData(user).then(isValid => {
            if (isValid) {
                const userInfo = this.telegramLogin.parseUserData(user);
                console.log("User authenticated successfully:", userInfo);
                alert(userInfo); // Display user info in an alert or on the UI
            } else {
                console.error("Data verification failed.");
            }
        }).catch(error => {
            console.error("Error during verification:", error);
        });
    }

    private onButtonClick(): void {
        // The Telegram WebApp should automatically call the onTelegramAuth function
        console.log('Button clicked. The Telegram WebApp should handle authentication.');
     //   https://oauth.telegram.org/auth?bot_id=YOUR_BOT_ID&scope=YOUR_SCOPE&public_key=YOUR_PUBLIC_KEY&nonce=YOUR_NONCE

     const telegramUrl = `https://oauth.telegram.org/auth?bot_id=7132134647:AAHj27DA9kHD_2cFANCo-dumSCA-nGm-E3M&scope=chat:read+user:read&public_key=ea95068b&nonce=7132134647`;

      // Redirect to the URL
        window.location.href = telegramUrl;

        const initData = window.Telegram.WebApp.initData || '';
        console.log((window as any).Telegram.WebApp);

        if (initData) {
            const searchParams = new URLSearchParams(initData);
            const telegramUser: TelegramUser = {
                id: parseInt(searchParams.get('id') || '0', 10),
                first_name: searchParams.get('first_name') || '',
                last_name: searchParams.get('last_name') || undefined,
                username: searchParams.get('username') || undefined,
                photo_url: searchParams.get('photo_url') || undefined,
                auth_date: parseInt(searchParams.get('auth_date') || '0', 10),
                hash: searchParams.get('hash') || ''
            };

            // Verify the user data using the TelegramLoginParsing class
            this.telegramLogin.verifyTelegramData(telegramUser).then(isValid => {
                if (isValid) {
                    const userInfo = this.telegramLogin.parseUserData(telegramUser);
                    console.log("User authenticated successfully:", userInfo);
                    alert(userInfo); // Display user info in an alert or on the UI
                } else {
                    console.error("Data verification failed.");
                }
            }).catch(error => {
                console.error("Error during verification:", error);
            });
        } else {
            console.error("Telegram initData not found. Ensure the Telegram WebApp is properly set up.");
        }
    }
}
