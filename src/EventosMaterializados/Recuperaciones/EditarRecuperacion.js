import React, { useState, useEffect, useContext } from "react";
import AADService from "../../auth/authFunctions";
import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import DateObject from "react-date-object";

import MaterialTable from "material-table";
import { forwardRef } from "react";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { FormInputMonedaOrigen } from "../../form-components/FormInputMonedaOrigen";
import { FormSearchListCompania } from "../../form-components/FormSearchListCompania";
import { FormInputDate } from "../../form-components/FormInputDate";
import { FormSearchListFuenteRecuperacion } from "../../form-components/FormSearchListFuenteRecuperacion";
import { FormSearchListDivisaOrigen } from "../../form-components/FormSearchListDivisaOrigen";
// import { ModalEfectosFinancieros } from "./ModalesEventos/ModalEfectosFinancieros";
import { FormComponentInfoContable } from "../../form-components/FormComponentInfoContable";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { FormSearchListCuentasContables } from "../../form-components/FormSearchListCuentasContables";

import { UsuarioContext } from "../../Context/UsuarioContext";
import ModalInactivar from "./Modales/ModalInactivar";

const animatedComponents = makeAnimated();

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

const defaultValues = {
  motivoInactivacion: null,

  fuenteRecuperacion: null,

  divisaOrigen: null,
  valorDivisaOrigen: null,

  companiaContable: null,
  cuentaContable: null,

  fechaContable: null,
  informacionAdicional: null,
};

