import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import AADService from "../../../auth/authFunctions";
import { useHistory } from "react-router-dom";

export default function ModalInactivar({
  setActivo,
  Inactivar,
  setInactivar,
  setMotivoInactivacion,
}) {
  const serviceAAD = new AADService();

  const handleClose = () => {
    setInactivar((prev) => !prev);
  };
  const handleSave = () => {
    setMotivoInactivacion(document.getElementById("motivoInactivacion").value);
    setInactivar((prev) => !prev);
    setActivo((prev) => !prev);
  };
  return (
    <>
      <Modal show={Inactivar} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Añadir riesgos al evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            id="motivoInactivacion"
            className="form-control text-center"
            placeholder="Motivo de inactivación"
            rows="3"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="botonNegativo" onClick={handleClose}>
            Cancelar
          </Button>
          <Button className="botonPositivo" onClick={handleSave}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
      <span></span>
    </>
  );
}
