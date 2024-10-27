import mongoose from 'mongoose';

const weatherDataSchema = new mongoose.Schema({
  cityId: String,
  cityName: String,
  timestamp: Date,
  main: String,
  temp: Number,
  feels_like: Number,
  raw_data: Object
});

export const WeatherData = mongoose.model('WeatherData', weatherDataSchema);
