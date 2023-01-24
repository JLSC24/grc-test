import React from "react";
function Header(props) {
  return (
    <div className={props.className + " client"}>
      <img src="CARO.png" alt="logo" />
      <div className={props.className + " client-info"}>
        CARO: Chatbot de Autogestión de Riesgos Operacionales
      </div>
    </div>
  );
}

export default Header;
