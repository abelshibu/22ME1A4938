import React from "react";
import { getAllUrls } from "../utils/storage";
import './styles.css';

const Analytics = () => {
  const urls = getAllUrls();

  return (
    <div className="container">
      <h1>Analytics</h1>
      <div className="url-list">
        {Object.entries(urls).map(([shortcode, entry]) => (
          <div key={shortcode} className="url-item">
            <strong>{shortcode}</strong>: {entry.visits} visits | Expires on:{" "}
            {new Date(entry.expiration).toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
