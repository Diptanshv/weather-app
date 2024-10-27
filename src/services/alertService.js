import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

export class AlertService {
  constructor() {
    this.tempThreshold = config.alertThreshold.maxTemp;
    this.consecutiveChecks = config.alertThreshold.consecutiveChecks;
    this.temperatureAlerts = new Map(); // Store consecutive alerts

    if (config.email.host) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: true,
        auth: {
          user: config.email.user,
          pass: config.email.pass
        }
      });
    }
  }

  async checkTemperatureAlert(cityName, temperature) {
    const alertKey = `${cityName}-temp`;
    const currentAlerts = this.temperatureAlerts.get(alertKey) || [];
    
    if (temperature > this.tempThreshold) {
      currentAlerts.push(temperature);
      if (currentAlerts.length >= this.consecutiveChecks) {
        await this.sendAlert(cityName, temperature);
        this.temperatureAlerts.delete(alertKey);
      } else {
        this.temperatureAlerts.set(alertKey, currentAlerts);
      }
    } else {
      this.temperatureAlerts.delete(alertKey);
    }
  }

  async sendAlert(cityName, temperature) {
    console.log(`ALERT: High temperature in ${cityName}: ${temperature}°C`);
    
    if (this.transporter && config.email.to) {
      try {
        await this.transporter.sendMail({
          from: config.email.user,
          to: config.email.to,
          subject: `Weather Alert: High Temperature in ${cityName}`,
          text: `The temperature in ${cityName} has exceeded ${this.tempThreshold}°C.\nCurrent temperature: ${temperature}°C`
        });
      } catch (error) {
        console.error('Error sending email alert:', error);
      }
    }
  }
}