import React, { useEffect, useState, useContext, useCallback } from "react";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { Link, Routes, Route, useHistory, useLocation } from "react-router-dom";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

import axios from "axios";
import AADService from "../../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

function AlertDismissibleExample({ alerta }) {
  switch (alerta.id) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return <Alert variant="success">{alerta.data}</Alert>;

    case 3:
      return <Alert variant="danger">{alerta.data}</Alert>;

    case 4:
      return <Alert variant="warning">Error al enviar la información</Alert>;

    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;

    case 7:
      return (
        <Alert variant="warning">
          Corrige los siguientes errores:
          <br></br>• Debe completar los campos obligatorios
        </Alert>
      );
    default:
      return <p></p>;
  }
}

const animatedComponents = makeAnimated();

export default function AristaLAFT() {
  const serviceAAD = new AADService();

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const history = useHistory();

  const location = useLocation();

  const [causaN1, setCausaN1] = useState(null);

  const col1 = 2;
  const col2 = 10;

  return (
    <>
      <Container>
        <Row className="mb-3">
          <Col sm={col1} xs={12}>
            <label className="forn-label label">Compañía</label>
          </Col>
          <Col sm={col2} xs={12}>
            <Select
              components={animatedComponents}
              options={[{ value: 1, label: "hola mundo" }]}
              value={causaN1}
              onChange={setCausaN1}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
