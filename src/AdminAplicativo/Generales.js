import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import XLSX from "xlsx";
import { w3cwebsocket as W3CWebSocket } from "websocket";
function AlertDismissibleExample({ alerta }) {
  switch (alerta.id) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return <Alert variant="success">{alerta.data}</Alert>;

    case 3:
      return <Alert variant="danger">{alerta.data}</Alert>;

    case 4:
      return <Alert variant="warning">Error al enviar la información</Alert>;

    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;

    case 7:
      return (
        <Alert variant="warning">
          Corrige los siguientes errores:
          <br></br>• Debe completar los campos obligatorios
        </Alert>
      );
    default:
      return <p></p>;
  }
}
const serviceAAD = new AADService();
const client_riesgos = new W3CWebSocket(
  process.env.REACT_APP_WS_URL + "/ws/eros/riesgos_" +
    serviceAAD.getUser().userName.split("@")[0]
);
const client = new W3CWebSocket(
  process.env.REACT_APP_WS_URL + "/ws/contratos/" +
    serviceAAD.getUser().userName.split("@")[0]
);

export default function Generales() {
  const [loading, setLoading] = React.useState(false);
  const [activarBotones, setActivarBotones] = React.useState({
    riesgos: true,
    evaluaciones: true,
    controles: true,
    proveedores: true,
  });
  const [archivo, setArchivo] = React.useState([]);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [carga, setCarga] = React.useState(false);
  const [enableButton, setEnableButton] = React.useState(true);
  const [enableButtonProveedores, setEnableButtonProveedores] =
    React.useState(true);

  const [url, setURL] = React.useState(null);
  const [descarga, setDescarga] = React.useState(true);
  const [method, setMethod] = React.useState(null);

  let tempArchivo = [];
  let temp = [];

  useEffect(() => {
    client.onopen = () => {
      console.warn("WebSocket Client Connected");
    };
    client.onClose = () => {
      console.warn("WebSocket Client Disconnected");
      closeWS();
    };
    client.onmessage = (message) => {
      recibirMensaje(JSON.parse(message.data));
    };
    client_riesgos.onopen = () => {
      console.warn("WebSocket Client Connected Client_riesgos");
    };
    client_riesgos.onclose = () => {
      console.warn("WebSocket Client Disconnected Client_riesgos");
      closeWS();
    };
    client_riesgos.onmessage = (message) => {
      recibirMensaje(JSON.parse(message.data));
    };
  }, []);

  function closeWS() {
    var mensaje = window.confirm(
      "Se ha cerrado la conexión con el servidor, es necesario recargar la página para continuar"
    );
    if (mensaje) {
      window.location.reload();
    } else {
      alert("No podrá hacer uso de los cargadores hasta recargar la página");
    }
  }

  const recibirMensaje = (data) => {
    console.warn(data);
    if (data.payload.message === "Error_File") {
      setCarga(false);
      setEnableButton(true);
      setEnableButtonProveedores(true);
      setEstadoPost({
        id: 3,
        data: "Error: Por favor verificar la estructura del archivo",
      });
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 10000);
    } else if (data.payload.message === "Error") {
      setCarga(false);
      setEnableButton(true);
      setEnableButtonProveedores(true);
      setEstadoPost({
        id: 3,
        data: data.payload.Detail,
      });
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 10000);
    } else if (data.payload.message === "Success") {
      setEnableButton(true);
      setEnableButtonProveedores(true);
      setEstadoPost({
        id: 2,
        data: "Carga finalizada, recuerde revisar su informe de cargue",
      });
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 5000);
      if (data.payload.URL) {
        setURL(data.payload.URL);
        setCarga(true);
      }
    }
  };
  async function fileFromURL(url) {
    let urlConsulta = url;
    axios({
      url: urlConsulta,
      method: "GET",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    })
      .then((response) => {
        let name = urlConsulta.split("/").pop();
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
        setCarga(false);
        setDescarga(true);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          setEstadoPost({
            id: 3,
            data: "No estas autorizado para realizar esta accion o tu sesión esta vencida",
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        } else if (error.response.status == 404) {
          setEstadoPost({
            id: 3,
            data: "No se encontró el archivo seleccionado",
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        }
      });
  }
  const subirArchivo = (e, source) => {
    setEstadoPost({ id: 0, data: null });
    setArchivo([]);
    if (
      e[0].name.split(".")[1] == "xlsx" /*  ||
        e[i].name.split(".")[1] == "csv" */
    ) {
      switch (source) {
        case "riesgos":
          setActivarBotones({
            riesgos: true,
            evaluaciones: false,
            controles: false,
            proveedores: false,
          });
          break;
        case "evaluaciones":
          setActivarBotones({
            riesgos: false,
            evaluaciones: true,
            controles: false,
            proveedores: false,
          });
          break;
        case "controles":
          setActivarBotones({
            riesgos: false,
            evaluaciones: false,
            controles: true,
            proveedores: false,
          });
          break;
        case "proveedores":
          setActivarBotones({
            riesgos: false,
            evaluaciones: false,
            controles: false,
            proveedores: true,
          });
          break;
        default:
          break;
      }
      temp.push(e[0].name);
      tempArchivo.push(e[0]);
    }

    setArchivo(tempArchivo);
  };
  const cancelarCargue = () => {
    setArchivo([]);
    setEnableButton(true);
    setEnableButtonProveedores(true);
    setActivarBotones({
      riesgos: true,
      evaluaciones: true,
      controles: true,
      proveedores: true,
    });
  };
  const uploadArchivo = async (file, source) => {
    setLoading(true);
    if (file.length > 0) {
      let jsonObject = {};
      var fileReader = new FileReader();
      fileReader.onload = function (event) {
        var data = event.target.result;
        var workbook = XLSX.read(data, {
          type: "binary",
          cellDates: true,
          dateNF: "dd-mm-yyy HH:mm:ss",
        });
        workbook.SheetNames.forEach((sheet) => {
          let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            raw: true,
            blankRows: true,
            defval: null,
          });
          jsonObject[sheet.trim()] = rowObject;
        });
        jsonObject["user"] = serviceAAD.getUser().userName;
        sendMessageSocket(jsonObject, source);
      };
      fileReader.readAsBinaryString(file[0]);
    } else {
      setEnableButton(true);
      setEnableButtonProveedores(true);
      window.alert("No se ha seleccionado un archivo");
    }
  };

  const sendMessageSocket = (msg, source) => {
    if (msg) {
      if (client_riesgos.readyState !== 0 && client.readyState !== 0) {
        switch (source) {
          case "riesgos":
            setEnableButton(false);
            client_riesgos.send(JSON.stringify(msg));
            break;
          case "proveedores":
            setEnableButtonProveedores(false);
            client.send(JSON.stringify(msg));
            break;

          default:
            break;
        }
      } else {
        console.error("Conexión con el servidor no establecida");
      }
    }
  };

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Cargas Masivas</h1>
        </Col>
      </Row>
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <p className="label error">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Recuerde que puede cargar solo un
            archivo al tiempo
          </p>
        </Col>
      </Row>
      <hr />
      <Row className="mb-4">
        <Col sm={1} xs={12}></Col>
        <Col sm={3} xs={12}>
          <label className="forn-label label">Cargue para proveedores:</label>
        </Col>
        <Col sm={4} xs={12}>
          <input
            type="file"
            name="files"
            accept=".xlsx,.csv"
            onChange={(e) => subirArchivo(e.target.files, "proveedores")}
            disabled={!activarBotones.proveedores}
          ></input>
        </Col>
        {enableButtonProveedores ? (
          <Col sm={4} xs={12}>
            <button
              type="button"
              className="btn botonPositivo"
              onClick={() => uploadArchivo(archivo, "proveedores")}
              disabled={!activarBotones.proveedores}
            >
              Cargar registros
            </button>
          </Col>
        ) : (
          <Col className="col-auto" sm={3} xs={3}>
            <Loader
              type="Oval"
              color="#FFBF00"
              height={30}
              width={30}
              style={{
                textAlign: "center",
                position: "static",
              }}
            />
          </Col>
        )}
      </Row>
      <hr />
      {/* <-------------------------------------fila 2-------------------------------------> */}
      <Row className="mb-4">
        <Col sm={1} xs={12}></Col>
        <Col sm={3} xs={12}>
          <label className="forn-label label">
            Cargue para otros elementos:
          </label>
        </Col>
        <Col sm={4} xs={12}>
          <input
            type="file"
            name="files"
            accept=".xlsx,.csv"
            onChange={(e) => subirArchivo(e.target.files, "riesgos")}
            disabled={!activarBotones.riesgos}
          ></input>
        </Col>
        {enableButton ? (
          <Col sm={4} xs={12}>
            <button
              type="button"
              className="btn botonPositivo"
              onClick={(e) => uploadArchivo(archivo, "riesgos")}
              disabled={!activarBotones.riesgos}
            >
              Cargar registros
            </button>
          </Col>
        ) : (
          <Col className="col-auto" sm={3} xs={3}>
            <Loader
              type="Oval"
              color="#FFBF00"
              height={30}
              width={30}
              style={{
                textAlign: "center",
                position: "static",
              }}
            />
          </Col>
        )}
      </Row>

      <hr />
      <Row className="mb-4">
        <Col sm={4} xs={12}></Col>
        <Col sm={3} xs={12}>
          <Button
            id="buttonEfectos"
            type="button"
            className="btn botonPositivo"
            disabled={!carga}
            onClick={() => fileFromURL(url)}
          >
            Descargar Informe de cargue &nbsp;
            <IoMdDownload />
          </Button>
        </Col>
        <Col sm={4} xs={12}>
          <button
            type="button"
            className="btn botonNegativo"
            onClick={() => cancelarCargue()}
          >
            Cancelar
          </button>
        </Col>
        <Col sm={4} xs={12}></Col>
      </Row>
    </>
  );
}
