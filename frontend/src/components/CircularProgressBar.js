// InteractiveProgressBar.js
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import default styles
import './InteractiveProgressBar.css'; // Import custom styles

const InteractiveProgressBar = ({ value }) => (
  <div className="progress-bar-container">
    <CircularProgressbar
      value={value}
      text={`${value}%`}
      styles={buildStyles({
        pathColor: `rgba(62, 152, 199, ${value / 100})`,
        textColor: '#fff',
        trailColor: '#d6d6d6',
      })}
    />
  </div>
);

export default InteractiveProgressBar;
