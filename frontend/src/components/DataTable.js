import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './DataTable.css'; // Import the CSS file

const DataTable = ({ data = [] }) => { // Default parameter for data
  const [selectedTraceId, setSelectedTraceId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 30; // Number of rows per page

  // Function to handle row click
  const handleRowClick = (traceId) => {
    setSelectedTraceId(traceId);
  };

  // Function to handle closing the popup
  const handleClosePopup = () => {
    setSelectedTraceId(null);
  };

  // Function to safely render data, convert objects to strings if needed
  const renderSafeText = (text) => {
    if (typeof text === 'object') {
      return JSON.stringify(text, null, 2); // Convert object to JSON string with formatting
    }
    return text;
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Get selected data based on TraceID
  const selectedData = data.find(item => item.TraceID === selectedTraceId);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="data-table-container">
      <table>
        <thead>
          <tr>
            <th>TraceID</th>
            <th>Status</th>
            <th>Time</th>
            <th>Latency</th>
            <th>TotalTokens</th>
            <th>PromptTokens</th>
            <th>CompletionTokens</th>
            <th>TotalCost</th>
            <th>PromptCost</th>
            <th>CompletionCost</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map(item => (
            <tr key={item.TraceID} onClick={() => handleRowClick(item.TraceID)}>
              <td>{item.TraceID}</td>
              <td>{item.Status}</td>
              <td>{item.Time}</td>
              <td>{item.Latency}</td>
              <td>{item.TotalTokens}</td>
              <td>{item.PromptTokens}</td>
              <td>{item.CompletionTokens}</td>
              <td>{item.TotalCost}</td>
              <td>{item.PromptCost}</td>
              <td>{item.CompletionCost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedData && ReactDOM.createPortal(
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <button className="popup-close-button" onClick={handleClosePopup}>Exit</button>
            <div className="popup-message">
              <div className="popup-input">
                <strong>Input:</strong>
                <pre>{renderSafeText(selectedData.Input)}</pre>
              </div>
              <div className="popup-output">
                <strong>Output:</strong>
                <pre>{renderSafeText(selectedData.Output)}</pre>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
