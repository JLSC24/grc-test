import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import { Row, Col } from "react-bootstrap";

export default function ResumenCalculo({
  exposicionIn,
  efectividadCtrl,
  nivelRiesgoInherente,
  nivelRiesgoResidual,
  setNivelRiesgoResidual,
  exposicionResidual,
  setExposicionResidual,
  par,
  Calculado,
  isHiddenDecision,
  setCalculaResumen,
  loadingResumen,
  setLoadingResumen,
}) {
  const [colorNvlInherente, setColorNvlInherente] = useState(null);
  //const [exposicionResidual, setExposicionResidual] = useState(null);
  //const [nivelRiesgoResidual, setNivelRiesgoResidual] = useState(null);
  const [colorNvlResidual, setColorNvlResidual] = useState(null);

  useEffect(() => {
    const asignaColorInherente = () => {
      let nivel = nivelRiesgoInherente;
      if (nivel === "Muy crítico") {
        setColorNvlInherente("#900000");
      } else if (nivel === "Crítico") {
        setColorNvlInherente("#ff0000");
      } else if (nivel === "Moderado") {
        setColorNvlInherente("#ffdb00");
      } else if (nivel === "Tolerable") {
        setColorNvlInherente("#00b050");
      }
    };
    asignaColorInherente();

    const calculaResiduales = () => {
      console.log("******CALUCLADO?******:", Calculado);
      if (Calculado === true) {
        let exposicionResidual = exposicionIn * (1 - efectividadCtrl / 100);
        let result = exposicionResidual;
        setExposicionResidual(exposicionResidual);

        if (par) {
          if (result <= par.tolerable) {
            setNivelRiesgoResidual("Tolerable");
            setColorNvlResidual("#00b050");
          } else if (result > par.tolerable && result <= par.moderado) {
            setNivelRiesgoResidual("Moderado");
            setColorNvlResidual("#ffdb00");
          } else if (result > par.moderado && result <= par.critico) {
            setNivelRiesgoResidual("Crítico");
            setColorNvlResidual("#ff0000");
          } else if (result > par.critico && result <= par.muy_critico) {
            setNivelRiesgoResidual("Muy crítico");
            setColorNvlResidual("#900000");
          } else if (result > par.muy_critico) {
            setNivelRiesgoResidual("Muy crítico");
            setColorNvlResidual("#900000");
          }
        }
      } else {
        let nivel = nivelRiesgoResidual;
        if (nivel === "Muy crítico") {
          setColorNvlResidual("#900000");
        } else if (nivel === "Crítico") {
          setColorNvlResidual("#ff0000");
        } else if (nivel === "Moderado") {
          setColorNvlResidual("#ffdb00");
        } else if (nivel === "Tolerable") {
          setColorNvlResidual("#00b050");
        }
      }
    };

    calculaResiduales();
  }, [
    par,
    exposicionIn,
    efectividadCtrl,
    nivelRiesgoInherente,
    setColorNvlInherente,
    setExposicionResidual,
    setNivelRiesgoResidual,
    isHiddenDecision,
    nivelRiesgoResidual,
    exposicionResidual,
  ]);

  return (
    <>
      <Row className="mb-3 mt-4">
        <Col sm={2} xs={12}>
          <label className="form-label label">Exposición inherente</label>
        </Col>
        <Col sm={2} xs={12}>
          <input
            type="text"
            className="form-control text-center texto"
            value={parseFloat(exposicionIn).toLocaleString()}
            readOnly
          ></input>
        </Col>
        <Col sm={2} xs={12}>
          <label className="form-label label">Nivel riesgo inherente</label>
        </Col>
        <Col sm={2} xs={12}>
          <input
            type="text"
            className="form-control text-center texto"
            style={{ backgroundColor: colorNvlInherente, color: "white" }}
            value={nivelRiesgoInherente}
            readOnly
          ></input>
        </Col>
      </Row>
      <Row className="mb-3 mt-4">
        <Col sm={2} xs={12}>
          <label className="form-label label">Efectividad de controles</label>
        </Col>
        <Col sm={2} xs={12}>
          <input
            type="text"
            className="form-control text-center texto"
            value={efectividadCtrl}
            readOnly
          ></input>
        </Col>
        <Col sm={4}></Col>
        <Col sm={4} xs={12}>
          {/*  <Row className="justify-content-evenly">
                <Col className="text-center">
                  {" "}
                  <button
                    type="button"
                    className="btn botonPositivo2"
                    id=""
                    onClick={() => {
                      setCalculaResumen(true);
                      setLoadingResumen(true);
                    }}
                  >
                    Calcular
                  </button>
                </Col>
                <Col hidden={isHiddenDecision}>
                  <button
                    type="button"
                    className="btn botonPositivo2"
                    id=""
                    onClick={() => {}}
                  >
                    Solicitar decisión
                  </button>
                </Col>
              </Row> */}
        </Col>
      </Row>

      <Row>
        <Col sm={2} xs={12}>
          <label className="form-label label">Exposición residual</label>
        </Col>
        <Col sm={2} xs={12}>
          <input
            type="text"
            className="form-control text-center texto"
            value={parseFloat(exposicionResidual).toLocaleString()}
            readOnly
          ></input>
        </Col>
        <Col sm={2} xs={12}>
          <label className="form-label label">Nivel riesgo residual</label>
        </Col>
        <Col sm={2} xs={12}>
          <input
            type="text"
            className="form-control text-center texto"
            style={{ backgroundColor: colorNvlResidual, color: "white" }}
            value={nivelRiesgoResidual}
            readOnly
          ></input>
        </Col>
      </Row>
    </>
  );
}
