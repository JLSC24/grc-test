import React, { useState, useEffect } from "react";
import { Button, Row, Col, Modal } from "react-bootstrap";
import AADService from "../auth/authFunctions";
import DateObject from "react-date-object";
import DatePicker from "react-datepicker";

export default function ModalSeguimiento({
  showModalS,
  setShowModalS,
  dataS,
  setDataS,
  dataSeguimiento,
  setDataSeguimiento,
  dataPA,
  usuario,
  setEstadoPost,
  sendData,
  fechaFinalizacion,
  setFechaFinalizacion,
}) {
  const [show, setShow] = useState(false);
  const serviceAAD = new AADService();

  useEffect(() => {
    if (showModalS === true) {
      setShow(true);
    }
  }, [showModalS, setShow]);

  const enviarInfoSeguimiento = (dataSeguimientoEnv) => {
    async function limpiar(state) {
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }

    function formatoFecha(fecha) {
      return fecha.split("T")[0];
    }
    let dataSeg = {
      idseguimiento: 0,
      idplanaccion: dataPA.idplanaccion,
      porcentajeavance: parseFloat(dataSeguimientoEnv.porcentajeavance) / 100,
      fechaseguimiento: formatoFecha(dataSeguimientoEnv.fechaseguimiento),
      fechacreacion: dataSeguimientoEnv.fechaseguimiento,
      idusuariocreacion: usuario.idusuario,
      fechamodificacion: dataSeguimientoEnv.fechaseguimiento,
      idusuariomodificacion: usuario.idusuario,
      descripcion: dataSeguimientoEnv.descripcion,
    };

    fetch(
      process.env.REACT_APP_API_URL + "/plandeAccion/seguimiento/" +
        dataPA.idplanaccion +
        "/",
      {
        method: "POST",
        body: JSON.stringify(dataSeg),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      }
    )
      .then((data) =>
        data.json().then((response) => {
          if (data.status >= 200 && data.status < 300) {
            setEstadoPost({ id: 2, data: data });
            limpiar();

            let estadoSeguimiento = "Creado";
            if (dataS) {
              if (dataS.texto === "Finalizar plan") {
                estadoSeguimiento = "Ejecutado";
              } else if (dataS.texto === "Suspender plan") {
                estadoSeguimiento = "Suspendido";
              } else if (dataS.texto === "Cancelar plan") {
                estadoSeguimiento = "Cancelado";
              } else {
                if (dataSeg.porcentajeavance !== 0) {
                  estadoSeguimiento = "Ejecución";
                }
              }
            }
            setFechaFinalizacion(
              Date.parse(data.fechafinalizacion.replace(/-/g, "/"))
            );

            let sendFechaFinal = new DateObject(fechaFinalizacion).format(
              "YYYY-MM-DD"
            );

            dataPA.estadopa = estadoSeguimiento;
            dataPA.porcentajeavance = dataSeg.porcentajeavance;
            dataPA.fechafinalizacion = sendFechaFinal;

            fetch(
              process.env.REACT_APP_API_URL + "/plandeAccion/" + dataPA.idplanaccion + "/",
              {
                method: "PUT",
                body: JSON.stringify(dataPA),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  Authorization: "Bearer " + serviceAAD.getToken(),
                },
              }
            )
              .then((data) =>
                data.json().then((response) => {
                  if (data.status >= 200 && data.status < 300) {
                    setEstadoPost({ id: 2, data: data });
                    limpiar();
                    window.location.reload();
                  } else if (data.status >= 500) {
                    setEstadoPost({ id: 5, data: response });
                    limpiar();
                  } else if (data.status >= 400 && data.status < 500) {
                    setEstadoPost({ id: 4, data: response });
                    limpiar();
                  }
                })
              )
              .catch(function (err) {
                console.error(err);
              });
          } else if (data.status >= 500) {
            setEstadoPost({ id: 5, data: response });
            limpiar();
          } else if (data.status >= 400 && data.status < 500) {
            setEstadoPost({ id: 4, data: response });
            limpiar();
          }
        })
      )
      .catch(function (err) {
        console.error(err);
      });
  };

  const llenarInfoSeguimiento = () => {
    let sendFechaFinal = new DateObject(fechaFinalizacion).format("YYYY-MM-DD");
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    let fechaISOinicial = today.toISOString();
    let tempSeguimiento = {
      fechafinalizacion: sendFechaFinal,
      texto: dataS.texto,
      porcentajeavance: document.getElementById("avance").value
        ? document.getElementById("avance").value
        : null,
      descripcion: document.getElementById("descripcionAvance").value
        ? document.getElementById("descripcionAvance").value
        : null,
      idusuariomodificacion: dataS.usuario,
      nombreUsuariocreacion: dataS.nombre,
      fechaseguimiento: fechaISOinicial,
    };

    let tempListaSeguimientos = dataSeguimiento;
    tempListaSeguimientos.unshift(tempSeguimiento);
    setDataSeguimiento(tempListaSeguimientos);
    setDataS(tempSeguimiento);
    enviarInfoSeguimiento(tempSeguimiento);
    setShow(false);
    setShowModalS(false);
  };

  const retornarSeguimiento = () => {
    if (dataS.texto === "Finalizar plan") {
      if (document.getElementById("avance").value < 100) {
        window.alert(
          "No puede finalizar un plan de acción que no esté al 100%"
        );
      } else {
        if (
          document.getElementById("avance").value &&
          document.getElementById("descripcionAvance").value
        ) {
          llenarInfoSeguimiento();
        } else {
          window.alert("Faltan datos, asegurese de llenar todo");
        }
      }
    } else {
      if (
        document.getElementById("avance").value &&
        document.getElementById("descripcionAvance").value
      ) {
        llenarInfoSeguimiento();
      } else {
        window.alert("Faltan datos, asegurese de llenar todo");
      }
    }
  };
  const handleClose = () => {
    setShow(false);
    setShowModalS(false);
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
            Añadir Seguimiento al Plan de Acción: {dataS ? dataS.texto : null}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dataS.texto === "Finalizar plan" ? (
            <Row className="mb-3">
              <Col sm={12} xs={12}>
                <label className="titulo_resumen error forn-label">
                  Al confirmar esta acción, no podra volver a editar este plan
                  de acción.
                </label>
              </Col>
            </Row>
          ) : null}
          <Row className="mb-3">
            <Col sm={4} xs={12}>
              <label className="label forn-label">Porcentaje de Avance*</label>
            </Col>
            <Col sm={8} xs={12}>
              <input
                required
                type="number"
                className="form-control text-center texto"
                placeholder="%"
                id="avance"
              ></input>
            </Col>
          </Row>
          <Row className="mb-3">
          <Col sm={4} xs={12}>
                 <label className="label forn-label">Fecha Finalización*</label>
               </Col>
                 <Col sm={3} xs={12}>
                   <DatePicker
                    className="form-control"
                   selected={fechaFinalizacion}
                   onChange={(date) => {
                   setFechaFinalizacion(date);
                   }}
                   id="fechaFinali"
                   required
                   ></DatePicker>
                  </Col>
             </Row>
          <Row className="mb-3">
            <Col sm={4} xs={12}>
              <label className="label forn-label">Descripción*</label>
            </Col>
            <Col sm={8} xs={12}>
              <textarea
                required
                className="form-control text-center"
                placeholder={"Descripción de: " + dataS.texto}
                rows="3"
                id="descripcionAvance"
              ></textarea>
            </Col>
          </Row>
          {dataS.texto === "Finalizar plan" ? (
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="label forn-label">Fecha Finalización*</label>
              </Col>
              <Col sm={3} xs={12}>
                <DatePicker
                  className="form-control"
                  selected={fechaFinalizacion}
                  onChange={(date) => {
                    setFechaFinalizacion(date);
                  }}
                  id="fechaFinali"
                  maxDate={new Date()}
                  required
                ></DatePicker>
              </Col>
            </Row>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="botonPositivo"
            onClick={() => {
              retornarSeguimiento();
            }}
          >
            Aceptar
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
