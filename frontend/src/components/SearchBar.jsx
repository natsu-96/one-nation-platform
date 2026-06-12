import React from "react";

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-container" style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Search to nominate..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "2px solid #0C641B",
        }}
      />
    </div>
  );
}

export default SearchBar;
