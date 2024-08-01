// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarChartComponent from './BarChartComponent';
import PieChartComponent from './PieChartComponent';
import DataTable from './DataTable';
import ProgressBar from './ProgressBar';

const Dashboard = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/data');
        const data = response.data;

        // Process data for charts and table
        const barData = Object.keys(data.run_types_count).map(name => ({
          name,
          value: data.run_types_count[name],
        }));
        const pieData = Object.keys(data.status_counts).map(status => ({
          name: status,
          value: data.status_counts[status],
        }));
        const tableData = data.tableData || [];
        const progressValue = data.progressValue || 0;

        setBarChartData(barData);
        setPieChartData(pieData);
        setTableData(tableData);
        setProgressValue(progressValue);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = React.useMemo(() => [
    { Header: 'TraceID', accessor: 'TraceID' },
    { Header: 'Name', accessor: 'Name' },
    { Header: 'Type', accessor: 'Type' },
    { Header: 'Time', accessor: 'Time' },
    { Header: 'Latency', accessor: 'Latency' },
    { Header: 'TotalTokens', accessor: 'TotalTokens' },
    { Header: 'PromptTokens', accessor: 'PromptTokens' },
    { Header: 'CompletionTokens', accessor: 'CompletionTokens' },
    { Header: 'TotalCost', accessor: 'TotalCost' },
    { Header: 'PromptCost', accessor: 'PromptCost' },
    { Header: 'CompletionCost', accessor: 'CompletionCost' },
    { Header: 'Input', accessor: 'Input' },
    { Header: 'Output', accessor: 'Output' },
  ], []);

  return (
    <div>
      <h1>Dashboard</h1>
      <BarChartComponent data={barChartData} />
      <PieChartComponent data={pieChartData} />
      <DataTable columns={columns} data={tableData} />
      <ProgressBar value={progressValue} />
    </div>
  );
};

export default Dashboard;
