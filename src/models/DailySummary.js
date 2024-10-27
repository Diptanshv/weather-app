import mongoose from 'mongoose';
const dailySummarySchema = new mongoose.Schema({
    cityId: String,
    cityName: String,
    date: Date,
    avgTemp: Number,
    maxTemp: Number,
    minTemp: Number,
    dominantWeather: String,
    weatherCounts: Object
  });
  
export const DailySummary = mongoose.model('DailySummary', dailySummarySchema);
  