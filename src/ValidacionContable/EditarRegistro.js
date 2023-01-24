import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";
import { Row, Col, Button, Form } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import { FormProvider, useForm } from "react-hook-form";
import { FormInputTexto } from "../form-components/FormInputTexto";

export default function EditarRegistro() {
  const serviceAAD = new AADService();

  useEffect(() => {}, []);

  const { handleSubmit, reset, control, setValue } = useForm({
    defaultValues: {
      companiaContable: "",
      cuentaContable: "",
      anioContable: "",
      mesContable: "",
      valorReclasificar: "",
    },
  });

  const onSubmit = (data) => {};

  return (
    <>
      {/* <-------------------------------------fila 1-------------------------------------> */}
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Información contable</h1>
        </Col>
      </Row>
      {/* <-------------------------------------fila 2-------------------------------------> */}

      <Row className="mb-4">
        <Col sm={4} xs={12}>
          <label className="forn-label label">Compañia contable</label>
        </Col>
        <Col sm={6} xs={12}></Col>
      </Row>

      <Row className="mb-4">
        <Col sm={4} xs={12}>
          <label className="forn-label label">Cuenta contable</label>
        </Col>
        <Col sm={6} xs={12}>
          <FormInputTexto
            name="cuentaContable"
            control={control}
            label="Cuenta contable"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col sm={4} xs={12}>
          <label className="forn-label label">Año contable</label>
        </Col>
        <Col sm={6} xs={12}>
          <FormInputTexto
            name="cuentaContable"
            control={control}
            label="Cuenta contable"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col sm={4} xs={12}>
          <label className="forn-label label">Mes contable</label>
        </Col>
        <Col sm={6} xs={12}>
          <FormInputTexto
            name="cuentaContable"
            control={control}
            label="Cuenta contable"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col sm={4} xs={12}>
          <label className="forn-label label">
            Valor pendiente a reclasficar
          </label>
        </Col>
        <Col sm={6} xs={12}></Col>
      </Row>

      <Row className="mb-4">
        <Col sm={6} xs={12}></Col>
        <Col sm={2} xs={12}>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant={"contained"}
            className="btn botonPositivo"
          >
            Submit
          </Button>
        </Col>
        <Col sm={2} xs={12}>
          <button
            type="button"
            className="btn botonNegativo"
            onClick={() => reset()}
            variant={"outlined"}
          >
            Reset
          </button>
        </Col>
      </Row>
    </>
  );
}
