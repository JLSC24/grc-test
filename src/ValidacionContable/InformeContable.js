import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";
import { Row, Col, Button, Form } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";
import { IoMdCloudUpload } from "react-icons/io";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";

export default function InformeContable() {
  const serviceAAD = new AADService();
  const [datInformeBasilea, setDatInformeBasilea] = useState([]);
  const [urlBotonBasilea, setUrlBotonBasilea] = React.useState("");
  const [disableBotonBasilea, setDisableBotonBasilea] = React.useState(true);
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
          <h1 className="titulo">Informes contables</h1>
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
          <label className="label forn-label">Información contable:</label>
        </Col>
        <Col sm={4} xs={12}>
          <input
            type="file"
            name="files"
            accept=".xlsx,.csv"
            // onChange={(e) => subirArchivo(e.target.files)}
          ></input>
        </Col>
        <Col sm={3} xs={12}>
          <Button
            id="buttonEventos"
            type="button"
            className="btn botonPositivo"
            // onClick={() =>
            //   descargarArchivo(
            //     "buttonEventos",
            //     process.env.REACT_APP_API_URL + "/download/cargadores/cargador_eventos.xlsx"
            //   )
            // }
          >
            Subir archivo &nbsp;
            <IoMdCloudUpload />
          </Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>
      {/* <-------------------------------------fila 3-------------------------------------> */}
      <Row className="mb-3">
        <Col sm={1} xs={12}></Col>
        <Col sm={3} xs={12}>
          <label className="label forn-label">Resultados de validación:</label>
        </Col>

        <Col sm={2} xs={12}>
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
        <Col sm={2} xs={12}>
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

        <Col sm={3} xs={12}>
          <Button
            id="buttonEventos"
            type="button"
            className="btn botonPositivo"
            // onClick={() =>
            //   descargarArchivo(
            //     "buttonEventos",
            //     process.env.REACT_APP_API_URL + "/download/cargadores/cargador_eventos.xlsx"
            //   )
            // }
          >
            Descargar &nbsp;
            <IoMdDownload />
          </Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={12} xs={12}>
          <hr />
        </Col>
      </Row>
    </>
  );
}
