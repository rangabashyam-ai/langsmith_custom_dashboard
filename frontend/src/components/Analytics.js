import React from 'react';
import './Analytics.css';

const analyticsData = [
  {
    title: 'Visitors',
    value: '13.7K',
    target: '172,456 Target Users',
    change: '+10%',
    backgroundColor: '#3498db',
  },
  {
    title: 'Bounce Rate',
    value: '41.6%',
    target: '472,456 Target Users',
    change: '+5%',
    backgroundColor: '#2ecc71',
  },
  {
    title: 'Users',
    value: '19M',
    target: '172,456 Target Users',
    change: '+10%',
    backgroundColor: '#f39c12',
  },
  {
    title: 'New Contacts',
    value: '75',
    target: '172,456 Target Users',
    change: '-5%',
    backgroundColor: '#e74c3c',
  },
];

const Analytics = () => (
  <div className="analytics">
    {analyticsData.map((item, index) => (
      <div className="card" key={index} style={{ backgroundColor: item.backgroundColor }}>
        <h3>{item.title}</h3>
        <p className="value">{item.value}</p>
        <p className="target">{item.target}</p>
        <p className="change">{item.change}</p>
      </div>
    ))}
  </div>
);

export default Analytics;
