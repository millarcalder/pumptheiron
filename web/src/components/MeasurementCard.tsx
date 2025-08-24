import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getTodayDateUTC } from '../lib/misc';

export interface MeasurementEntry {
  date: number; // UTC timestamp in milliseconds
  value: number | null; // null indicates no entry for that date
}

export interface MeasurementData {
  name: string;
  unit: string;
  values: MeasurementEntry[];
}

interface MeasurementProps {
  data: MeasurementData;
  addOrUpdateValue: (date: number, value: number) => void;
  style?: React.CSSProperties;
}

const fetchEntriesByPrevDays = (
  entries: MeasurementEntry[],
  prevDays: number,
): MeasurementEntry[] => {
  /**
   * Fetches measurement entries from the previous {prevDays} days and fills missing days with a null value.
   *
   * @param entries - The measurement entries.
   * @param numDays - The number of days to go back by.
   * @returns An array of measurement entries.
   */

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const TODAY_TS = getTodayDateUTC();

  const sortedEntries = [...entries].sort((a, b) => a.date - b.date);
  const filledEntries: MeasurementEntry[] = [];

  let cur = TODAY_TS - (prevDays - 1) * MS_PER_DAY;
  while (cur <= TODAY_TS) {
    const dailyEntries = sortedEntries.filter((entry) => entry.date === cur); // Assumes that all entries use midnight

    if (dailyEntries.length > 1) {
      throw new Error(`Multiple entries found for date ${new Date(cur).toLocaleDateString()}`);
    }

    if (dailyEntries.length === 0) {
      filledEntries.push({ date: cur, value: null });
    } else {
      filledEntries.push(...dailyEntries);
    }

    cur = cur + MS_PER_DAY;
  }

  return filledEntries;
};

const MeasurementCard: React.FC<MeasurementProps> = ({ data, addOrUpdateValue, style }) => {
  const { name, unit, values } = data;

  const [numDays, setNumDays] = React.useState<number>(30);
  const [inputValue, setInputValue] = React.useState<number>(values[values.length - 1]?.value || 0);

  const TODAY_TS = useMemo(() => getTodayDateUTC(), []);
  const filledEntries = React.useMemo(
    () => fetchEntriesByPrevDays(values, numDays),
    [values, numDays],
  );

  return (
    <div style={{ ...style, display: 'flex', flexDirection: 'column' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filledEntries.map(({ date, value }) => ({
            date: new Date(date).toLocaleDateString(),
            value,
          }))}
        >
          <XAxis dataKey="date" />
          <YAxis label={{ value: unit, angle: -90, position: 'insideLeft' }} />
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
        <span style={{ marginRight: '8px', marginLeft: '8px' }}>Input:</span>
        <input
          type="number"
          step="0.1"
          value={inputValue}
          onChange={(e) => {
            const value = parseFloat(parseFloat(e.target.value).toFixed(1));
            if (!isNaN(value)) {
              setInputValue(value);
            }
          }}
        />
        <button onClick={() => addOrUpdateValue(TODAY_TS, inputValue)}>
          {values.find((entry) => entry.date === TODAY_TS) ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default MeasurementCard;
