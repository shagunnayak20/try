# Quick Start Guide

## Running the Application

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will be available at: **http://localhost:8000**

### Step 2: Start the Frontend

Open a new terminal (keep backend running) and run:

```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### Step 3: Upload Data

1. Open **http://localhost:5173** in your browser
2. Drag and drop the included `sample-data.csv` or your own CSV/Excel file
3. Watch as interactive charts are automatically generated

## What You'll See

The application will automatically:
- Detect column types (numbers, categories, dates)
- Generate appropriate charts for each column
- Create interactive filters in the sidebar
- Update all charts in real-time as you filter

## Testing with Sample Data

A sample CSV file (`sample-data.csv`) is included in the project root with:
- Date column (time series)
- Product and Region (categorical data)
- Sales and Quantity (numeric data)
- Customer_Type (categorical filter)

## Key Features

- **Drag & Drop Upload**: Easy file upload interface
- **Auto-Detection**: Smart column type recognition
- **Multiple Chart Types**: Bar, Line, and Time Series
- **Real-time Filters**: Interactive sidebar with instant updates
- **Responsive Layout**: Works on all screen sizes

## Troubleshooting

**Backend not starting?**
- Make sure Python 3.8+ is installed
- Install dependencies: `pip install -r requirements.txt`

**Frontend not starting?**
- Make sure Node.js 16+ is installed
- Install dependencies: `npm install`

**CORS errors?**
- Ensure backend is running on port 8000
- Ensure frontend is running on port 5173

**Charts not showing?**
- Verify your file has valid data
- Check browser console for errors
- Ensure backend successfully processed the file
