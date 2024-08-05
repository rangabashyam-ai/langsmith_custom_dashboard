from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import threading
import logging
import uvicorn
from Dashboard import GetData, DataHandler
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI()
app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

# Get data and save it to CSV
print("[INFO] Fetching Data")
df, names_count, run_types_count = GetData(days=3, hours=5, minutes=30, seconds=0)
df.to_csv(Path(__file__).parent / 'LangsmithData.csv')

# Initialize DataHandler
data_handler = DataHandler(df)

# Start DataHandler thread
def start_data_handler():
    try:
        data_handler.Run()
    except Exception as e:
        logging.error(f"Error in data handler thread: {e}")

print("[INFO] Starting Thread")
thread = threading.Thread(target=start_data_handler)
thread.start()

@app.get("/", response_class=HTMLResponse)
async def index():
    index_file = Path(__file__).parent / "templates" / "index.html"
    if index_file.exists():
        with open(index_file, "r") as f:
            return HTMLResponse(content=f.read(), status_code=200)
    else:
        logging.error("Index file not found")
        raise HTTPException(status_code=404, detail="Index file not found")


# @app.get("/data")
# async def data():
#     try:
#         global df, names_count, run_types_count
#         df = data_handler.ReturnData()
#         print(names_count)
#         print(run_types_count)

#         # Convert 'Time' column to datetime if it's not already
#         df['Time'] = pd.to_datetime(df['Time'])

#         # Set the time column as index
#         df.set_index('Time', inplace=True)

#         # Resample by hour (or any other period you prefer) and count the number of requests
#         bar_chart_data = df.resample('H').size().reset_index(name='Number of Requests')

#         # Rename columns for the bar chart
#         bar_chart_data = bar_chart_data.rename(columns={"Time": "name", "Number of Requests": "value"})

#         # Pie chart and table data (as before)
#         status_counts = df['Status'].value_counts().to_dict()
#         pie_chart_data = [{"name": status, "value": count} for status, count in status_counts.items()]
#         table_data = df.reset_index().to_dict(orient='records')  # Reset index for table display

#         return {
#             "barChartData": bar_chart_data.to_dict(orient='records'),
#             "pieChartData": pie_chart_data,
#             "tableData": table_data,
#             "progressValue": 50  # Example value
#         }
#     except Exception as e:
#         logging.error(f"Error while updating DataFrame: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/data")
async def data():
    global df
    try:
        global df, names_count, run_types_count
        df = data_handler.ReturnData()
        print(names_count)
        print(run_types_count)

        # Convert 'Time' column to datetime if it's not already
        df['Time'] = pd.to_datetime(df['Time'])

        # Set the time column as index
        df.set_index('Time', inplace=True)

        # Resample by hour (or any other period you prefer) and count the number of requests
        bar_chart_data = df.resample('H').size().reset_index(name='Number of Requests')

        # Rename columns for the bar chart
        bar_chart_data = bar_chart_data.rename(columns={"Time": "name", "Number of Requests": "value"})

        # Pie chart data
        status_counts = df['Status'].value_counts().to_dict()
        pie_chart_data_status = [{"name": status, "value": count} for status, count in status_counts.items()]

        # Add names_count and run_types_count pie chart data
        pie_chart_data_names_count = [{"name": name, "value": count} for name, count in names_count.items()]
        pie_chart_data_run_types_count = [{"name": run_type, "value": count} for run_type, count in run_types_count.items()]

        # Table data
        table_data = df.reset_index().to_dict(orient='records')  # Reset index for table display

        return {
            "barChartData": bar_chart_data.to_dict(orient='records'),
            "pieChartDataStatus": pie_chart_data_status,
            "pieChartDataNamesCount": pie_chart_data_names_count,
            "pieChartDataRunTypesCount": pie_chart_data_run_types_count,
            "tableData": table_data,
            "progressValue": 50  # Example value
        }
    except Exception as e:
        logging.error(f"Error while updating DataFrame: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/analytics")
async def analytics():
    global df
    try:
        average_tokens_per_question = df['TotalTokens'].mean()
        average_cost_per_question = df['TotalCost'].mean()
        total_cost = df['TotalCost'].sum()
        average_latency_per_question = df['Latency'].mean()

        return {
            "averageTokensPerQuestion": average_tokens_per_question,
            "averageCostPerQuestion": average_cost_per_question,
            "totalCost": total_cost,
            "averageLatencyPerQuestion": average_latency_per_question
        }
    except Exception as e:
        logging.error(f"Error while calculating analytics: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)
