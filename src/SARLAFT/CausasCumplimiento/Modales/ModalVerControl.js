import React, { useState, useEffect } from "react";
import { Row, Col, Button, Container, Modal } from "react-bootstrap";
import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

export default function ModalVerControl(props) {
  const [id, setID] = useState(null);

  const [estado, setEstado] = useState(null);

  const [macroriesgo, setMacroriesgo] = useState(null);

  const defaultValues = {
    id: null,
    compania: null,
    proceso: null,
    nombre: null,
    descripcion: null,
  };

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (Array.isArray(props.dataControles)) {
      if (props.selected.length > 0) {
        props.dataControles.forEach((obj) => {
          if (obj.idcontrol === props.selected[0]) {
            setValue("id", obj.idcontrol);
            setValue("compania", obj.compania);
            setValue("proceso", obj.proceso);
            setValue("nombre", obj.nombre);
            setValue("descripcion", obj.descripcion);
          }
        });
      } else {
        reset();
      }
    }
  }, [props.selected]);

  return (
    <FormProvider {...methods}>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Ver Control
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">ID Control</label>
              </Col>
              <Col sm={4} xs={12}>
                <input
                  {...register("id")}
                  disabled
                  type="text"
                  className="form-control text-center texto"
                  placeholder="ID Control"
                />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">Compañia</label>
              </Col>
              <Col sm={4} xs={12}>
                <input
                  {...register("compania")}
                  disabled
                  type="text"
                  className="form-control text-center texto"
                  placeholder="Compañia"
                />
              </Col>

              <Col sm={2} xs={12}>
                <label className="forn-label label">Proceso</label>
              </Col>
              <Col sm={4} xs={12}>
                <input
                  {...register("proceso")}
                  disabled
                  type="text"
                  className="form-control text-center texto"
                  placeholder="Proceso"
                />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">Nombre</label>
              </Col>
              <Col sm={10} xs={12}>
                <input
                  {...register("nombre")}
                  disabled
                  type="text"
                  className="form-control text-center texto"
                  placeholder="Macro Riesgo"
                />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">Descripción</label>
              </Col>
              <Col sm={10} xs={12}>
                <textarea
                  {...register("descripcion")}
                  disabled
                  className="form-control text-center"
                  placeholder="Descripción"
                  rows="6"
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
    </FormProvider>
  );
}
