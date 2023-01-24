import React, { useState, useEffect } from "react";
import { Button, Row, Col, Modal } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import AADService from "../auth/authFunctions";

export default function ModalDecision({
  showDecision,
  setShowDecision,
  riesgo,
}) {
  const [show, setShow] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [tomadorDecisones, setTomadorDecisones] = React.useState([]);
  const [responsabledecision, setResponsableDecision] = React.useState(null);
  const serviceAAD = new AADService();

  /*   const opcionesTomadorDecision = [
    { value: "Comité de Riesgos", label: "Comité de Riesgos" },
    { value: "Vicepresidente", label: "Vicepresidente" },
    { value: "Director", label: "Director" },
    { value: "Gerente", label: "Gerente" },
  ]; */

  useEffect(() => {
    if (showDecision === true) {
      setShow(true);
    }
    async function getUsuarios() {
      const response_CRO = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/6",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataCRO = response_CRO.data;
      const response_BO = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/3",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataBO = response_BO.data;
      dataBO = dataCRO.concat(dataBO);
      const response_RO = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/7",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataRO = response_RO.data;
      dataBO = dataBO.concat(dataRO);
      const response_RM = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/2",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataRM = response_RM.data;
      dataBO = dataBO.concat(dataRM);

      let temp = [];
      dataBO.map((dat) => {
        temp.push({
          value: dat.idposicion,
          label: dat.nombre,
          //rol: dat.perfil,
          posicion: dat.nombreposicion,
        });
        return null;
      });

      const setObj = new Set();

      const usrUnique = temp.reduce((acc, persona) => {
        if (!setObj.has(persona.label)) {
          setObj.add(persona.label, persona);
          acc.push(persona);
        }
        return acc;
      }, []);

      setTomadorDecisones(usrUnique);
    }

    const GetUser = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/usuario/" + serviceAAD.getUser().userName + "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setUsuario(data);
    };
    GetUser();
    getUsuarios();
  }, [showDecision, setShow]);

  const handleClose = () => {
    setShow(false);
    setShowDecision(false);
  };

  const enviarSolicitud = async (e) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    let iddecision = 0;
    //TODO:siempre se cambia el usuario de creación para quien solicita la decisión
    var data = JSON.stringify({
      idriesgo: riesgo.idriesgo,
      tomadordecision: responsabledecision.posicion,
      tomadordecision2: "Director",
      idresponsabledecision: parseInt(responsabledecision.value),
      fecha_decision: today.toISOString(),
      observaciones: null,
      idusuario_decision: usuario.idposicion, //TODO:quien es ese usuario decisión
      fechacreacion: today.toISOString(),
      idusuariocreacion: usuario.idposicion,
      fechamodificacion: today.toISOString(),
      idusuariomodificacion: usuario.idposicion,
      disp_numerico1: 0.0,
      disp_numerico2: 0.0,
      disp_varchar1: null,
      disp_varchar2: null,
      decision: "Pendiente",
    });

    if (riesgo.iddecision && riesgo.iddecision !== "") {
      fetch(
        process.env.REACT_APP_API_URL + "/EditarDecisiones/" + riesgo.iddecision + "/",
        {
          method: "PUT",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      )
        .then((data) =>
          data.json().then((response) => {
            if (data.status >= 200 && data.status < 300) {
              window.location.reload();
            } else if (data.status >= 500) {
              /* setEstadoPostDecision(5); */
            } else if (data.status >= 400 && data.status < 500) {
              /* setEstadoPostDecision(4); */
            }
          })
        )
        .catch(function (err) {});
    } else {
      fetch(process.env.REACT_APP_API_URL + "/EditarDecisiones/0/", {
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      })
        .then((data) =>
          data.json().then((response) => {
            if (data.status >= 200 && data.status < 300) {
              window.location.reload();
            } else if (data.status >= 500) {
              /* setEstadoPostDecision(5); */
            } else if (data.status >= 400 && data.status < 500) {
              /* setEstadoPostDecision(4); */
            }
          })
        )
        .catch(function (err) {});
    }
  };

  return (
    <>
      <Modal
        size="sm"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Solicitud de Decisiones
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Row className="mb-3">
            <Col sm={6} xs={12}>
              <label className="form-label label">Tomador de la decisión</label>
            </Col>
            <Col sm={6} xs={10}>
              <Select
                id="valueoption"
                placeholder={"Seleccione un Tomador de decisión..."}
                options={opcionesTomadorDecision}
                onChange={filtrarTomadorDecision}
              />
            </Col>
          </Row> */}
          <Row className="mb-3">
            <Col sm={6} xs={12}>
              <label className="form-label label">Responsable decisión</label>
            </Col>
            <Col sm={6} xs={10}>
              <Select
                id="valueoptionresponsable"
                placeholder={"Seleccione un Responsable decisión..."}
                options={tomadorDecisones}
                onChange={(option) => {
                  setResponsableDecision(option);
                }}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="botonPositivo"
            onClick={(e) => {
              enviarSolicitud();
              handleClose();
            }}
          >
            Guardar
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <span></span>
    </>
  );
}
