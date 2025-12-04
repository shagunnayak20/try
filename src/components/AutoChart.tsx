import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AutoChartProps {
  column: string;
  type: string;
  data: any[];
}

export default function AutoChart({ column, type, data }: AutoChartProps) {
  const generateChartData = () => {
    if (type === 'category') {
      const counts: Record<string, number> = {};
      data.forEach((row) => {
        const value = row[column];
        if (value) {
          counts[value] = (counts[value] || 0) + 1;
        }
      });

      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    }

    if (type === 'number') {
      return data
        .map((row, index) => ({
          index: index + 1,
          value: parseFloat(row[column]) || 0,
        }))
        .filter((item) => !isNaN(item.value));
    }

    if (type === 'date') {
      const dateCounts: Record<string, number> = {};
      data.forEach((row) => {
        const dateValue = row[column];
        if (dateValue) {
          const date = dateValue.split('T')[0];
          dateCounts[date] = (dateCounts[date] || 0) + 1;
        }
      });

      return Object.entries(dateCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    return [];
  };

  const chartData = generateChartData();

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{column}</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {column}
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({type})
        </span>
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        {type === 'category' ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Count" />
          </BarChart>
        ) : type === 'number' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" label={{ value: 'Index', position: 'insideBottom', offset: -5 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#10b981" name={column} />
          </LineChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8b5cf6" name="Count" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
