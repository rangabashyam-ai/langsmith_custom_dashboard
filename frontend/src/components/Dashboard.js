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
        const response = await axios.get('http://127.0.0.1:8000/data'); // Ensure the URL matches your backend endpoint
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
      <div className="dashboard-content">
        <Sidebar className="dashboard-sidebar" />
        <main className="dashboard-main">
          <div className="overview-section">
            <section id="analytics" className="dashboard-panel">
              <h2>Analytics Overview</h2>
              <Analytics />
            </section>
            <section id="pie-chart" className="dashboard-panel pie-chart">
              <h2>Pie Chart Overview</h2>
              <PieChartComponent data={pieChartData} />
            </section>
          </div>
          <div className="chart-section">
            <section id="bar-chart" className="dashboard-panel">
              <h2>Bar Chart Overview</h2>
              <BarChartComponent data={barChartData} />
            </section>
            <section id="table-data" className="dashboard-panel">
              <h2>Table Data</h2>
              {/* Add DataTable component if needed */}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
