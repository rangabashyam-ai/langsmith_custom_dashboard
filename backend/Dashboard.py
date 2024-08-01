#import streamlit as st
import pandas
import os
from langsmith import Client
from datetime import datetime, timedelta
import re
import time
import pytz

os.environ["LANGCHAIN_TRACING_V2"]="true"
os.environ["LANGCHAIN_ENDPOINT"]="https://api.smith.langchain.com"
# os.environ["LANGCHAIN_API_KEY"]="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"
# os.environ["LANGCHAIN_PROJECT"]="Multi-agent Collaboration"

# os.environ["LANGCHAIN_API_KEY"]="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"
# os.environ["LANGCHAIN_PROJECT"]="Convogene Ap"

os.environ["LANGCHAIN_API_KEY"] = "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"
os.environ["LANGCHAIN_PROJECT"] = "rag-infobell"

#st.set_page_config(layout="wide")
#st.title("Convogene Logs")
#placeholder = st.empty()
 
def UTC2IST(utc):
    timestamp_format = "%H:%M:%S %d %m %Y"
    utc_zone = pytz.timezone('UTC')
    ist_zone = pytz.timezone('Asia/Kolkata')

    utc_time = utc_zone.localize(utc)
    ist_time = utc_time.astimezone(ist_zone)
    
    return ist_time.strftime(timestamp_format)

def FineTuneData(runs):
    rows = []
    for run in runs:
        run_data = {}
        if run.error == None or run.end_time == None:
            run_data['Status'] = '✅'
        else:
            run_data['Status'] = '❗'
        run_data['TraceID'] = run.trace_id
        run_data['ID'] = run.id
        run_data['Name'] = run.name
        run_data['Type'] = run.run_type
        run_data['Time'] = UTC2IST(run.start_time)
        #run_data['Error'] = run.error
        if run.end_time == None or run.start_time == None:
            run_data['Latency'] = None
        else:
            gap = run.end_time - run.start_time
            run_data['Latency'] = str(round(gap.total_seconds(), 2)) + 's'

        run_data['TotalTokens'] = run.total_tokens
        run_data['PromptTokens'] = run.prompt_tokens
        run_data['CompletionTokens'] = run.completion_tokens
        run_data['TotalCost'] = run.total_cost
        run_data['PromptCost'] = run.prompt_cost
        run_data['CompletionCost'] = run.completion_cost
        run_data['Input'] = run.inputs
        run_data['Output'] = run.outputs

        rows.append(run_data)

    data = pandas.DataFrame(rows)
    return data

def GetData(days, hours, minutes, seconds):
    #print(f"[INFO] Last {days}days {hours}hours {minutes}minutes {seconds}seconds Data fetching")
    start_time = datetime.now() - timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds)

    client = Client()
    start = time.time()
    runs = list(
        client.list_runs(
            project_name = os.getenv('LANGCHAIN_PROJECT'),
            #run_type="llm",
            start_time=start_time,
            #is_root = True
        )
    )
    end = time.time()
    #print(f"[INFO] Total time taken to fetch Runs: {end-start}")

    root_runs = [run for run in runs if run.parent_run_id == None]
    data = FineTuneData(root_runs)
    non_root_runs = [run for run in runs if run not in root_runs]

    names = []
    run_types = []
    for run in non_root_runs:
        names.append(run.name)
        run_types.append(run.run_type)
    
    names_count = {item: names.count(item) for item in set(names)}
    run_types_count = {item: run_types.count(item) for item in set(run_types)}

    #print(f"[INFO] Last {days}days {hours}hours {minutes}minutes {seconds}seconds Data has been fetched")
    return data, names_count, run_types_count
    #data.to_csv('LangsmithData.csv')

class DataHandler:
    def __init__(self, data):
        print("[INFO] Initializing the Object")
        self.data = data
        self.recent_id = self.data['TraceID'][0]
        self.running_ids = set()
        print(f"[INFO] Recent ID: {self.recent_id}")
        # print(self.data.head())
        #self.ShowData()
    
    """def ShowData(self):
        print("[INFO] Showing Logs")
        data = self.data.drop(columns = ['ID', 'Type', 'TraceID'])
        #data = self.data.drop(self.data.columns[0], axis = 1)
        # print("[INFO] Showing Data")
        placeholder.dataframe(data)"""
    
    def ReturnData(self):
        data = self.data.drop(columns = ['ID', 'Type'])
        return data

    def Run(self):
        while True:
            last_data = GetData(0, 5, 31, 0)
            #last_data.to_csv('OneDayData.csv')
            if not last_data.empty:
                last_data_trace_ids = list(last_data['TraceID'])
                data_trace_ids = list(self.data['TraceID'])
                running_trace_ids = [id for id in last_data_trace_ids if id not in data_trace_ids]
                for running_id in running_trace_ids:
                    self.running_ids.add(running_id)
            else:
                print("[INFO] No recent Traces")

            #print(f"[INFO] Fetching running traces with ids {self.running_ids}")
            if len(self.running_ids) > 0:
                client = Client()
                runs = list(
                    client.list_runs(
                    project_name =  os.getenv('LANGCHAIN_PROJECT'),
                    id = list(self.running_ids)
                    )
                )

                data = FineTuneData(runs)
                print(f"[INFO] Recent Data: {data}")
                if not data.empty:
                    for i, row in data.iterrows():
                        print(f"[INFO] Latency: {row['Latency']}")
                        if row['Latency'] != None:
                            self.data = pandas.concat([row.to_frame().T, self.data], ignore_index=True)
                            #self.ShowData()
                            #self.ReturnData()
                            self.running_ids.remove(row['TraceID'])



