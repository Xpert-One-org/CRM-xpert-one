import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

type PieDataPoint = {
  name: string;
  value: number;
};

type PieChartStatProps = {
  data: PieDataPoint[];
  colors?: string[];
  title?: string;
  threshold?: number;
};

const COLORS = [
  '#0088FE', // bleu
  '#00C49F', // vert
  '#FFBB28', // jaune
  '#FF8042', // orange
  '#8884d8', // violet
  '#82ca9d', // vert clair
  '#ffc658', // jaune clair
  '#8dd1e1', // bleu clair
  '#a4de6c', // vert foncé
  '#d0ed57', // vert lime
  '#f56954', // rouge
  '#7158e2', // indigo
  '#ff6b6b', // rose
  '#9b59b6', // violet
  '#3498db', // bleu
  '#2ecc71', // vert
  '#f1c40f', // jaune
  '#e74c3c', // rouge
  '#c0392b', // rouge foncé
  '#9b59b6', // violet
  '#8e44ad', // violet foncé
  '#3498db', // bleu
  '#2980b9', // bleu foncé
];

// Fonction pour tronquer le texte
const truncateText = (text: string, maxLength: number = 40): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

const PieChartStat: React.FC<PieChartStatProps> = ({
  data,
  colors = COLORS,
  title = 'Répartition des données',
  threshold = 2, // Par défaut, regrouper les valeurs < 3%
}) => {
  const [viewMode, setViewMode] = useState<'pie' | 'bar'>('pie');

  if (!data || data.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        Aucune donnée disponible
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Préparer les données en regroupant les petites valeurs
  const processedData = [...data]
    .sort((a, b) => b.value - a.value) // Trier par valeur décroissante
    .reduce((acc: PieDataPoint[], item) => {
      const percent = (item.value / total) * 100;

      if (percent < threshold) {
        // Trouver si "Autres" existe déjà
        const othersIndex = acc.findIndex((i) => i.name === 'Autres');
        if (othersIndex >= 0) {
          acc[othersIndex].value += item.value;
        } else {
          acc.push({ name: 'Autres', value: item.value });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, []);

  // Trier à nouveau les données pour que "Autres" soit à la fin
  const sortedData = processedData.sort((a, b) => {
    if (a.name === 'Autres') return 1;
    if (b.name === 'Autres') return -1;
    return b.value - a.value;
  });

  const barData = [...sortedData]
    .sort((a, b) => b.value - a.value)
    .map((item) => ({
      ...item,
      displayName: truncateText(item.name, 50),
    }));

  const renderLegendContent = (props: any) => {
    const { payload } = props;

    return (
      <ul className="m-0 flex flex-col p-0 text-xs">
        {payload.map((entry: any, index: number) => {
          const itemValue = entry.payload.value;
          const percentage = ((itemValue / total) * 100).toFixed(1);

          return (
            <li key={`item-${index}`} className="mb-1 flex items-center">
              <div
                className="mr-2 inline-block size-3"
                style={{ backgroundColor: entry.color }}
              />
              <span
                className="truncate"
                title={`${entry.value}: ${itemValue} (${percentage}%)`}
              >
                {truncateText(entry.value, 25)} ({percentage}%)
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  // Ne pas afficher les labels sur le camembert - ils sont trop nombreux et encombrants
  // Nous utilisons plutôt une légende bien formatée
  const renderCustomizedLabel = () => null;

  // Tooltip personnalisé pour afficher le nom complet et la valeur
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="rounded border border-gray-200 bg-white p-2 shadow-md">
          <p className="font-semibold">{data.name}</p>
          <p>{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // Personnaliser le nom affiché sur l'axe Y du graphique à barres
  const renderCustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const item = barData.find((d) => d.displayName === payload.value);
    const fullName = item ? item.name : payload.value;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-5} y={0} dy={3} textAnchor="end" fill="#666" fontSize={11}>
          <title>{fullName}</title>
          {truncateText(payload.value, 25)}
        </text>
      </g>
    );
  };

  return (
    <div className="flex size-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-medium"></div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('pie')}
            className={`rounded px-3 py-1 ${
              viewMode === 'pie'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Camembert
          </button>
          <button
            onClick={() => setViewMode('bar')}
            className={`rounded px-3 py-1 ${
              viewMode === 'bar'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Barres
          </button>
        </div>
      </div>

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'pie' ? (
            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Pie
                data={sortedData}
                cx="45%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={140} // Agrandi le camembert
                fill="#8884d8"
                dataKey="value"
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                content={renderLegendContent}
                wrapperStyle={{
                  paddingLeft: 20,
                  width: '35%',
                  maxHeight: 300,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              />
            </PieChart>
          ) : (
            <BarChart
              layout="vertical"
              data={barData}
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => value.toString()}
              />
              <YAxis
                type="category"
                dataKey="displayName"
                tick={renderCustomizedAxisTick}
                width={120}
                interval={0} // Affiche toutes les étiquettes
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Valeur">
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartStat;
