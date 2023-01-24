import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../../auth/authFunctions";
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import { UsuarioContext } from "../../Context/UsuarioContext";
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
export default function DescargaMaestros(props) {
  //let history = useHistory();
  const serviceAAD = new AADService();
  //const [startDate, setStartDate] = useState(new Date());
  const [enableButtonMaestros, setEnableButtonMaestros] = React.useState(true);
  const [enableButtonOC, setEnableButtonOC] = React.useState(true);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const { dataUsuario } = React.useContext(UsuarioContext);
  const { descarga, setDescarga } = React.useState(true);

  // async function pressBtnPerdidas(urlBotonPerdidas, buttonName) {
  //   setEnableButtonMaestros(false);
  //   fileFromURL(urlBotonPerdidas, buttonName);
  // }

  async function pressBtnPerdidas(urlBotonPerdidas, buttonName) {
    fileFromURL(urlBotonPerdidas, buttonName);
  }

  async function fileFromURL(url, buttonName) {
    setEstadoPost({
      id: 2,
      data: "Descargando archivo",
    });
    setTimeout(() => {
      setEstadoPost({ id: 0, data: null });
    }, 3000);

    switch (buttonName) {
      case "buttonMaestros":
        setEnableButtonMaestros(false);
        break;
      case "buttonOC":
        setEnableButtonOC(false);
        break;

      default:
        break;
    }
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
      case "buttonMaestros":
        setEnableButtonMaestros(true);
        break;
      case "buttonOC":
        setEnableButtonOC(true);
        break;

      default:
        break;
    }
  }

  useEffect(() => {}, []);

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      {/* <-------------------------------------fila 1-------------------------------------> */}
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Descarga de maestros</h1>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>
      {/* <-------------------------------------fila 2-------------------------------------> */}
      <Row className="mb-4">
        <Col sm={1} xs={12}></Col>
        <Col sm={4} xs={12}>
          <label className="forn-label label">
            Descargar listado de maestros:
          </label>
        </Col>
        <Col sm={2} xs={12}></Col>
        {props.permisos.descargar ? (
          enableButtonMaestros ? (
            <Col sm={3} xs={12}>
              <Button
                id="buttonPerdidas"
                type="button"
                className="btn botonPositivo"
                onClick={() =>
                  fileFromURL(
                    process.env.REACT_APP_API_URL + "/download/eventos/Maestros.xlsx",
                    "buttonMaestros"
                  )
                }
              >
                Descargar Maestros &nbsp;
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

      {/* <-------------------------------------fila 3-------------------------------------> */}
      <Row className="mb-4">
        <Col sm={1} xs={12}></Col>
        <Col sm={4} xs={12}>
          <label className="forn-label label">
            Descargar información de OCs para ejecución del VAR:
          </label>
        </Col>
        <Col sm={2} xs={12}></Col>
        {props.permisos.descargar ? (
          enableButtonOC ? (
            <Col sm={3} xs={12}>
              <Button
                id="buttonPerdidas"
                type="button"
                className="btn botonPositivo"
                onClick={() =>
                  fileFromURL(
                    process.env.REACT_APP_API_URL + "/download/eventos/OCs_VAR.xlsx",
                    "buttonOC"
                  )
                }
              >
                Descargar OCs VAR &nbsp;
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
    </>
  );
}
