import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgressBar = ({ value, text }) => {
  return (
    <div className="circular-progress-container">
      <CircularProgressbar
        value={value}
        text={text}
        styles={buildStyles({
          pathColor: `var(--progress-path-color, rgba(62, 152, 199, ${value / 100}))`,
          textColor: 'var(--progress-text-color, #333)',
          trailColor: 'var(--progress-trail-color, #d6d6d6)',
          backgroundColor: 'var(--progress-background-color, #f0f0f0)',
          textSize: '22px',
        })}
      />
    </div>
  );
};

export default CircularProgressBar;
