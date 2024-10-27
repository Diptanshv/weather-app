import dotenv from 'dotenv';
dotenv.config();

export const config = {
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  updateInterval: process.env.UPDATE_INTERVAL || '*/5 * * * *', // Every 5 minutes
  temperatureUnit: process.env.TEMP_UNIT || 'celsius',
  alertThreshold: {
    maxTemp: process.env.MAX_TEMP_THRESHOLD || 35,
    consecutiveChecks: process.env.CONSECUTIVE_CHECKS || 2
  },
  cities: [
    { name: 'Delhi', id: '1273294' },
    { name: 'Mumbai', id: '1275339' },
    { name: 'Chennai', id: '1264527' },
    { name: 'Bangalore', id: '1277333' },
    { name: 'Kolkata', id: '1275004' },
    { name: 'Hyderabad', id: '1269843' }
  ],
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-monitoring'
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    to: process.env.ALERT_EMAIL_TO
  }
};