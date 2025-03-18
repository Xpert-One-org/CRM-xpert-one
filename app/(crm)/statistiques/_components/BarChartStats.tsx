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
} from 'recharts';

type ChartDataPoint = {
  name: string;
  [key: string]: string | number;
};

type BarChartStatProps = {
  data: ChartDataPoint[];
  dataKey: string;
  color?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
};

const BarChartStat: React.FC<BarChartStatProps> = ({
  data,
  dataKey,
  color = '#248a8d',
  yAxisFormatter,
  tooltipFormatter,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={yAxisFormatter} />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartStat;
