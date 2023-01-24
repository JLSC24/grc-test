import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";
import { Row, Col, Button, Form } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";

export default function Descargas(props) {
  //let history = useHistory();
  const serviceAAD = new AADService();
  //const [startDate, setStartDate] = useState(new Date());
  const [enableButtonPerdidas, setEnableButtonPerdidas] = React.useState(true);
  const [enableButtonHistorico, setEnableButtonHistorico] =
    React.useState(true);
  const [enableButtonVAR, setEnableButtonVAR] = React.useState(true);
  const [enableButtonSFC, setEnableButtonSFC] = React.useState(true);
  const [enableButtonBasilea, setEnableButtonBasilea] = React.useState(true);
  const [enableButtonEfectos, setEnableButtonEfectos] = React.useState(true);
  const [enableButtonAtomo, setEnableButtonAtomo] = React.useState(true);
  const [enableButtonPerdidasProv, setEnableButtonPerdidasProv] =
    React.useState(true);
  const [datInformeBasilea, setDatInformeBasilea] = useState([]);
  const [urlBotonBasilea, setUrlBotonBasilea] = React.useState("");
  const [disableBotonBasilea, setDisableBotonBasilea] = React.useState(true);
  const [descarga, setDescarga] = React.useState(true);
  async function pressBtnPerdidas(urlBotonPerdidas, buttonName) {
    fileFromURL(urlBotonPerdidas, buttonName);
  }
  async function fileFromURL(url, buttonName) {
    let urlConsulta = url;
    axios({
      url: urlConsulta,
      method: "GET",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
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
    });

    switch (buttonName) {
      case "buttonPerdidas":
        setEnableButtonPerdidas(true);
        break;
      case "buttonHistorico":
        setEnableButtonHistorico(true);
        break;
      case "buttonBasilea":
        setEnableButtonBasilea(true);
        break;
      case "buttonEfectos":
        setEnableButtonEfectos(true);
        break;
      case "buttonVAR":
        setEnableButtonVAR(true);
        break;
      case "buttonSFC":
        setEnableButtonSFC(true);
        break;
      case "buttonAtomo":
        setEnableButtonAtomo(true);
        break;
      default:
        break;
    }
  }

  async function nestedFileFromURL(string, buttonName) {
    var url = "";
    var data = {};

    switch (string) {
      case "Bancolombia":
        setEnableButtonBasilea(false);
        url = process.env.REACT_APP_API_URL + "/informes";
        data = { informe: "Basilea_Bancolombia" };
        break;
      case "Consolidado":
        setEnableButtonBasilea(false);
        url = process.env.REACT_APP_API_URL + "/informes";
        data = { informe: "Basilea_Consolidado" };
        break;
      case "Banca de Inversión":
        setEnableButtonBasilea(false);
        url = process.env.REACT_APP_API_URL + "/informes";
        data = { informe: "Basilea_Banca_de_Inversión" };
        break;
      case "buttonEfectos":
        setEnableButtonEfectos(false);
        url = process.env.REACT_APP_API_URL + "/informes";
        data = { informe: "efectos" };
        break;
      case "buttonAtomo":
        setEnableButtonAtomo(false);
        url = process.env.REACT_APP_API_URL + "/informes";
        data = { informe: "informe_atomo" };
      default:
        break;
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    })
      .then((response) => {
        response.json().then((data) => {
          let urlFetch = data.URL;
          fileFromURL(urlFetch, buttonName);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function tipoInformeBasilea(e) {
    if (e.target.value === "") {
      setDisableBotonBasilea(true);
    } else {
      setUrlBotonBasilea(e.target.value);
      setDisableBotonBasilea(false);
    }
  }

  useEffect(() => {
    const datosInformeBasilea = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Informes/Basilea",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatInformeBasilea(data);
    };

    datosInformeBasilea();
  }, []);

  return (
    <>
      {/* <-------------------------------------fila 1-------------------------------------> */}
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Descarga de archivos</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>
      {/* <-------------------------------------fila 2-------------------------------------> */}
      <Row className="mb-3">
        <Col sm={1} xs={12}></Col>
        <Col sm={3} xs={12}>
          <label className="forn-label label">
            Informe de Basilea (10 años):
          </label>
        </Col>
        <Col sm={3} xs={12}>
          <select
            className="form-control texto"
            required
            id="Compania"
            onChange={(e) => tipoInformeBasilea(e)}
          >
            <option value="">Seleccione opcíon</option>
            {datInformeBasilea !== null
              ? datInformeBasilea.map((tiposInforme) => {
                  return (
                    <option className="texto" value={tiposInforme.valor}>
                      {tiposInforme.valor}
                    </option>
                  );
                })
              : null}
          </select>
        </Col>
        {props.permisos.descargar ? (
          enableButtonBasilea ? (
            <Col sm={3} xs={12}>
              <Button
                disabled={disableBotonBasilea}
                id="buttonBasilea"
                type="button"
                className="btn botonPositivo"
                onClick={() => {
                  setEnableButtonPerdidas(false);
                  nestedFileFromURL(urlBotonBasilea, "buttonBasilea");
                }}
              >
                Descargar informe &nbsp;
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
            Informe de pérdidas de los ultimos 2 años sin provisiones:
          </label>
        </Col>
        <Col sm={2} xs={12}></Col>
        {props.permisos.descargar ? (
          enableButtonPerdidasProv ? (
            <Col sm={3} xs={12}>
              <Button
                id="buttonPerdidas"
                type="button"
                className="btn botonPositivo"
                onClick={() => {
                  setEnableButtonPerdidas(false);

                  pressBtnPerdidas(
                    process.env.REACT_APP_API_URL + "/download/eventos/Eventos.xlsx",
                    "buttonPerdidas"
                  );
                }}
              >
                Descargar pérdidas &nbsp;
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
      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>

      {/* <-------------------------------------fila 4-------------------------------------> */}
      <Row className="mb-4">
        <Col sm={1} xs={12}></Col>
        <Col sm={4} xs={12}>
          <label className="forn-label label">
            Informe de pérdidas de los ultimos 2 años con provisiones:
          </label>
        </Col>
        <Col sm={2} xs={12}></Col>
        {props.permisos.descargar ? (
          enableButtonPerdidas ? (
            <Col sm={3} xs={12}>
              <Button
                id="buttonPerdidas"
                type="button"
                className="btn botonPositivo"
                onClick={() => {
                  setEnableButtonPerdidas(false);

                  pressBtnPerdidas(
                    process.env.REACT_APP_API_URL + "/download/eventos/Eventos_PROV.xlsx",
                    "buttonPerdidas"
                  );
                }}
              >
                Descargar provisiones &nbsp;
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
      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>
      {/* <-------------------------------------fila 5-------------------------------------> */}
      <Row className="mb-4">
        <Col sm={1} xs={12}></Col>
        <Col sm={4} xs={12}>
          <label className="forn-label label">
            Descargar informe histórico de perdidas con provisiones(5 Años)
          </label>
        </Col>
        <Col sm={2} xs={12}></Col>
        {props.permisos.descargar ? (
          enableButtonHistorico ? (
            <Col sm={3} xs={12}>
              <Button
                id="buttonPerdidas"
                type="button"
                className="btn botonPositivo"
                onClick={() => {
                  setEnableButtonHistorico(false);
                  pressBtnPerdidas(
                    process.env.REACT_APP_API_URL + "/download/eventos/Eventos_Historico.xlsx",
                    "buttonHistorico"
                  );
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
      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>

      {/* <-------------------------------------fila 6-------------------------------------> */}
      <Row>
        <Col sm={1} xs={12}></Col>
        <Col sm={6} xs={12}>
          <label className="forn-label label">Descargar efectos:</label>
        </Col>
        {/* <Col sm={3} xs={12}>
          <select
            className="form-control texto"
            required
            id="Compania"
            // onChange={() => cambiarComp()}
          >
            <option value="">Seleccione compañia</option>
            {datCompañia !== null
              ? datCompañia.map((compañia) => {
                  return (
                    <option className="texto" value={compañia.idcompania}>
                      {compañia.compania}
                    </option>
                  );
                })
              : null}
          </select>
        </Col> */}
        {props.permisos.descargar ? (
          enableButtonEfectos ? (
            <Col sm={3} xs={12}>
              <Button
                id="buttonEfectos"
                type="button"
                className="btn botonPositivo"
                onClick={() =>
                  nestedFileFromURL("buttonEfectos", "buttonEfectos")
                }
              >
                Descargar efectos &nbsp;
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
      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>

      {/* <-------------------------------------fila 7-------------------------------------> */}
      <Row className="mb-4">
        <Col sm={1} xs={12}></Col>
        <Col sm={4} xs={12}>
          <label className="forn-label label">
            Descargar reporte para el VAR
          </label>
        </Col>
        <Col sm={2} xs={12}></Col>
        {props.permisos.descargar ? (
          enableButtonVAR ? (
            <Col sm={3} xs={12}>
              <Button
                id="buttonPerdidas"
                type="button"
                className="btn botonPositivo"
                onClick={() => {
                  setEnableButtonVAR(false);
                  pressBtnPerdidas(
                    process.env.REACT_APP_API_URL + "/download/eventos/DESCARGA_VAR.xlsx",
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
      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>

      {/* <-------------------------------------fila 8-------------------------------------> */}
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
                id="buttonPerdidas"
                type="button"
                className="btn botonPositivo"
                onClick={() => {
                  setEnableButtonSFC(false);
                  pressBtnPerdidas(
                    process.env.REACT_APP_API_URL + "/download/eventos/DESCARGA_SFC.xlsx",
                    "buttonSFC"
                  );
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
      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>
      {/* <-------------------------------------fila 9-------------------------------------> */}
      <Row>
        <Col sm={1} xs={12}></Col>
        <Col sm={6} xs={12}>
          <label className="forn-label label">Descargar informe Átomo</label>
        </Col>
        {props.permisos.descargar ? (
          enableButtonAtomo ? (
            <Col sm={3} xs={12}>
              <Button
                id="buttonAtomo"
                type="button"
                className="btn botonPositivo"
                onClick={() =>
                  nestedFileFromURL("buttonAtomo", "buttonAtomo")
                }
              >
                Descargar Átomo &nbsp;
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
      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>
    </>
  );
}
