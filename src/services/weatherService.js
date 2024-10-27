import axios from 'axios';
import { config } from '../config/config.js';

export const axiosInstance = axios.create(); // Create a separate axios instance

export class WeatherService {
  constructor() {
    this.apiKey = config.openWeatherApiKey;
    this.baseUrl = 'http://api.openweathermap.org/data/2.5';
    this.axios = axiosInstance;  // Use axios instance in the class
  }

  kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

async getCurrentWeather(cityId) {
    try {
      const response = await this.axios.get(
        `${this.baseUrl}/weather?id=${cityId}&appid=${this.apiKey}`
      );

      console.log(response);
      
      return {
        cityId,
        cityName: response.data.name,
        timestamp: new Date(),
        main: response.data.weather[0].main,
        temp: this.kelvinToCelsius(response.data.main.temp),
        feels_like: this.kelvinToCelsius(response.data.main.feels_like),
        raw_data: response.data
      };
    } catch (error) {
      console.info(`Error fetching weather for city ${cityId}:`, error);
      throw error;
    }
  }
}