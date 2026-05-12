import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

const RADIAN = Math.PI / 180;

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
  if (percentage < 5) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      className="text-xs font-semibold" fontSize={11}>
      {`${percentage}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
        <span className="text-sm font-semibold text-gray-800">{d.categoryName}</span>
      </div>
      <p className="text-sm text-gray-600">{formatCurrency(d.total)}</p>
      <p className="text-xs text-gray-400">{d.percentage}% of total</p>
    </div>
  );
};

const ExpensePieChart = ({ data = [] }) => {
  if (!data.length) {
    return <EmptyState icon="🥧" title="No expense data" description="Add some expense transactions to see the breakdown" />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={110}
          paddingAngle={3}
          dataKey="total"
          labelLine={false}
          label={CustomLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value, entry) => (
            <span className="text-xs text-gray-600">{entry.payload.categoryName}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensePieChart;