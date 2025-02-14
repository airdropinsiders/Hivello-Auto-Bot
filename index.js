const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { displayBanner } = require('./banner');
const config = require('./config.json');

function loadProxies() {
    try {
        const proxiesContent = fs.readFileSync('proxy.txt', 'utf8');
        return proxiesContent.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(proxy => proxy); // Keep the full proxy URL
    } catch (error) {
        console.error('Error loading proxies:', error.message);
        return [];
    }
}

function createProxyAgent(proxyUrl) {
    if (!proxyUrl) return null;
    
    try {
        if (proxyUrl.startsWith('socks4://') || proxyUrl.startsWith('socks5://')) {
            return new SocksProxyAgent(proxyUrl);
        } else if (proxyUrl.startsWith('http://')) {
            return new HttpsProxyAgent(proxyUrl);
        }
    } catch (error) {
        console.error('Error creating proxy agent:', error.message);
        return null;
    }
    return null;
}

function createApiClient(token, proxyUrl) {
    const agent = createProxyAgent(proxyUrl);
    
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
        timeout: 10000,
        ...(agent && { httpsAgent: agent, httpAgent: agent })
    });
}

function loadDevices() {
    try {
        const devicesContent = fs.readFileSync('devices.txt', 'utf8');
        return devicesContent.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(line => {
                const [deviceId, token, label] = line.split('|').map(s => s.trim());
                return { 
                    deviceId, 
                    token, 
                    label: label || deviceId // Use deviceId as label if not provided
                };
            });
    } catch (error) {
        console.error('Error loading devices:', error.message);
        process.exit(1);
    }
}

async function updateDevicePing(client, device) {
    const networkStatus = [
        {"chain":"aioz","earning":true},
        {"chain":"filecoin","earning":true},
        {"chain":"golem","earning":true},
        {"chain":"livepeer","earning":true},
        {"chain":"myst","earning":true},
        {"chain":"nosana","earning":true},
        {"chain":"pkt","earning":true},
        {"chain":"sentinel","earning":true}
    ];

    try {
        await client.post(`${config.apiBaseUrl}/devices/${device.deviceId}/ping`, {
            status: "Earning",
            network_status: networkStatus
        });
        console.log(`[${device.label}] Device ping updated successfully`);
        return true;
    } catch (error) {
        console.error(`[${device.label}] Error updating device ping:`, error.message);
        return false;
    }
}

async function miningLoop(devices, useProxy) {
    let cycleCount = 0;
    const proxies = useProxy ? loadProxies() : [];
    let currentProxyIndex = 0;
    
    while (true) {
        try {
            cycleCount++;
            console.log('\n=== Starting mining cycle #' + cycleCount + ' ===');
            const timestamp = new Date().toLocaleString();
            console.log(`Time: ${timestamp}`);
            
            for (const device of devices) {
                let proxyUrl = null;
                if (useProxy && proxies.length > 0) {
                    proxyUrl = proxies[currentProxyIndex];
                    // Hide password in logs if present
                    const displayUrl = proxyUrl.replace(/\/\/(.*):(.*)@/, '//*****:*****@');
                    console.log(`[${device.label}] Using proxy: ${displayUrl}`);
                    currentProxyIndex = (currentProxyIndex + 1) % proxies.length;
                }
                
                const client = createApiClient(device.token, proxyUrl);
                const pingOk = await updateDevicePing(client, device);
                
                if (pingOk) {
                    console.log(`[${device.label}] Ping cycle completed successfully`);
                } else {
                    console.log(`[${device.label}] Ping cycle failed, will retry in next cycle`);
                }
                
                // Add small delay between devices
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            console.log(`Waiting ${config.pingInterval/1000} seconds before next cycle...`);
            await new Promise(resolve => setTimeout(resolve, config.pingInterval));
            
        } catch (error) {
            console.error('Error in mining loop:', error.message);
            await new Promise(resolve => setTimeout(resolve, config.pingInterval));
        }
    }
}

async function promptProxyUsage() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query) => new Promise((resolve) => readline.question(query, resolve));

    console.log('\nProxy Configuration:');
    console.log('1. No Proxy');
    console.log('2. Use Proxy from proxy.txt');
    
    const choice = await question('Select option (1-2): ');
    readline.close();
    
    return choice === '2';
}

async function runBot() {
    await displayBanner();
    
    console.log('Starting Hivello Mining Bot...');
    console.log('Loading devices from devices.txt...');
    
    const devices = loadDevices();
    console.log(`Loaded ${devices.length} devices:`);
    devices.forEach(device => {
        console.log(`- ${device.label} (${device.deviceId})`);
    });
    
    const useProxy = await promptProxyUsage();
    if (useProxy) {
        const proxies = loadProxies();
        console.log(`Loaded ${proxies.length} proxies from proxy.txt`);
    } else {
        console.log('Running without proxy');
    }
    
    console.log('Press Ctrl+C to stop the bot');
    console.log(`Remote API URL: ${config.apiBaseUrl}`);
    console.log(`VPS IP: ${config.localApiUrl}`);
    
    await miningLoop(devices, useProxy);
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
