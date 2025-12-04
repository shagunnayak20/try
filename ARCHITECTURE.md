# System Architecture

## Overview

This is a full-stack data visualization application with a clear separation between backend data processing and frontend visualization.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                   Port: 5173 (Vite)                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐   ┌──────────────┐   ┌─────────────┐  │
│  │ FileUpload  │   │  Dashboard   │   │   Filters   │  │
│  │ Component   │───│  Component   │───│  Component  │  │
│  └─────────────┘   └──────────────┘   └─────────────┘  │
│         │                  │                             │
│         │                  ├──────────────┐              │
│         │                  │              │              │
│         │           ┌──────▼──────┐       │              │
│         │           │  AutoChart  │       │              │
│         │           │  Component  │       │              │
│         │           └─────────────┘       │              │
│         │                                 │              │
└─────────┼─────────────────────────────────┼──────────────┘
          │                                 │
          │ HTTP POST /upload               │ Filter Events
          │ (multipart/form-data)           │ (client-side)
          │                                 │
┌─────────▼─────────────────────────────────▼──────────────┐
│                 BACKEND (FastAPI)                         │
│                    Port: 8000                             │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │              POST /upload                        │    │
│  │  1. Receive file (CSV/Excel)                     │    │
│  │  2. Detect file type                             │    │
│  │  3. Parse with Pandas                            │    │
│  │  4. Auto-detect column types                     │    │
│  │     - Numeric → "number"                         │    │
│  │     - String → "category"                        │    │
│  │     - DateTime → "date"                          │    │
│  │  5. Return JSON: {schema, data, columns}         │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  Libraries: Pandas, FastAPI, Uvicorn                      │
└────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. File Upload Flow

```
User selects file
    │
    ▼
FileUpload Component
    │
    ├─ Validates file type (.csv, .xlsx, .xls)
    │
    ▼
HTTP POST to /upload
    │
    ▼
FastAPI Backend
    │
    ├─ Reads file content
    ├─ Parses with Pandas
    ├─ Detects column types
    │
    ▼
Returns JSON Response:
{
  schema: { col1: "number", col2: "category", ... },
  data: [...],
  columns: [...]
}
    │
    ▼
App Component stores data
    │
    ▼
Dashboard Component renders
```

### 2. Chart Generation Flow

```
Dashboard receives data
    │
    ▼
For each column:
    │
    ├─ Check schema type
    │
    ├─ Category → AutoChart renders BarChart
    │   └─ Counts unique values
    │   └─ Shows top 10 categories
    │
    ├─ Number → AutoChart renders LineChart
    │   └─ Plots values by index
    │
    └─ Date → AutoChart renders LineChart
        └─ Groups by date
        └─ Shows counts over time
```

### 3. Filter Flow

```
Filters Component
    │
    ├─ Detects filterable columns
    │   ├─ Category columns → Dropdowns
    │   └─ Number columns → Min/Max inputs
    │
    ▼
User changes filter
    │
    ▼
Filter state updates (React state)
    │
    ▼
Apply filters to data (client-side)
    │
    ▼
Pass filtered data to Dashboard
    │
    ▼
All AutoChart components re-render
    │
    ▼
Charts update instantly
```

## Component Hierarchy

```
App
├── FileUpload
│   └── Handles file selection and upload
│
└── Dashboard
    ├── Filters (Sidebar)
    │   ├── Category filters
    │   └── Numeric filters
    │
    └── Chart Grid
        └── AutoChart (for each column)
            ├── BarChart (category)
            ├── LineChart (number)
            └── LineChart (date)
```

## Key Design Decisions

### Backend (Python)
- **FastAPI**: Chosen for high performance and automatic API docs
- **Pandas**: Industry standard for data analysis and type detection
- **CORS Enabled**: Allows frontend to make requests from different port

### Frontend (React)
- **TypeScript**: Type safety for better developer experience
- **Recharts**: Powerful and flexible charting library
- **Client-side Filtering**: Fast, responsive UX without server round-trips
- **Component-based**: Modular, reusable architecture

### Data Processing
- **Auto-detection**: Uses Pandas type inference for intelligence
- **No persistence**: Data only exists during session (stateless)
- **Efficient filtering**: All filtering happens in-browser

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React 18 | UI rendering |
| Type Safety | TypeScript | Developer experience |
| Charts | Recharts | Data visualization |
| Styling | Tailwind CSS | Responsive design |
| Build Tool | Vite | Fast development |
| Backend Framework | FastAPI | API server |
| Data Processing | Pandas | Data analysis |
| Server | Uvicorn | ASGI server |

## Security Considerations

- **File Validation**: Only CSV and Excel files accepted
- **CORS**: Configured for local development (restrict in production)
- **Error Handling**: Graceful error messages without exposing internals
- **No Persistence**: Data not stored, reducing security surface

## Performance Optimizations

- **Client-side Filtering**: No server round-trips for filtering
- **Efficient Chart Rendering**: Only re-renders affected charts
- **Lazy Loading**: Components loaded as needed
- **Data Truncation**: Limited to top 10 for category charts

## Future Enhancements

- Add data persistence with database
- User authentication and saved dashboards
- More chart types (pie, scatter, heatmap)
- Export capabilities (PNG, PDF)
- Real-time data streaming
- Custom chart configuration UI
