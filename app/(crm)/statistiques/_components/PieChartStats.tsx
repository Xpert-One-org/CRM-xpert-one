import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type PieDataPoint = {
  name: string;
  value: number;
};

type PieChartStatProps = {
  data: PieDataPoint[];
  colors?: string[];
};

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

const PieChartStat: React.FC<PieChartStatProps> = ({
  data,
  colors = COLORS,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        Aucune donnée disponible
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              `${value} (${((Number(value) / total) * 100).toFixed(0)}%)`,
              'Valeur',
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartStat;
