import React, { useState, useEffect } from "react";

import { Row, Col, Button, Container, Modal } from "react-bootstrap";

export default function ModalVerMacroriesgos(props) {
  const [id, setID] = useState(null);

  const [estado, setEstado] = useState(null);

  const [macroriesgo, setMacroriesgo] = useState(null);

  useEffect(() => {
    if (Array.isArray(props.dataMacroriesgos)) {
      if (props.selected.length > 0) {
        props.dataMacroriesgos.forEach((obj) => {
          if (obj.idmacroriesgos === props.selected[0]) {
            setID(obj.idmacroriesgos);
            setMacroriesgo(obj.macroriesgo);
            if (obj.estado == 1) {
              setEstado("Activo");
            } else {
              setEstado("Inactivo");
            }
          }
        });
      } else {
        setID(null);
        setEstado(null);
        setMacroriesgo(null);
      }
    }
  }, [props.selected]);

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Ver Macro Riesgo1212
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">ID Macro Riesgo</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                disabled
                type="text"
                className="form-control text-center texto"
                placeholder="ID Macro Riesgo"
                value={id}
              />
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Estado</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                disabled
                type="text"
                className="form-control text-center texto"
                placeholder="Estado"
                value={estado}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Macro Riesgo</label>
            </Col>
            <Col sm={10} xs={12}>
              <input
                disabled
                type="text"
                className="form-control text-center texto"
                placeholder="Macro Riesgo"
                value={macroriesgo}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {" "}
        <Button
          type="button"
          className="btn botonNegativo"
          onClick={props.onHide}
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
