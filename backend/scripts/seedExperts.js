import 'dotenv/config';
import { connectDatabase } from '../config/db.js';
import { Expert } from '../models/Expert.js';

const experts = [
  {
    name: 'Ava Johnson',
    category: 'Technology',
    experience: 8,
    rating: 4.8,
    availableSlots: [
      { date: '2026-03-01T00:00:00.000Z', slots: ['09:00', '10:00', '14:00'] },
      { date: '2026-03-02T00:00:00.000Z', slots: ['11:00', '15:00'] },
    ],
  },
  {
    name: 'Liam Patel',
    category: 'Finance',
    experience: 12,
    rating: 4.9,
    availableSlots: [
      { date: '2026-03-01T00:00:00.000Z', slots: ['08:00', '13:00', '16:00'] },
      { date: '2026-03-03T00:00:00.000Z', slots: ['10:00', '12:00'] },
    ],
  },
  {
    name: 'Sophia Lee',
    category: 'Health',
    experience: 6,
    rating: 4.7,
    availableSlots: [
      { date: '2026-03-02T00:00:00.000Z', slots: ['09:30', '10:30', '11:30'] },
      { date: '2026-03-04T00:00:00.000Z', slots: ['14:00', '17:00'] },
    ],
  },
  {
    name: 'Noah Martinez',
    category: 'Technology',
    experience: 10,
    rating: 4.6,
    availableSlots: [
      { date: '2026-03-03T00:00:00.000Z', slots: ['09:00', '11:00', '15:30'] },
      { date: '2026-03-05T00:00:00.000Z', slots: ['10:00', '16:00'] },
    ],
  },
  {
    name: 'Emma Brown',
    category: 'Finance',
    experience: 9,
    rating: 4.5,
    availableSlots: [
      { date: '2026-03-01T00:00:00.000Z', slots: ['10:00', '12:00', '14:00'] },
      { date: '2026-03-06T00:00:00.000Z', slots: ['09:00', '13:00'] },
    ],
  },
  {
    name: 'Olivia Davis',
    category: 'Health',
    experience: 11,
    rating: 4.9,
    availableSlots: [
      { date: '2026-03-02T00:00:00.000Z', slots: ['08:30', '09:30', '13:30'] },
      { date: '2026-03-05T00:00:00.000Z', slots: ['11:00', '15:00'] },
    ],
  },
];

const seedExperts = async () => {
  await connectDatabase(process.env.MONGO_URI);

  await Expert.deleteMany({});
  const created = await Expert.insertMany(experts);

  console.info(`✅ Seeded ${created.length} experts`);
  process.exit(0);
};

seedExperts().catch((error) => {
  console.error('❌ Failed to seed experts', error);
  process.exit(1);
});
