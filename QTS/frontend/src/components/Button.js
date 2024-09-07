import React from "react";

function Button({ buttonText, onClick, clr }) {
  return (
    <button className={`btn-primary ${clr}`} type="button" onClick={onClick}>
      {buttonText}
    </button>
  );
}

export default Button;
