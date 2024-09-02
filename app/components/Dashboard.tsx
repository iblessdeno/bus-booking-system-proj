'use client';  // Add this line at the top of the file

import React from 'react';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import Chart from './Chart';

export default function Dashboard() {
  return (
    <div>
      <GoalForm onSubmit={(goal) => console.log('New goal:', goal)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <GoalList goals={[]} onUpdate={() => {}} onDelete={() => {}} />
        <Chart goals={[]} />
      </div>
    </div>
  );
}