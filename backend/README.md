# Backend Setup

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Running the Server

```bash
uvicorn main:app --reload
```

The API will be available at: `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `POST /upload` - Upload CSV or Excel file

## Example Response

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
