import React, { useState, useMemo } from "react";
import Home from "./home.js";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { UsuarioContext } from "./Context/UsuarioContext";
import { RecuperacionesContext } from "./Context/RecuperacionesContext.js";

function App() {
  const [dataUsuario, setDataUsuario] = useState(null);

  const [dataRecuperaciones, setDataRecuperaciones] = useState(null);

  const providerUser = useMemo(
    () => ({ dataUsuario, setDataUsuario }),
    [dataUsuario, setDataUsuario]
  );

  // const providerRecuperaciones = useMemo(
  //   () => ({ dataRecuperaciones, setDataRecuperaciones }),
  //   [dataRecuperaciones, setDataRecuperaciones]
  // );

  return (
    <>
      <UsuarioContext.Provider value={providerUser}>
        <RecuperacionesContext.Provider
          value={{ dataRecuperaciones, setDataRecuperaciones }}
        >
          <Home key="homeReact1" />
        </RecuperacionesContext.Provider>
      </UsuarioContext.Provider>
    </>
  );
}

export default App;
