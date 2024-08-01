// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import BarChartComponent from './BarChartComponent';
// import PieChartComponent from './PieChartComponent';
// import DataTable from './DataTable';
// import ProgressBar from './ProgressBar';

// const Dashboard = () => {
//   const [barChartData, setBarChartData] = useState([]);
//   const [pieChartData, setPieChartData] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [progressValue, setProgressValue] = useState(0);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/data');
//         console.log('Fetched data:', response.data);  // Log the fetched data
//         const data = response.data;
  
//         setBarChartData(data.barChartData || []);
//         setPieChartData(data.pieChartData || []);
//         setTableData(data.tableData || []);
//         setProgressValue(data.progressValue || 0);
  
//         // Log the table data to verify it's being set correctly
//         console.log('Table data:', data.tableData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to fetch data.');
//       }
//     };
  
//     fetchData();
//   }, []);

//   const columns = React.useMemo(() => [
//     { Header: 'TraceID', accessor: 'TraceID' },
//     { Header: 'Name', accessor: 'Name' },
//     { Header: 'Type', accessor: 'Type' },
//     { Header: 'Time', accessor: 'Time' },
//     { Header: 'Latency', accessor: 'Latency' },
//     { Header: 'TotalTokens', accessor: 'TotalTokens' },
//     { Header: 'PromptTokens', accessor: 'PromptTokens' },
//     { Header: 'CompletionTokens', accessor: 'CompletionTokens' },
//     { Header: 'TotalCost', accessor: 'TotalCost' },
//     { Header: 'PromptCost', accessor: 'PromptCost' },
//     { Header: 'CompletionCost', accessor: 'CompletionCost' },
//     { Header: 'Input', accessor: 'Input' },
//     { Header: 'Output', accessor: 'Output' },
//   ], []);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <BarChartComponent data={barChartData} />
//       <PieChartComponent data={pieChartData} />
//       <DataTable columns={columns} data={tableData} />
//       <ProgressBar value={progressValue} />
//     </div>
//   );
// };

// export default Dashboard; // this is for dynamic data

import React, { useEffect, useState } from 'react';
import BarChartComponent from './BarChartComponent';
import PieChartComponent from './PieChartComponent';
import DataTable from './DataTable';
import CircularProgressBar from './CircularProgressBar';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  // Dummy data
  const dummyBarChartData = [
    { name: 'Type A', value: 30 },
    { name: 'Type B', value: 20 },
    { name: 'Type C', value: 50 },
  ];

  const dummyPieChartData = [
    { name: 'Status A', value: 40 },
    { name: 'Status B', value: 30 },
    { name: 'Status C', value: 30 },
  ];

  const dummyPieChartData2 = [ 
    { name: 'Category X', value: 35 },
    { name: 'Category Y', value: 45 },
    { name: 'Category Z', value: 20 },
  ];

  const dummyTableData = [
    {
      TraceID: '1',
      Name: 'Sample 1',
      Type: 'Type A',
      Time: '2024-08-01 12:00:00',
      Latency: '100ms',
      TotalTokens: '500',
      PromptTokens: '300',
      CompletionTokens: '200',
      TotalCost: '$0.50',
      PromptCost: '$0.30',
      CompletionCost: '$0.20',
      Input: 'Sample input text',
      Output: 'Sample output text',
    },
    {
      TraceID: '2',
      Name: 'Sample 2',
      Type: 'Type B',
      Time: '2024-08-01 12:05:00',
      Latency: '150ms',
      TotalTokens: '400',
      PromptTokens: '250',
      CompletionTokens: '150',
      TotalCost: '$0.40',
      PromptCost: '$0.25',
      CompletionCost: '$0.15',
      Input: 'Another sample input text',
      Output: 'Another sample output text',
    },
  ];

  const dummyProgressValue = 75; // Percentage

  const [barChartData, setBarChartData] = useState(dummyBarChartData);
  const [pieChartData, setPieChartData] = useState(dummyPieChartData);
  const [pieChartData2, setPieChartData2] = useState(dummyPieChartData2); // New Pie Chart State
  const [tableData, setTableData] = useState(dummyTableData);
  const [progressValue, setProgressValue] = useState(dummyProgressValue);
  const [error, setError] = useState(null);

  // Simulating data fetch
  useEffect(() => {
    try {
      // Normally you'd fetch data here, but we're using dummy data
      setBarChartData(dummyBarChartData);
      setPieChartData(dummyPieChartData);
      setPieChartData2(dummyPieChartData2); // Set new Pie Chart Data
      setTableData(dummyTableData);
      setProgressValue(dummyProgressValue);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data.');
    }
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
  ], []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <nav>
            <ul>
              <li><a href="#bar-chart">Bar Chart</a></li>
              <li><a href="#pie-chart">Pie Chart</a></li>
              <li><a href="#pie-chart-2">Pie Chart 2</a></li>
              <li><a href="#data-table">Data Table</a></li>
              <li><a href="#progress">Progress</a></li>
            </ul>
          </nav>
        </aside>
        <main className="dashboard-main">
          <div className="chart-section">
            <section id="bar-chart" className="dashboard-panel">
              <h2>Bar Chart Overview</h2>
              <BarChartComponent data={barChartData} />
            </section>
            <section id="pie-chart" className="dashboard-panel">
              <h2>Pie Chart Overview</h2>
              <PieChartComponent data={pieChartData} />
            </section>
            <section id="pie-chart-2" className="dashboard-panel">
              <h2>Pie Chart Overview 2</h2>
              <PieChartComponent data={pieChartData2} colorScheme="cool" /> {/* Add different colors if needed */}
            </section>
          </div>
          <div className="data-section">
            <section id="progress" className="dashboard-panel">
              <h2>Progress</h2>
              <CircularProgressBar value={progressValue} text={`${progressValue}%`} />
            </section>
            <section id="data-table" className="dashboard-panel">
              <h2>Data Table</h2>
              <DataTable columns={columns} data={tableData} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

