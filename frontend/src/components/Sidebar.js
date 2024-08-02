// import React from 'react';
// import './Sidebar.css';

// const Sidebar = () => (
//   <div className="sidebar">
//     <div className="profile">
//       <img src="profile.jpg" alt="profile" />
//       <h2>Ranga Bashyam</h2>
//     </div>
//     <ul>
//       <li><a href="#bar-chart">Bar Chart</a></li>
//       <li><a href="#pie-chart">Pie Chart</a></li>
//       <li><a href="#pie-chart-2">Pie Chart 2</a></li>
//       <li><a href="#data-table">Data Table</a></li>
//       <li><a href="#progress">Progress</a></li>
//       <li><a href="#analytics">Analytics</a></li>
//     </ul>
//   </div>
// );

// export default Sidebar;

import React, { useState } from 'react';
import { Link } from 'react-scroll';
import './Sidebar.css';
import { FaHome, FaChartBar, FaChartPie, FaTable, FaCog, FaSearch } from 'react-icons/fa';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const menuItems = [
    { name: 'Home', icon: <FaHome />, to: 'home' },
    { name: 'Bar Chart', icon: <FaChartBar />, to: 'bar-chart' },
    { name: 'Pie Chart', icon: <FaChartPie />, to: 'pie-chart' },
    { name: 'Data Table', icon: <FaTable />, to: 'data-table' },
    { name: 'Progress', icon: <FaCog />, to: 'progress' },
    { name: 'Analytics', icon: <FaChartPie />, to: 'analytics' },
  ];

  const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="collapse-toggle" onClick={handleCollapseToggle}>
        {isCollapsed ? '>' : '<'}
      </button>
      <div className="profile">
        <img src="profile.jpg" alt="profile" />
        {!isCollapsed && <h2>Ranga Bashyam</h2>}
      </div>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
        <FaSearch />
      </div>
      <ul>
        {filteredItems.map(item => (
          <li key={item.name}>
            <Link 
              to={item.to} 
              smooth={true} 
              duration={500}
              className="sidebar-link"
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
