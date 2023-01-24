import React, { useState, useEffect } from "react";
import AADService from "../auth/authFunctions";
import axios from "axios";

import MaterialTable from "material-table";
import { forwardRef } from "react";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import { FormInputMes } from "../form-components/FormInputMes";
import { FormInputAño } from "../form-components/FormInputAño";
import { FormInputDate } from "../form-components/FormInputDate";

const animatedComponents = makeAnimated();

function AlertDismissibleExample({ alerta }) {
  switch (alerta) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return <Alert variant="success">Guardó exitosamente</Alert>;

    case 3:
      return <Alert variant="danger"></Alert>;

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

const defaultValues = {
  riesgo: null,
  compania: null,
  areaReporta: null,
  areaOcurrencia: null,
  proceso: null,
  fechaInicial: null,
  fechaFinal: null,
  fechaDescubrimiento: null,
  asociadoCambio: null,
  categoriaCorp1: null,
  categoriaCorp3: null,
  descCategoriaCorp: null,
  categoriaLocal1: null,
  categoriaLocal3: null,
  descCategoriaLocal: null,
  tipoFalla: null,
  afectoConsumidor: null,
  otrosRiesgosImpact: null,
  idMacroevento: null,
  planesAccion: null,
  infoAdicional: null,
};

export default function NuevoRegistro() {
  const serviceAAD = new AADService();

  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState(null);
  const [ListaCuentasContablesInicial, setListaCuentasContablesInicial] =
    useState(null);
  const [ListaCuentasContables, setListaCuentasContables] = useState(null);

  useEffect(() => {
    async function getCompanias() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let companias = response.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
        setListaCompaniasInicial(companias);
      } catch (error) {
        console.error(error);
      }
    }
    async function getCuentasContables() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/cuenta_contable/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let data = response.data.map(
          ({
            idcuenta_contable: value,
            nombre: label,
            idcompania,
            nivel,
            padre,
            cuenta_n1,
          }) => ({
            value,
            label,
            idcompania,
            nivel,
            padre,
            cuenta_n1,
          })
        );
        setListaCuentasContablesInicial(data);
      } catch (error) {
        console.error(error);
      }
    }

    getCompanias();
    getCuentasContables();
  }, []);

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { register, handleSubmit, control, setValue } = methods;

  const onSubmit = (data) => console.warn(data);

  const onError = (errors, e) => console.error(errors, e);

  const FiltrarMaestros = (objCompania) => {
    setValue("compania", objCompania);

    const idcompania = objCompania.value;

    let tempListaCuentasContables = ListaCuentasContablesInicial.filter(
      (cuenta) => cuenta.idcompania == idcompania
    );
    setListaCuentasContables(tempListaCuentasContables);
  };

  return (
    <>
      <Container>
        {/* <-------------------------------------Titulo-------------------------------------> */}
        <Row className="mb-3 mt-3">
          <Col md={12}>
            <h1 className="titulo">Registro pendiente por reclasificar</h1>
          </Col>
        </Row>

        {/* <-------------------------------------Formulario-------------------------------------> */}
        <Row className="mb-4">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Compañía contable</label>
          </Col>
          <Col sm={6} xs={12}>
            <Controller
              control={control}
              name="compania"
              rules={{
                required: "falta el campo",
              }}
              render={({ field: { value } }) => (
                <Select
                  components={animatedComponents}
                  options={ListaCompaniasInicial}
                  onChange={FiltrarMaestros}
                  value={value}
                  placeholder="Seleccione la compañia"
                />
              )}
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Cuenta contable</label>
          </Col>

          <Col sm={6} xs={12}>
            <Controller
              control={control}
              name="cuentaContable"
              rules={{
                required: "falta el campo",
              }}
              render={({ field: { value, onChange } }) => (
                <Select
                  components={animatedComponents}
                  options={ListaCuentasContables}
                  onChange={onChange}
                  value={value}
                  placeholder="Seleccione la compañia"
                />
              )}
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Fecha contable</label>
          </Col>

          <Col sm={6} xs={12}>
            <FormInputMes
              control={control}
              name="fechaInicial"
              label="FechaInicial"
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Valor pendiente a reclasificar
            </label>
          </Col>

          <Col sm={6} xs={12}>
            <FormInputMes
              control={control}
              name="fechaInicial"
              label="FechaInicial"
            />
          </Col>
        </Row>

        {/* <-------------------------------------Botones-------------------------------------> */}
        <Row className="mb-4">
          <Col sm={2} xs={12}>
            <button
              type="button"
              onClick={() => {
                setValue("cuentaContable", "cuentacontable");
              }}
              className="btn botonPositivo"
            >
              setValue
            </button>
          </Col>
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
        </Row>
      </Container>
    </>
  );
}
