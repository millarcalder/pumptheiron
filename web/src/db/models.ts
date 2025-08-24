export interface MeasurementEntry {
  date: number; // UTC timestamp in milliseconds
  value: number;
}

export interface Measurement {
  id?: number; // Primary key. Optional for auto-increment
  name: string;
  description?: string;
  unit: string;
  values: MeasurementEntry[];
}

export interface ExerciseEntry {
  exerciseId: number;
  date: number; // UTC timestamp in milliseconds
  repetitions: number;
  weight: number; // kilograms
}

export interface Exercise {
  id?: number; // Primary key. Optional for auto-increment
  name: string;
  description?: string;
  entries: ExerciseEntry[];
}

export interface CardLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Card {
  id?: number; // Primary key. Optional for auto-increment
  type: 'exercise' | 'measurement';
  linkedId: number; // ID of the exercise or measurement
  layout: CardLayout;
}
