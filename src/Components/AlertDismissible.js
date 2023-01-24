import { set } from "lodash";
import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";

export default function AlertDismissible({ data }) {
  const [msg, setMsg] = React.useState(null);
  const [dataA, setDataA] = React.useState(null);

  let temp = [];
  let errors = "";
  let temp2 = [];
  /*   if (data.alerta.data !== null && data.alerta.data !== undefined) {
    temp = JSON.stringify(data.alerta.data).split('"');
    temp.map((dat, index) => {
      if (index % 2 !== 0) {
        temp2.push(dat);
      }
    });
    for (let index = 0; index < temp2.length; index += 2) {
      errors = errors + temp2[index] + ": " + temp2[index + 1] + "\n";
    }
  } */

  useEffect(() => {
    setDataA(data);
    if (data && data.name) {
      setMsg(data.name + ": " + data.message);
    }

    setTimeout(() => {
      setDataA(null);
    }, 4000);
  }, [data, setDataA]);

  if (dataA && dataA.status) {
    switch (dataA.status) {
      case 201:
        console.log('probando el case 201')
        return (<Alert variant="success">Guardó exitosamente</Alert>);
        break;
      case 202:
        return <Alert variant="success">Actualizó exitosamente</Alert>;
        break;
      case 206:
        return (
          <Alert variant="warning">Se guardó pero con datos faltantes</Alert>
        );
        break;
      case 400:
        return <Alert variant="danger">{msg}</Alert>;
        break;
      case "custom":
        return <Alert variant="warning">{msg}</Alert>;
        break;
      case 500:
        return <Alert variant="danger">Error en el servidor</Alert>;
        break;

      default:
        return <p></p>;
        break;
    }
  } else {
    return <p></p>;
  }
}
