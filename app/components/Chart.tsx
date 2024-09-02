'use client';  // Add this line at the top of the file

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Goal } from '../lib/types';

interface Props {
  goals: Goal[];
}

export default function Chart({ goals }: Props) {
  const data = goals.map(goal => ({
    name: goal.title,
    current: goal.currentAmount,
    target: goal.targetAmount,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="current" fill="#8884d8" />
        <Bar dataKey="target" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}