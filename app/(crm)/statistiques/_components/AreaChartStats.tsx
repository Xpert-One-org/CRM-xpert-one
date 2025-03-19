import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type ChartDataPoint = {
  name: string;
  [key: string]: string | number;
};

type AreaChartStatProps = {
  data: ChartDataPoint[];
  dataKey: string;
  color?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
};

const AreaChartStat: React.FC<AreaChartStatProps> = ({
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
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={yAxisFormatter} />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartStat;
