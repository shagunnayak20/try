import { useState } from 'react';
import AutoChart from './AutoChart';
import Filters from './Filters';

interface DashboardProps {
  schema: Record<string, string>;
  data: any[];
  columns: string[];
}

export default function Dashboard({ schema, data, columns }: DashboardProps) {
  const [filteredData, setFilteredData] = useState(data);

  const handleFilterChange = (newFilteredData: any[]) => {
    setFilteredData(newFilteredData);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Filters schema={schema} data={data} onFilterChange={handleFilterChange} />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Data Visualization Dashboard
          </h1>
          <p className="text-gray-600">
            Showing {filteredData.length} of {data.length} records
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {columns.map((column) => (
            <AutoChart
              key={column}
              column={column}
              type={schema[column]}
              data={filteredData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
