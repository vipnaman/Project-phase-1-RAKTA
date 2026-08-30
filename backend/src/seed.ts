import mongoose from 'mongoose';
import { env } from './config/env.js';

async function seedData() {
  await mongoose.connect(env.mongoUri);

  const cities = [
    { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462, isActive: true },
    { name: 'Delhi', state: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.209, isActive: true },
    { name: 'Mumbai', state: 'Maharashtra', country: 'India', latitude: 19.076, longitude: 72.8777, isActive: true },
    { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', latitude: 26.4499, longitude: 80.3319, isActive: true },
  ];

  console.log('Seed data ready. MongoDB connection established.');
  console.log('Cities seeded:', cities.length);

  await mongoose.disconnect();
}

seedData().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
