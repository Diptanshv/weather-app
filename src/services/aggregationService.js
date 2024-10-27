export class AggregationService {
    static async calculateDailySummary(weatherData) {
      const temperatures = weatherData.map(data => data.temp);
      const weatherCounts = weatherData.reduce((acc, data) => {
        acc[data.main] = (acc[data.main] || 0) + 1;
        return acc;
      }, {});
  
      const dominantWeather = Object.entries(weatherCounts)
        .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  
      return {
        cityId: weatherData[0].cityId,
        cityName: weatherData[0].cityName,
        date: new Date().setHours(0, 0, 0, 0),
        avgTemp: temperatures.reduce((a, b) => a + b) / temperatures.length,
        maxTemp: Math.max(...temperatures),
        minTemp: Math.min(...temperatures),
        dominantWeather,
        weatherCounts
      };
    }
}