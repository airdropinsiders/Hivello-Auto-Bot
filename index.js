const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { displayBanner } = require('./banner');

const config = require('./config.json');

function createApiClient(token) {
    return axios.create({
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Hivello/1.4.0 Chrome/124.0.6367.230 Electron/30.0.8 Safari/537.36',
            'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        },
        timeout: 10000 
    });
}

async function updateDevicePing(client) {
    const networkStatus = [
        {"chain":"aioz","earning":false},
        {"chain":"filecoin","earning":true},
        {"chain":"golem","earning":false},
        {"chain":"livepeer","earning":false},
        {"chain":"myst","earning":true},
        {"chain":"nosana","earning":false},
        {"chain":"pkt","earning":false},
        {"chain":"sentinel","earning":false}
    ];

    try {
        await client.post(`${config.apiBaseUrl}/devices/${config.deviceId}/ping`, {
            status: "Earning",
            network_status: networkStatus
        });
        console.log('Device ping updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating device ping:', error.message);
        return false;
    }
}

async function miningLoop(client) {
    let cycleCount = 0;
    
    while (true) {
        try {
            cycleCount++;
            console.log('\n=== Starting mining cycle #' + cycleCount + ' ===');
            const timestamp = new Date().toLocaleString();
            console.log(`Time: ${timestamp}`);
            
            const pingOk = await updateDevicePing(client);
            
            if (pingOk) {
                console.log('Ping cycle completed successfully');
            } else {
                console.log('Ping cycle failed, will retry in next cycle');
            }
            
            console.log(`Waiting ${config.pingInterval/1000} seconds before next cycle...`);
            await new Promise(resolve => setTimeout(resolve, config.pingInterval));
            
        } catch (error) {
            console.error('Error in mining loop:', error.message);
            await new Promise(resolve => setTimeout(resolve, config.pingInterval));
        }
    }
}

async function runBot() {
    const client = createApiClient(config.token);
    
    await displayBanner();
    
    console.log('Starting Hivello Mining Bot...');
    console.log('Press Ctrl+C to stop the bot');
    console.log(`Remote API URL: ${config.apiBaseUrl}`);
    console.log(`VPS IP: ${config.localApiUrl}`);
    
    await miningLoop(client);
}

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

process.on('SIGINT', () => {
    console.log('\nGracefully shutting down...');
    process.exit(0);
});

runBot().catch(error => {
    console.error('Bot error:', error);
    process.exit(1);
});