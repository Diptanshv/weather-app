// test/setup.js
import { config } from '../src/config/config.js';
import mongoose from 'mongoose';

// Setup test database connection
beforeAll(async () => {
  const testDbUri = config.mongodb.uri.replace(
    /\/[^/]+$/,
    '/weather-monitoring-test'
  );
  await mongoose.connect(testDbUri);
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Clear collections before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});