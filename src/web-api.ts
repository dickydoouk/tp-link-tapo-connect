import express from 'express';
import { cloudLogin, loginDeviceByIp } from './api';
import { discoverLocalDevices } from './discover';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/cloudLogin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const cloudApi = await cloudLogin(email, password);
    res.json({ message: 'Login successful', cloudApi });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/listDevices', async (req, res) => {
  const { email, password } = req.query;
  try {
    const cloudApi = await cloudLogin(email, password);
    const devices = await cloudApi.listDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to list devices', error: error.message });
  }
});

app.post('/loginDeviceByIp', async (req, res) => {
  const { email, password, deviceIp } = req.body;
  try {
    const device = await loginDeviceByIp(email, password, deviceIp);
    res.json({ message: 'Device login successful', device });
  } catch (error) {
    res.status(500).json({ message: 'Device login failed', error: error.message });
  }
});

app.get('/discoverDevices', async (req, res) => {
  const { email, password } = req.query;
  try {
    const devices = await discoverLocalDevices(email, password);
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to discover devices', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});