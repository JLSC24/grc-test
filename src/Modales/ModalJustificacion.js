import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

export default function ModalJustificacion(props) {
  const handleClose = () => {
    props.setShowJustificacion((prev) => !prev);
  };

  const handleSave = () => {
    props.setJustificacion(document.getElementById("motivoInactivacion").value);
    props.setEstado(false);

    handleClose();
  };

  return (
    <>
      <Modal show={props.showJustificacion} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Motivo de inactivación</Modal.Title>
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
