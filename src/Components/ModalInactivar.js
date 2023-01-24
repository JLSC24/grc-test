import React, { useState, useEffect } from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";
import AADService from "../auth/authFunctions";

export default function ModalInactivar({ showMod, setShowMod, data, setData }) {
  const [show, setShow] = useState(false);
  const serviceAAD = new AADService();

  useEffect(() => {
    if (showMod === true) {
      setShow(true);
    }
  }, [showMod, setShow]);

  const handleClose = () => {
    setShow(false);
    setShowMod(false);
  };

  const retornarJusti = () => {
    if (data["motivo_inactivacion"]) {
      const tiempoTranscurrido = Date.now();
      const hoy = new Date(tiempoTranscurrido);
      data["fecha_inactivacion"] = hoy.toISOString().split("T")[0];
      data["estado"] = "Inactivo";
      data["usuario_inactivacion"] = serviceAAD.getUser().userName;
      handleClose();
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Datos para la inactivación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col sm={4} xs={12}>
              <label className="form-label label">
                Justificación inactivación*
              </label>
            </Col>
            <Col sm={8} xs={12}>
              <textarea
                className="form-control text-center"
                placeholder="Justificación inactivación"
                rows="3"
                id="Objetivo"
                onChange={(e) => (data["motivo_inactivacion"] = e.target.value)}
                required
              ></textarea>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="botonPositivo"
            onClick={() => {
              retornarJusti();
            }}
          >
            Aceptar
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
            }}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <span></span>
    </>
  );
}
