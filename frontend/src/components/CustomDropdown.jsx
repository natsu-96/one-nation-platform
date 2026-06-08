import React, { useState, useRef, useEffect } from "react";
import "./CustomDropdown.css";
import downArrow from "../assets/down.png"

function CustomDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ value: "this-week", label: "This Week" });
  const dropdownRef = useRef(null);

  const options = [
    { value: "this-week", label: "This Week" },
    { value: "last-week", label: "Last Week" },
    { value: "all-time", label: "All Time" }
  ];

  // Close the dropdown instantly if the user clicks anywhere else on the screen
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="voting-filter-right" ref={dropdownRef}>
      <div className="react-dropdown">
        {/* Trigger Button */}
        <button 
          className={`dropdown-trigger ${isOpen ? "active" : ""}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption.label}
          <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
            <img src={downArrow} alt="Down Arrow" />
          </span>
        </button>

        {/* Custom Options Container List */}
        {isOpen && (
          <ul className="dropdown-menu">
            {options.map((opt) => (
              <li 
                key={opt.value} 
                className={`dropdown-item ${selectedOption.value === opt.value ? "selected" : ""}`}
                onClick={() => {
                  setSelectedOption(opt);
                  setIsOpen(false);
                  // Call your filter state update functions here if needed!
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CustomDropdown;