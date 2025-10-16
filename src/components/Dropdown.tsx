// Dropdown menu tsx component
import React, { useState } from "react";

interface DropdownProps {
  options: string[];
  onSelect: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOptionState] = useState<string>("All");

  const handleOptionClick = (option: string) => {
    setSelectedOptionState(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div
      className="dropdown"
      style={{ position: "relative", display: "inline-block" }}
    >
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption}
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div
          className="dropdown-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          <ul
            className="dropdown-list"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              textAlign: "center",
            }}
          >
            {options.map((option) => (
              <li key={option} className="dropdown-item">
                <button
                  className="dropdown-option"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
