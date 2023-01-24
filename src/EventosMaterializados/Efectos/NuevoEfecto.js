import React, { useState, useEffect, useContext, forwardRef } from "react";
import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";
import { Link, Routes, Route, useHistory, useLocation } from "react-router-dom";
import AADService from "../../auth/authFunctions";

import makeAnimated from "react-select/animated";

import Select from "react-select";

import axios from "axios";

import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

// import { ModalEfectosFinancieros } from "./ModalesEventos/ModalEfectosFinancieros";
import ModalRecuperaciones from "./Modales/ModalRecuperaciones";
import { FormInputEfectoFinanciero } from "../../form-components/FormInputEfectoFinanciero";
import { FormInputTipoEfecto } from "../../form-components/FormInputTipoEfecto";
import { FormInputGeografia } from "../../form-components/FormInputGeografia";
import { FormInputLineasNegocio } from "../../form-components/FormInputLineasNegocio";
import { FormInputProducto } from "../../form-components/FormInputProducto";
import { FormInputCanal } from "../../form-components/FormInputCanal";
import { FormInputObjetoCosto } from "../../form-components/FormInputObjetoCosto";
import { FormInputCasosEspeciales } from "../../form-components/FomrInputCasosEspeciales";
import { FormInputOtrosEfectosRelacionados } from "../../form-components/FormInputOtrosEfectosRelacionados";
import { FormInputClasificacionDemanda } from "../../form-components/FormInputClasificacionDemanda";

import { FormInputDate } from "../../form-components/FormInputDate";
import { NumericCellType } from "handsontable/cellTypes";
import DateObject from "react-date-object";

import { UsuarioContext } from "../../Context/UsuarioContext";
import { RecuperacionesContext } from "../../Context/RecuperacionesContext";
import { FormSearchListDivisaOrigen } from "../../form-components/FormSearchListDivisaOrigen";
import { FormComponentInfoContable } from "../../form-components/FormComponentInfoContable";
import ModalEfectosValoracion from "./Modales/ModalEfectosValoracion";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#f4f4f4",
    heigth: "10px",
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    /* maxHeight: "60vh", */
    minHeight: "20vh",
  },

  MuiTableRow: {
    root: {
      //This can be referred from Material UI API documentation.
      heigth: "10px",
    },
  },
});

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
  efectoFinanciero: null,
  tipoEfecto: null,
  descripcionEfecto: null,
  geografia: null,
  lineaNegocio: null,
  producto: null,
  canal: null,
  objetoCosto: null,
  casosEspeciales: null,
  otrosEfectos: null,
  divisaOrigen: null,
  valorDivisaOrigen: null,
  infoContable: null,
  documentoContable: null,
  fechaContable: null,
  valorFrecuencia: null,
  clasificacionDemanda: null,
};

