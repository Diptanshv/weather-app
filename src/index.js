import cron from 'node-cron';
import mongoose from 'mongoose';
import express from 'express';
import { config } from './config/config.js';
import { WeatherService } from './services/weatherService.js';
import { AlertService } from './services/alertService.js';
import { AggregationService } from './services/aggregationService.js';
import { WeatherData } from './models/WeatherData.js';
import { DailySummary } from './models/DailySummary.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const weatherService = new WeatherService();
const alertService = new AlertService();

// Connect to MongoDB
mongoose.connect(config.mongodb.uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schedule weather data collection
cron.schedule(config.updateInterval, async () => {
  try {
    for (const city of config.cities) {
      const weatherData = await weatherService.getCurrentWeather(city.id);
      
      // Save weather data
      await new WeatherData(weatherData).save();
      
      // Check for alerts
      await alertService.checkTemperatureAlert(city.name, weatherData.temp);
    }
  } catch (error) {
    console.error('Error in scheduled weather update:', error);
  }
});

// Daily aggregation job - runs at midnight
cron.schedule('*/1 * * * *', async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    for (const city of config.cities) {
      const weatherData = await WeatherData.find({
        cityId: city.id,
        timestamp: {
          $gte: yesterday,
          $lt: new Date()
        }
      });

      if (weatherData.length > 0) {
        const summary = await AggregationService.calculateDailySummary(weatherData);
        await new DailySummary(summary).save();
      }
    }
  } catch (error) {
    console.error('Error in daily aggregation:', error);
  }
});

app.use(express.static(path.join(__dirname, 'public')));

// API endpoints
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/current-weather', async (req, res) => {
  try {
    const latestData = await WeatherData.find()
      .sort({ timestamp: -1 })
      .limit(config.cities.length);
    res.json(latestData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching current weather data' });
  }
});

app.get('/api/daily-summary', async (req, res) => {
  try {
    const summaries = await DailySummary.find()
      .sort({ date: -1 })
      .limit(7 * config.cities.length); // Last 7 days
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching daily summaries' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
