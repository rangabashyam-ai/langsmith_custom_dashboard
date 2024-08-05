import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarChartComponent from './BarChartComponent';
import PieChartComponent from './PieChartComponent';
import Analytics from './Analytics';
import Sidebar from './Sidebar';
import DataTable from './DataTable';
import './Dashboard.css';

const Dashboard = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartDataStatus, setPieChartDataStatus] = useState([]);
  const [pieChartDataNamesCount, setPieChartDataNamesCount] = useState([]);
  const [pieChartDataRunTypesCount, setPieChartDataRunTypesCount] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/data');
        const { barChartData, pieChartDataStatus, pieChartDataNamesCount, pieChartDataRunTypesCount, tableData } = response.data;

        setBarChartData(barChartData);
        setPieChartDataStatus(pieChartDataStatus);
        setPieChartDataNamesCount(pieChartDataNamesCount);
        setPieChartDataRunTypesCount(pieChartDataRunTypesCount);
        setTableData(tableData);
        
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
            <section id="pie-chart-status" className="dashboard-panel pie-chart">
              <h2>Error Status</h2>
              <PieChartComponent data={pieChartDataStatus} />
            </section>
            <section id="pie-chart-names-count" className="dashboard-panel pie-chart">
              <h2>LLM calls Count</h2>
              <PieChartComponent data={pieChartDataNamesCount} />
            </section>
            <section id="pie-chart-run-types-count" className="dashboard-panel pie-chart">
              <h2>Run Types Count</h2>
              <PieChartComponent data={pieChartDataRunTypesCount} />
            </section>
          </div>
          <div className="chart-section">
            <section id="bar-chart" className="dashboard-panel">
              <h2>Requests vs Time</h2>
              <BarChartComponent data={barChartData} />
            </section>
            <section id="table-data" className="dashboard-panel">
              <h2>Convogene Logs</h2>
              <DataTable data={tableData} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
