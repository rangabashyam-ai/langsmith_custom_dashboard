import React from 'react';
import './Analytics.css';

const analyticsData = [
  {
    title: 'Visitors',
    value: '13.7K',

    backgroundColor: '#3498db',
  },
  {
    title: 'Bounce Rate',
    value: '41.6%',

    backgroundColor: '#2ecc71',
  },
  {
    title: 'Users',
    value: '19M',

    backgroundColor: '#f39c12',
  },
  {
    title: 'New Contacts',
    value: '75',

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
