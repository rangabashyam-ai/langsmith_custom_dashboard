import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Analytics.css';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/analytics');
        const { averageTokensPerQuestion, averageCostPerQuestion, totalCost, averageLatencyPerQuestion } = response.data;

        const fetchedAnalyticsData = [
          { title: 'Average Tokens Per Question', value: averageTokensPerQuestion, backgroundColor: '#3498db' },
          { title: 'Average Cost Per Question', value: averageCostPerQuestion, backgroundColor: '#2ecc71' },
          { title: 'Total Cost Till Now', value: totalCost, backgroundColor: '#f39c12' },
          { title: 'Average Latency Per Question', value: averageLatencyPerQuestion, backgroundColor: '#e74c3c' },
        ];

        setAnalyticsData(fetchedAnalyticsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Failed to fetch analytics data.');
      }
    }

    fetchAnalyticsData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="analytics">
      {analyticsData.map((item, index) => (
        <div className="card" key={index} style={{ backgroundColor: item.backgroundColor }}>
          <h3>{item.title}</h3>
          <p className="value">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Analytics;
