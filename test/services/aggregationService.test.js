// test/services/aggregationService.test.js
import { AggregationService } from '../../src/services/aggregationService.js';
import jest from 'jest-mock';

describe('AggregationService', () => {
  describe('calculateDailySummary', () => {
    const mockWeatherData = [
      {
        cityId: '1273294',
        cityName: 'Delhi',
        temp: 30,
        main: 'Clear',
        timestamp: new Date('2024-01-01T10:00:00Z')
      },
      {
        cityId: '1273294',
        cityName: 'Delhi',
        temp: 32,
        main: 'Clear',
        timestamp: new Date('2024-01-01T11:00:00Z')
      },
      {
        cityId: '1273294',
        cityName: 'Delhi',
        temp: 28,
        main: 'Cloudy',
        timestamp: new Date('2024-01-01T12:00:00Z')
      }
    ];

    test('calculates correct temperature statistics', async () => {
      const summary = await AggregationService.calculateDailySummary(mockWeatherData);
      
      expect(summary.avgTemp).toBeCloseTo(30, 2);
      expect(summary.maxTemp).toBe(32);
      expect(summary.minTemp).toBe(28);
    });

    test('determines correct dominant weather condition', async () => {
      const summary = await AggregationService.calculateDailySummary(mockWeatherData);
      
      expect(summary.dominantWeather).toBe('Clear');
      expect(summary.weatherCounts).toEqual({
        'Clear': 2,
        'Cloudy': 1
      });
    });

    test('maintains correct city information', async () => {
      const summary = await AggregationService.calculateDailySummary(mockWeatherData);
      
      expect(summary.cityId).toBe('1273294');
      expect(summary.cityName).toBe('Delhi');
    });

    test('handles empty data array', async () => {
      await expect(AggregationService.calculateDailySummary([]))
        .rejects.toThrow();
    });
  });
});