// test/services/alertService.test.js
import { AlertService } from '../../src/services/alertService.js';
import jest from 'jest-mock';

describe('AlertService', () => {
  let alertService;
  let mockTransporter;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue(true)
    };
    alertService = new AlertService();
    // Mock the email transporter
    if (alertService.transporter) {
      alertService.transporter = mockTransporter;
    }
  });

  describe('checkTemperatureAlert', () => {
    test('should not trigger alert for temperature below threshold', async () => {
      const spy = jest.spyOn(alertService, 'sendAlert');
      await alertService.checkTemperatureAlert('Delhi', 30);
      expect(spy).not.toHaveBeenCalled();
    });

    test('should trigger alert after consecutive high temperatures', async () => {
      const spy = jest.spyOn(alertService, 'sendAlert');
      
      // First high temperature
      await alertService.checkTemperatureAlert('Delhi', 36);
      expect(spy).not.toHaveBeenCalled();
      
      // Second high temperature
      await alertService.checkTemperatureAlert('Delhi', 36);
      expect(spy).toHaveBeenCalledWith('Delhi', 36);
    });

    test('should reset consecutive count after normal temperature', async () => {
      const spy = jest.spyOn(alertService, 'sendAlert');
      
      await alertService.checkTemperatureAlert('Delhi', 36);
      await alertService.checkTemperatureAlert('Delhi', 30);
      await alertService.checkTemperatureAlert('Delhi', 36);
      
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('sendAlert', () => {
    test('should log alert to console', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      await alertService.sendAlert('Delhi', 36);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ALERT: High temperature in Delhi')
      );
    });

    test('should send email if transporter is configured', async () => {
      alertService.transporter = mockTransporter;
      await alertService.sendAlert('Delhi', 36);
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    test('should handle email sending errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error');
      mockTransporter.sendMail.mockRejectedValue(new Error('Email error'));
      
      alertService.transporter = mockTransporter;
      await alertService.sendAlert('Delhi', 36);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error sending email alert:',
        expect.any(Error)
      );
    });
  });
});