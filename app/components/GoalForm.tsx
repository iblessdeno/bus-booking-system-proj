'use client';  // Add this line at the top of the file

import { useState } from 'react';
import { Goal } from '../lib/types';

interface Props {
  onSubmit: (goal: Goal) => void;
}

export default function GoalForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      deadline: new Date(deadline),
    };
    onSubmit(newGoal);
    setTitle('');
    setTargetAmount('');
    setDeadline('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Goal Title"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        placeholder="Target Amount"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Add Goal
      </button>
    </form>
  );
}