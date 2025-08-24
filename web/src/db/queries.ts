import { type DB } from './db';
import {
  type Card,
  type CardLayout,
  type Exercise,
  type ExerciseEntry,
  type Measurement,
} from './models';

export function addMeasurement(db: DB, measurement: Measurement): Promise<number> {
  return db.measurements.add(measurement);
}

export function addOrUpdateMeasurement(
  db: DB,
  measurement: Measurement,
  date: number,
  value: number,
) {
  /* Adds or updates a measurement entry */
  const existingIndex = measurement.values.findIndex((v) => v.date === date);
  if (existingIndex !== -1) {
    const updatedValues = [...measurement.values];
    updatedValues[existingIndex] = { date, value };
    db.measurements.update(measurement.id!, { values: updatedValues });
  } else {
    db.measurements.update(measurement.id!, {
      values: [...measurement.values, { date, value }],
    });
  }
}

export function addExercise(db: DB, exercise: Exercise): Promise<number> {
  return db.exercises.add(exercise);
}

export function addExerciseEntry(db: DB, exercise: Exercise, entry: ExerciseEntry) {
  db.exercises.update(exercise.id!, {
    entries: [...(exercise.entries || []), entry],
  });
}

export function addCard(db: DB, card: Card): Promise<number> {
  return db.cards.add(card);
}

export function updateCardLayout(db: DB, cardId: number, newLayout: CardLayout) {
  db.cards.update(cardId, {
    layout: newLayout,
  });
}