export default function EditarRecuperacion() {
  const serviceAAD = new AADService();

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const { dataUsuario } = useContext(UsuarioContext);

  const history = useHistory();

  const location = useLocation();

  const [Activo, setActivo] = useState(true);
  const [Inactivar, setInactivar] = useState(false);
  const [motivoInactivacion, setMotivoInactivacion] = useState(null);

  const [idRecuperacion, setIdRecuperacion] = useState(null);
  const [idEfectoFinanciero, setIdEfectoFinanciero] = useState(null);

  const [estadoRecuperacion, setEstadoRecuperacion] = useState(null);

  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState([]);

  const [listaDivisas, setListaDivisas] = useState([]);

  const [monedaCOP, setMonedaCOP] = useState(null);
  const [monedaUSD, setMonedaUSD] = useState(null);

  const [cuentasContables, setCuentasContable] = useState(null);
  const [listaCuentasContables, setListaCuentasContables] = useState(null);

  const [loadingData, setLoadingData] = React.useState(false);

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

  useEffect(() => {
    const llenarFormulario = async () => {
      try {
        //---------------------------------------------------------Manejo de ids...
        console.log("Ubicación de donde provengo : ", location);

        let tempIDrecup = "";

        if (typeof location.state != "undefined") {
          if (
            location.state.idRecuperacion &&
            location.state.idRecuperacion.length > 0
          ) {
            tempIDrecup = location.state.idRecuperacion;

            setIdRecuperacion(tempIDrecup);
          }
        }

        //-----------------------------------------------LLamar a las APIs para traer listas

        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/recuperacion/" + tempIDrecup,
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

        const responseCompanias = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let data = response.data;

        console.log("datos del back : ", data);

        if (data.recuperacion_anulada == 1) {
          setActivo(false);
        } else {
          setActivo(true);
        }

        if (
          data.divisa_origen_recuperacion &&
          data.recuperacion_divisa_origen &&
          data.fecha_contable_recuperacion
        ) {
          let convertValue = {
            divisa_origen: data.divisa_origen_recuperacion,
            valor_divisa_origen: parseFloat(data.recuperacion_divisa_origen),
            fecha_trm: new Date(data.fecha_contable_recuperacion),
          };

          try {
            const conversionDivisa = await axios.post(
              process.env.REACT_APP_API_URL + "/convertir_divisa",
              convertValue,
              {
                headers: {
                  Authorization: "Bearer " + serviceAAD.getToken(),
                },
              }
            );

            let dataConversion = conversionDivisa.data;

            setMonedaCOP(dataConversion.valor_COP);
            setMonedaUSD(dataConversion.valor_USD);

            console.log("dataConversion", dataConversion);
          } catch (error) {
            console.log("Error al convertir valor : ", error);
          }
        }

        setValue("estadoRecuperacion", estadoRecuperacion);

        setValue("idEfecto", data.idefecto_financiero);

        setIdEfectoFinanciero(data.idefecto_financiero);

        setValue("fuenteRecuperacion", {
          value: data.fuente_recuperacion,
          label: data.fuente_recuperacion,
        });

        setValue("companiaContable", {
          value: data.compania_contable_recuperacion,
          label: data.compania_contable_recuperacion,
        });
        setValue("divisaOrigen", {
          value: data.divisa_origen_recuperacion,
          label: data.divisa_origen_recuperacion,
        });
        setValue("valorDivisaOrigen", data.recuperacion_divisa_origen);

        let date1 = new DateObject(data.fecha_contable_recuperacion);

        let date2 = Date.parse(data.fecha_contable_recuperacion);

        console.log(date1.format("DD/MM/YYYY"));
        console.log(date2);
        setValue("fechaContable", date2);

        setValue("infoAdicional", data.informacion_adicional);

        let companias = responseCompanias.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
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

        setListaCompaniasInicial(companias);

        setListaCuentasContables(cuentasContables);

        let objCompania = companias.filter(
          (compania) => compania.label === data.compania_contable_recuperacion
        );

        let numeroCuentaContable = cuentasContables.find(
          (cuenta) => cuenta.nombre === data.cuenta_contable_recuperacion
        );

        setValue("cuentaContable", {
          value: numeroCuentaContable.label,
          label: numeroCuentaContable.label,
        });

        let cuentasFiltradas = cuentasContables.filter(
          (cuenta) => cuenta.value === objCompania[0].value
        );

        console.log("cuentas filtradas : ", cuentasFiltradas);

        setCuentasContable(cuentasFiltradas);

        setLoadingData(true);
      } catch (error) {
        console.error(error);
      }
    };

    llenarFormulario();
  }, []);

  const onSubmit = (dato) => {
    console.log("datos del formulario : ", dato);
    const dataEnviar = {
      id_recuperacion: idRecuperacion,
      id_efecto_financiero: dato.idEfecto,

      recuperacion_anulada: 0,
      justificacion_anulacion_recuperacion: dato.motivoInactivacion,

      fuente_de_recuperacion: dato.fuenteRecuperacion.label,

      divisa_origen: dato.divisaOrigen.label,
      recuperacion_en_divisa_origen: parseFloat(dato.valorDivisaOrigen),

      compañia_contable: dato.companiaContable.label,
      cuenta_contable: dato.cuentaContable.label,

      fecha_contable: new Date(dato.fechaContable),

      informacion_adicional: dato.informacionAdicional,
    };

    console.log("Datos a enviar al back :", dataEnviar);

    try {
      axios
        .put(process.env.REACT_APP_API_URL + "/recuperacion/", dataEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            alert("Recuperación actualizada correctamente");
            //setEstadoPost(2);
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

  const InactivarEvento = () => {
    setInactivar((prev) => !prev);
  };

  const ActivarEvento = () => {
    setActivo((prev) => !prev);
  };

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

          {!loadingData ? (
            <Row className="mb-3 mt-5">
              <Col>
                <Loader
                  type="Oval"
                  color="#FFBF00"
                  style={{ textAlign: "center", position: "static" }}
                />
              </Col>
            </Row>
          ) : (
            <>
              <Row className="mb-3 mt-3">
                {!!Activo == true ? (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={InactivarEvento}
                    >
                      Inactivar
                    </Button>
                  </Col>
                ) : (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={ActivarEvento}
                    >
                      Activar
                    </Button>
                  </Col>
                )}
                <Col sm={2} xs={12}>
                  <Link to={"/Recuperaciones"}>
                    <Button type="button" className="botonNegativo">
                      Cancelar
                    </Button>
                  </Link>
                </Col>
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
                  <Button
                    type="submit"
                    onClick={handleSubmit(onSubmit, onError)}
                    variant={"contained"}
                    className="btn botonPositivo"
                  >
                    Guardar
                  </Button>
                </Col>

                <Col sm={4} xs={12}>
                  {console.log("ESTADO DEL EVENTO", Activo)}
                  {console.log("-------------", !!Activo)}

                  <input
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Nuevo Estado del evento"
                    value={!!Activo ? "Activa" : "Inactiva"}
                    disabled
                  />
                </Col>
              </Row>

              {/* <----------------------------------------Formulario----------------------------------------> */}
              <hr />
              <br />
              {/* <-------------Información general-------------------> */}
              <Row className="mb-4">
                {!Activo ? (
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
                        rows="3"
                        value={motivoInactivacion}
                        disabled
                      />
                    </Col>
                  </>
                ) : (
                  <></>
                )}
              </Row>

              <ModalInactivar
                setActivo={setActivo}
                Inactivar={Inactivar}
                setInactivar={setInactivar}
                setMotivoInactivacion={setMotivoInactivacion}
              ></ModalInactivar>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">ID efecto</label>
                </Col>

                <Col sm={4} xs={12}>
                  <input
                    disabled
                    type="text"
                    className="form-control text-center texto"
                    placeholder="ID del efecto"
                    {...register("idEfecto")}
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Fuente de recuperación
                  </label>
                </Col>
                <Col sm={4} xs={12}>
                  <FormSearchListFuenteRecuperacion
                    control={control}
                    name="fuenteRecuperacion"
                    label="Fuente de Recuperacion"
                  />
                </Col>
              </Row>

              {/* <------------------------------------- Información financiera y contable -------------------------------------> */}

              <Row className="mb-3 mt-3">
                <Col sm={6} xs={12}>
                  <h2 className="subtitulo">
                    Información financiera y contable
                  </h2>
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
                  <p>{errors.proceso?.message}</p>
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
                        placeholder="Valor de la frecuencia"
                        onChange={onChange}
                        value={value}
                      />
                    )}
                    rules={{
                      required: "Te faltó completar este campo",
                    }}
                  />
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
                    placeholder="Valor divisa origen"
                    value={monedaCOP}
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
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={6} xs={12}></Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">Fecha contable:</label>
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

              <br />
              <hr />

              {/* <-------------------------------------Titulo-------------------------------------> */}

              <Row className="mb-3 mt-3">
                {!!Activo == true ? (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={InactivarEvento}
                    >
                      Inactivar
                    </Button>
                  </Col>
                ) : (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={ActivarEvento}
                    >
                      Activar
                    </Button>
                  </Col>
                )}
                <Col sm={2} xs={12}>
                  <Link to={"/Recuperaciones"}>
                    <Button type="button" className="botonNegativo">
                      Cancelar
                    </Button>
                  </Link>
                </Col>

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
                  <Button
                    type="submit"
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
                <Col sm={12} xs={12}>
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
            </>
          )}
        </FormProvider>
      </Container>
    </>
  );
}
