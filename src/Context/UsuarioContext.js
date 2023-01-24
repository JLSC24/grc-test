import React, { createContext } from "react";

//*Al crear un contexto se crea un objeto que consta de dos partes, Context.Provider y Context.Consumer
export const UsuarioContext = createContext(null);

//* El Context.Provider es un componente que recibe un prop value que serán los valores a compartir.
//* Todos los componentes renderizados dentro de este componente tendran acceso a los valores del contexto.
