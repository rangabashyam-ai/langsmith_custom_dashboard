// import React, { useEffect, useState } from 'react';
// import BarChartComponent from './BarChartComponent';
// import PieChartComponent from './PieChartComponent';
// import Analytics from './Analytics';
// import Sidebar from './Sidebar';
// import './Dashboard.css';

// const Dashboard = () => {
//   // Dummy data
//   const dummyBarChartData = [
//     { name: 'Type A', value: 30 },
//     { name: 'Type B', value: 20 },
//     { name: 'Type C', value: 50 },
//   ];

//   const dummyPieChartData = [
//     { name: 'Status A', value: 40 },
//     { name: 'Status B', value: 30 },
//     { name: 'Status C', value: 30 },
//   ];

//   const dummyPieChartData2 = [
//     { name: 'Category X', value: 35 },
//     { name: 'Category Y', value: 45 },
//     { name: 'Category Z', value: 20 },
//   ];

//   const dummyTableData = [
//     {
//       TraceID: '1',
//       Name: 'Sample 1',
//       Type: 'Type A',
//       Time: '2024-08-01 12:00:00',
//       Latency: '100ms',
//       TotalTokens: '500',
//       PromptTokens: '300',
//       CompletionTokens: '200',
//       TotalCost: '$0.50',
//       PromptCost: '$0.30',
//       CompletionCost: '$0.20',
//       Input: 'Sample input text',
//       Output: 'Sample output text',
//     },
//     {
//       TraceID: '2',
//       Name: 'Sample 2',
//       Type: 'Type B',
//       Time: '2024-08-01 12:05:00',
//       Latency: '150ms',
//       TotalTokens: '400',
//       PromptTokens: '250',
//       CompletionTokens: '150',
//       TotalCost: '$0.40',
//       PromptCost: '$0.25',
//       CompletionCost: '$0.15',
//       Input: 'Another sample input text',
//       Output: 'Another sample output text',
//     },
//   ];

//   const [barChartData, setBarChartData] = useState(dummyBarChartData);
//   const [pieChartData, setPieChartData] = useState(dummyPieChartData);
//   const [pieChartData2, setPieChartData2] = useState(dummyPieChartData2); // New Pie Chart State
//   const [tableData, setTableData] = useState(dummyTableData);
//   const [error, setError] = useState(null);

//   // Simulating data fetch
//   useEffect(() => {
//     try {
//       // Normally you'd fetch data here, but we're using dummy data
//       setBarChartData(dummyBarChartData);
//       setPieChartData(dummyPieChartData);
//       setPieChartData2(dummyPieChartData2); // Set new Pie Chart Data
//       setTableData(dummyTableData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError('Failed to fetch data.');
//     }
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
//   ], []);

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   return (
//     <div className="dashboard-container">

//       <div className="dashboard-content">
//         <Sidebar className="dashboard-sidebar" /> {/* Apply sidebar CSS class */}
//         <main className="dashboard-main">
//           <div className="chart-section">
//             <section id="pie-chart" className="dashboard-panel">
//               <h2>Pie Chart Overview</h2>
//               <PieChartComponent data={pieChartData} />
//             </section>
//             <section id="analytics" className="dashboard-panel">
//               <h2>Analytics Overview</h2>
//               <Analytics />
//             </section>
//           </div>
//           <div className="chart-section">
//             <section id="bar-chart" className="dashboard-panel">
//               <h2>Bar Chart Overview</h2>
//               <BarChartComponent data={barChartData} />
//             </section>
//             <section id="pie-chart-2" className="dashboard-panel">
//               <h2>Pie Chart Overview 2</h2>
//               <PieChartComponent data={pieChartData2} colorScheme="cool" />
//             </section>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarChartComponent from './BarChartComponent';
import PieChartComponent from './PieChartComponent';
import Analytics from './Analytics';
import Sidebar from './Sidebar';
import './Dashboard.css'; 

const Dashboard = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [progressValue, setProgressValue] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/data');
        const { barChartData, pieChartData, tableData, progressValue } = response.data;

        setBarChartData(barChartData);
        setPieChartData(pieChartData);
        setTableData(tableData);
        setProgressValue(progressValue);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">CONVOGENE Langsmith Dashboard</div>
        <img src="infobellit.png" alt="Info Bellit" className="header-image" />
      </header>
      <div className="dashboard-content">
        <Sidebar className="dashboard-sidebar" />
        <main className="dashboard-main">
          <div className="analytics-section">
            <section id="analytics" className="dashboard-panel">
              <h2>Analytics Overview</h2>
              <Analytics />
            </section>
          </div>
          <div className="chart-section">
            <section id="bar-chart" className="dashboard-panel">
              <h2>Bar Chart Overview</h2>
              <BarChartComponent data={barChartData} />
            </section>
            <section id="pie-chart" className="dashboard-panel">
              <h2>Pie Chart Overview</h2>
              <PieChartComponent data={pieChartData} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
