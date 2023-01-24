import React, { useEffect } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import { Row, Col, Alert, Button } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";
import Loader from "react-loader-spinner";
import XLSX from "xlsx";
import { UsuarioContext } from "../Context/UsuarioContext";

import axios from "axios";
import AADService from "../auth/authFunctions";

import { w3cwebsocket as W3CWebSocket } from "websocket";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ padding: "0.5%" }} p={3}>
          <Typography component="div" style={{ padding: "0.5%" }}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function AlertDismissibleExample(data) {
  const [show, setShow] = React.useState(true);

  let dataError = data.alerta.data;
  let dataID = data.alerta.id;

  if (dataError && dataError.message !== null && dataID !== 2) {
    return (
      <Alert
        variant="warning"
        show={show}
        onClose={() => setShow(false)}
        dismissible
      >
        <i>{dataError.message}</i>
      </Alert>
    );
  } else if (
    dataError !== undefined &&
    dataError !== null &&
    dataError.errors !== null
  ) {
    <Alert
      variant="danger"
      show={show}
      onClose={() => setShow(false)}
      dismissible
    >
      <i>Ocurrió un error al escanear el archivo</i>
    </Alert>;
  } else if (dataID === 2) {
    <Alert
      variant="success"
      show={show}
      onClose={() => setShow(false)}
      dismissible
    >
      <i>{dataError.message}</i>
    </Alert>;
  } else {
    return <div></div>;
  }
  return (
    <Alert
      variant="success"
      show={show}
      onClose={() => setShow(false)}
      dismissible
    >
      <i>{dataError.message}</i>
    </Alert>
  );
}
const serviceAAD = new AADService();
const client = new W3CWebSocket(
  process.env.REACT_APP_WS_URL + "/ws/post_" + serviceAAD.getUser().userName.split("@")[0]
);

