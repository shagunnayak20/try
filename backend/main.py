from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from typing import Dict, List, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def detect_column_type(series: pd.Series) -> str:
    if pd.api.types.is_numeric_dtype(series):
        return "number"
    elif pd.api.types.is_datetime64_any_dtype(series):
        return "date"
    else:
        try:
            pd.to_datetime(series, errors='raise')
            return "date"
        except:
            return "category"

def process_dataframe(df: pd.DataFrame) -> Dict[str, Any]:
    schema = {}

    for column in df.columns:
        col_type = detect_column_type(df[column])
        schema[column] = col_type

        if col_type == "date":
            df[column] = pd.to_datetime(df[column], errors='coerce')
            df[column] = df[column].astype(str)

    df = df.fillna("")

    data = df.to_dict(orient='records')

    return {
        "schema": schema,
        "data": data,
        "columns": list(df.columns)
    }

@app.get("/")
def read_root():
    return {"message": "Data Visualization Backend API"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload CSV or Excel files."
            )

        if df.empty:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")

        result = process_dataframe(df)

        return result

    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="The file is empty or corrupted.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
