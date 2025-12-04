import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

interface FiltersProps {
  schema: Record<string, string>;
  data: any[];
  onFilterChange: (filteredData: any[]) => void;
}

export default function Filters({ schema, data, onFilterChange }: FiltersProps) {
  const [categoryFilters, setCategoryFilters] = useState<Record<string, string>>({});
  const [numericFilters, setNumericFilters] = useState<Record<string, { min: number; max: number }>>({});

  useEffect(() => {
    applyFilters();
  }, [categoryFilters, numericFilters, data]);

  const applyFilters = () => {
    let filtered = [...data];

    Object.entries(categoryFilters).forEach(([column, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter((row) => row[column] === value);
      }
    });

    Object.entries(numericFilters).forEach(([column, range]) => {
      filtered = filtered.filter((row) => {
        const val = parseFloat(row[column]);
        return !isNaN(val) && val >= range.min && val <= range.max;
      });
    });

    onFilterChange(filtered);
  };

  const getCategoryValues = (column: string): string[] => {
    const values = new Set<string>();
    data.forEach((row) => {
      if (row[column]) {
        values.add(row[column]);
      }
    });
    return Array.from(values).sort();
  };

  const getNumericRange = (column: string): { min: number; max: number } => {
    const values = data
      .map((row) => parseFloat(row[column]))
      .filter((val) => !isNaN(val));

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  const handleCategoryChange = (column: string, value: string) => {
    setCategoryFilters({
      ...categoryFilters,
      [column]: value,
    });
  };

  const handleNumericChange = (column: string, type: 'min' | 'max', value: number) => {
    const range = numericFilters[column] || getNumericRange(column);
    setNumericFilters({
      ...numericFilters,
      [column]: {
        ...range,
        [type]: value,
      },
    });
  };

  const resetFilters = () => {
    setCategoryFilters({});
    setNumericFilters({});
  };

  const categoryColumns = Object.entries(schema).filter(([, type]) => type === 'category');
  const numericColumns = Object.entries(schema).filter(([, type]) => type === 'number');

  return (
    <div className="w-64 bg-white p-6 shadow-lg h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        </div>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Reset
        </button>
      </div>

      {categoryColumns.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
          {categoryColumns.map(([column]) => (
            <div key={column} className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">{column}</label>
              <select
                value={categoryFilters[column] || 'all'}
                onChange={(e) => handleCategoryChange(column, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                {getCategoryValues(column).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {numericColumns.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Numeric Ranges</h3>
          {numericColumns.map(([column]) => {
            const range = getNumericRange(column);
            const currentFilter = numericFilters[column] || range;

            return (
              <div key={column} className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">{column}</label>
                <div className="space-y-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={currentFilter.min}
                      onChange={(e) =>
                        handleNumericChange(column, 'min', parseFloat(e.target.value))
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={currentFilter.max}
                      onChange={(e) =>
                        handleNumericChange(column, 'max', parseFloat(e.target.value))
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {categoryColumns.length === 0 && numericColumns.length === 0 && (
        <p className="text-sm text-gray-500">No filters available</p>
      )}
    </div>
  );
}
