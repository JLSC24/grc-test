import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

export default function ModalAlerta({ text, showAlerta, setShowAlerta }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (showAlerta === true) {
      setShow(true);
    }
  }, [showAlerta, setShow]);

  const handleClose = () => {
    setShow(false);
    setShowAlerta(false);
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
            Algo no anda bien...
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{text}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <span></span>
    </>
  );
}
