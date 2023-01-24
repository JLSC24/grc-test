import React, { useEffect, useState, useContext, useCallback } from "react";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { Link, Routes, Route, useHistory, useLocation } from "react-router-dom";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

import axios from "axios";

import AADService from "../auth/authFunctions";

import Select from "react-select";

import makeAnimated from "react-select/animated";

import { FormInputRiesgosGestionados } from "../form-components/FormInputRiesgosGestionados";

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

export default function CrearMacroRiesgo() {
  const serviceAAD = new AADService();

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const history = useHistory();

  const location = useLocation();

  const [estado, setEstado] = useState(true);

  const [showJustificacion, setShowJustificacion] = useState(false);

  const [justificacion, setJustificacion] = useState(null);

  const [macroriesgo, setMacroriesgo] = useState(null);

  const [aristas, setAristas] = useState(null);

  const [listaPaises, setListaPaises] = useState(null);

  const [listaCompanias, setListaCompanias] = useState(null);

  const [listaAristas, setListaAristas] = useState(null);

  const [listaUbicacion, setListaUbicacion] = useState(null);

  const [listaTipoUbicacion, setListaTipoUbicacion] = useState([
    { value: 1, label: "País" },
    { value: 2, label: "Compañia" },
  ]);
  const [ubicacion, setUbicacion] = useState(null);
  const [tipoUbicacion, setTipoUbicacion] = useState(null);

  const defaultValues = {
    estado: null,
    justificacion: null,

    idMacroriesgo: null,
    macroriesgo: null,

    tipoUbicacion: null,
    ubicacion: null,

    descripcion: null,

    aristas: null,
  };

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    //---------------------- Listas  ---------------------

    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    };

    let APIS = [
      fetch(process.env.REACT_APP_API_URL + "/maestros_ro/aristas/", config),
      fetch(process.env.REACT_APP_API_URL + "/maestros_ro/compania/", config),
      fetch(process.env.REACT_APP_API_URL + "/generales/Causa/Pais", config),
    ];

    Promise.all(APIS)
      .then(async ([arista, compania, pais]) => {
        const listaAristas = await arista.json();
        const listaCompanias = await compania.json();
        const listaPaises = await pais.json();

        //Función para filtrar las aristas según el tipo de riesgo (erm,orm,it)
        let aristas = listaAristas.filter((arista) => arista.erm == 1);

        aristas = aristas.map(
          ({ idaristas: value, nombre: label, orm, erm, it }) => ({
            value,
            label,
            orm,
            erm,
            it,
          })
        );
        let companias = listaCompanias.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
        let paises = listaPaises.map(({ parametro: value, valor: label }) => ({
          value,
          label,
        }));

        setListaAristas(aristas);

        setListaCompanias(companias);

        setListaPaises(paises);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const goBack = () => {
    history.push({
      pathname: "/Macroriesgos",
    });
  };

  const onSubmit = (data) => {
    //Funcion para convertir el Array de aristas en un string
    let stringAristas = [];
    if (data.aristas) {
      data.aristas.map((item) => stringAristas.push(item.value));
      stringAristas = stringAristas.join(",");
    }
    //Preparación del JSON a enviar
    let dataEnviar = {
      estado: 1,
      justificacion: null,
      idmacroriesgos: null,
      macroriesgo: data.macroriesgo ? data.macroriesgo : null,
      ubicacion_1: data.tipoUbicacion ? data.tipoUbicacion.label : null,
      ubicacion_2: data.ubicacion ? data.ubicacion.label : null,
      descripcion: data.descripcion ? data.descripcion : null,
      arista: data.aristas ? stringAristas : null,
    };

    console.log("Datos a enviar ->: ", dataEnviar);

    try {
      axios
        .post(process.env.REACT_APP_API_URL + "/macroriesgos/", dataEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            history.push({
              pathname: "/EditarMacroriesgo",
              state: {
                idMacroriesgo: response.data.idmacroriesgos,
              },
            });

            console.log("id macroriesgos", response);

            alert("Guardado con éxito");

            //setEstadoPost(2);
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
            alert("Error en el servidor");
            console.log(response.data);
          } else if (response.status >= 400 && response.status < 512) {
            setEstadoPost(5);
            alert("Error en el servidor");
            console.log(response);
          }
        })
        .catch((errors) => {
          console.log("errors", errors);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onError = (errors) => {
    console.log("Errors ->: ", errors);
  };

  const FiltrarUbicacion = (e) => {
    setTipoUbicacion(e);

    setUbicacion(null);

    switch (e.label) {
      case "País":
        setListaUbicacion(listaPaises);
        break;
      case "Compañia":
        setListaUbicacion(listaCompanias);
        console.log(listaCompanias);
        break;

      default:
        setUbicacion(null);
        break;
    }
  };

  const col1 = 2;
  const col2 = 10;
  const col3 = 4;

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Container fluid>
        <FormProvider {...methods}>
          {/* <-------------------------------------Modales -------------------------------------> */}

          {/* <-------------------------------------Titulo-------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={8} xs={12}>
              <h1 className="titulo">Crear Macro riesgo </h1>
            </Col>

            <Col sm={2} xs={12}>
              <Button type="button" className="botonNegativo" onClick={goBack}>
                Cancelar
              </Button>
            </Col>

            <Col sm={2} xs={12}>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit, onError)}
                variant={"contained"}
                className="btn botonPositivo"
              >
                Guardar
              </Button>
            </Col>
          </Row>

          <hr />
          <br />

          {/*------------------------------ motivo de inactivación---------------------------*/}

          <Row className="mb-4">
            {!estado ? (
              <>
                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Motivo de inactivación
                  </label>
                </Col>
                <Col sm={10} xs={12}>
                  <textarea
                    className="form-control text-center"
                    placeholder="Motivo de inactivación"
                    rows="2"
                    value={justificacion}
                    disabled
                  />
                </Col>
              </>
            ) : (
              <></>
            )}
          </Row>

          {/*------------------------------Campos del formulario---------------------------*/}

          <Row className="mb-3">
            <Col sm={col1} xs={12}>
              <label className="forn-label label">Macro riesgo*</label>
            </Col>
            <Col sm={col2} xs={12}>
              <input
                type="text"
                className="form-control text-center"
                rows="3"
                {...register("macroriesgo", {
                  minLength: 1,
                  required: "Te faltó completar este campo",
                })}
              />
              <p>{errors.macroriesgo?.message}</p>
            </Col>
          </Row>

          <Row className="mb-3 mt-3">
            <Col sm={col1} xs={12}>
              <label className="forn-label label">Tipo Ubicación*</label>
            </Col>

            <Col sm={col3} xs={12}>
              <Controller
                control={control}
                name="tipoUbicacion"
                render={({ field }) => (
                  <Select
                    components={animatedComponents}
                    placeholder="País/Compañía"
                    options={listaTipoUbicacion}
                    onChange={(e) => {
                      FiltrarUbicacion(e);
                      field.onChange(e);
                    }}
                    value={field.value}
                  />
                )}
                rules={{
                  required: `Te faltó completar este campo`,
                }}
              />
              <p>{errors.tipoUbicacion?.message}</p>
            </Col>

            <Col sm={col1} xs={12}>
              <label className="forn-label label">Ubicación*</label>
            </Col>

            <Col sm={col3} xs={12}>
              <Controller
                control={control}
                name="ubicacion"
                render={({ field }) => (
                  <Select
                    components={animatedComponents}
                    placeholder="Ubicación"
                    options={listaUbicacion}
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
                  />
                )}
                rules={{
                  required: `Te faltó completar este campo`,
                }}
              />
              <p>{errors.ubicacion?.message}</p>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={col1} xs={12}>
              <label className="forn-label label">Descripción*</label>
            </Col>
            <Col sm={col2} xs={12}>
              <textarea
                {...register("descripcion", {
                  minLength: 1,
                  required: "Te faltó completar este campo",
                })}
                type="text"
                className="form-control text-center"
                rows="3"
              />
              <p>{errors.descripcion?.message}</p>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={col1} xs={12}>
              <label className="form-label label">Aristas*​</label>
            </Col>

            <Col sm={col2} xs={12}>
              <Controller
                control={control}
                name="aristas"
                rules={{ required: "Te falto completar este campo" }}
                render={({ field }) => (
                  <Select
                    isMulti
                    components={animatedComponents}
                    options={listaAristas}
                    value={field.value}
                    onChange={(e) => {
                      var aristas = [];
                      e.map((a) => aristas.push(a));
                      setAristas(aristas);
                      field.onChange(aristas);
                    }}
                  />
                )}
              />
              <p>{errors.aristas?.message}</p>
            </Col>
          </Row>
        </FormProvider>
      </Container>
    </>
  );
}
