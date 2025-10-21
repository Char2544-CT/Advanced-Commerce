// Dropdown menu tsx component
import React, { useState } from "react";
import "../styles/Dropdown.css";

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
    <div className="dropdown">
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption}
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <ul className="dropdown-list">
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
