import React, { useState } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";

function ModalEliminarEfecto({
  openModal,
  setOpenModal,
  desasociarEfectos,
  tipoDeEfecto,
  setSelected_propios,
  setSelected_desencadenados,
  setSelected_recibidos,
}) {
  const CloseModal = () => setOpenModal(false);
  const padding = 90; // adjust this to your needs
  let height = 20 + padding;
  let heightPx = height + "px";
  let heightOffset = height / 2;
  let offsetPx = heightOffset + "px";

  // const styleModalEliminar = {
  //   border: "0",
  //   borderRadius: "4px",
  //   bottom: "auto",
  //   height: "200px", // set height
  //   left: "50%",
  //   padding: "2rem",
  //   position: "fixed",
  //   right: "auto",
  //   top: "50%", // start from center
  //   // transform: "translate(-50%,-" + offsetPx + ")", // adjust top "up" based on height
  //   width: "200px",
  //   background: "white", // maxWidth: "40rem",
  // };

  return (
    <>
      <Modal
        size="sm"
        centered={true}
        // style={styleModalEliminar}
        show={openModal}
        onHide={CloseModal}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            ¿Esta seguro de eliminar el efecto seleccionado?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Este cambio se realizará de inmediato.</Modal.Body>
        <Modal.Footer>
          <Row className="mb-3 mt-4 justify-content-center">
            <Col sm={12} xs={12} className="text-center">
              <Button
                type="button"
                className="btn botonNegativo2"
                onClick={CloseModal}
              >
                Cerrar
              </Button>
              <Button
                type="button"
                className="btn botonPositivo2"
                onClick={() => {
                  desasociarEfectos(tipoDeEfecto);
                }}
              >
                Continuar
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export { ModalEliminarEfecto };
