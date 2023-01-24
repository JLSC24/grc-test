import React, { useState, useEffect, useContext, useMemo } from "react";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { Link, Routes, Route, useHistory, useLocation } from "react-router-dom";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

import axios from "axios";
import AADService from "../../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { UsuarioContext } from "../../Context/UsuarioContext";

import { FormInputDate } from "../../form-components/FormInputDate";
import { FormSearchListFuenteRecuperacion } from "../../form-components/FormSearchListFuenteRecuperacion";

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

export default function NuevaRecuperacion() {
  const serviceAAD = new AADService();

  const defaultValues = {
    fuenteRecuperacion: null,

    valorDivisaOrigen: null,
    divisaOrigen: null,

    informacionAdicional: null,
    companiaContable: null,
    cuentaContable: null,

    fechaContable: null,
  };

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const history = useHistory();

  const location = useLocation();

  const { dataUsuario } = useContext(UsuarioContext);

  const [idRecuperacion, setIdRecuperacion] = useState(null);
  const [idEfectoFinanciero, setIdEfectoFinanciero] = useState(null);

  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState([]);

  const [listaDivisas, setListaDivisas] = useState([]);
  const [divisa, setDivisa] = useState(null);
  const [moneda, setMoneda] = useState(null);
  const [monedaCOP, setMonedaCOP] = useState(null);
  const [monedaUSD, setMonedaUSD] = useState(null);

  const [cuentasContables, setCuentasContable] = useState(null);
  const [listaCuentasContables, setListaCuentasContables] = useState(null);

  useEffect(() => {
    //---------------------------------------------------------Manejo de ids...
    console.log("Ubicación de donde provengo : ", location);

    let tempIDefecto = "";

    if (typeof location.state != "undefined") {
      if (
        location.state.idEfectoFinanciero &&
        location.state.idEfectoFinanciero.length > 0
      ) {
        tempIDefecto = location.state.idEfectoFinanciero;

        setIdEfectoFinanciero(tempIDefecto);
      }
    }
  }, []);

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
        const responseCuentaContable = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/cuenta_contable/",
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

        let nombreCompañia = companias.filter(
          (compania) => compania.value == dataUsuario.idcompania
        );

        setListaCompaniasInicial(companias);

        let cuentasContables = responseCuentaContable.data.map(
          ({
            idcompania: value,
            numero_cuenta: label,
            nombre,
            idcuenta_contable,
            estado,
          }) => ({
            value,
            label,
            nombre,
            idcuenta_contable,
            estado,
          })
        );

        setListaCuentasContables(cuentasContables);

        let idRecup =
          "REC-" +
          nombreCompañia[0].label +
          "-" +
          dataUsuario.email.split("@")[0] +
          "-" +
          Date.now().toString().slice(-7);

        setIdRecuperacion(idRecup);
      } catch (error) {
        console.error(error);
      }
    }

    async function getDivisas() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Recuperaciones/divisa_origen",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let data = response.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );

        setListaDivisas(data);
      } catch (error) {
        console.error(error);
      }
    }

    getCompanias();
    getDivisas();
  }, []);

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log("Datos prepreocesados: ", data);

    const dataEnviar = {
      id_recuperacion: idRecuperacion,
      id_efecto_financiero: idEfectoFinanciero,

      recuperacion_anulada: 0,
      justificacion_anulacion_recuperacion: null,

      fuente_de_recuperacion: data.fuenteRecuperacion
        ? data.fuenteRecuperacion.label
        : null,

      divisa_origen: data.divisaOrigen ? data.divisaOrigen.label : null,
      recuperacion_en_divisa_origen: data.valorDivisaOrigen
        ? parseFloat(data.valorDivisaOrigen)
        : null,

      compañia_contable: data.companiaContable
        ? data.companiaContable.label
        : null,
      cuenta_contable: data.cuentaContable ? data.cuentaContable.label : null,

      fecha_contable: data.fechaContable ? new Date(data.fechaContable) : null,
      informacion_adicional: data.informacionAdicional
        ? data.informacionAdicional
        : null,
    };

    console.log("Datos listos para enviar: ", dataEnviar);

    try {
      axios
        .post(process.env.REACT_APP_API_URL + "/recuperacion/", dataEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            alert("Guardado con exito");
            history.push({
              pathname: "/EditarEfecto",
              state: {
                idEfectoFinanciero: idEfectoFinanciero,
              },
            });
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
          } else if (response.status >= 400 && response.status < 512) {
            setEstadoPost(5);
          }
        })
        .catch((errors) => {
          console.log("CHATCH", errors.response.data);
          let result = JSON.stringify(errors.response.data).split(",");
          let msg = [];
          console.log("RESUTL", result);

          result.map((dato) => {
            msg.push(
              "\n ■" +
                dato
                  .replace("[", "")
                  .replace("]", "")
                  .replace("{", "")
                  .replace("}", "")
                  .replace(".", "")
            );
            return null;
          });
          msg = msg.toString().replace(",", "");
          console.log("MENSAJE", msg);

          setEstadoPost({
            id: 3,
            data: msg,
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const onError = (errors, e) => console.log(errors);

  const getConversion = () => {
    let dataConversion = {
      divisa_origen: getValues("divisaOrigen").label,
      valor_divisa_origen: parseFloat(getValues("valorDivisaOrigen")),
      fecha_trm: new Date(getValues("fechaContable")),
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/convertir_divisaa", dataConversion)
      .then((response) => {
        setMonedaCOP(response.data.valor_COP);
        setMonedaUSD(response.data.valor_USD);
      })
      .catch((errors) => {
        let msg = errors.response.data.message;
        setEstadoPost({
          id: 3,
          data: msg,
        });
        setTimeout(() => {
          setEstadoPost({ id: 0, data: null });
        }, 10000);
      });
  };
  const FiltrarCuentas = (e) => {
    setValue("cuentaContable", null);

    let cuentasFiltradas = listaCuentasContables.filter(
      (cuenta) => cuenta.value === e.value
    );

    setCuentasContable(cuentasFiltradas);
  };

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />

      <Container>
        <FormProvider {...methods}>
          {/* <-------------------------------------Titulo-------------------------------------> */}
          <Row className="mb-3 mt-3">
            <Col sm={12} xs={12}>
              <h1 className="titulo">Recuperación: {idRecuperacion}</h1>
            </Col>
          </Row>

          <Row className="mb-3 mt-3">
            <Col sm={2} xs={12}>
              <Link
                to={{
                  pathname: "/EditarEfecto",
                  state: {
                    idEfectoFinanciero: idEfectoFinanciero,
                  },
                }}
              >
                <Button type="button" className="botonNegativo3">
                  Regresar
                </Button>
              </Link>
            </Col>

            <Col sm={2} xs={12}>
              <Link to={"/Recuperaciones"}>
                <Button type="button" className="botonNegativo">
                  Cancelar
                </Button>
              </Link>
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

          {/* <----------------------------------------Formulario----------------------------------------> */}
          <hr />
          <br />
          {/* <-------------Información general-------------------> */}

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">ID efecto:</label>
            </Col>

            <Col sm={4} xs={12}>
              <input
                value={idEfectoFinanciero}
                type="text"
                className="form-control text-center texto"
                placeholder="ID del efecto"
                {...register("idEfecto")}
              />
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Fuente de recuperación</label>
            </Col>
            <Col sm={4} xs={12}>
              <FormSearchListFuenteRecuperacion
                control={control}
                name="fuenteRecuperacion"
                label="Fuente de Recuperacion"
              />
              <p>{errors.fuenteRecuperacion?.message}</p>
            </Col>
          </Row>

          {/* <------------------------------------- Información financiera y contable -------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={6} xs={12}>
              <h2 className="subtitulo">Información financiera y contable</h2>
              <hr />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Moneda origen</label>
            </Col>

            <Col sm={4} xs={12}>
              <Controller
                control={control}
                name="divisaOrigen"
                render={({ field: { onChange, value } }) => (
                  <Select
                    components={animatedComponents}
                    options={listaDivisas}
                    onChange={onChange}
                    value={value}
                    placeholder="Seleccione la divisa"
                  />
                )}
                rules={{
                  required: "Te faltó completar este campo",
                }}
              />
              <p>{errors.divisaOrigen?.message}</p>
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">
                Valor en moneda origen:​
              </label>
            </Col>
            <Col sm={4} xs={12}>
              <Controller
                control={control}
                name="valorDivisaOrigen"
                render={({ field: { onChange, value } }) => (
                  <input
                    type="number"
                    className="form-control text-center texto"
                    placeholder="Valor divisa origen"
                    onChange={onChange}
                    value={value}
                  />
                )}
                rules={{
                  required: "Te faltó completar este campo",
                }}
              />
              <p>{errors.valorDivisaOrigen?.message}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Valor en COP:​</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                type="number"
                className="form-control text-center texto"
                placeholder="COP"
                value={monedaCOP}
                disabled
              />
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Valor en USD:​</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                type="number"
                className="form-control text-center texto"
                placeholder="USD"
                value={monedaUSD}
                disabled
              />
            </Col>
          </Row>

          {/* <------------------------------------- Información contable-------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Compañia contable</label>
            </Col>
            <Col sm={4} xs={12}>
              <Controller
                control={control}
                name={"companiaContable"}
                render={({ field }) => (
                  <Select
                    components={animatedComponents}
                    options={ListaCompaniasInicial}
                    placeholder="Seleccione la compañia"
                    onChange={(e) => {
                      FiltrarCuentas(e);
                      field.onChange(e);
                    }}
                    value={field.value}
                  />
                )}
                rules={{
                  required: "Te faltó completar este campo",
                }}
              />
              <p>{errors.companiaContable?.message}</p>
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Cuenta contable</label>
            </Col>

            <Col sm={4} xs={12}>
              <Controller
                control={control}
                name={"cuentaContable"}
                render={({ field }) => (
                  <Select
                    components={animatedComponents}
                    options={cuentasContables}
                    placeholder="Seleccione la compañia"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    value={field.value}
                  />
                )}
                rules={{
                  required: "Te faltó completar este campo",
                }}
              />
              <p>{errors.cuentaContable?.message}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={6} xs={12}></Col>
            <Col sm={2} xs={12}>
              <label className="forn-label label">Fecha contable</label>
            </Col>

            <Col sm={2} xs={12}>
              <FormInputDate
                control={control}
                name="fechaContable"
                label="Fecha contable"
              />
              <p>{errors.fechaContable?.message}</p>
            </Col>

            <Col sm={2} xs={12}>
              <button
                type="button"
                class="btn btn-primary btn-md"
                onClick={getConversion}
              >
                Convertir divisa
              </button>
            </Col>
          </Row>

          <hr />

          {/* <-------------------------------------Titulo-------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={2} xs={12}>
              <Link
                to={{
                  pathname: "/EditarEfecto",
                  state: {
                    idEfectoFinanciero: idEfectoFinanciero,
                  },
                }}
              >
                <Button type="button" className="botonNegativo3">
                  Regresar
                </Button>
              </Link>
            </Col>

            <Col sm={2} xs={12}>
              <Link to={"/Recuperaciones"}>
                <Button type="button" className="botonNegativo">
                  Cancelar
                </Button>
              </Link>
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

          <br />

          <Row className="mb-3 mt-3">
            <Col sm={8} xs={12}>
              <h1 className="titulo">Recuperación: {idRecuperacion}</h1>
            </Col>
          </Row>
          <Row className="mb-4">
            <br />
          </Row>
          <Row className="mb-4">
            <br />
          </Row>
          <Row className="mb-4">
            <br />
          </Row>
        </FormProvider>
      </Container>
    </>
  );
}
