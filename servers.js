const express = require('express');
const axios = require('axios').default;
const cors = require('cors');
const WebSocket = require('ws');
const fs = require('fs');
const https = require('https'); // Import HTTPS module

const app = express();
const port = 20011;
const usersFile = 'users.json';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Utility function to read users from JSON file
const readUsers = () => {
    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
};

// Proxmox API configuration
const proxmoxConfig = {
    baseURL: 'https://81.169.237.72:8006/api2/json/nodes/h3066910',
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Ignore SSL certificate issues
    headers: {
        'Authorization': 'PVEAPIToken=API@pve!front-end=a9094682-9fd4-4bd0-ab13-5dffc4617d6d',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

// Discord webhook URL
const discordWebhookURL = 'https://discordapp.com/api/webhooks/1248310846086578297/imqo4VsowiMzlIjVbzN0G8YzoGGGM5IhdpxqZMUI6S37CiEoMHkoxtM7NQ8e9aqhZUrQ';

// Function to send error message to Discord webhook
const sendErrorToDiscord = async (error, endpoint) => {
    const embed = {
        title: 'API Error',
        description: `Error occurred at endpoint: ${endpoint}`,
        color: 16711680, // Red color
        fields: [
            {
                name: 'Error Message',
                value: error.message || 'Unknown error'
            }
        ],
        timestamp: new Date()
    };

    try {
        await axios.post(discordWebhookURL, {
            embeds: [embed]
        });
    } catch (webhookError) {
        console.error('Failed to send error message to Discord webhook:', webhookError);
    }
};

// Function to send success message to Discord webhook
const sendOkay = async (endpoint) => {
    const embed = {
        title: 'API Healthy! 🟢',
        description: `Request given to: ${endpoint} has worked!`,
        color: 51968, // Green color
        fields: [
            {
                name: '🟢 Online',
                value: 'Works fine!'
            }
        ],
        timestamp: new Date()
    };

    try {
        await axios.post(discordWebhookURL, {
            embeds: [embed]
        });
    } catch (webhookError) {
        console.error('Failed to send success message to Discord webhook:', webhookError);
    }
};




// Define a route for /lxc to fetch all LXC containers
app.get('/lxc', async (req, res) => {
    try {
        const apiUrl = 'https://cpanel.in-cloud.us/api/application/servers';
        const params = {
            page: 1,
            per_page: 50
        };

        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': 'Bearer 2|NThhqCh6kN3bckZTNKZZ3DfNqM6EEB0rZlFpym63',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            params: params
        });

        res.json(response.data);
        await sendOkay('Provided Servers');
    } catch (error) {
        console.error(error);
        await sendErrorToDiscord(error, 'Failed to Provide servers');
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/qemu', async (req, res) => {
    try {
        const apiUrl = `${proxmoxConfig.baseURL}/`;

        const response = await axios.get(apiUrl, {
            ...proxmoxConfig
        });

        res.json(response.data);
        await sendOkay('/qemu');
    } catch (error) {
        console.error(error);
        await sendErrorToDiscord(error, '/qemu');
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});



// Define a route for /node/status to check if the node is online or offline
app.get('/node/status', async (req, res) => {
    try {
        const apiUrl = `${proxmoxConfig.baseURL}/status`;

        const response = await axios.get(apiUrl, {
            ...proxmoxConfig
        });

        res.json({ status: "online" });
        await sendOkay('/node/status');
    } catch (error) {
        console.error(error);
        await sendErrorToDiscord(error, '/node/status');
        res.status(500).json({ error: 'Failed to fetch node status' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
