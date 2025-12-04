import { useState } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { Loader2 } from 'lucide-react';

interface DataResponse {
  schema: Record<string, string>;
  data: any[];
  columns: string[];
}

function App() {
  const [uploadedData, setUploadedData] = useState<DataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (data: DataResponse) => {
    setUploadedData(data);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleReset = () => {
    setUploadedData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!uploadedData ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Automated Data Visualization Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Upload your CSV or Excel file to generate interactive charts automatically
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="text-gray-600">Processing your file...</p>
            </div>
          ) : (
            <FileUpload onFileUpload={handleFileUpload} onLoading={handleLoading} />
          )}
        </div>
      ) : (
        <div className="relative h-screen">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Upload New File
            </button>
          </div>
          <Dashboard
            schema={uploadedData.schema}
            data={uploadedData.data}
            columns={uploadedData.columns}
          />
        </div>
      )}
    </div>
  );
}

export default App;
