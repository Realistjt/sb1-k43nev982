import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useStore } from '../store/useStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const ProgressTracker: React.FC = () => {
  const { questions = [], flashcards = [] } = useStore();

  if (!Array.isArray(questions) || !Array.isArray(flashcards)) {
    return null;
  }

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString();
  }).reverse();

  const questionsPerDay = last7Days.map(date => {
    return questions.filter(q => {
      const qDate = new Date(q.timestamp).toLocaleDateString();
      return qDate === date;
    }).length;
  });

  const data = {
    labels: last7Days,
    datasets: [
      {
        label: 'Questions Asked',
        data: questionsPerDay,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
      <div className="mb-4">
        <Line data={data} />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Questions</p>
          <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Flashcards Created</p>
          <p className="text-2xl font-bold text-green-600">{flashcards.length}</p>
        </div>
      </div>
    </div>
  );
};