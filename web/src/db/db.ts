import Dexie, { type Table } from 'dexie';
import { type Card, type Exercise, type Measurement } from './models';

const db = new Dexie('pumptheiron') as Dexie & {
  measurements: Table<Measurement, number>;
  exercises: Table<Exercise, number>;
  cards: Table<Card, number>;
};

// Schema declaration:
db.version(1).stores({
  measurements: '++id, name, unit', // Primary key "id"
  exercises: '++id, name, description', // Primary key "id"
  cards: '++id, type', // Primary key "id"
});

// Populate the database with initial data
db.on('populate', async () => {
  await db.measurements.add({
    id: 1,
    name: 'Weight',
    unit: 'kg',
    values: [
      { date: new Date('2025-08-02T00:00:00Z').getTime(), value: 70 },
      { date: new Date('2025-08-01T00:00:00Z').getTime(), value: 69.5 },
    ],
  });
  await db.exercises.add({
    id: 1,
    name: 'Bench Press',
    description: 'Chest exercise',
    entries: [
      {
        exerciseId: 1,
        date: new Date('2025-05-01T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 50,
      },
      {
        exerciseId: 1,
        date: new Date('2025-05-01T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 55,
      },
      {
        exerciseId: 1,
        date: new Date('2025-05-01T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 60,
      },
      {
        exerciseId: 1,
        date: new Date('2025-05-03T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 52.5,
      },
      {
        exerciseId: 1,
        date: new Date('2025-05-03T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 57.5,
      },
      {
        exerciseId: 1,
        date: new Date('2025-05-03T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 62.5,
      },
      {
        exerciseId: 1,
        date: new Date('2025-05-05T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 52.5,
      },
      {
        exerciseId: 1,
        date: new Date('2025-05-05T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 57.5,
      },
      {
        exerciseId: 1,
        date: new Date('2025-05-05T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 62.5,
      },
      {
        exerciseId: 1,
        date: new Date('2025-08-01T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 50,
      },
      {
        exerciseId: 1,
        date: new Date('2025-08-01T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 55,
      },
      {
        exerciseId: 1,
        date: new Date('2025-08-01T00:00:00Z').getTime(),
        repetitions: 10,
        weight: 60,
      },
    ],
  });
  await db.cards.add({
    id: 1,
    type: 'measurement',
    linkedId: 1,
    layout: { x: 0, y: 0, w: 10, h: 10 },
  });
  await db.cards.add({
    id: 2,
    type: 'exercise',
    linkedId: 1,
    layout: { x: 0, y: 0, w: 10, h: 10 },
  });
});

export type DB = typeof db;
export { db };
