from flask import Flask, render_template, jsonify, abort
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_caching import Cache
import pandas as pd
import threading
import logging
from Dashboard import GetData, DataHandler
from pathlib import Path
import gc

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure Cache
app.config['CACHE_TYPE'] = 'simple'  # Consider using Redis or Memcached in production
app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # Cache timeout in seconds
cache = Cache(app)

# Logging configuration
logging.basicConfig(level=logging.INFO)

# Get initial data and keep it in memory
logging.info("[INFO] Fetching Data")
df, names_count, run_types_count = GetData(days=10, hours=5, minutes=30, seconds=0)

# Initialize DataHandler with DataFrame
data_handler = DataHandler(df)

# Start DataHandler thread
def start_data_handler():
    try:
        data_handler.Run()
    except Exception as e:
        logging.error(f"Error in data handler thread: {e}")

logging.info("[INFO] Starting DataHandler Thread")
#thread = threading.Thread(target=start_data_handler, daemon=True)
#thread.start()

# Background task to clean up memory
def memory_cleanup():
    gc.collect()

# Route to fetch data and return processed results
@app.route("/data")
@cache.cached(timeout=300)  # Cache API response for 5 minutes
def data():
    global df
    try:
        # Fetch updated data from DataHandler (still in memory)
        df = data_handler.ReturnData()

        # Ensure 'Time' column exists and process it
        if 'Time' in df.columns:
            try:
                df['Time'] = pd.to_datetime(df['Time'], format="%H:%M:%S %m %d %Y", errors='coerce', cache=True)
                invalid_times = df['Time'].isnull().sum()
                if invalid_times > 0:
                    logging.warning(f"Invalid date formats found: {invalid_times}")
                df.dropna(subset=['Time'], inplace=True)
            except Exception as e:
                logging.error(f"Error parsing 'Time' column: {e}")
                abort(500, description=f"Time parsing error: {e}")
        else:
            logging.error("'Time' column missing")
            abort(500, description="'Time' column missing")

        # Set 'Time' as the index
        df.set_index('Time', inplace=True)

        # Process bar chart data
        bar_chart_data = df.resample('H').size().reset_index(name='Number of Requests')
        bar_chart_data.rename(columns={"Time": "name", "Number of Requests": "value"}, inplace=True)

        # Process pie chart data for Status, Names, and Run Types
        status_counts = df['Status'].value_counts().to_dict()
        pie_chart_data_status = [{"name": status, "value": count} for status, count in status_counts.items()]
        pie_chart_data_names_count = [{"name": name, "value": count} for name, count in names_count.items()]
        pie_chart_data_run_types_count = [{"name": run_type, "value": count} for run_type, count in run_types_count.items()]

        # Convert the DataFrame to a dictionary for table data
        table_data = df.reset_index().to_dict(orient='records')

        # Clear unnecessary objects to free memory
        memory_cleanup()

        # Return the processed data as a JSON response
        return jsonify({
            "barChartData": bar_chart_data.to_dict(orient='records'),
            "pieChartDataStatus": pie_chart_data_status,
            "pieChartDataNamesCount": pie_chart_data_names_count,
            "pieChartDataRunTypesCount": pie_chart_data_run_types_count,
            "tableData": table_data,
            "progressValue": 50  # Placeholder for progress; adjust as necessary
        })

    except Exception as e:
        logging.error(f"Error while updating DataFrame: {e}")
        abort(500, description="Internal Server Error")
@app.route("/analytics")
def analytics():
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
        abort(500, description="Internal Server Error")

#route to Home Page
@app.route('/')
def hello_world():
    return "<h1>Hey there! <br> Custom Dashboard backendend script running here!!</h1>"
    
if __name__ == '__main__':
    # Use a production-ready server like Gunicorn for better performance
    app.run(host='0.0.0.0', port=5000, debug=True)
    
#run with the command - gunicorn -w 4 -b 0.0.0.0:5000 test:app
