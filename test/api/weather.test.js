// test/api/weather.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { WeatherData } from '../../src/models/WeatherData.js';
import { DailySummary } from '../../src/models/DailySummary.js';

// Create Express app for testing
const app = express();
app.use(express.json());

// Import and setup routes
app.get('/api/current-weather', async (req, res) => {
  try {
    const latestData = await WeatherData.find()
      .sort({ timestamp: -1 })
      .limit(6);
    res.json(latestData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching current weather data' });
  }
});

app.get('/api/daily-summary', async (req, res) => {
  try {
    const summaries = await DailySummary.find()
      .sort({ date: -1 })
      .limit(42); // 7 days * 6 cities
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching daily summaries' });
  }
});

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // await connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    // await mongoose.disconnect();
  });

  beforeEach(async () => {
    await WeatherData.deleteMany({});
    await DailySummary.deleteMany({});
  });

  describe('GET /api/current-weather', () => {
    test('returns latest weather data for all cities', async () => {
      // Insert test data
      await WeatherData.create([
        {
          cityId: '1273294',
          cityName: 'Delhi',
          temp: 30,
          feels_like: 32,
          main: 'Clear',
          timestamp: new Date()
        },
        {
          cityId: '1275339',
          cityName: 'Mumbai',
          temp: 28,
          feels_like: 30,
          main: 'Cloudy',
          timestamp: new Date()
        }
      ]);

      const response = await request(app)
        .get('/api/current-weather')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('cityName');
      expect(response.body[0]).toHaveProperty('temp');
    });

    test('handles empty database', async () => {
      const response = await request(app)
        .get('/api/current-weather')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/daily-summary', () => {
    test('returns daily summaries for the last week', async () => {
      // Insert test data
      await DailySummary.create([
        {
          cityId: '1273294',
          cityName: 'Delhi',
          date: new Date(),
          avgTemp: 30,
          maxTemp: 35,
          minTemp: 25,
          dominantWeather: 'Clear',
          weatherCounts: { 'Clear': 10, 'Cloudy': 2 }
        }
      ]);

      const response = await request(app)
        .get('/api/daily-summary')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('avgTemp');
      expect(response.body[0]).toHaveProperty('dominantWeather');
    });

    test('handles empty database', async () => {
      const response = await request(app)
        .get('/api/daily-summary')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });
});