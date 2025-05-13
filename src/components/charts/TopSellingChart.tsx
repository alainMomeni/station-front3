// src/components/charts/TopSellingChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface TopSellingProductData {
  name: string;
  quantity: number;
}

interface TopSellingChartProps {
  data: TopSellingProductData[];
  title?: string;
}

const TopSellingChart: React.FC<TopSellingChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 italic">
        Pas de données de vente disponibles
      </div>
    );
  }

  // Trier et limiter aux 5 premiers
  const sortedData = [...data]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const chartData = {
    labels: sortedData.map(item => item.name),
    datasets: [
      {
        label: 'Quantité vendue',
        data: sortedData.map(item => item.quantity),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)', // Purple
          'rgba(168, 85, 247, 0.8)',
          'rgba(192, 132, 252, 0.8)',
          'rgba(216, 180, 254, 0.8)',
          'rgba(233, 213, 255, 0.8)',
        ],
        borderColor: [
          'rgb(147, 51, 234)', // Purple
          'rgb(168, 85, 247)',
          'rgb(192, 132, 252)',
          'rgb(216, 180, 254)',
          'rgb(233, 213, 255)',
        ],
        borderWidth: 1,
        borderRadius: 6,
    }]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: !!title,
        text: title || '',
        font: {
          size: 14,
          family: "'Inter', sans-serif",
        },
        color: '#4B5563', // text-gray-600
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        bodyFont: {
          size: 13
        },
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Quantité: ${context.raw} unités`
        }
      }
    },
    scales: {
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      x: {
        grid: {
          color: '#E5E7EB'
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      }
    }
  };

  return (
    <div className="h-[300px] w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TopSellingChart;