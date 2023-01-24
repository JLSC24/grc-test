import React, { useState, useEffect, useContext } from "react";
import AADService from "../../../auth/authFunctions";
import axios from "axios";

import Select from "react-select";

import {
  Row,
  Col,
  Form,
  Alert,
  Button,
  Container,
  Modal,
} from "react-bootstrap";

import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export default function ModalCausas(props) {
  const serviceAAD = new AADService();
  const [showJustificacion, setShowJustificacion] = useState(false);
  const [justificacionAnulacionCausa, setJustificacionAnulacionCausa] =
    useState("");

  const [causaAnulada, setCausaAnulada] = useState([
    { value: 0, label: "Activo" },
  ]);
  const [causaN1, setCausaN1] = useState(null);
  const [causaN2, setCausaN2] = useState(null);
  const [causasN2, setCausasN2] = useState(null);
  const [ListaCausasN1, setListaCausasN1] = useState([]);
  const [ListaCausasN2, setListaCausasN2] = useState([]);
  const [pesoCausa, setPesoCausa] = useState(null);
  const [relevancia, setRelevancia] = useState([]);
  const [listaRelevancia, setListaRelevancia] = useState([]);
  const [descripcionIncidencia, setDescripcionIncidencia] = useState("");

  useEffect(() => {
    async function getCausas() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/causa/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        const responseRelevancia = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Causa_del_evento/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let causas = response.data.map(
          ({
            idcausa: value,
            nombre: label,
            nivel,
            padre,
            causa_n1,
            causa_n2,
            causa_n3,
            estado,
          }) => ({
            value,
            label,
            nivel,
            padre,
            causa_n1,
            causa_n2,
            causa_n3,
            estado,
          })
        );

        let relevancia = responseRelevancia.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );

        let causasN1 = causas.filter(function (causa) {
          return causa.nivel == 1;
        });

        let causasN2 = causas.filter(function (causa) {
          return causa.nivel == 2;
        });

        let valuesN1 = Object.values(causasN1);

        let temp1 = [];

        valuesN1.map(function (causa) {
          temp1.push(Object.values(causa)[0]);
        });

        setListaCausasN1(causasN1);
        setListaCausasN2(causasN2);
        setListaRelevancia(relevancia);
      } catch (error) {
        console.error(error);
      }
    }
    getCausas();
  }, []);

  useEffect(() => {
    let isSelectedCausaEmpty = !!(
      Array.isArray(props.causaSelected) && props.causaSelected.length > 0
    );

    if (!!isSelectedCausaEmpty) {
      console.log("data de las causas", props.dataCausas);

      console.log("id causa seleccionada", props.causaSelected);

      props.dataCausas.map((causa) => {
        if (props.causaSelected == causa.id_causa_delevento) {
          setCausaAnulada({
            value: causa.causa_anulada,
            label: causa.causa_anulada == 0 ? "Activa" : "Inactivo",
          });
          setCausaN1({
            value: causa.causa_n1,
            label: causa.causa_n1,
          });

          setCausaN2({
            value: causa.causa_n2,
            label: causa.causa_n2,
          });
          setDescripcionIncidencia(causa.descripcion_incidencia_causa);

          setJustificacionAnulacionCausa(causa.justificacion_anulacion_causa);

          setPesoCausa(causa.peso_causa);

          setRelevancia({
            value: causa.relevancia_causa,
            label: causa.relevancia_causa,
          });
        }
      });
    } else {
      setCausaN1(null);
      setCausaN2(null);
      setRelevancia(null);
      setPesoCausa(null);
      setDescripcionIncidencia("");
      setJustificacionAnulacionCausa("");
      setCausaAnulada([{ value: 0, label: "Activo" }]);
    }
  }, [props.causaSelected]);

  const FiltrarCausas = (causaN1) => {
    setCausaN1(causaN1);
    setCausaN2(null);
    let tempCausasN2 = ListaCausasN2.filter(
      (causaN2) => causaN2.padre == causaN1.value
    );
    setCausasN2(tempCausasN2);
  };

  const GuardarCausa = () => {
    let newArray = props.dataCausas.map((causa) => {
      if (causa.id_causa_delevento == props.causaSelected[0]) {
        return {
          ...causa,

          causa_anulada: causaAnulada.value,
          causa_n1: causaN1.label,
          causa_n2: causaN2.label,
          descripcion_incidencia_causa: descripcionIncidencia,
          id_causa_delevento: causa.id_causa_delevento,
          idevento_materializado: props.idEventoMaterializado,
          justificacion_anulacion_causa: justificacionAnulacionCausa,
          peso_causa: pesoCausa,
          relevancia_causa: relevancia.label,
        };
      }
      return causa;
    });

    props.setDataCausas(newArray);
    onHide();
  };

  const CrearCausa = () => {
    let length = props.dataCausas.push({
      causa_anulada: 0,
      causa_n1: causaN1.label,
      causa_n2: causaN2.label,
      descripcion_incidencia_causa: descripcionIncidencia,
      idevento_materializado: props.idEventoMaterializado,
      justificacion_anulacion_causa: justificacionAnulacionCausa,
      peso_causa: pesoCausa,
      relevancia_causa: relevancia.label,
    });

    props.dataCausas[length - 1].id_causa_delevento =
      "C" + (length - 1) + "-" + props.idEventoMaterializado;

    onHide();
  };

  const onHide = () => {
    props.setShowModalCausas(false);
    setCausaN1(null);
    setCausaN2(null);
    setRelevancia(null);
    setPesoCausa(null);
    setDescripcionIncidencia(null);
    setJustificacionAnulacionCausa(null);
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Asociar causa al evento
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Estado evento</label>
            </Col>
            <Col sm={4} xs={12}>
              <Select
                components={animatedComponents}
                placeholder="Nuevo Estado del evento"
                options={[
                  { value: "0", label: "Activo" },
                  { value: "1", label: "Inactivo" },
                ]}
                onChange={(e) => {
                  if (e.value == 1) {
                    setShowJustificacion(true);
                  } else {
                    setShowJustificacion(false);
                    setJustificacionAnulacionCausa("");
                  }
                  setCausaAnulada(e);
                }}
                value={causaAnulada}
              />
            </Col>
            <Col sm={2} xs={12}>
              <label className="forn-label label">Motivo inactivación</label>
            </Col>
            {causaAnulada.value == 1 ? (
              <>
                <Col sm={4} xs={12}>
                  <textarea
                    className="form-control text-center"
                    placeholder="Motivo de inactivación de la causa"
                    rows="3"
                    onChange={(e) =>
                      setJustificacionAnulacionCausa(e.target.value)
                    }
                    value={justificacionAnulacionCausa}
                  />
                </Col>
              </>
            ) : (
              <></>
            )}
          </Row>
          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Causa nivel 1</label>
            </Col>
            <Col sm={4} xs={12}>
              <Select
                components={animatedComponents}
                options={ListaCausasN1}
                placeholder="Seleccione la causa de nivel 1"
                onChange={FiltrarCausas}
                value={causaN1}
              />
            </Col>
            <Col sm={2} xs={12}>
              <label className="forn-label label">Causa nivel 2</label>
            </Col>
            <Col sm={4} xs={12}>
              <Select
                components={animatedComponents}
                options={causasN2}
                placeholder="Seleccione la causa de nivel 2"
                onChange={setCausaN2}
                value={causaN2}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Relevancia de la causa</label>
            </Col>
            <Col sm={4} xs={12}>
              <Select
                components={animatedComponents}
                options={listaRelevancia}
                placeholder="Seleccione la relevancia de la causa"
                onChange={setRelevancia}
                value={relevancia}
              />
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Peso de la causa</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                type="text"
                pattern="(^\d*\.?\d*[1-9]+\d*$)|(^[0-9]+\d*\.\d*$)"
                className="form-control  texto"
                placeholder="Ingrese el peso de la causa"
                onChange={(e) =>
                  setPesoCausa((v) =>
                    e.target.validity.valid ? e.target.value : v
                  )
                }
                value={pesoCausa}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">
                Descripción de la causa
              </label>
            </Col>
            <Col sm={10} xs={12}>
              <textarea
                className="form-control text-center"
                placeholder="Descripción de la incidencia de la causa"
                rows="2"
                onChange={(e) => setDescripcionIncidencia(e.target.value)}
                value={descripcionIncidencia}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {!(
          Array.isArray(props.causaSelected) && props.causaSelected.length > 0
        ) ? (
          <Button className="botonPositivo" onClick={CrearCausa}>
            Crear causa
          </Button>
        ) : (
          <Button className="botonPositivo" onClick={GuardarCausa}>
            Guardar causa
          </Button>
        )}

        <Button className="botonNegativo" onClick={onHide}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
