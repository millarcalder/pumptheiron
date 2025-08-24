import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getTodayDateUTC } from '../lib/misc';

interface ExerciseEntryByDay {
  date: number; // UTC timestamp in milliseconds
  entries: ExerciseEntry[];

  maxWeight: number | null;
  maxRepetitions: number | null;

  totalWeight: number | null;
  totalRepetitions: number | null;
}

export interface ExerciseEntry {
  date: number; // UTC timestamp in milliseconds
  repetitions: number;
  weight: number; // kilograms
}

export interface ExerciseData {
  name: string;
  description?: string;
  entries: ExerciseEntry[];
}

interface ExerciseProps {
  data: ExerciseData;
}

interface ExerciseProps {
  data: ExerciseData;
  style?: React.CSSProperties;
  addEntry: (entry: ExerciseEntry) => void;
}

type DisplayMetric = 'max_repetitions' | 'max_weight' | 'total_repetitions' | 'total_weight';

const displayMetricToLabel = (displayMetric: DisplayMetric) => {
  switch (displayMetric) {
    case 'max_repetitions':
      return 'Max Repetitions';
    case 'max_weight':
      return 'Max Weight (kg)';
    case 'total_repetitions':
      return 'Total Repetitions';
    case 'total_weight':
      return 'Total Weight (kg)';
  }
};

const displayMetricToUnit = (displayMetric: DisplayMetric) => {
  switch (displayMetric) {
    case 'max_repetitions':
    case 'total_repetitions':
      return 'reps';
    case 'max_weight':
    case 'total_weight':
      return 'kg';
  }
};

const extractValueByDisplayMetric = (displayMetric: DisplayMetric, entry: ExerciseEntryByDay) => {
  switch (displayMetric) {
    case 'max_repetitions':
      return entry.maxRepetitions;
    case 'max_weight':
      return entry.maxWeight;
    case 'total_repetitions':
      return entry.totalRepetitions;
    case 'total_weight':
      return entry.totalWeight;
  }
};

const groupEntriesByDay = (entries: ExerciseEntry[], numDays: number): ExerciseEntryByDay[] => {
  /**
   * Groups exercise entries by day and calculates daily aggregates.
   * Includes entries from the last {numDays} days from today. Days without entries will still be included.
   *
   * @param entries - The exercise entries to group.
   * @param numDays - The number of days to include in the grouping.
   * @returns An array of grouped exercise entries by day.
   */

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const TODAY_TS = getTodayDateUTC();

  const sortedEntries = [...entries].sort((a, b) => a.date - b.date);
  const entriesByDay: ExerciseEntryByDay[] = [];

  let cur = TODAY_TS - (numDays - 1) * MS_PER_DAY;
  while (cur <= TODAY_TS) {
    const dailyEntries = sortedEntries.filter((entry) => entry.date === cur); // Assumes that all entries use midnight

    const maxWeight =
      dailyEntries.length > 0 ? Math.max(...dailyEntries.map((entry) => entry.weight)) : null;
    const maxRepetitions =
      dailyEntries.length > 0 ? Math.max(...dailyEntries.map((entry) => entry.repetitions)) : null;
    const totalWeight =
      dailyEntries.length > 0 ? dailyEntries.reduce((sum, entry) => sum + entry.weight, 0) : null;
    const totalRepetitions =
      dailyEntries.length > 0
        ? dailyEntries.reduce((sum, entry) => sum + entry.repetitions, 0)
        : null;

    entriesByDay.push({
      date: cur,
      entries: dailyEntries,
      maxWeight,
      maxRepetitions,
      totalWeight,
      totalRepetitions,
    });

    cur = cur + MS_PER_DAY;
  }

  return entriesByDay;
};

const ExerciseCard: React.FC<ExerciseProps> = ({ data, style, addEntry }) => {
  const { name, description, entries } = data;

  const [inputWeight, setInputWeight] = React.useState<number>(
    entries[entries.length - 1]?.weight || 0,
  );
  const [inputReps, setInputReps] = React.useState<number>(
    entries[entries.length - 1]?.repetitions || 0,
  );
  const [displayedMetric, setDisplayedMetric] = React.useState<DisplayMetric>('max_weight');
  const [numDays, setNumDays] = React.useState<number>(30);

  const entriesByDay = useMemo(() => groupEntriesByDay(entries, numDays), [entries, numDays]);

  return (
    <div style={{ ...style, display: 'flex', flexDirection: 'column' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={entriesByDay.map((entry) => ({
            date: new Date(entry.date).toLocaleDateString(),
            value: extractValueByDisplayMetric(displayedMetric, entry),
          }))}
        >
          <XAxis dataKey="date" />
          <YAxis
            label={{
              value: displayMetricToLabel(displayedMetric),
              angle: -90,
              position: 'insideLeft',
            }}
            unit={` ${displayMetricToUnit(displayedMetric)}`}
          />
          <Tooltip />
          <Line dataKey="value" name={name} connectNulls />
        </LineChart>
      </ResponsiveContainer>
      <div>
        <span style={{ marginRight: '8px', marginLeft: '8px' }}>Options:</span>
        <select
          value={numDays}
          onChange={(e) => setNumDays(e.target.value ? parseInt(e.target.value) : 30)}
        >
          <option value="30">Last 30 Days</option>
          <option value="60">Last 60 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="180">Last 180 Days</option>
          <option value="360">Last 360 Days</option>
        </select>
        <select
          value={displayedMetric}
          onChange={(e) => setDisplayedMetric(e.target.value as DisplayMetric)}
        >
          <option value="max_weight">Max Weight</option>
          <option value="max_repetitions">Max Repetitions</option>
          <option value="total_weight">Total Weight</option>
          <option value="total_repetitions">Total Repetitions</option>
        </select>

        <span style={{ marginRight: '8px', marginLeft: '8px' }}>Weight:</span>
        <input
          type="number"
          placeholder="Weight"
          value={inputWeight}
          step="0.1"
          onChange={(e) => setInputWeight(e.target.value ? parseFloat(e.target.value) : 0)}
        />
        <span style={{ marginRight: '8px', marginLeft: '8px' }}>Repetitions:</span>
        <input
          type="number"
          placeholder="Repetitions"
          value={inputReps}
          step="1"
          onChange={(e) => setInputReps(e.target.value ? parseInt(e.target.value) : 0)}
        />
        <button
          onClick={() => {
            addEntry({
              date: getTodayDateUTC(),
              repetitions: inputReps,
              weight: inputWeight,
            });
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
