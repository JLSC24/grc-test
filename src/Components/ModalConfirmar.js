import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

export default function ModalConfirmar({
  showMod,
  setShowMod,
  data,
  setConfirm,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (showMod === true) {
      setShow(true);
    }
  }, [showMod, setShow]);

  const handleClose = () => {
    setShow(false);
    setShowMod(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Advertencia
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{data}</Modal.Body>
        <Modal.Footer>
          <Button
            className="botonPositivo"
            onClick={() => {
              setConfirm(true);
              handleClose();
            }}
          >
            Aceptar
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setConfirm(false);
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
