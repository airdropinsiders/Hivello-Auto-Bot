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
- Edit `config.json` with your device settings:
  - Set your `deviceId`
  - Update `localApiUrl` if needed
  - Add your bearer `token`

## Usage

Start the bot:
```bash
npm run start
```

To stop the bot, press `Ctrl+C`.

# How To Find Device-ID & Bearer Token

Below are the steps to find the Device-ID and Bearer Token:

## Steps

1. **Find Device-ID**    
  The Device-ID can typically be found in the application settings or network requests. Follow these steps:

   ![Device-ID](./device.PNG)  

2. **Find Bearer Token**  
   To retrieve the Bearer Token, you need to download and install **Fiddler Classic**. Follow these steps:  
   - Download Fiddler Classic from the official website: [Fiddler Classic Download](https://www.telerik.com/download/fiddler).  
   - Once installed, open Fiddler Classic and configure it to capture HTTPS traffic.  

   ![Bearer Token](./token.PNG)  

Make sure to follow the steps carefully to retrieve the required Device-ID and Bearer Token.

## Configuration

Edit `config.json` to modify:
- `deviceId`: Your Hivello device ID
- `apiBaseUrl`: Hivello API endpoint
- `localApiUrl`: Your VPS IP address
- `token`: Your bearer token
- `pingInterval`: Time between pings (in milliseconds)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
