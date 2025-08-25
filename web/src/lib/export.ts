import JSZip from 'jszip';
import type { DB } from '../db/db';
import { downloadBlob } from './misc';

export async function exportAllDataAsZip(db: DB) {
  const [cards, exercises, measurements] = await Promise.all([
    db.cards.toArray(),
    db.exercises.toArray(),
    db.measurements.toArray(),
  ]);

  const zip = new JSZip();
  zip.file('cards.json', JSON.stringify(cards, null, 2));
  zip.file('exercises.json', JSON.stringify(exercises, null, 2));
  zip.file('measurements.json', JSON.stringify(measurements, null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, 'exported_data.zip');
}
