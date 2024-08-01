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
//         const data = response.data;

//         // Ensure the data has the expected structure
//         const barData = Object.keys(data.run_types_count || {}).map(name => ({
//           name,
//           value: data.run_types_count[name],
//         }));
//         const pieData = Object.keys(data.status_counts || {}).map(status => ({
//           name: status,
//           value: data.status_counts[status],
//         }));
//         const tableData = data.tableData || [];
//         const progressValue = data.progressValue || 0;

//         setBarChartData(barData);
//         setPieChartData(pieData);
//         setTableData(tableData);
//         setProgressValue(progressValue);
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

// export default Dashboard;


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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/data');
        const data = response.data;

        // Assuming data has columns 'TraceID', 'Name', 'Type', etc.
        const tableData = data.data.map((row, index) => {
          const rowData = {};
          data.columns.forEach((col, idx) => {
            rowData[col] = row[idx];
          });
          return rowData;
        });

        setTableData(tableData);
        // Additional processing for barChartData and pieChartData if needed
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
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

  if (error) {
    return <div>{error}</div>;
  }

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
