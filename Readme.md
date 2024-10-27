# Weather Monitoring System

A real-time weather monitoring system that collects data from OpenWeatherMap API for major Indian metros, processes it, and provides insights through rollups and aggregates.

## Features

- Real-time weather data collection for 6 major Indian metros
- Temperature conversion from Kelvin to Celsius
- Daily weather summaries with aggregates
- Configurable alerting system for temperature thresholds
- Email notifications for alerts
- REST API endpoints for data access
- MongoDB storage for historical data

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenWeatherMap API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-monitoring-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
OPENWEATHER_API_KEY=your_api_key_here
MONGODB_URI=mongodb://localhost:27017/weather-monitoring
UPDATE_INTERVAL="*/5 * * * *"
TEMP_UNIT=celsius
MAX_TEMP_THRESHOLD=35
CONSECUTIVE_CHECKS=2

# Email configuration (optional)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
ALERT_EMAIL_TO=recipient@example.com
```

## Running the Application

1. Start MongoDB:
```bash
mongod
```

2. Start the application:
```bash
npm start
```

## API Endpoints

- GET `/api/current-weather`: Get latest weather data for all cities
- GET `/api/daily-summary`: Get daily summaries for the last 7 days

## Design Choices

1. **Data Storage**: MongoDB was chosen for its flexibility with JSON-like documents and good support for time-series data.

2. **Architecture**:
   - Service-based architecture for separation of concerns
   - Cron jobs for scheduled tasks
   - Express.js for API endpoints

3. **Alert System**:
   - In-memory tracking of consecutive temperature breaches
   - Email notifications with configurable thresholds
   - Console logging as fallback when email is not configured

4. **Aggregation**:
   - Daily summaries calculated at midnight
   - Dominant weather condition based on frequency

## Testing

Run the tests using:
```bash
npm test
```

## Dependencies

All dependencies can be installed via npm. Key dependencies include:
- express: Web framework
- mongoose: MongoDB ODM
- node-cron: Task scheduler
- axios: HTTP client
- nodemailer: Email sending
- dotenv: Environment configuration

## Docker Support

To run with Docker:

1. Build the image:
```bash
docker build -t weather-monitoring-system .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env weather-monitoring-system
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.