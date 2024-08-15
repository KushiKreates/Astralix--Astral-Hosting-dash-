const express = require('express');
const axios = require('axios').default;
const https = require('https');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const { createProxyMiddleware } = require('http-proxy-middleware');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cookieParser());

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const usersFile = 'users.json';

// Enable CORS and JSON parsing
const corsOptions = {
  origin: 'https://navigation-tomatoes-modem-perfect.trycloudflare.com', // Allow this specific origin
  methods: ['GET', 'POST'], // Allow only GET and POST methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
};

app.use(cors(corsOptions)); // Use CORS middleware with options
app.use(express.json());

// Utility function to read users from JSON file
const readUsers = () => {
    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
};

// Utility function to write users to JSON file
const writeUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};
// Route to sign up a new user
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    const users = readUsers();

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, password: hashedPassword };
    users.push(newUser);
    writeUsers(users);

    res.json({ message: 'User signed up successfully' });
});

// Route to log in a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const users = readUsers();

    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.json({ message: 'User logged in successfully' });
});

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

// Define a route for /lxc/:id to fetch container specifications
app.get('/lxc/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const apiUrl = `${proxmoxConfig.baseURL}/lxc/${id}/status/current`;

        const response = await axios.get(apiUrl, {
            ...proxmoxConfig
        });

        const containerSpecs = {
            vcpu: response.data.data.cpus,
            cpuUsage: response.data.data.cpu,
            memoryUsage: response.data.data.mem,
            maxMemory: response.data.data.maxmem,
            diskUsage: response.data.data.disk,
            maxDisk: response.data.data.maxdisk,
            network: response.data.data.netin,
            maxNetwork: response.data.data.netout
        };

        res.json(containerSpecs);
        await sendOkay(`/lxc/${id}`);
    } catch (error) {
        console.error(error);
        await sendErrorToDiscord(error, `/lxc/${id}`);
        res.status(500).json({ error: 'Failed to fetch container specifications' });
    }
});

// Define a route for /lxc to fetch all LXC containers
app.get('/lxc', async (req, res) => {
    try {
        const apiUrl = `${proxmoxConfig.baseURL}/lxc`;

        const response = await axios.get(apiUrl, {
            ...proxmoxConfig
        });

        res.json(response.data);
        await sendOkay('/lxc');
    } catch (error) {
        console.error(error);
        await sendErrorToDiscord(error, '/lxc');
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Define a route for /lxc/stop/:id to stop the LXC container
app.post('/lxc/stop/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const apiUrl = `${proxmoxConfig.baseURL}/lxc/${id}/status/stop`;

        console.log(`Attempting to stop container ${id}`);

        const response = await axios.post(apiUrl, null, proxmoxConfig);

        console.log(`Successfully stopped container ${id}`);
        res.json({ message: `Successfully stopped container ${id}` });
        await sendOkay(`/lxc/stop/${id}`);
    } catch (error) {
        console.error(`Failed to stop container ${id}:`, error);
        await sendErrorToDiscord(error, `/lxc/stop/${id}`);
        res.status(500).json({ error: `Failed to stop container ${id}` });
    }
});

// Define a route for /lxc/start/:id to start the LXC container
app.post('/lxc/start/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const apiUrl = `${proxmoxConfig.baseURL}/lxc/${id}/status/start`;

        console.log(`Attempting to start container ${id}`);

        const response = await axios.post(apiUrl, null, proxmoxConfig);

        console.log(`Successfully started container ${id}`);
        res.json({ message: `Successfully started container ${id}` });
        await sendOkay(`/lxc/start/${id}`);
    } catch (error) {
        console.error(`Failed to start container ${id}:`, error);
        await sendErrorToDiscord(error, `/lxc/start/${id}`);
        res.status(500).json({ error: `Failed to start container ${id}` });
    }
});

// Define a route for /lxc/power/:id/:state to control LXC container power state
app.post('/lxc/power/:id/:state', async (req, res) => {
    const { id, state } = req.params;

    try {
        let apiUrl = '';
        if (state === 'start') {
            apiUrl = `${proxmoxConfig.baseURL}/lxc/${id}/status/start`;
            console.log(`Attempting to start container ${id}`);
        } else if (state === 'stop') {
            apiUrl = `${proxmoxConfig.baseURL}/lxc/${id}/status/stop`;
            console.log(`Attempting to stop container ${id}`);
        } else {
            return res.status(400).json({ error: 'Invalid state. Must be "start" or "stop".' });
        }

        const response = await axios.post(apiUrl, null, proxmoxConfig);

        console.log(`Successfully ${state === 'start' ? 'started' : 'stopped'} container ${id}`);
        res.json({ message: `Successfully ${state === 'start' ? 'started' : 'stopped'} container ${id}` });
        await sendOkay(`/lxc/power/${id}/${state}`);
    } catch (error) {
        console.error(`Failed to ${state === 'start' ? 'start' : 'stop'} container ${id}:`, error);
        await sendErrorToDiscord(error, `/lxc/power/${id}/${state}`);
        res.status(500).json({ error: `Failed to ${state === 'start' ? 'start' : 'stop'} container ${id}` });
    }
});

// Define a route for /node/status to check if the node is online or offline
app.get('/node/status', async (req, res) => {
    try {
        const apiUrl = `${proxmoxConfig.baseURL}/status`;

        const response = await axios.get(apiUrl, {
            ...proxmoxConfig
        });

        const nodeStatus = response.data.data ? 'online' : 'offline';
        res.json({ status: nodeStatus });
        await sendOkay('/node/status');
    } catch (error) {
        console.error(error);
        await sendErrorToDiscord(error, '/node/status');
        res.status(500).json({ error: 'Failed to fetch node status' });
    }
});

// Define a route for /vms to fetch all VMs
app.get('/vms', async (req, res) => {
    try {
        const apiUrl = `${proxmoxConfig.baseURL}/qemu`;

        const response = await axios.get(apiUrl, {
            ...proxmoxConfig
        });

        res.json(response.data);
        await sendOkay('/vms');
    } catch (error) {
        console.error(error);
        await sendErrorToDiscord(error, '/vms');
        res.status(500).json({ error: 'Failed to fetch VMs' });
    }
});

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'User already exists' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ token });
});

app.get('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/user', authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  console.log(user);
  res.json({ email: user.email, isAdmin: user.admin });
});

app.use('/api/admin', authenticateToken, async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.admin) {
    return res.status(403).json({ error: 'Access Denied!' });
  }

  next();
});

const { PROXMOX_TOKEN,PROXMOX_API_URL } = require('./privateconf');
// Proxy /proxmox requests to the target URL
app.use('/proxmox', authenticateToken, createProxyMiddleware({
  target: PROXMOX_API_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/proxmox': '', // remove base path
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add custom headers or modify the request before sending it to the target
    proxyReq.setHeader(  'Authorization', `PVEAPIToken=${PROXMOX_TOKEN}`,);
  },
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
