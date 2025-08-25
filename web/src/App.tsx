import './App.css';
import MeasurementCard from './components/MeasurementCard';
import ExerciseCard from './components/ExerciseCard';
import { db } from './db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  addCard,
  addExercise,
  addExerciseEntry,
  addMeasurement,
  addOrUpdateMeasurement,
  updateCardLayout,
} from './db/queries';
import RGL, { WidthProvider } from 'react-grid-layout';
import CardComponent from './components/Card';
import { useEffect, useMemo, useState } from 'react';
import type { Card, Exercise, Measurement } from './db/models';
import NavBar from './components/NavBar';
import Modal from './components/Modal';
import AddCardForm, { type AddCardData } from './forms/AddCardForm';
import { exportAllDataAsZip } from './lib/export';

const ReactGridLayout = WidthProvider(RGL);

function renderExerciseCard(card: Card, exercise: Exercise) {
  return (
    <CardComponent
      key={card.id!.toString()}
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3
        className="drag-handle"
        style={{
          cursor: 'move',
          marginTop: '0',
        }}
      >
        {exercise.name}
      </h3>
      <ExerciseCard
        style={{ flexGrow: 1 }}
        data={{
          name: exercise.name,
          description: exercise.description,
          entries: exercise.entries,
        }}
        addEntry={(exerciseEntry) => {
          addExerciseEntry(db, exercise, {
            exerciseId: exercise.id!,
            date: exerciseEntry.date,
            repetitions: exerciseEntry.repetitions,
            weight: exerciseEntry.weight,
          });
        }}
      />
    </CardComponent>
  );
}

function renderMeasurementCard(card: Card, measurement: Measurement) {
  return (
    <CardComponent
      key={card.id!.toString()}
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3
        className="drag-handle"
        style={{
          cursor: 'move',
          marginTop: '0',
        }}
      >
        {measurement.name}
      </h3>
      <MeasurementCard
        style={{ flexGrow: 1 }}
        data={{
          name: measurement.name,
          unit: measurement.unit,
          values: measurement.values,
        }}
        addOrUpdateValue={(date, value) => {
          addOrUpdateMeasurement(db, measurement, date, value);
        }}
      />
    </CardComponent>
  );
}

function renderCards(cards: Card[], exercises: Exercise[], measurements: Measurement[]) {
  return cards?.map((card) => {
    if (card.type === 'exercise') {
      const exercise = exercises?.find((e) => e.id === card.linkedId);
      return exercise ? renderExerciseCard(card, exercise) : null;
    } else if (card.type === 'measurement') {
      const measurement = measurements?.find((m) => m.id === card.linkedId);
      return measurement ? renderMeasurementCard(card, measurement) : null;
    }
  });
}

async function addCardFormSubmission(data: AddCardData) {
  // Handle form submission
  if (data.type === 'exercise') {
    const exerciseId = await addExercise(db, {
      name: data.name,
      description: data.description,
      entries: [],
    });
    // Link the exercise to the card
    await addCard(db, {
      type: 'exercise',
      linkedId: exerciseId,
      layout: {
        x: 0,
        y: 0,
        w: 4,
        h: 4,
      },
    });
  } else if (data.type === 'measurement') {
    const measurementId = await addMeasurement(db, {
      name: data.name,
      unit: data.unit || '',
      values: [],
    });
    // Link the measurement to the card
    await addCard(db, {
      type: 'measurement',
      linkedId: measurementId,
      layout: {
        x: 0,
        y: 0,
        w: 4,
        h: 4,
      },
    });
  }
}

function App() {
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);

  const cards = useLiveQuery(() => db.cards.toArray());
  const exercises = useLiveQuery(() => db.exercises.toArray());
  const measurements = useLiveQuery(() => db.measurements.toArray());

  const [layout, setLayout] = useState<any[] | undefined>(undefined);

  // Only generate layout once after cards are loaded for the first time
  useEffect(() => {
    if (cards !== undefined && layout === undefined) {
      setLayout(
        cards.map((card) => ({
          i: card.id!.toString(),
          x: card.layout.x,
          y: card.layout.y,
          w: card.layout.w,
          h: card.layout.h,
        })),
      );
    }
  }, [cards]);

  //
  // This is really important,
  //  - the layout is only used as an initializer so it must be ready!
  //  - if the components aren't rendered straight away the layout won't be applied correctly. They
  //    are not rendered if the cards are not ready or related measurements & exercises are missing
  //
  const ready = useMemo(
    () =>
      layout !== undefined &&
      cards !== undefined &&
      exercises !== undefined &&
      measurements !== undefined,
    [layout, cards, exercises, measurements],
  );

  return !ready ? (
    <div>Loading...</div>
  ) : (
    <>
      <Modal open={addCardModalOpen} onClose={() => setAddCardModalOpen(false)}>
        <AddCardForm
          onSubmit={async (data) => {
            await addCardFormSubmission(data);
            setAddCardModalOpen(false);
          }}
        />
      </Modal>
      <NavBar
        onAddCard={() => setAddCardModalOpen(true)}
        triggerExport={() => {
          if (!confirm('Are you sure you want to export all data?')) return;
          exportAllDataAsZip(db);
        }}
      />
      <ReactGridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        compactType={'vertical'}
        draggableHandle=".drag-handle"
        onLayoutChange={(newLayout) => {
          newLayout.forEach((layoutItem) => {
            updateCardLayout(db, parseInt(layoutItem.i), {
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h,
            });
          });
        }}
      >
        {renderCards(cards!, exercises!, measurements!)}
      </ReactGridLayout>
    </>
  );
}

export default App;
