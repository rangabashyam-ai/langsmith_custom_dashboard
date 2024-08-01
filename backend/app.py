# from fastapi import FastAPI, HTTPException
# from fastapi.responses import HTMLResponse
# from fastapi.middleware.cors import CORSMiddleware
# import pandas as pd
# import random
# import uvicorn
# import threading
# import logging
# from Dashboard import GetData, FineTuneData, DataHandler
# from fastapi.staticfiles import StaticFiles
# from pathlib import Path

# app = FastAPI()
# # Mounting static directory to serve images
# app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"), name="static")


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize logging
# logging.basicConfig(level=logging.INFO)

# # Sample DataFrame
# df, names_count, run_types_count = GetData(days=30, hours=5, minutes=30, seconds=0)
# df.to_csv('LangsmithData.csv')

# data_handler = DataHandler(df)
# thread = threading.Thread(target=data_handler.Run)
# thread.start()

# @app.get("/", response_class=HTMLResponse)
# async def index():
#     with open("./templates/index.html", "r") as f:
#         return HTMLResponse(content=f.read(), status_code=200)

# # @app.get("/data")
# # async def data():
# #     global df
# #     try:
# #         # Update the DataFrame with new random data
# #         df = data_handler.ReturnData()
        
# #         # Ensure all data is string-encoded to avoid issues
# #         df = df.map(lambda x: str(x))

# #         return df.to_json(orient='split')
# #     except Exception as e:
# #         logging.error(f"Error while updating DataFrame: {e}")
# #         raise HTTPException(status_code=500, detail="Internal Server Error")

# @app.get("/", response_class=HTMLResponse)
# async def index():
#     with open("./templates/index.html", "r") as f:
#         return HTMLResponse(content=f.read(), status_code=200)

# @app.get("/data")
# async def data():
#     try:
#         # Update the DataFrame with new random data
#         df = data_handler.ReturnData()
        
#         # Ensure all data is string-encoded to avoid issues
#         df = df.applymap(str)

#         return df.to_json(orient='split')
#     except Exception as e:
#         logging.error(f"Error while updating DataFrame: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")


# if __name__ == '__main__':
#     uvicorn.run(app, host='127.0.0.1', port=8000)


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

df, names_count, run_types_count = GetData(days=30, hours=5, minutes=30, seconds=0)
df.to_csv('LangsmithData.csv')

data_handler = DataHandler(df)
thread = threading.Thread(target=data_handler.Run)
thread.start()

@app.get("/", response_class=HTMLResponse)
async def index():
    with open("./templates/index.html", "r") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.get("/data")
async def data():
    try:
        df = data_handler.ReturnData()
        df = df.map(str)
        return df.to_json(orient='split')
    except Exception as e:
        logging.error(f"Error while updating DataFrame: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)
