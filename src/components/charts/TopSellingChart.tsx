// src/components/charts/TopSellingChart.tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell // Pour couleurs personnalisées si besoin
} from 'recharts';

export interface TopSellingProductData {
  name: string;
  quantity: number;
}

interface TopSellingChartProps {
  data: TopSellingProductData[];
  title?: string;
}

// Couleurs de base (vous pouvez les étendre ou les personnaliser)
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28', '#FF8042'];

const TopSellingChart: React.FC<TopSellingChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 italic">
        Pas de données de vente disponibles pour le graphique.
      </div>
    );
  }

  // Trier les données par quantité décroissante et prendre les X premiers (ex: top 5)
  const sortedData = [...data]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5); // Affiche le top 5, ajuster si besoin

  return (
    <div className="h-72 md:h-80 w-full"> {/* Hauteur ajustable */}
      {title && <h3 className="text-md font-semibold text-gray-700 mb-3 text-center">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical" // Important pour barres horizontales
          data={sortedData}
          margin={{
            top: 5,
            right: 30,
            left: 70, // Laisser de la place pour les labels longs des produits
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis type="number" stroke="#9ca3af" /> {/* Axe des quantités */}
          <YAxis
            dataKey="name"
            type="category"
            stroke="#9ca3af"
            width={100} // Ajuster la largeur pour les noms de produits
            tick={{ fontSize: 10 }}
             // Pourrait être nécessaire si les noms sont très longs :
            // tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 12)}...` : value}
          />
          <Tooltip
            cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }}
            formatter={(value: number) => [`${value} Unités`, 'Quantité vendue']}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="quantity" name="Quantité Vendue" fill="#8884d8" barSize={20}>
            {sortedData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSellingChart;