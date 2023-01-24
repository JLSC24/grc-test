import React, { useState, useEffect, Children } from "react";
import ModalAlerta from "../Globales/ModalAlerta";
import { Row, Col, Form, Alert, Navbar, Container, Nav } from "react-bootstrap";

import { Link, useHistory } from "react-router-dom";
import Select from "react-select";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Queries from "../Components/QueriesAxios";

const _ = require("lodash");

const AlertDismissibleExample = ({ alerta }) => {
  switch (alerta) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return <Alert variant="success">Guardó exitosamente</Alert>;

    case 3:
      return <Alert variant="danger"></Alert>;

    case 4:
      return <Alert variant="warning">Error al enviar la información</Alert>;

    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;

    case 6:
      return (
        <Alert variant="warning">
          Ya existe una evaluación para el activo seleccionado
        </Alert>
      );
    case 7:
      return (
        <Alert variant="warning">
          Corrige los siguientes errores: • Debe completar los campos
          obligatorios
        </Alert>
      );
    case 8:
      return (
        <Alert variant="warning">
          No se permite crear un riesgo con el mismo nombre
        </Alert>
      );
    default:
      return <p></p>;
  }
};
const useStylesModal = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "30vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "30vh",
    //minHeight: "50vh",
  },
});

export default function EditarRiesgo(props) {
  const serviceAAD = new AADService();
  const classes = useStylesModal();

  const [susceptibilidad, setSusceptibilidad] = useState(null);
  const [naturaleza, setNaturaleza] = useState(null);
  const [juicio, setJuicio] = useState(null);
  const [partesRelacionadas, setPartesRelacionadas] = useState(null);
  const [cambiosProceso, setCambiosProceso] = useState(null);

  const [totalProbabilidad, setTotalProbabilidad] = useState(null);
  const [probabilidad, setProbabilidad] = useState(null);
  const [calificacion, setCalificacion] = useState(null);
  const [impacto, setImpacto] = useState(null);
  const [montoImpacto, setMontoImpacto] = useState(null);
  const [calificacionRiesgo, setCalificacionRiesgo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [observacion, setObservacion] = useState(null);

  const [idRiesgo, setIdRiesgo] = useState(null);

  const history = useHistory();

  const [validated, setValidated] = useState(false);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [showAlerta, setShowAlerta] = useState(false);
  const [textAlerta, setTextAlerta] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(false);

  useEffect(() => {
    let riesgo;
    const getRiesgo = async () => {
      try {
        const response_riesgo = await axios.get(
          process.env.REACT_APP_API_URL + "/GuardarEfectividad/" +
            localStorage.getItem("idRiesgo") +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        riesgo = await response_riesgo.data;
        setIdRiesgo(riesgo.idriesgo);
      } catch (error) {
        console.error(error);
      }
    };

    const calcular = () => {
      let tempSusceptibilidad = susceptibilidad ? susceptibilidad.value : null;
      let tempNaturaleza = naturaleza ? naturaleza.value : null;
      let tempJuicio = juicio ? juicio.value : null;
      let tempPartesRelacionadas = partesRelacionadas
        ? partesRelacionadas.value
        : null;
      let tempCambiosProceso = cambiosProceso ? cambiosProceso.value : null;

      setTotalProbabilidad(
        tempSusceptibilidad +
          tempNaturaleza +
          tempJuicio +
          tempPartesRelacionadas +
          tempCambiosProceso
      );

      let tempProbabilidad =
        tempSusceptibilidad +
        tempNaturaleza +
        tempJuicio +
        tempPartesRelacionadas +
        tempCambiosProceso;
      let probabilidad;

      if (tempProbabilidad > 0 && tempProbabilidad <= 5.06) {
        probabilidad = 1;
      } else if (tempProbabilidad > 0 && tempProbabilidad < 6.6) {
        probabilidad = 2;
      } else if (tempProbabilidad > 0 && tempProbabilidad <= 10.89) {
        probabilidad = 3;
      } else if (tempProbabilidad > 0 && tempProbabilidad) {
        probabilidad = 4;
      }
      setProbabilidad(probabilidad);

      switch (probabilidad) {
        case 1:
          setCalificacion("Baja");
          break;
        case 2:
          setCalificacion("Media");
          break;
        case 3:
          setCalificacion("Alta");
          break;
        case 4:
          setCalificacion("Muy Alta");
          break;

        default:
          break;
      }

      let tempImpacto = impacto ? impacto.value : null;

      let calificacion = tempImpacto * probabilidad;
      setCalificacionRiesgo(calificacion);

      let resultado;
      if (calificacion > 0 && calificacion <= 16) {
        resultado = "Tolerable";
      } else if (calificacion >= 17 && calificacion <= 48) {
        resultado = "Moderado";
      } else if (calificacion > 0 && calificacion > 48) {
        resultado = "Crítico";
      }

      setResultado(resultado);
    };
    const getValoracionSox = async () => {
      try {
        let responseValoracionSox = await Queries(
          null,
          "/valoracion_sox/" + localStorage.getItem("idRiesgo") + "/",
          "GET"
        );

        console.log(responseValoracionSox);
        setSusceptibilidad({
          label: responseValoracionSox.susceptibilidad_error,
          value:
            responseValoracionSox.susceptibilidad_error === "Alto"
              ? 3
              : responseValoracionSox.susceptibilidad_error === "Moderado"
              ? 2
              : 1,
        });

        setNaturaleza({
          label: responseValoracionSox.naturaleza,
          value: responseValoracionSox.naturaleza === "Manual" ? 2 : 1,
        });

        setJuicio({
          label: responseValoracionSox.naturaleza,
          value: responseValoracionSox.naturaleza === "Sí" ? 2 : 1,
        });

        setPartesRelacionadas({
          label: responseValoracionSox.naturaleza,
          value: responseValoracionSox.naturaleza === "Sí" ? 2 : 1,
        });

        setCambiosProceso({
          label: responseValoracionSox.naturaleza,
          value: responseValoracionSox.naturaleza === "Sí" ? 2 : 1,
        });

        setTotalProbabilidad(responseValoracionSox.total_ptobabilidad);
        setProbabilidad(responseValoracionSox.probabilidad);
        setCalificacion(responseValoracionSox.calificacion);
        setCalificacionRiesgo(responseValoracionSox.calificacion_riesgo);
        setImpacto({
          label: responseValoracionSox.impacto,
          value: parseInt(responseValoracionSox.impacto.split(" - ")[1]),
        });

        setMontoImpacto(responseValoracionSox.monto_impacto);
        setResultado(responseValoracionSox.resultado);
        setObservacion(responseValoracionSox.observaciones);
      } catch (error) {}
    };
    if (
      !susceptibilidad &&
      !naturaleza &&
      !juicio &&
      !partesRelacionadas &&
      !cambiosProceso &&
      !impacto &&
      !montoImpacto &&
      !probabilidad &&
      !totalProbabilidad &&
      !calificacion &&
      !calificacionRiesgo &&
      !resultado
    ) {
      getValoracionSox();
    }

    if (!idRiesgo) {
      getRiesgo();
    }
    calcular();
  }, [
    susceptibilidad,
    naturaleza,
    juicio,
    partesRelacionadas,
    cambiosProceso,
    impacto,
    montoImpacto,
  ]);

  const actualizarCalculo = () => {};

  //** Envía los datos al back */

  const sendData = async (event) => {
    event.preventDefault();
    setLoadingResumen(true);
    let detalleSOX = {
      susceptibilidad_error: susceptibilidad ? susceptibilidad.label : null,
      naturaleza: naturaleza ? naturaleza.label : null,
      requiere_alto_grado_juicio: juicio ? juicio.label : null,
      involucra_transacciones: partesRelacionadas
        ? partesRelacionadas.label
        : null,
      relacionado_cambio_procesos: cambiosProceso ? cambiosProceso.label : null,
      total_ptobabilidad: totalProbabilidad ? totalProbabilidad : null,
      probabilidad: probabilidad ? probabilidad : null,
      calificacion: calificacion ? calificacion : null,
      impacto: impacto ? impacto.label : null,
      monto_impacto: montoImpacto ? parseFloat(montoImpacto) : null,
      calificacion_riesgo: calificacionRiesgo ? calificacionRiesgo : null,
      resultado: resultado ? resultado : null,
      observaciones: observacion ? observacion : null,

      id_riesgo: idRiesgo,
    };
    console.log(detalleSOX);
    JSON.stringify(detalleSOX);

    let requestDetSOX = await Queries(detalleSOX, "/valoracion_sox/", "PUT");
    setLoadingResumen(false);

    if (requestDetSOX.status === 201) {
      setEstadoPost(2);
      setTimeout(() => {
        setEstadoPost(0);
      }, 4000);
    }
    setValidated(true);
  };

  return (
    <>
      <Row>
        <Col>
          <div
            style={{ position: "fixed", zIndex: 10, minWidth: "80vw" }}
            className={classes.content}
          >
            <div className={classes.appBarSpacer}>
              <Navbar bg="dark" variant="dark" expand="xl">
                <Container>
                  <Navbar id="justify-content-center">
                    <Nav className="ml-auto">
                      <Nav.Link>
                        <Link to="editarRiesgo" className="link2">
                          Información General
                        </Link>
                      </Nav.Link>
                      <Nav.Link>
                        <Link to="causaControles" className="link2">
                          Causas y controles
                        </Link>
                      </Nav.Link>
                      <Nav.Link>
                        <Link to="valoracionRiesgo" className="link2">
                          Valoración RO
                        </Link>
                      </Nav.Link>
                      <Nav.Link>
                        <Link to="valoracionSOX" className="link2">
                          Valoración SOX
                        </Link>
                      </Nav.Link>
                      <Nav.Link href="#resumenPorEfecto">
                        <Link to="riesgos">
                          <button type="button" className="btn botonNegativo2">
                            Cancelar
                          </button>
                        </Link>
                      </Nav.Link>
                      <Nav.Link href="#resumenPorEfecto">
                        {props.permisos.editar ? (
                          <button
                            type="button"
                            className="btn botonPositivo2"
                            id="send"
                            onClick={sendData}
                          >
                            Guardar
                          </button>
                        ) : null}
                      </Nav.Link>
                    </Nav>
                  </Navbar>
                </Container>
              </Navbar>
            </div>
          </div>
        </Col>
      </Row>
      <Form
        id="formData"
        noValidate
        validated={validated}
        onSubmit={sendData}
        className="mb-5"
      >
        {/* ///////////////////// ventanas modales //////////////////// */}

        <ModalAlerta
          showAlerta={showAlerta}
          setShowAlerta={setShowAlerta}
          text={textAlerta}
        />
        <Row className="mt-5 mb-3">
          <Col md={12}>
            {" "}
            <AlertDismissibleExample
              alerta={estadoPost}
              className="mb-3 mt-5"
            />{" "}
          </Col>
        </Row>
        {/* ///////////////////////////// Acciones ////////////////////////////// */}
        <Row className="mb-3 mt-5">
          <Col md={12}>
            <h1 className="titulo">Riesgo # {idRiesgo} </h1>
          </Col>
        </Row>
        <hr />
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Susceptibilidad a declaración equivocada por error o fraude*
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              options={[
                { label: "Alto", value: 3 },
                { label: "Moderado", value: 2 },
                { label: "Bajo", value: 1 },
              ]}
              value={susceptibilidad}
              placeholder={"Seleccione..."}
              onChange={(e) => {
                setSusceptibilidad(e);
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Naturaleza *</label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              options={[
                { label: "Manual", value: 2 },
                { label: "Automático", value: 1 },
              ]}
              value={naturaleza}
              placeholder={"Seleccione..."}
              onChange={(e) => {
                setNaturaleza(e);
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Requiere alto grado de juicio o estimación *
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              options={[
                { label: "Sí", value: 2 },
                { label: "No", value: 1 },
              ]}
              value={juicio}
              placeholder={"Seleccione..."}
              onChange={(e) => {
                setJuicio(e);
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              El riesgo involucra transacciones con Partes Relacionadas *
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              options={[
                { label: "Sí", value: 2 },
                { label: "No", value: 1 },
              ]}
              value={partesRelacionadas}
              placeholder={"Seleccione..."}
              onChange={(e) => {
                setPartesRelacionadas(e);
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              El riesgo está relacionado con cambios en el proceso asociados a
              nueva normatividad contable, aplicativos, personas, otros *
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              options={[
                { label: "Sí", value: 2 },
                { label: "No", value: 1 },
              ]}
              value={cambiosProceso}
              placeholder={"Seleccione..."}
              onChange={(e) => {
                setCambiosProceso(e);
              }}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">TOTAL probabilidad</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center number"
              placeholder="Total probabilidad"
              id="tot_probabilidad"
              disabled={true}
              defaultValue={totalProbabilidad ? totalProbabilidad : null}
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Probabilidad</label>
          </Col>
          <Col sm={3} xs={12}>
            <input
              type="text"
              className="form-control text-center number"
              placeholder="Probabilidad"
              id="probabilidad"
              disabled={true}
              defaultValue={probabilidad ? probabilidad : null}
            ></input>
          </Col>
          <Col sm={2} xs={12}>
            <label className="form-label label">Calificación</label>
          </Col>
          <Col sm={3} xs={12}>
            <input
              type="text"
              className="form-control text-center number"
              placeholder="Calificación"
              id="calificacion"
              disabled={true}
              defaultValue={calificacion ? calificacion : null}
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">IMPACTO *</label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              options={[
                { label: "Leve - 5", value: 5 },
                { label: "Moderado - 10", value: 10 },
                { label: "Severo - 15", value: 15 },
                { label: "Crítico - 20", value: 20 },
              ]}
              value={impacto}
              placeholder={"Seleccione..."}
              onChange={(e) => {
                setImpacto(e);
              }}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Monto del impacto *</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="number"
              className="form-control text-center number"
              placeholder="Monto de impacto"
              id="mont_imp"
              defaultValue={parseFloat(montoImpacto).toLocaleString()}
              onChange={(e) => setMontoImpacto(e.target.value)}
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Calificación del riesgo</label>
          </Col>
          <Col sm={3} xs={12}>
            <input
              type="text"
              className="form-control text-center number"
              placeholder="Calificación del riesgo"
              id="calificacion"
              disabled={true}
              defaultValue={calificacionRiesgo ? calificacionRiesgo : null}
            ></input>
          </Col>
          <Col sm={2} xs={12}>
            <label className="form-label label">Resultado</label>
          </Col>
          <Col sm={3} xs={12}>
            <input
              type="text"
              className={
                resultado
                  ? resultado === "Tolerable"
                    ? "form-control text-center result-tolerable"
                    : resultado === "Moderado"
                    ? "form-control text-center result-moderado"
                    : "form-control text-center result-critico"
                  : "form-control text-center"
              }
              placeholder="Resultado"
              id="resultado"
              disabled={true}
              defaultValue={resultado ? resultado : null}
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Observación de la valoración*
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <textarea
              className="form-control text-center"
              placeholder="Observación de la valoración"
              rows="3"
              id="Objetivo"
              defaultValue={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              required
            ></textarea>
          </Col>
        </Row>

        <Row className="mb-5 mt-5"></Row>
      </Form>
    </>
  );
}
