import React, { useState } from 'react';

type CardType = 'measurement' | 'exercise';

export interface AddCardData {
  type: CardType;
  name: string;
  description?: string;
  unit?: string;
}

interface AddCardFormProps {
  onSubmit: (data: AddCardData) => void;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<CardType>('measurement');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Normalize inputs
    const normalizedName = name.trim();
    const normalizedDescription = description.trim();
    const normalizedUnit = unit.trim();

    if (!normalizedName) return; // Name required
    if (type === 'measurement' && !normalizedUnit) return; // Unit required for measurements

    onSubmit({
      type,
      name: normalizedName,
      description: normalizedDescription,
      unit: type === 'measurement' ? normalizedUnit : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Card Type:
          <select value={type} onChange={(e) => setType(e.target.value as CardType)}>
            <option value="measurement">Measurement</option>
            <option value="exercise">Exercise</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
      </div>
      {type === 'measurement' && (
        <div>
          <label>
            Unit:
            <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required />
          </label>
        </div>
      )}
      <button type="submit">Add Card</button>
    </form>
  );
};

export default AddCardForm;
