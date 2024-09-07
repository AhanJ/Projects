import React, { useState, useEffect, useRef } from "react";

function Dropdown({ buttonText, content, keyField, displayField, onSelect }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const [selectedItem, setselectedItem] = useState(buttonText);

  function handleItemClick(item) {
    setselectedItem(item[displayField]);
    if (onSelect) onSelect(item[keyField]);
    setOpen(false);
  }

  function toggleDropdown() {
    setOpen(!open);
  }

  useEffect(() => {
    function outsideClickHandler(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", outsideClickHandler);

    return () => {
      document.removeEventListener("click", outsideClickHandler);
    }; // cleanup function
  }, [dropdownRef]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className={`dropdown-btn ${open ? "btn-open" : ""}`}
        type="button"
        onClick={toggleDropdown}
      >
        {selectedItem}
        <span>
          <img alt="arrow" src={open ? "/arrow_up.png" : "/arrow_down.png"} />
        </span>
      </button>
      <div className={`dropdown-content ${open ? "content-open" : ""}`}>
        {content.map((item) => (
          <div
            className="dd-item"
            onClick={() => {
              handleItemClick(item);
            }}
            key={item[keyField]}
          >
            {item[displayField]}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dropdown;
