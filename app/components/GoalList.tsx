'use client';  // Add this line at the top of the file

import { Goal } from '../lib/types';

interface Props {
  goals: Goal[];
  onUpdate: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export default function GoalList({ goals, onUpdate, onDelete }: Props) {
  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="p-4 border rounded">
          <h3 className="font-bold">{goal.title}</h3>
          <p>Target: ${goal.targetAmount}</p>
          <p>Current: ${goal.currentAmount}</p>
          <p>Deadline: {goal.deadline.toLocaleDateString()}</p>
          <input
            type="number"
            placeholder="Add amount"
            className="mt-2 p-1 border rounded"
            onBlur={(e) => {
              const amount = parseFloat(e.target.value);
              if (!isNaN(amount)) {
                onUpdate({
                  ...goal,
                  currentAmount: goal.currentAmount + amount,
                });
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={() => onDelete(goal.id)}
            className="ml-2 p-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}