export default function EventosMaterializados(props) {
  const serviceAAD = new AADService();
  /* let responsePost = null */
  const [informeCargue, setInformeCargue] = React.useState(null);
  const [statusCarga, setStatusCarga] = React.useState([]);
  const [dataEnviada, setDataEnviada] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [method, setMethod] = React.useState(null);
  const [archivo, setArchivo] = React.useState([]);
  const [stateArchivo, setStateArchivo] = React.useState([]);
  const [names, setNames] = React.useState([]);
  const [errores, setErrores] = React.useState(null);
  const [namesN, setNamesN] = React.useState([]);
  const [estadoPOST, setEstadoPost] = React.useState(0);
  const [tipoConsulta, setTipoConsulta] = React.useState("guardados");
  const [loading, setLoading] = React.useState(false);
  const [confirmJSON, setConfirmJSON] = React.useState({
    estado: 0,
    confirmation: false,
    action: "",
    json: null,
  });
  let tempArchivo = [];
  let temp = [];
  const [enableButtonEventos, setEnableButtonEventos] = React.useState(true);
  const [enableButtonEventosUnificado, setEnableButtonEventosUnificado] =
    React.useState(true);
  const [enableButtonMacroeventos, setEnableButtonMacroeventos] =
    React.useState(true);
  const [enableButtonDetalle, setEnableButtonDetalle] = React.useState(true);
  const { dataUsuario } = React.useContext(UsuarioContext);
  const { descarga, setDescarga } = React.useState(true);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const errorArchivo = (data) => {
    let msgError = "";
    let dataError = data.data;
    let dataID = data.id;
    if (dataError && dataID === 5) {
      dataError.map((dat) => {
        if (dat.error === "Faltan hojas en cargador") {
          msgError =
            msgError +
            dat.error +
            ":\n" +
            dat.descripcion_error +
            "\n----------------------------\n";
          setErrores(msgError);
        } else if (dat.error === "Nombre de hoja inválido") {
          msgError =
            msgError +
            dat.error +
            ":\n" +
            dat.descripcion_error +
            "\n-----------------------------\n";
          setErrores(msgError);
        } else if (dat.error === "Nombre de columna inválido") {
          msgError =
            msgError +
            dat.error +
            ":\n" +
            dat.descripcion_error +
            "\n-----------------------------\n";
          setErrores(msgError);
        } else if (dat.error === "Formato de hoja inválido") {
          msgError =
            msgError +
            dat.error +
            ":\n" +
            dat.descripcion_error +
            "\n-----------------------------\n";
          setErrores(msgError);
        } else if (dat.error === "Error inesperado") {
          msgError =
            msgError +
            "Ha ocurrido un error inesperado, por favor recargue la página e intente nuevamente o contácte al administrador del sistema" +
            ":" +
            "\n-----------------------------\n" +
            "Descripción del error:\n" +
            dat.descripcion_error +
            "\n-----------------------------\n";

          setErrores(msgError);
        }
      });
      setErrores(msgError);
    }
  };

  const recibirLog = async (data) => {
    let date = new Date();
    let vectorDataLog = statusCarga;
    let detalleHora =
      date.toLocaleDateString() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds() +
      " " +
      data.payload.Detail;
    data.payload.Detail = detalleHora;
    vectorDataLog.push(data);
    setStatusCarga(vectorDataLog);
  };
  const recibirMensaje = async (data) => {
    const button1 = document.getElementById("simple-tab-1");
    if (
      data.payload.message === "En_proceso" ||
      data.payload.message === "En_Proceso"
    ) {
      await recibirLog(data);
    }
    button1.click();

    if (data.payload.Error) {
      setEstadoPost({ id: 0, data: null });
      if (data.payload.message === "Error_File") {
        errorArchivo({ id: 5, data: data.payload.Detail });
      } else if (data.payload.message === "Error") {
        setInformeCargue(null);
        setEstadoPost({ id: 4, data: data.payload.Detail });
        setInformeCargue(data.payload.Detail);
        setTimeout(function () {
          setEstadoPost({ id: 0, data: null });
        }, 5000);
      }
      setLoading(false);
    } else if (
      data.payload.Error === false &&
      data.payload.saved === 0 &&
      data.payload.message !== "En_proceso"
    ) {
      setEstadoPost({ id: 2, data: data.payload.Detail });
      setInformeCargue(data.payload.Detail);
      setConfirmJSON({
        estado: 2,
        confirmation: true,
        action: "post",
      });
      setLoading(false);
    } else if (data.payload.saved === 1) {
      setEstadoPost({ id: 2, data: data.payload.Detail });
      setInformeCargue(data.payload.Detail);
      setConfirmJSON({
        estado: 0,
        confirmation: false,
        action: "post",
      });
      setLoading(false);
    }
  };

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

  const sendMessageSocket = (msg) => {
    if (msg) {
      if (client.readyState !== 0) {
        client.send(JSON.stringify(msg));
      } else {
        /* console.warn("reconectando");
        const tempClient = new W3CWebSocket(
          process.env.REACT_APP_API_URL + "/ws/post_" +
            serviceAAD.getUser().userName.split("@")[0]
        );
        tempClient.onmessage = (event) =>
          recibirMensaje(JSON.parse(event.data));
        tempClient.onerror = (event) => {
          recibirError(event.data);
        };
        setClient(tempClient);
        sendMessageSocket(msg); */
      }
    }
  };

  const subirArchivo = (e) => {
    setEstadoPost({ id: 0, data: null });
    setArchivo([]);
    setNames([]);
    setStateArchivo([]);
    setNames([]);
    setNamesN([]);

    if (
      e[0].name.split(".")[1] == "xlsx" /*  ||
        e[i].name.split(".")[1] == "csv" */
    ) {
      temp.push(e[0].name);
      tempArchivo.push(e[0]);
    }

    setArchivo(tempArchivo);
  };

  const uploadArchivo = async (file, action, confirm) => {
    setLoading(true);
    setMethod(action);
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
        jsonObject["guardar"] = confirm;
        jsonObject["method"] = action;
        jsonObject["user"] = serviceAAD.getUser().userName;

        let compañia_temp = serviceAAD
          .getUser()
          .userName.split("@")[1]
          .split(".")[0]
          .toLowerCase();
        if (
          compañia_temp === "bam" ||
          compañia_temp === "banistmo" ||
          dataUsuario.idcompania === 5 ||
          dataUsuario.idcompania === 3
        ) {
          axios
            .post(process.env.REACT_APP_API_URL + "/cargador_perdidas/", jsonObject, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            })
            .then(function (response) {
              recibirMensaje(response.data);
            })
            .catch((errors) => {
              // react on errors.
              console.error(errors);
            });
        } else {
          sendMessageSocket(jsonObject);
        }
      };
      fileReader.readAsBinaryString(file[0]);
    }
  };

  const cancelarCarga = () => {
    const button0 = document.getElementById("simple-tab-0");
    setEstadoPost({ id: 0, data: null });
    setArchivo([]);
    setNames([]);
    setStateArchivo([]);
    setNames([]);
    setNamesN([]);
    setInformeCargue(null);
    setConfirmJSON({
      estado: 0,
      confirmation: false,
      action: "",
      json: null,
    });
    setErrores(null);
    setDataEnviada(false);
    button0.click();
  };

  const descargarArchivo = async (buttonName, url) => {
    switch (buttonName) {
      case "buttonEventos":
        setEnableButtonEventos(false);
        break;
      case "buttonEventosUnificado":
        setEnableButtonEventosUnificado(false);
        break;
      case "buttonMacroeventos":
        setEnableButtonMacroeventos(false);
        break;
      case "buttonDetalle":
        setEnableButtonDetalle(false);
        break;
      default:
        break;
    }
    async function limpiar(buttonName) {
      setTimeout(() => {
        switch (buttonName) {
          case "buttonEventos":
            setEnableButtonEventos(false);
            break;
          case "buttonEventosUnificado":
            setEnableButtonEventosUnificado(false);
            break;
          case "buttonMacroeventos":
            setEnableButtonMacroeventos(false);
            break;
          case "buttonDetalle":
            setEnableButtonDetalle(false);
            break;
          default:
            break;
        }
      }, 3000);
    }
    let urlConsulta = url ? url : informeCargue.URL;
    if (urlConsulta) {
      axios({
        url: urlConsulta,
        method: "GET",
        responseType: "blob", // importante
        headers: {
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      }).then((response) => {
        let name = urlConsulta.split("/").pop();
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
        limpiar(buttonName);
      });
    } else {
      console.warn("No es posible descargar el archivo");
      limpiar(buttonName);
    }
  };

  return (
    <>
      <AppBar
        position="static"
        style={{ background: "#2c2a29", color: "white" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Cargue de archivos" {...a11yProps(0)} />
          <Tab label="Informe de cargue" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {!loading ? (
          <>
            <Row className="mb-3"></Row>
            <Row className="mb-3">
              <Col sm={6} xs={12}>
                <label className="label forn-label">
                  Plantillas para cargue de eventos
                </label>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={2} xs={12}></Col>
              <Col sm={4} xs={12}>
                <label className="text forn-label">
                  Cargador / modificador de eventos:{" "}
                </label>
              </Col>
              {props.permisos.descargar ? (
            enableButtonEventos ? (
                <Col sm={3} xs={12}>
                  <Button
                    id="buttonEventos"
                    type="button"
                    className="btn botonPositivo"
                    onClick={() =>
                      descargarArchivo(
                        "buttonEventos",
                        process.env.REACT_APP_API_URL + "/download/cargadores/cargador_eventos.xlsx"
                      )
                    }
                  >
                    Descargar <IoMdDownload />
                  </Button>
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
              )
              ) : null}
            </Row>
            <Row className="mb-3">
              <Col sm={2} xs={12}></Col>
              <Col sm={4} xs={12}>
                <label className="text forn-label">
                  Cargador de eventos unificado:
                </label>
              </Col>
              {props.permisos.descargar ? (
            enableButtonEventosUnificado ? (
                <Col sm={3} xs={12}>
                  <Button
                    id="buttonEventosUnificado"
                    type="button"
                    className="btn botonPositivo"
                    onClick={() =>
                      descargarArchivo(
                        "buttonEventosUnificado",
                        process.env.REACT_APP_API_URL + "/download/cargadores/cargador_eventos_unificado.xlsm"
                      )
                    }
                  >
                    Descargar <IoMdDownload />
                  </Button>
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
              )
              ) : null}
            </Row>
            <Row className="mb-3">
              <Col sm={2} xs={12}></Col>
              <Col sm={4} xs={12}>
                <label className="text forn-label">
                  Cargador de macroeventos:
                </label>
              </Col>
              {props.permisos.descargar ? (
            enableButtonMacroeventos ? (
                <Col sm={3} xs={12}>
                  <Button
                    id="buttonMacroeventos"
                    type="button"
                    className="btn botonPositivo"
                    onClick={() =>
                      descargarArchivo(
                        "buttonMacroeventos",
                        process.env.REACT_APP_API_URL + "/download/cargadores/cargador_macroeventos.xlsx"
                      )
                    }
                  >
                    Descargar <IoMdDownload />
                  </Button>
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
              )
              ) : null}
            </Row>
            <Row className="mb-3">
              <Col sm={12} xs={12}>
                <hr />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={6} xs={12}>
                <label className="label forn-label">Seleccione archivo</label>
              </Col>
              <Col sm={6} xs={12}>
                <input
                  type="file"
                  name="files"
                  accept=".xlsx,.csv"
                  onChange={(e) => subirArchivo(e.target.files)}
                ></input>
              </Col>
            </Row>

            <hr />
            <Row className="mb-3">
              <Col sm={3} xs={12}></Col>
              <Col sm={4} xs={12}>
                <label className="label forn-label">Archivo seleccionado</label>
              </Col>
              <Col sm={2} xs={12} className="text-center">
                <label className="label forn-label">Estado</label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={3} xs={12}></Col>
              <Col sm={4} xs={12}>
                <label className="text forn-label">{names[0]}</label>
              </Col>
              <Col sm={2} xs={12} className="text-center">
                <label className="text forn-label">{stateArchivo[0]}</label>
              </Col>
            </Row>
            <hr />
            <Row className="mb-3">
              <Col sm={3} xs={0}></Col>
              <Col sm={3} xs={12}>
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={(e) => uploadArchivo(archivo, "post", 0)}
                >
                  Crear nuevos registros
                </button>
              </Col>
              <Col sm={3} xs={12}>
                <button
                  type="button"
                  className="btn botonGeneral"
                  onClick={(e) => uploadArchivo(archivo, "put", 0)}
                >
                  Actualizar registros
                </button>
              </Col>
              <Col sm={3} xs={0}></Col>
            </Row>
          </>
        ) : (
          <>
            {/* <Loader
              type="Oval"
              color="#FFBF00"
              style={{ textAlign: "center", position: "static" }}
            /> */}
            <h2 style={{ textAlign: "center", position: "static" }}>
              Cargando archivo.
            </h2>

            {/* <ul>
              {statusCarga
                ? statusCarga.map((statusC) => {
                    return <li>{statusC.Detail}</li>;
                  })
                : null}
            </ul> */}
          </>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {!loading ? (
          <>
            <AlertDismissibleExample alerta={estadoPOST} />
            <Row className="mb-3">
              <Col>
                <Row>
                  <Col sm={12} xs={12}>
                    <label className="titulo forn-label">
                      Informe de cargue:
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col sm={1} xs={1}></Col>
                  <Col sm={11} xs={11}>
                    <hr />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Row>
                  <Col sm={1} xs={12}></Col>
                  <Col sm={6} xs={12}>
                    <label className="subtitulo forn-label">Resumen</label>
                  </Col>
                  {enableButtonDetalle ? (
                    <Col sm={4} xs={12}>
                      {/* <a href={informeCargue ? informeCargue.URL : "#!"}> */}
                      <button
                        id="buttonDetalle"
                        type="button"
                        className="btn botonPositivo"
                        onClick={() => descargarArchivo("buttonDetalle", "")}
                      >
                        Descargar Detalle{"   "}
                        <IoMdDownload />
                      </button>
                      {/* </a> */}
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

                <Row>
                  <Col sm={1} xs={1}></Col>
                  <Col sm={11} xs={11}>
                    <hr />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col sm={1} xs={12}></Col>
              <Col sm={6} xs={12}>
                <label className="label forn-label">
                  Número de registros <b>correctos</b>:
                </label>
              </Col>
              {/* informeCargue.Resumen.Numero_registros_guardados.length */}
              <Col sm={5} xs={12}>
                <label className="label forn-label">
                  Número de registros con <b>errores</b> que no se añaden:
                </label>
              </Col>
            </Row>
            <Row>
              <Col sm={2} xs={12}></Col>
              <Col sm={4} xs={12}>
                {informeCargue && informeCargue.Resumen ? (
                  <>
                    <ul>
                      {informeCargue.Resumen.Numero_registros_correctos
                        .length === 0 ? (
                        <li>0 registros {tipoConsulta}</li>
                      ) : (
                        informeCargue.Resumen.Numero_registros_correctos.map(
                          (dat) => {
                            return (
                              <li>
                                {dat.hoja}: {dat.Registros_correctos}
                              </li>
                            );
                          }
                        )
                      )}
                    </ul>
                  </>
                ) : null}
              </Col>
              {/* informeCargue.Resumen.Numero_registros_guardados.length */}
              <Col sm={2} xs={12}></Col>
              <Col sm={4} xs={12}>
                {informeCargue && informeCargue.Resumen ? (
                  <>
                    <ul>
                      {informeCargue.Resumen.Numero_de_registros_con_error
                        .length === 0 ||
                      informeCargue.Resumen.Numero_de_registros_con_error ===
                        0 ? (
                        <li>0 registros con errores</li>
                      ) : (
                        informeCargue.Resumen.Numero_de_registros_con_error.map(
                          (dat, index) => {
                            return (
                              <li key={index}>
                                {dat.hoja}: {dat.Numero_registros_erroneos}
                              </li>
                            );
                          }
                        )
                      )}
                    </ul>
                  </>
                ) : null}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col sm={2} xs={12}></Col>
              <Col sm={4} xs={12}>
                {!dataEnviada ? (
                  <>
                    {confirmJSON.confirmation === true &&
                    confirmJSON.estado === 2 ? (
                      <button
                        type="button"
                        onClick={(e) => uploadArchivo(archivo, method, 1)}
                        className="btn botonPositivo"
                      >
                        Cargar
                      </button>
                    ) : (
                      <Button disabled className="btn botonPositivo">
                        Cargar
                      </Button>
                    )}
                  </>
                ) : null}
              </Col>
              <Col sm={2} xs={12}></Col>
              <Col sm={4} xs={12}>
                <button
                  type="button"
                  onClick={() => cancelarCarga()}
                  className="btn botonNegativo"
                >
                  Cancelar
                </button>
              </Col>
            </Row>
            <hr />
            {errores !== null ? (
              <Row>
                <Col>
                  <label className="label forn-label">
                    Ocurrieron los siguientes errores:
                  </label>
                </Col>
              </Row>
            ) : null}

            <Row>
              <Col sm={1} xs={12}></Col>
              <Col sm={11} xs={12}>
                {errores !== null ? (
                  <textarea
                    style={{ color: "red" }}
                    className="form-control"
                    defaultValue={errores}
                    rows="5"
                    id="Objetivo"
                    disabled
                  ></textarea>
                ) : null}
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Loader
              type="Oval"
              color="#FFBF00"
              style={{ textAlign: "center", position: "static" }}
            />
            <ul>
              {statusCarga
                ? statusCarga.map((statusC) => {
                    return <li>{statusC.payload.Detail}</li>;
                  })
                : null}
            </ul>
          </>
        )}
      </TabPanel>
    </>
  );
}
