# Hivello Auto Bot

An automated bot for Hivello mining operations that helps maintain device status and network connections.

## Register
- https://dashboard.hivello.com/referrals?code=Q50RV54515

## Features

- Automated device ping updates
- Network status monitoring
- Configurable ping intervals
- Error handling and graceful shutdown
- Clean console output with status updates

## Installation

1. Clone the repository:
```bash
git clone https://github.com/airdropinsiders/Hivello-Auto-Bot.git
```

2. Install dependencies:
```bash
cd Hivello-Auto-Bot
npm install
```

3. Configure the bot:
- Edit `devices.txt` with your device settings:
 ``` 
  deviceId1|token1|label1
  deviceId2|token2|label2
```

4. Configure your proxy:
- Edit `proxy.txt` with your device settings:
 ``` 
http://1.2.3.4:8080
http://user:pass@1.2.3.4:8080
socks4://1.2.3.4:1080
socks4://user:pass@1.2.3.4:1080
socks5://1.2.3.4:1080
socks5://user:pass@1.2.3.4:1080
```
## Usage

Start the bot:
```bash
npm run start
```

To stop the bot, press `Ctrl+C`.

# How To Find Device-ID & Bearer Token

Below are the steps to find the Device-ID and Bearer Token:

## Steps

1. **Fiddler Settings**
   Go to Tools - then Settings :
  
   ![Settings](./settings.PNG)

2. **Find Device-ID**    
  The Device-ID can typically be found in the application settings or network requests. Follow these steps:

   ![Device-ID](./device.PNG)  

3. **Find Bearer Token**  
   To retrieve the Bearer Token, you need to download and install **Fiddler Classic**. Follow these steps:  
   - Download Fiddler Classic from the official website: [Fiddler Classic Download](https://www.telerik.com/download/fiddler).  
   - Once installed, open Fiddler Classic and configure it to capture HTTPS traffic.  

   ![Bearer Token](./token.PNG)  

Make sure to follow the steps carefully to retrieve the required Device-ID and Bearer Token.

## Configuration

Edit `config.json` to modify:
- `apiBaseUrl`: Hivello API endpoint
- `localApiUrl`: Your VPS IP address
- `pingInterval`: Time between pings (in milliseconds)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
