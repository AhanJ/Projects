import React from "react";

function Header({ title, src }) {
  return (
    <header className="header">
      <div className="header-content container">
        <img alt="logo" src={src} />
        <h3>{title}</h3>
      </div>
    </header>
  );
}

export default Header;