export default function NuevoEfecto(props) {
  const location = useLocation();

  let history = useHistory();

  const classes = useStyles();

  const serviceAAD = new AADService();

  const { dataUsuario } = useContext(UsuarioContext);

  const { dataRecuperaciones } = useContext(RecuperacionesContext);

  const [idEfectoFinanciero, setIdEfectoFinanciero] = useState(null);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  //* En este conjunto de variables de estado se guardan los valores obtenidos de la api,
  // * de modo que no se tenga que consultar posteriormente.

  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState([]);
  const [ListaAreasInicial, setListaAreasInicial] = useState([]);
  const [ListaProcesosInicial, setListaProcesosInicial] = useState([]);
  const [ListaCategoriasRiesgo, setListaCategoriasRiesgo] = useState([]);

  const [listaTipoEfecto, setListaTipoEfecto] = useState([]);
  const [listaTipoEfectoFiltrada, setListaTipoEfectoFiltrada] = useState([]);
  const [listaEfectosFinancieros, setListaEfectoFinancieros] = useState([]);

  const [listaDivisas, setListaDivisas] = useState([]);
  const [divisa, setDivisa] = useState(null);
  const [moneda, setMoneda] = useState(null);
  const [monedaCOP, setMonedaCOP] = useState(null);
  const [monedaUSD, setMonedaUSD] = useState(null);

  const [ListaAreas, setListaAreas] = useState([]);
  const [ListaProcesos, setListaProcesos] = useState([]);
  const [ListaCatCorp1, setListaCatCorp1] = useState([]);
  const [ListaCatCorp3, setListaCatCorp3] = useState([]);
  const [ListaCatLocal1, setListaCatLocal1] = useState([]);
  const [ListaCatLocal3, setListaCatLocal3] = useState([]);
  const [ListaCausasN1, setListaCausasN1] = useState([]);
  const [ListaCausasN2, setListaCausasN2] = useState([]);
  const [idEventoMaterializado, setIdEventoMaterializado] = useState(null);

  const [dataEfectos, setDataEfectos] = useState([]);
  const [showEfectos, setShowEfectos] = useState(false);
  const [showModalEfectos, setShowModalEfectos] = useState(false);
  const [showDisplayEfectos, setShowDisplayEfectos] = useState(false);

  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ButtonEdit, SetButtonEdit] = useState(false);
  const [dataRecuperacion, setDataRecuperacion] = useState([]);

  const [dataEfectosValoracion, setDataEfectosValoracion] = useState([]);
  const [showEfectosValoracion, setShowEfectosValoracion] = useState(false);

  useEffect(() => {
    console.log(location);
    //Si vengo de Eventos necesito conocer el id del evento
    if (location && location.state) {
      setIdEventoMaterializado(location.state.idEventoMaterializado);
    }
  }, [location]);

  useEffect(() => {
    const getCompanias = async () => {
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

        let nombreCompañia = companias.filter(
          (compania) => compania.value == dataUsuario.idcompania
        );

        localStorage.setItem(
          "idEfectoFinanciero",
          "EF-" +
            nombreCompañia[0].label +
            "-" +
            dataUsuario.email.split("@")[0] +
            "-" +
            Date.now().toString().slice(-7)
        );

        setIdEfectoFinanciero(localStorage.idEfectoFinanciero.replaseAll('','_'));

        //setIdEventoMaterializado(localStorage.idEventoMaterializado);
      } catch (error) {
        console.error(error);
      }
    };
    const getDivisas = async () => {
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
    };
    const getEfectosFinancieros = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Efecto_financiero/efecto_financiero",
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

        setListaEfectoFinancieros(data);
      } catch (error) {
        console.error(error);
      }
    };
    const getTipoEfecto = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/tipo_de_efecto/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let data = response.data.map(
          ({ idm_parametrosgenerales: value, valor: label, parametro }) => ({
            value,
            label,
            parametro,
          })
        );

        setListaTipoEfecto(data);
      } catch (error) {
        console.error(error);
      }
    };

    getCompanias();
    getDivisas();
    getEfectosFinancieros();
    getTipoEfecto();
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
    const dataEnviar = {
      id_efecto_financiero: idEfectoFinanciero,
      id_evento_materializado: idEventoMaterializado,

      efecto_anulado: 0,
      justificacion_anulacion_efecto: null,

      efecto_financiero: data.efectoFinanciero
        ? data.efectoFinanciero.label
        : null,
      tipo_de_efecto: data.tipoEfecto ? data.tipoEfecto.label : null,
      geografia: data.geografia ? data.geografia.label : null,
      linea_de_negocio: data.lineaNegocio ? data.lineaNegocio.label : null,
      producto: data.producto ? data.producto.label : null,
      canal: data.canal ? data.canal.label : null,
      objeto_de_costo: data.objetoCosto ? data.objetoCosto.label : null,

      casos_especiales: data.casosEspeciales
        ? data.casosEspeciales.label
        : null,
      otros_efectos_relacionados: data.otrosEfectos
        ? data.otrosEfectos.label
        : null,

      id_efecto_valoracion: data.idEfectoValoracion
        ? data.idEfectoValoracion
        : null,

      descripcion_del_efecto: data.descripcionEfecto
        ? data.descripcionEfecto
        : null,

      divisa_origen: data ? data.divisaOrigen.label : null,
      perdida_en_divisa_origen: data.valorDivisaOrigen
        ? parseInt(data.valorDivisaOrigen)
        : null,
      moneda_cop: monedaCOP ? monedaCOP : null,

      compañia_contable: data.infoContable ? data.infoContable.value : null,
      cuenta_contable: data.infoContable ? data.infoContable.label : null,
      numero_documento_contable: data.documentoContable
        ? data.documentoContable
        : null,
      fecha_contable: data.fechaContable ? data.fechaContable : null,

      valor_de_la_frecuencia: data.valorFrecuencia
        ? data.valorFrecuencia
        : null,
      clasificacion_de_la_demanda: data.clasificacionDemanda
        ? data.clasificacionDemanda.label
        : null,

      recuperaciones: [],
    };

    console.log("Datos prepreocesados: ", data);
    console.log("Datos listos para enviar: ", dataEnviar);

    try {
      axios
        .post(process.env.REACT_APP_API_URL + "/efecto_financiero/", dataEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          console.log(response.data);
          if (response.status >= 200 && response.status < 300) {
            setEstadoPost(2);
            setTimeout(
              history.push({
                pathname: "/EditarEvento",
                state: { idEventoMaterializado: idEventoMaterializado },
              }),
              3000
            );
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);

            alert(response.data);
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

  const onSubmitRecuperaciones = (data) => {
    const dataEnviar = {
      id_efecto_financiero: idEfectoFinanciero,
      id_evento_materializado: idEventoMaterializado,

      efecto_anulado: 0,
      justificacion_anulacion_efecto: null,

      efecto_financiero: data.efectoFinanciero
        ? data.efectoFinanciero.label
        : null,
      tipo_de_efecto: data.tipoEfecto ? data.tipoEfecto.label : null,
      geografia: data.geografia ? data.geografia.label : null,
      linea_de_negocio: data.lineaNegocio ? data.lineaNegocio.label : null,
      producto: data.producto ? data.producto.label : null,
      canal: data.canal ? data.canal.label : null,
      objeto_de_costo: data.objetoCosto ? data.objetoCosto.label : null,

      casos_especiales: data.casosEspeciales
        ? data.casosEspeciales.label
        : null,
      otros_efectos_relacionados: data.otrosEfectos
        ? data.otrosEfectos.label
        : null,

      id_efecto_valoracion: data.idEfectoValoracion
        ? data.idEfectoValoracion
        : null,

      descripcion_del_efecto: data.descripcionEfecto
        ? data.descripcionEfecto
        : null,

      divisa_origen: data ? data.divisaOrigen.label : null,
      perdida_en_divisa_origen: data.valorDivisaOrigen
        ? parseInt(data.valorDivisaOrigen)
        : null,
      moneda_cop: monedaCOP ? monedaCOP : null,

      compañia_contable: data.infoContable ? data.infoContable.value : null,
      cuenta_contable: data.infoContable ? data.infoContable.label : null,
      numero_documento_contable: data.documentoContable
        ? data.documentoContable
        : null,
      fecha_contable: data.fechaContable ? data.fechaContable : null,

      valor_de_la_frecuencia: data.valorFrecuencia
        ? data.valorFrecuencia
        : null,
      clasificacion_de_la_demanda: data.clasificacionDemanda
        ? data.clasificacionDemanda.label
        : null,

      recuperaciones: [],
    };
    console.log("Datos prepreocesados: ", data);
    console.log("Datos listos para enviar: ", dataEnviar);

    try {
      axios
        .post(process.env.REACT_APP_API_URL + "/efecto_financiero/", dataEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          console.log(response.data);
          if (response.status >= 200 && response.status < 300) {
            setEstadoPost(2);
            setTimeout(
              history.push({
                pathname: "/NuevaRecuperacion",
                state: { idEfectoFinanciero: idEfectoFinanciero },
              }),
              3000
            );
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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      SetButtonEdit(true);
    } else {
      SetButtonEdit(false);
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const crearRecuperacion = () => {
    //setDataUsuario({ idusuario: 2222 });
    window.open("NuevaRecuperacion", "_blank").focus();
  };

  const getConversion = () => {
    let dataConversion = {
      divisa_origen: getValues("divisaOrigen").label,
      valor_divisa_origen: parseFloat(getValues("valorDivisaOrigen")),
      fecha_trm: getValues("fechaContable"),
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/convertir_divisa", dataConversion)
      .then((response) => {
        setMonedaCOP(response.data.valor_COP);
        setMonedaUSD(response.data.valor_USD);
      });
  };

  const FiltrarTipoDeEfecto = (objTipoEfecto) => {
    setValue("tipoEfecto", null);

    let tempListaTipoEfecto = listaTipoEfecto.map((tipoEfecto) => {
      let newParametro = tipoEfecto.parametro.replace(/_/g, " ");

      return { ...tipoEfecto, parametro: newParametro };
    });

    let tempListaTipoEfectoFiltrado = [];

    switch (objTipoEfecto.label) {
      case "Contable en cuentas RO":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Contable en cuentas RO";
          }
        );
        break;

      case "Provisionado":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Provisionado";
          }
        );
        break;

      case "Sin asiento contable":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Sin asiento contable";
          }
        );
        break;

      case "Contable en otras cuentas":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Contable en otras cuentas";
          }
        );
        break;

      case "Ingresos":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Ingresos";
          }
        );
        break;

      default:
        break;
    }

    setListaTipoEfectoFiltrada(tempListaTipoEfectoFiltrado);
  };

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Container>
        <FormProvider {...methods}>
          {/* <-------------------------------------Titulo-------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={6} xs={12}>
              <h1 className="titulo">Efecto: {idEfectoFinanciero}</h1>
            </Col>

            <Col sm={2} xs={12}>
              <Link to={"/Eventos"}>
                <Button type="button" className="botonNegativo">
                  Cancelar
                </Button>
              </Link>
            </Col>
            <Col sm={2} xs={12}>
              <Link
                to={{
                  pathname: "/EditarEvento",
                  state: { idEventoMaterializado: idEventoMaterializado },
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

          {/* <----------------------------------------Formulario----------------------------------------> */}

          <hr />
          <br />

          <ModalRecuperaciones
            showModalEfectos={showModalEfectos}
            setShowModalEfectos={setShowModalEfectos}
            dataEfectos={dataEfectos}
            setDataEfectos={setDataEfectos}
            setShowDisplayEfectos={setShowDisplayEfectos}
          ></ModalRecuperaciones>

          <ModalEfectosValoracion
            setValue={setValue}
            getValues={getValues}
            dataEfectosValoracion={dataEfectosValoracion}
            setDataEfectosValoracion={setDataEfectosValoracion}
            showEfectosValoracion={showEfectosValoracion}
            setShowEfectosValoracion={setShowEfectosValoracion}
          ></ModalEfectosValoracion>

          {/* <-------------Información general-------------------> */}

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">ID Evento:</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                type="text"
                value={idEventoMaterializado}
                className="form-control text-left texto"
                placeholder="Aqui va el id del evento"
                {...register("idEvento")}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Efecto financiero*</label>
            </Col>
            <Col sm={4} xs={12}>
              <Controller
                control={control}
                name="efectoFinanciero"
                render={({ field }) => (
                  <Select
                    components={animatedComponents}
                    options={listaEfectosFinancieros}
                    onChange={(e) => {
                      FiltrarTipoDeEfecto(e);
                      field.onChange(e);
                    }}
                    value={field.value}
                    placeholder="Seleccione el efecto financiero"
                  />
                )}
                rules={{
                  required: "Te faltó completar este campo",
                }}
              />
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Tipo de efecto*</label>
            </Col>

            <Col sm={4} xs={12}>
              <Controller
                control={control}
                name="tipoEfecto"
                render={({ field }) => (
                  <Select
                    components={animatedComponents}
                    options={listaTipoEfectoFiltrada}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    value={field.value}
                    placeholder="Seleccione el tipo de efecto"
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
              <label className="forn-label label">Geografía*</label>
            </Col>
            <Col sm={4} xs={12}>
              <FormInputGeografia
                control={control}
                name="geografia"
                label="Geografía"
              />
              <p>{errors.geografia?.message}</p>
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Lineas de negocio*</label>
            </Col>

            <Col sm={4} xs={12}>
              <FormInputLineasNegocio
                control={control}
                name="lineaNegocio"
                label="Lineas de negocio"
              />
              <p>{errors.lineaNegocio?.message}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Producto*</label>
            </Col>

            <Col sm={4} xs={12}>
              <FormInputProducto
                control={control}
                name="producto"
                label="Producto"
              />
              <p>{errors.producto?.message}</p>
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Canal*</label>
            </Col>

            <Col sm={4} xs={12}>
              <FormInputCanal control={control} name="canal" label="Canal" />
              <p>{errors.canal?.message}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Objeto de costo*</label>
            </Col>

            <Col sm={4} xs={12}>
              <FormInputObjetoCosto
                control={control}
                name="objetoCosto"
                label="Objeto de costo"
              />
              <p>{errors.objetoCosto?.message}</p>
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Casos especiales</label>
            </Col>

            <Col sm={4} xs={12}>
              <FormInputCasosEspeciales
                control={control}
                name="casosEspeciales"
                label="Casos especiales"
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">
                Otros efectos relacionados
              </label>
            </Col>

            <Col sm={4} xs={12}>
              <FormInputOtrosEfectosRelacionados
                control={control}
                name="otrosEfectos"
                label="Otros efectos relacionados"
              />
            </Col>

            <Col sm={3} xs={4}>
              <label className="forn-label label">
                ID Efecto de valoración
              </label>
            </Col>

            <Col sm={2} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="ID del riesgo"
                {...register("idEfectoValoracion")}
              />
            </Col>

            <Col sm={1} xs={12}>
              <button
                type="button"
                class="btn btn-primary btn-md"
                onClick={() => setShowEfectosValoracion(true)}
              >
                Asociar
              </button>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Descripción del efecto</label>
            </Col>
            <Col sm={10} xs={12}>
              <textarea
                className="form-control text-center"
                placeholder="Descripción del efecto"
                rows="3"
                {...register("descripcionEfecto")}
              />
              <p>{errors.descripcionEfecto?.message}</p>
            </Col>
          </Row>

          <br />

          {/* <------------------------------------- Información financiera y contable​-------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={6} xs={12}>
              <h2 className="subtitulo">Información financiera y contable</h2>
              <hr />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Moneda origen*</label>
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
                Valor en moneda origen*
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

          <FormComponentInfoContable
            fullWidth={true}
            control={control}
            name="infoContable"
            label="Información contable"
          />

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Documento contable</label>
            </Col>

            <Col sm={4} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder=""
                {...register("documentoContable")}
              />
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Fecha contable:</label>
            </Col>

            <Col sm={2} xs={12}>
              <FormInputDate
                control={control}
                name="fechaContable"
                label="Fecha contable"
              />
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

          {/* <------------------------------------- Campos de uso para Panamá:​-------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={4} xs={12}>
              <h2 className="subtitulo">Campos de uso para Panamá​</h2>
              <hr />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Valor de la frecuencia</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                type="number"
                className="form-control text-center texto"
                placeholder="Valor de la frecuencia"
                {...register("valorFrecuencia")}
              />
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">
                Clasificación de la demanda
              </label>
            </Col>

            <Col sm={4} xs={12}>
              <FormInputClasificacionDemanda
                control={control}
                name="clasificacionDemanda"
                label="Clasificación de la demanda"
                {...register("clasificacionDemanda")}
              />
            </Col>
          </Row>

          <br />

          {/* <-------------------------------------RECUPERACIONES-------------------------------------> */}

          {/* <-------------------------------------Botones-------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={9} xs={12}></Col>
            <Col sm={3} xs={12}>
              <Button
                type="button"
                variant={"contained"}
                className="btn botonPositivo"
                onClick={handleSubmit(onSubmitRecuperaciones, onError)}
              >
                Nueva recuperación
              </Button>
            </Col>
          </Row>

          {/* <----------------------------------------------------------------------> */}

          <Row className="mb-4">
            <Paper className={classes.root}>
              <TableContainer component={Paper} className={classes.container}>
                <Table
                  className={"text"}
                  stickyHeader
                  aria-label="sticky table"
                >
                  {/* Inicio de encabezado */}
                  <TableHead className="titulo">
                    <TableRow>
                      <StyledTableCell padding="checkbox"></StyledTableCell>
                      <StyledTableCell>ID recuperación</StyledTableCell>
                      <StyledTableCell align="left">
                        Fuente de recuperación
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Moneda origen
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Recuperación divisa origen
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Compañía contable
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Cuenta contable
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Fecha contable
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Información adicional
                      </StyledTableCell>
                      <StyledTableCell align="left">Estado</StyledTableCell>
                      <StyledTableCell align="left">
                        Justificación anulación
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  {/* Fin de encabezado */}
                  {/* Inicio de cuerpo de la tabla */}
                  <TableBody>
                    {dataRecuperacion
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.idriesgo);
                        return (
                          <StyledTableRow
                            key={row.idefecto_financiero}
                            hover
                            onClick={(event) =>
                              handleClick(event, row.idefecto_financiero)
                            }
                            selected={isItemSelected}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <StyledTableCell component="th" scope="row">
                              <Checkbox checked={isItemSelected} />
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {row.id_recuperacion}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.fuente_de_recuperacion}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.divisa_origen}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.recuperacion_en_divisa_origen}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.compañia_contable}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.cuenta_contable}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.fecha_contable}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.informacion_adicional}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.recuperacion_anulada}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.justificacion_anulacion_recuperacion}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                  {/* Fin de cuerpo de la tabla */}
                </Table>
              </TableContainer>
            </Paper>
          </Row>

          {/* <---------------------------------------------------------------------------------> */}

          <br />
          <hr />

          <Row className="mb-3 mt-3">
            <Col sm={6} xs={12}>
              <h1 className="titulo">Efecto: {idEfectoFinanciero}</h1>
            </Col>

            <Col sm={2} xs={12}>
              <Link
                to={{
                  pathname: "/EditarEvento",
                  state: { idEventoMaterializado: idEventoMaterializado },
                }}
              >
                <Button type="button" className="botonNegativo3">
                  Regresar
                </Button>
              </Link>
            </Col>
            <Col sm={2} xs={12}>
              <Link to={"/Eventos"}>
                <Button type="button" className="botonNegativo">
                  Cancelar
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
