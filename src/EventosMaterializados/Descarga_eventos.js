import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import { UsuarioContext } from "../Context/UsuarioContext";
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
export default function Descarga_eventos(props) {
  //let history = useHistory();
  const serviceAAD = new AADService();
  //const [startDate, setStartDate] = useState(new Date());
  const [enableButtonPerdidas, setEnableButtonPerdidas] = React.useState(true);
  const [enableButtonPerdidasProv, setEnableButtonPerdidasProv] =
    React.useState(true);
  const [enableButtonHistorico, setEnableButtonHistorico] =
    React.useState(true);
  const [enableButtonSFC, setEnableButtonSFC] = React.useState(true);
  const [enableButtonVAR, setEnableButtonVAR] = React.useState(true);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const { dataUsuario } = React.useContext(UsuarioContext);
  const { descarga, setDescarga } = React.useState(true);
  async function fileFromURL(url, buttonName) {
    let urlConsulta = url;
    setEstadoPost({
      id: 2,
      data: "Descargando archivo",
    });
    setTimeout(() => {
      setEstadoPost({ id: 0, data: null });
    }, 3000);
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
        } else {
          setEstadoPost({
            id: 3,
            data: "Error en la descarga",
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        }
      });

    switch (buttonName) {
      case "buttonPerdidas":
        setEnableButtonPerdidas(true);
        break;
      case "buttonPerdidasProv":
        setEnableButtonPerdidasProv(true);
        break;
      case "buttonHistorico":
        setEnableButtonHistorico(true);
        break;
      case "buttonSFC":
        setEnableButtonSFC(true);
        break;
      case "buttonVAR":
        setEnableButtonVAR(true);
        break;
      default:
        break;
    }
  }

  async function descargaEventos() {
    setEnableButtonPerdidas(false);
    let urlFetch;
    if (dataUsuario.idcompania === 9) {
      urlFetch = process.env.REACT_APP_API_URL + "/download/eventos/Eventos_Tuya.xlsx";
    } else if (dataUsuario.idcompania === 10) {
      urlFetch = process.env.REACT_APP_API_URL + "/download/eventos/Eventos_Renting.xlsx";
    } else {
      urlFetch = process.env.REACT_APP_API_URL + "/download/eventos/Eventos_Grupo.xlsx";
    }

    fileFromURL(urlFetch, "buttonPerdidas");
  }

  async function descargaEventosProv() {
    setEnableButtonPerdidasProv(false);
    let urlFetch;
    if (dataUsuario.idcompania === 9) {
      urlFetch =
        process.env.REACT_APP_API_URL + "/download/eventos/Eventos_Tuya_PROV.xlsx";
    } else if (dataUsuario.idcompania === 10) {
      urlFetch =
        process.env.REACT_APP_API_URL + "/download/eventos/Eventos_Renting_PROV.xlsx";
    } else {
      urlFetch =
        process.env.REACT_APP_API_URL + "/download/eventos/Eventos_Grupo_PROV.xlsx";
    }

    fileFromURL(urlFetch, "buttonPerdidasProv");
  }
  async function descargaHistorico() {
    setEnableButtonHistorico(false);
    let urlFetch;
    if (dataUsuario.idcompania === 9) {
      urlFetch = process.env.REACT_APP_API_URL + "/download/eventos/Historico_Tuya.xlsx";
    } else if (dataUsuario.idcompania === 10) {
      urlFetch =
        process.env.REACT_APP_API_URL + "/download/eventos/Historico_Renting.xlsx";
    } else {
      urlFetch = process.env.REACT_APP_API_URL + "/download/eventos/Historico_Grupo.xlsx";
    }

    fileFromURL(urlFetch, "buttonHistorico");
  }
  async function descargaSFC() {
    setEnableButtonSFC(false);
    let urlFetch;
    if (dataUsuario.idcompania === 9) {
      urlFetch =
        process.env.REACT_APP_API_URL + "/download/eventos/DESCARGA_SFC_TUYA.xlsx";
    } else {
      urlFetch = process.env.REACT_APP_API_URL + "/download/eventos/DESCARGA_SFC.xlsx";
    }

    fileFromURL(urlFetch, "buttonSFC");
  }
  useEffect(() => {}, []);

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      {/* <-------------------------------------fila 1-------------------------------------> */}
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Descarga de eventos</h1>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>
      {/* <-------------------------------------fila 3-------------------------------------> */}
      <Row className="mb-4">
        <Col sm={1} xs={12}></Col>
        <Col sm={4} xs={12}>
          <label className="forn-label label">
            Informe de pérdidas de los últimos 2 años sin provisiones (para
            reportería corporativa):
          </label>
        </Col>
        <Col sm={2} xs={12}></Col>

        <Col sm={3} xs={12}>
          {props.permisos.descargar ? (
            enableButtonPerdidas ? (
              <Button
                id="buttonPerdidas"
                type="button"
                className="btn botonPositivo"
                onClick={() => {
                  descargaEventos();
                }}
              >
                Descargar pérdidas &nbsp;
                <IoMdDownload />
              </Button>
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
        </Col>
      </Row>
      <Row className="mb-4">
        <Col sm={1} xs={12}></Col>
        <Col sm={4} xs={12}>
          <label className="forn-label label">
            Informe de pérdidas de los últimos 2 años con provisiones (para
            validación contable):
          </label>
        </Col>
        <Col sm={2} xs={12}></Col>

        <Col sm={3} xs={12}>
          {props.permisos.descargar ? (
            enableButtonPerdidas ? (
              <Button
                id="buttonPerdidas"
                type="button"
                className="btn botonPositivo"
                onClick={() => {
                  descargaEventosProv();
                }}
              >
                Descargar provisiones &nbsp;
                <IoMdDownload />
              </Button>
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
        </Col>
      </Row>
      <Row className="mb-4">
        <Col sm={1} xs={12}></Col>
        <Col sm={4} xs={12}>
          <label className="forn-label label">
            Descargar informe histórico de pérdidas con provisiones (5 Años)
          </label>
        </Col>
        <Col sm={2} xs={12}></Col>
        {props.permisos.descargar ? (
          enableButtonHistorico ? (
            <Col sm={3} xs={12}>
              <Button
                id="buttonHistorico"
                type="button"
                className="btn botonPositivo"
                onClick={() => {
                  descargaHistorico();
                }}
              >
                Descargar Histórico &nbsp;
                <IoMdDownload />
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
      {dataUsuario.idcompania === 10 ? null : (
        <Row className="mb-4">
          <Col sm={1} xs={12}></Col>
          <Col sm={4} xs={12}>
            <label className="forn-label label">Descargar informe SFC</label>
          </Col>
          <Col sm={2} xs={12}></Col>
          {props.permisos.descargar ? (
            enableButtonSFC ? (
              <Col sm={3} xs={12}>
                <Button
                  id="buttonSFC"
                  type="button"
                  className="btn botonPositivo"
                  onClick={() => {
                    descargaSFC();
                  }}
                >
                  Descargar SFC &nbsp;
                  <IoMdDownload />
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
      )}
      {dataUsuario.idcompania === 9 || dataUsuario.idcompania === 10 ? null : (
        <Row className="mb-4">
          <Col sm={1} xs={12}></Col>
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Descargar informe para el VAR
            </label>
          </Col>
          <Col sm={2} xs={12}></Col>
          {props.permisos.descargar ? (
            enableButtonVAR ? (
              <Col sm={3} xs={12}>
                <Button
                  id="buttonSFC"
                  type="button"
                  className="btn botonPositivo"
                  onClick={() => {
                    setEnableButtonVAR(false);
                    fileFromURL(
                      process.env.REACT_APP_API_URL + "/download/eventos/DESCARGA_SFC.xlsx",
                      "buttonVAR"
                    );
                  }}
                >
                  Descargar VAR &nbsp;
                  <IoMdDownload />
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
      )}
    </>
  );
}
