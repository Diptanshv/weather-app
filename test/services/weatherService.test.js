// // test/services/weatherService.test.js
// import  { WeatherService, axiosInstance } from '../../src/services/weatherService.js';
// import jest from 'jest-mock';

// // Mock axios
// jest.spyOn('axios');

// describe('WeatherService', () => {
//   let weatherService;

//   beforeEach(() => {
//     weatherService = new WeatherService();
//   });

//   describe('kelvinToCelsius', () => {
//     test('converts 273.15K to 0°C', () => {
//       expect(weatherService.kelvinToCelsius(273.15)).toBeCloseTo(0, 2);
//     });

//     test('converts 373.15K to 100°C', () => {
//       expect(weatherService.kelvinToCelsius(373.15)).toBeCloseTo(100, 2);
//     });
//   });

//   describe('getCurrentWeather', () => {
//     const mockWeatherResponse = {
//       data: {
//         name: 'Delhi',
//         weather: [{ main: 'Clear' }],
//         main: {
//           temp: 300.15, // 27°C
//           feels_like: 301.15
//         }
//       }
//     };

//     test('fetches and transforms weather data correctly', async () => {
//       axios.get.mockResolvedValue(mockWeatherResponse);
      
//       const result = await weatherService.getCurrentWeather('1273294');
      
//       expect(result).toEqual(expect.objectContaining({
//         cityId: '1273294',
//         cityName: 'Delhi',
//         main: 'Clear',
//         temp: expect.any(Number),
//         feels_like: expect.any(Number),
//         timestamp: expect.any(Date),
//         raw_data: mockWeatherResponse.data
//       }));
      
//       expect(result.temp).toBeCloseTo(27, 1);
//     });

//     test('handles API errors gracefully', async () => {
//       const errorMessage = 'API Error';
//       axios.get.mockRejectedValue(new Error(errorMessage));
      
//       await expect(weatherService.getCurrentWeather('1273294'))
//         .rejects.toThrow(errorMessage);
//     });
//   });
// });

// test/services/weatherService.test.js
import { WeatherService, axiosInstance } from '../../src/services/weatherService.js';
import { jest } from '@jest/globals';

describe('WeatherService', () => {
  let weatherService;

  beforeEach(() => {
    weatherService = new WeatherService();
    jest.clearAllMocks();  // Clear mocks between tests
  });

  describe('kelvinToCelsius', () => {
    test('converts 273.15K to 0°C', () => {
      expect(weatherService.kelvinToCelsius(273.15)).toBeCloseTo(0, 2);
    });

    test('converts 373.15K to 100°C', () => {
      expect(weatherService.kelvinToCelsius(373.15)).toBeCloseTo(100, 2);
    });
  });

  describe('getCurrentWeather', () => {
    const mockWeatherResponse = {
      data: {
        name: 'Delhi',
        weather: [{ main: 'Clear' }],
        main: {
          temp: 300.15,
          feels_like: 301.15
        }
      }
    };

    test('fetches and transforms weather data correctly', async () => {
      jest.spyOn(axiosInstance, 'get').mockResolvedValue(mockWeatherResponse);

      const result = await weatherService.getCurrentWeather('1273294');

      expect(result).toEqual(expect.objectContaining({
        cityId: '1273294',
        cityName: 'Delhi',
        main: 'Clear',
        temp: expect.any(Number),
        feels_like: expect.any(Number),
        timestamp: expect.any(Date),
        raw_data: mockWeatherResponse.data
      }));

      expect(result.temp).toBeCloseTo(27, 1);
    });

    test('handles API errors gracefully', async () => {
      const errorMessage = 'API Error';
      jest.spyOn(axiosInstance, 'get').mockRejectedValue(new Error(errorMessage));

      await expect(weatherService.getCurrentWeather('1273294'))
        .rejects.toThrow(errorMessage);
    });
  });
});
