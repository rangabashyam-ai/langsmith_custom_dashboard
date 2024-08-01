from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import random
import uvicorn
import threading
import logging
from Dashboard import GetData, FineTuneData, DataHandler
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI()
# Mounting static directory to serve images
app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Sample DataFrame
df, names_count, run_types_count = GetData(days=7, hours=5, minutes=30, seconds=0)
df.to_csv('LangsmithData.csv')

data_handler = DataHandler(df)
thread = threading.Thread(target=data_handler.Run)
thread.start()

@app.get("/", response_class=HTMLResponse)
async def index():
    with open("./templates/index.html", "r") as f:
        return HTMLResponse(content=f.read(), status_code=200)

# @app.get("/data")
# async def data():
#     global df
#     try:
#         # Update the DataFrame with new random data
#         df = data_handler.ReturnData()
        
#         # Ensure all data is string-encoded to avoid issues
#         df = df.map(lambda x: str(x))

#         return df.to_json(orient='split')
#     except Exception as e:
#         logging.error(f"Error while updating DataFrame: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")
@app.get("/data")
async def data():
    global df
    try:
        df = data_handler.ReturnData()

        # Example transformation for bar chart
        bar_chart_data = [
            {"name": "Category 1", "value": 4000},
            {"name": "Category 2", "value": 3000},
        ]

        # Example transformation for pie chart
        pie_chart_data = [
            {"name": "Group A", "value": 400, "color": "#8884d8"},
            {"name": "Group B", "value": 300, "color": "#82ca9d"},
        ]

        # Convert DataFrame to list of dictionaries
        table_data = df.to_dict(orient='records')

        return {
            "barChartData": bar_chart_data,
            "pieChartData": pie_chart_data,
            "tableData": table_data,
            "progressValue": 50
        }
    except Exception as e:
        logging.error(f"Error while updating DataFrame: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)


