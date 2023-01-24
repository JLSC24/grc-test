import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function ModalEditarCausas(props) {
  return (
    <>
      <Modal show={props.show}>
        <Modal.Header>
          <Modal.Title>Motivo de inactivación de la causa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            id="motivoInactivacion"
            className="form-control text-center"
            placeholder="Motivo de inactivación"
            rows="3"
            onChange={(e) => props.setJusticacionAnulacionCausa(e.target.value)}
            value={props.justicacionAnulacionCausa}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="botonNegativo" onClick={props.onHide}>
            Cancelar
          </Button>
          <Button
            className="botonPositivo"
            onClick={() => {
              props.InactivarCausa();
              props.onHide();
            }}
          >
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
      <span></span>
    </>
  );
}
