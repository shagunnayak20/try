# Automated Data Visualization & Dashboard Generator

A full-stack web application that automatically generates interactive dashboards from CSV or Excel files with smart, auto-detected charts.

## Features

- **Smart File Upload**: Drag-and-drop or click to upload CSV/Excel files
- **Auto-Detection**: Automatically detects column types (numeric, category, date)
- **Dynamic Charts**:
  - Bar charts for categorical data (showing count of unique values)
  - Line charts for numeric data
  - Time series charts for date columns
- **Interactive Filters**:
  - Category dropdowns
  - Numeric range sliders
  - Real-time chart updates
- **Responsive Design**: Clean grid layout with sidebar filters

## Tech Stack

### Backend
- **Python FastAPI**: High-performance API framework
- **Pandas**: Data processing and analysis
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Recharts**: Powerful charting library
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **Lucide React**: Beautiful icons

## Project Structure

```
/backend
  ├── main.py              # FastAPI server with upload endpoint
  ├── requirements.txt     # Python dependencies
  └── README.md           # Backend setup instructions

/src
  ├── components/
  │   ├── FileUpload.tsx   # Drag-and-drop file upload
  │   ├── Dashboard.tsx    # Main dashboard layout
  │   ├── AutoChart.tsx    # Dynamic chart renderer
  │   └── Filters.tsx      # Sidebar filter controls
  ├── App.tsx             # Main application component
  └── main.tsx            # React entry point
```

## Getting Started

### Prerequisites

- **Python 3.8+**: For backend
- **Node.js 16+**: For frontend
- **pip**: Python package manager
- **npm**: Node package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Install Node dependencies (from project root):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. **Start Both Servers**:
   - Backend: `uvicorn main:app --reload` (in `/backend`)
   - Frontend: `npm run dev` (in project root)

2. **Upload Your Data**:
   - Open the frontend in your browser
   - Drag and drop a CSV or Excel file, or click to browse
   - Supported formats: `.csv`, `.xlsx`, `.xls`

3. **Explore Your Dashboard**:
   - Charts are automatically generated based on your data
   - Use the left sidebar to filter data
   - All charts update in real-time as you apply filters

4. **Upload New Data**:
   - Click "Upload New File" button in the top-right corner

## How It Works

### Data Type Detection

The backend automatically analyzes each column and classifies it as:
- **Number**: Numeric columns (int, float)
- **Category**: Text/string columns
- **Date**: Date and datetime columns

### Chart Generation

Based on detected types, the frontend automatically creates:
- **Bar Charts**: For categories (shows count of each unique value)
- **Line Charts**: For numeric data (plots values by index)
- **Time Series**: For dates (shows counts over time)

### Filtering

- **Category Filters**: Dropdown selection for each categorical column
- **Numeric Filters**: Min/max range inputs for numeric columns
- **Real-time Updates**: All charts refresh instantly when filters change

## Sample Data

Create a sample CSV file to test:

```csv
Date,Product,Sales,Region,Quantity
2024-01-01,Widget A,1500,North,45
2024-01-02,Widget B,2300,South,67
2024-01-03,Widget A,1800,East,52
2024-01-04,Widget C,2100,West,61
2024-01-05,Widget B,1900,North,48
```

This will generate:
- Time series for Date
- Bar chart for Product (count of each product)
- Line chart for Sales
- Bar chart for Region
- Line chart for Quantity

## API Endpoints

### POST /upload
Uploads and processes a data file.

**Request**:
- Method: `POST`
- Body: `multipart/form-data` with file field

**Response**:
```json
{
  "schema": {
    "Column1": "number",
    "Column2": "category",
    "Column3": "date"
  },
  "data": [...],
  "columns": ["Column1", "Column2", "Column3"]
}
```

## Building for Production

```bash
npm run build
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend is running on port 8000 and includes CORS middleware (already configured).

### Port Conflicts
- Backend default: `8000` (can be changed in `main.py`)
- Frontend default: `5173` (Vite default)

### File Upload Errors
- Ensure files are valid CSV or Excel format
- Check that files are not empty
- Verify file size is reasonable (backend has no explicit limit but large files may take time)

## License

MIT License
