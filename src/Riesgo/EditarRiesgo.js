import React, { useState, useEffect, Children } from "react";
import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import ModalAlerta from "../Globales/ModalAlerta";
import {
  Row,
  Col,
  Form,
  Alert,
  Navbar,
  Container,
  Nav,
  Button,
  Modal,
} from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";
import { AiFillDelete, AiFillCaretDown } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";
import axios from "axios";
import AADService from "../auth/authFunctions";
//import { CausaControlContext } from "../contexts/CausaControlContext";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import ModalProveedor from "../Maestros/Proveedores/ModalProveedor";
import Queries from "../Components/QueriesAxios";
// import { ModalEliminarEfecto } from "./ModalesNewRiesgos/ModalEliminarEfecto";

const _ = require("lodash");

const AlertDismissibleExample = ({ alerta }) => {
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

    case 6:
      return (
        <Alert variant="warning">
          Ya existe una evaluación para el activo seleccionado
        </Alert>
      );
    case 7:
      return (
        <Alert variant="warning">
          Corrige los siguientes errores: • Debe completar los campos
          obligatorios
        </Alert>
      );
    case 8:
      return (
        <Alert variant="warning">
          No se permite crear un riesgo con el mismo nombre
        </Alert>
      );
    default:
      return <p></p>;
  }
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#f4f4f4",
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "57vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "50vh",
    //minHeight: "50vh",
  },
});

const useStylesModal = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "30vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "30vh",
    //minHeight: "50vh",
  },
});
const animatedComponents = makeAnimated();
const defaultState = {
  id: "",
  descripcion: "",
  causaN1: "",
  causaN2: "",
  estado: true,
  porcentaje: "",
};

export default function EditarRiesgo(props) {
  const serviceAAD = new AADService();
  const [actualizar, setActualizar] = useState(false);

  const [enableButton, setEnableButton] = React.useState(true);
  //*Lista general de efectos, esta variable es la fuente de todas las tablas y modales
  const [listaGeneralEfectos, setListaGeneralEfectos] = useState([]);

  /* Datos para los modales */

  const [dataRiesgos, setDataRiesgos] = useState([]);
  const [elementoNegPal, setElementoNegPal] = useState([]);
  const [companias, setCompanias] = useState([]);
  const [listaElementos, setTipoElementoSelect] = useState([]);
  const [listaProceso, setListaProceso] = useState([]);
  //const [listaProveedor, setListaProveedor] = useState(["sin informacion"]);
  //const [listaProyecto, setListaProyecto] = useState(["sin informacion"]);
  const [listaProducto, setListaProducto] = useState([]);
  const [listaCanal, setListaCanal] = useState([]);
  const [catRiesgos, setCatRiesgos] = useState([]);
  const [subCatRiesgo, setSubCatRiesgo] = useState([]);
  const [catRiesgos_local, setCatRiesgos_Local] = useState([]);
  const [subCatRiesgos_localR, setSubCatRiesgos_LocalR] = useState([]);
  const [estados, setEstados] = useState([]);
  const [listaContratos, setListaContratos] = useState([]);
  const [listaContratosPrin, setListaContratosPrin] = useState([]);
  const [contrato, setContrato] = useState([]);
  const [contratoSelec, setContratoSelec] = useState([]);
  const [contratoOtros, setContratoOtros] = useState([]);
  const [listaProveedores, setListaProveedores] = useState([]);
  const [Proveedor, setProveedor] = useState([]);
  const [validador, setValidador] = useState(null);

  //* Reciben los datos filtrados
  const [listaGeneral, setListaGeneral] = useState([]);
  const [listaProceso_filtered, setListaProcesoFiltered] = useState([]);
  const [listaProveedor_filtered, setListaProveedorFiltered] = useState([]);
  const [listaProyecto_filtered, setListaProyectoFiltered] = useState([]);
  const [listaProducto_filtered, setListaProductoFiltered] = useState([]);
  const [listaCanal_filtered, setListaCanalFiltered] = useState([]);
  const [subCatRiesgo_filtered, setsubCatRiesgoFiltered] = useState([]);
  const [catRiesgosRO_filtered, setCat_RO_localFiltered] = useState([]);
  const [subCatRiesgosRO_filtered, setSubCat_RO_localFiltered] = useState([]);

  //* Reciben los datos ingresados/elegidos por el usuario
  const [rows, setRows] = useState([defaultState]);
  const [rowsAll, setRowsAll] = useState();

  const [idRiesgo, setIdRiesgo] = useState(null);
  const [estadoRiesgo, setEstadoRiesgo] = useState(null);
  const [compania, setCompania] = useState(null);
  const [idcompania, setIdCompania] = useState(null);
  const [obj_compania, setObj_compania] = useState(null);
  const [nombre_riesgo, setNombre_riesgo] = useState(null);
  const [descripcion, setDescripcion] = useState(null);
  const [aristas, setAristas] = useState(null);
  const [controlesAristas, setControlesAristas] = useState(null);
  const [listaAristas, setListaAristas] = React.useState([]);
  const [strAristas, setStrAristas] = useState([]);
  const [tipoElemento, setTipoElemento] = useState(null);
  const [elemento, setElementoEv] = useState(null);
  const [proceso, setProceso] = useState(null);
  const [canal, setCanal] = useState(null);
  const [producto, setProducto] = useState(null);
  const [showProveedor, setShowProveedor] = useState(false);
  const [showProceso, setShowProceso] = useState(false);
  const [showContratos, setShowContratos] = useState(false);
  const [riesgoRO, setRiesgoRo] = useState(null);
  const [subRiesgoRO, setSubRiesgoRo] = useState(null);
  const [riesgoLocal, setRiesgoLocal] = useState(null);
  const [subRiesgoLocal, setSubRiesgoLocal] = useState(null);
  const [cicloProceso, setCicloProceso] = useState(false);

  const [descripComplementaria, setDescComplementaria] = useState(null);
  const [riesgoCont, setRiesgoCont] = useState(null);
  const [malversacion, setMalversacion] = useState(null);

  //* Recibe el Riesgo a Editar
  const [riesgoEditar, SetRiesgoEditar] = useState(null);
  const [dataGrid, setDataGrid] = useState([]);

  //* Variables relacionadas con el resumen del calculo (DetalleRO)
  const [modelosDetalleRO, setModelosDetalleRO] = useState(null);
  const [exposicionIn, setExposicionIn] = useState(null);
  const [metEfectividadCtrl, setMetEfectividadCtrl] = useState(null);
  const [efectividadCtrl, setEfectividadCtrl] = useState(null);
  const [exposicionResidual, setExposicionResidual] = useState(null);
  const [nivelRiesgoInherente, setNivelRiesgoInherente] = useState(null);
  const [nivelRiesgoResidual, setNivelRiesgoResidual] = useState(null);
  // const [par, setPar] = useState(null);
  const [justificacionCausas, setJustificacionCausas] = useState(null);

  //* Variables relacionadas con el resumen de la valoracion (Efectos)
  const [muestraResumen, setMuestraResumen] = useState(false);
  const [resumenValoracion, setResumenValoracion] = useState(null);
  const [loadingData, setLoadingData] = React.useState(true);
  const [loadingDataCausas, setLoadingDataCausas] = React.useState(true);

  const [nombreElemento, setNombreElemento] = React.useState(null);
  const [nombreElementoOtros, setnombreElementoOtros] = React.useState(null);
  const [showModalProveedor, setShowModalProveedor] = React.useState(false);
  const [tipoProveedor, setTipoProveedor] = useState([]);

  const history = useHistory();

  //* Controla comportamiento de la vista

  const [tipoCompo, setTipoComponente] = useState("Select");
  const [isCheckedRO, setIsCheckedRO] = useState(false);
  const [isCheckedSOX, setIsCheckedSOX] = useState(false);
  const [checkedStateImpacto, setCheckedStateImpacto] = useState(false);
  const [validated, setValidated] = useState(false);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [showAlerta, setShowAlerta] = useState(false);
  const [textAlerta, setTextAlerta] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [malverObligatorio, setMalverObligatorio] = useState(false);

  // const listaAristas = [
  //   {
  //     name: "RO",
  //     value: "RO",
  //   },
  //   {
  //     name: "SOX",
  //     value: "SOX",
  //   },
  //   {
  //     name: "LAFT",
  //     value: "LAFT",
  //   },
  //   {
  //     name: "PDP",
  //     value: "PDP",
  //   },
  //   {
  //     name: "SAC",
  //     value: "SAC",
  //   },
  //   {
  //     name: "Corrupción int.",
  //     value: "Corrupción interna",
  //   },
  //   {
  //     name: "Corrupción ext.",
  //     value: "Corrupción externa",
  //   },
  //   {
  //     name: "Reputacional",
  //     value: "Reputacional",
  //   },
  //   {
  //     name: "Legal",
  //     value: "Legal",
  //   },
  //   {
  //     name: "ESG",
  //     value: "ESG",
  //   },
  // ];
  const [checkedState, setCheckedState] = useState(
    new Array(listaAristas.length).fill(false)
  );

  //* Variables para el resumen de efectos */

  const [dataResumenEfecto, setDataResumenEfecto] = useState([]);

  const classes = useStylesModal();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataCausaIn, setDataCausaIn] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  //* Variables involucradas en el modal de confimación de desasociar efectos
  const [openModal, setOpenModal] = React.useState(false);
  const [tipoDeEfecto, setTipoDeEfecto] = React.useState(null);

  const [listaDetalleSox, setListaDetalleSox] = useState([
    {
      name: "Existencia",
      value: "Existencia",
      state: false,
    },
    {
      name: "Integridad",
      value: "Integridad",
      state: false,
    },
    {
      name: "Exactitud",
      value: "Exactitud",
      state: false,
    },
    {
      name: "Valuación",
      value: "Valuación",
      state: false,
    },
    {
      name: "Derechos y Oblig.",
      value: "Derechos y Oblig.",
      state: false,
    },
    {
      name: "Presentación y Rev.",
      value: "Presentación y Rev.",
      state: false,
    },
  ]);
  const [fraudeInt, setFraudeInt] = useState(null);
  const [fraudeMalv, setFraudeMalv] = useState(null);
  const [fraudeRepFin, setFraudeRepFin] = useState(null);
  const [listaCatSOX, setListaCatSOX] = useState(null);
  const defaultValues = {
    aristasEdit: null,
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
    let companias;
    let elementosNegPpal;
    let listaProcesos;
    let listaProductos;
    let listaCanales;
    let catRiesgo_Corp;
    let subCatRiesgo_Corp;
    let catRiesgoRO_Local;
    let subCatRiesgos_local;
    let riesgo;
    let resumenRiesgo;
    let detalleRO;
    let ubicacion_elementoPpal;
    let ubicacion_Proceso;
    let rx_riesgo_efectos;
    let existeDetalleRO;
    let listaProveedor;

    const getProveedor = async () => {
      try {
        let response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/proveedor/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaProveedor = await response.data.map(
          ({ ID_SAP: value, Nombre_Proveedor: label, grupo, parametro }) => ({
            value,
            label,
            grupo,
            parametro,
          })
        );
        setListaProveedorFiltered(listaProveedor);
        setListaProveedores(listaProveedor);
      } catch (error) {
        console.error(error);
      }
    };

    getProveedor();

    //* configura estado /////////////////////

    const listadoEstados = [
      { value: 1, label: "Activo" },
      { value: 0, label: "Inactivo" },
    ];

    setEstados(listadoEstados);

    const getCompanias = async () => {
      setLoadingDataCausas(true);
      try {
        const response_compania = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        companias = await response_compania.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
        setCompanias(companias);
      } catch (error) {
        console.error(error);
      }
    };

    //* Recibe los datos de los elementos de negocio prinicpales ///////
    const getElementosNegPpal = async () => {
      setLoadingDataCausas(true);
      try {
        const response_elemNegPpal = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Evaluaciones/Tipo_elemento_negocio_principal",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        elementosNegPpal = await response_elemNegPpal.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );
        setElementoNegPal(elementosNegPpal);
      } catch (error) {
        console.error(error);
      }
    };

    //* Recibe los datos de los procesos ///////////////////////
    const getListaProcesos = async () => {
      setLoadingDataCausas(true);
      try {
        const response_procesos = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Proceso",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaProcesos = await response_procesos.data.map(
          ({ id: value, nombre: label, idcompania, ciclo }) => ({
            value,
            label,
            idcompania,
            ciclo,
          })
        );
        setListaProceso(listaProcesos);
      } catch (error) {
        console.error(error);
      }
    };

    //* Recibe los datos de los productos ///////////////////////
    const getProductos = async () => {
      setLoadingDataCausas(true);
      try {
        const response_productos = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Producto",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaProductos = await response_productos.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaProducto(listaProductos);
      } catch (error) {
        console.error(error);
      }
    };

    //* Recibe los datos de los canales ///////////////////////
    const getCanales = async () => {
      setLoadingDataCausas(true);
      try {
        const response_canales = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Canal",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaCanales = response_canales.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaCanal(listaCanales);
      } catch (error) {
        console.error(error);
      }
    };

    //*Recibe y transforma los datos de las categorias de riesgo RO y local //////
    const getCategoriasRiesgos = async () => {
      setLoadingDataCausas(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/categoria_riesgo/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let datos = await response.data.map(
          ({
            idcategoria_riesgo: value,
            nombre: label,
            atributo,
            nivel,
            categoria_riesgos_n1,
          }) => ({
            value,
            label,
            atributo,
            nivel,
            categoria_riesgos_n1,
          })
        );
        /* let  */ catRiesgo_Corp = [];
        /* let  */ subCatRiesgo_Corp = [];
        /* let  */ catRiesgoRO_Local = [];
        subCatRiesgos_local = [];

        datos.map((riesgo) => {
          if (
            riesgo.atributo !== "Corporativa" &&
            riesgo.atributo !== "Oculta" &&
            riesgo.nivel === 1
          ) {
            catRiesgoRO_Local.push(riesgo);
          } else if (
            riesgo.atributo !== "Corporativa" &&
            riesgo.atributo !== "Oculta" &&
            riesgo.nivel === 3
          ) {
            subCatRiesgos_local.push(riesgo);
          } else if (riesgo.nivel === 1) {
            catRiesgo_Corp.push(riesgo);
          } else if (riesgo.nivel === 3) {
            subCatRiesgo_Corp.push(riesgo);
          }
          return null;
        });

        setListaCatSOX(
          subCatRiesgo_Corp.filter((obj) => obj.categoria_riesgos_n1 === 26)
        );
        setCatRiesgos(catRiesgo_Corp);
        setSubCatRiesgo(subCatRiesgo_Corp);
        setCatRiesgos_Local(catRiesgoRO_Local);
        setSubCatRiesgos_LocalR(subCatRiesgos_local);
      } catch (error) {
        console.error(error);
      }
    };

    //*Recibe los datos del riesgo a editar  ///////////////
    const getRiesgo = async () => {
      setLoadingDataCausas(true);
      try {
        const response_riesgo = await axios.get(
          process.env.REACT_APP_API_URL + "/riesgos/" +
            localStorage.getItem("idRiesgo") +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        riesgo = await response_riesgo.data;
        setIdRiesgo(riesgo.idriesgo);
        setJustificacionCausas(riesgo.justificacion_participacion_causa);
        setControlesAristas(riesgo);
        let arrayAristas = riesgo?.arista_del_riesgo.split(",");
        console.log("arrayAristasjaja", riesgo?.arista_del_riesgo);

        let aristasEdit = [];

        arrayAristas.forEach((string) => {
          aristasEdit.push({ value: string, label: string });
        });
        console.log("aristas Edit", aristasEdit);
        // // if (aristasEdit.some((obj) => obj.label === "RO")) {
        // //   setCheckedRO(true);
        // // }else if(aristasEdit.some((obj) => obj.label === "RO")){
        // //   setCheckedSOX(true);
        // // }
        // // else {
        // //   setCheckedRO(false);
        // //   setCheckedSOX(false);
        // // }

        setValue("aristas", aristasEdit);
        // -------------------------fin manejo aristas
      } catch (error) {
        console.error(error);
      }
    };

    const getDetalleRO = async () => {
      setLoadingDataCausas(true);
      const verificaDetalleRO = (aristasDelRiesgo) => {
        if (aristas) {
          let aristas = aristasDelRiesgo.split(",");
          let isRO = false;
          aristas.map((e) => {
            if (e === "RO") {
              isRO = true;
            }
          });
          return isRO;
        }
      };

      existeDetalleRO = verificaDetalleRO(riesgo.arista_del_riesgo);

      try {
        if (existeDetalleRO === true) {
          const response_DetalleRO = await axios.get(
            process.env.REACT_APP_API_URL + "/rx_detalle_ro/" + riesgo.idriesgo + "/",
            {
              headers: {
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          );
          detalleRO = await response_DetalleRO.data;

          setNivelRiesgoInherente(detalleRO.nivel_riesgo_inherente);
          setNivelRiesgoResidual(detalleRO.nivel_riesgo_residual);
          setExposicionResidual(detalleRO.exposicion_residual);
          // getPar();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getDetalleSox = async () => {
      try {
        let requestDetalleSox = await Queries(
          null,
          "/rx_detalle_sox/" + localStorage.getItem("idRiesgo") + "/",
          "GET"
        );
        let tempAseveracionesCheck = listaDetalleSox;
        let tempDataTrue = requestDetalleSox.aseveraciones.split(";");
        let temp = tempAseveracionesCheck.map((dataCheck) => {
          tempDataTrue.map((dataRQ) => {
            if (dataRQ === dataCheck.name) {
              dataCheck.state = true;
            }
            return null;
          });
          return dataCheck;
        });
        setFraudeInt({
          label: requestDetalleSox.sub_categoria_corporativa,
          value: requestDetalleSox.sub_categoria_corporativa,
        });
        setFraudeMalv({
          label: requestDetalleSox.malversacion,
          value: requestDetalleSox.malversacion,
        });
        setFraudeRepFin({
          label: requestDetalleSox.fraude_rep_financiero,
          value: requestDetalleSox.fraude_rep_financiero,
        });
        setListaDetalleSox(temp);
      } catch (error) {}
    };
    getDetalleSox();

    const getUbicacion_elementoPpal = async () => {
      try {
        const response_UElementoPpal = await axios.get(
          process.env.REACT_APP_API_URL + "/ubicacion/" + riesgo.id_elemento_ppal + "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        ubicacion_elementoPpal = await response_UElementoPpal.data;
      } catch (error) {
        console.error(error);
      }
    };

    const getUbicacion_procesoRiesgo = async () => {
      try {
        const response_UProceso = await axios.get(
          process.env.REACT_APP_API_URL + "/ubicacion/" + riesgo.idubicacion + "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        ubicacion_Proceso = await response_UProceso.data;
      } catch (error) {
        console.error(error);
      }
    };

    async function getAristas() {
      let requestAristas = await Queries(null, "/maestros_ro/aristas/", "GET");
      requestAristas = requestAristas.map(({ nombre }) => ({
        value: nombre,
        label: nombre,
      }));
      console.log({ requestAristas });
      setListaAristas(requestAristas);
    }
    getAristas();

    const cargaRiesgo = async () => {
      await getCompanias();
      await getElementosNegPpal();
      await getListaProcesos();
      await getProductos();
      await getCanales();
      await getCategoriasRiesgos();
      await getRiesgo();
      await getDetalleRO();
      await getUbicacion_elementoPpal();
      await getUbicacion_procesoRiesgo();

      try {
        //* Filtra maestros según la compañía del riesgo a Editar ////////
        const checkCompania = (compania) => {
          return compania.label === riesgo.compania;
        };

        const compRiesgoEditar = companias.filter(checkCompania);
        const valueCompania = compRiesgoEditar[0].value;
        setCompania(compRiesgoEditar[0]);
        setIdCompania(compRiesgoEditar[0]);
        let procesosFiltrados = [];
        let canalesFiltrados = [];
        let productosFiltrados = [];
        await listaProcesos.map((dato) => {
          if (dato.idcompania === valueCompania) {
            procesosFiltrados.push(dato);
          }
          return null;
        });
        await listaCanales.map((dato) => {
          if (dato.idcompania === valueCompania) {
            canalesFiltrados.push(dato);
          }
          return null;
        });
        await listaProductos.map((dato) => {
          if (dato.idcompania === valueCompania) {
            productosFiltrados.push(dato);
          }
          return null;
        });

        setListaCanalFiltered(canalesFiltrados);
        setListaProcesoFiltered(procesosFiltrados);
        setListaProductoFiltered(productosFiltrados);

        //* Filtra categorias de RO Local según territorio ///////////////

        const filtraXPais_ROLocal = (paisCompania, categoriaRiesgoLocal) => {
          let categoriasFiltradas = [];
          if (paisCompania === "Colombia") {
            categoriaRiesgoLocal.map((categoria) => {
              if (categoria.atributo === "Local - COL") {
                categoriasFiltradas.push(categoria);
              }
              return null;
            });
          } else if (paisCompania === "Panamá") {
            categoriaRiesgoLocal.map((categoria) => {
              if (categoria.atributo === "Local -PAN") {
                categoriasFiltradas.push(categoria);
              }
              return null;
            });
          } else if (paisCompania === "Guatemala") {
            categoriaRiesgoLocal.map((categoria) => {
              if (categoria.atributo === "Local - GTM") {
                categoriasFiltradas.push(categoria);
              }
              return null;
            });
          } else if (paisCompania === "General") {
            categoriaRiesgoLocal.map((categoria) => {
              categoriasFiltradas.push(categoria);
              return null;
            });
          }
          return categoriasFiltradas;
        };

        let categorias_ROFIltradas = catRiesgoRO_Local
          ? filtraXPais_ROLocal(compRiesgoEditar[0].pais, catRiesgoRO_Local)
          : null;

        let subCategorias_ROFIltradas = subCatRiesgos_local
          ? filtraXPais_ROLocal(compRiesgoEditar[0].pais, subCatRiesgos_local)
          : null;

        //* Carga la lista de elementos correspondientes según la selección de Elemento de NEgocio PPal

        function controlaElementoPpal(tipoElemento) {
          if (tipoElemento === "Proceso") {
            setTipoComponente("Select");
            setTipoElementoSelect(procesosFiltrados);
          } else if (tipoElemento === "Proveedor") {
            setTipoComponente("Select");
            setTipoElementoSelect(null);
            setShowContratos(true);
          } else if (tipoElemento === "Producto") {
            setTipoComponente("Select");
            setTipoElementoSelect(productosFiltrados);
          } else if (tipoElemento === "Canal") {
            setTipoComponente("Select");
            setTipoElementoSelect(canalesFiltrados);
          } else if (tipoElemento === "Proyecto") {
            setTipoComponente("Select");
            setTipoElementoSelect(null);
          } else if (tipoElemento === "Otras iniciativas") {
            setTipoComponente("Input");
          }
        }

        controlaElementoPpal(riesgo.tipo_elemento_evaluado);

        //* Asignar valores predeterminados del Riesgo a editar

        function convierteCompaniafilter(companiaRiesgo, listadoCompanias) {
          return listadoCompanias.filter((compania) => {
            if (compania.label === companiaRiesgo) {
              return {
                value: compania.value,
                label: compania.label,
              };
            }
          });
        }

        function convierteCompania(companiaRiesgo, listadoCompanias) {
          return listadoCompanias.map((compania) => {
            if (compania.label === companiaRiesgo) {
              return {
                value: compania.value,
                label: compania.label,
              };
            }
          });
        }

        function convierteTipoElemento(tipoRiesgo, TiposDeELementoPpal) {
          return TiposDeELementoPpal.filter(
            (elemento) => elemento.label === tipoRiesgo
          );
        }

        function convierteElementoPpal(tipoElemento) {
          if (
            tipoElemento === "E_ElementoPpal_Producto" ||
            tipoElemento === "R_ElementoPpal_Producto"
          ) {
            return {
              value: ubicacion_elementoPpal.idproducto,
              label: ubicacion_elementoPpal.nombre_prod,
            };
          } else if (
            tipoElemento === "E_ElementoPpal_Proceso" ||
            tipoElemento === "R_ElementoPpal_Proceso"
          ) {
            return {
              value: ubicacion_elementoPpal.idproceso,
              label: ubicacion_elementoPpal.nombre_proceso,
            };
          } else if (
            tipoElemento === "E_ElementoPpal_Canal" ||
            tipoElemento === "R_ElementoPpal_Canal"
          ) {
            return {
              value: ubicacion_elementoPpal.idcanal,
              label: ubicacion_elementoPpal.nombre_canal,
            };
          } else if (
            tipoElemento === "E_ElementoPpal_Proveedor" ||
            tipoElemento === "R_ElementoPpal_Proveedor"
          ) {
            setShowProveedor(true);
            let temp_contratos_prin = [];
            let temp_contratos = [];
            riesgo.contratos.map((o) => {
              if (o.principal) {
                temp_contratos_prin.push({
                  value: o.id_contrato,
                  label: o.nombre,
                });
              } else {
                temp_contratos.push({
                  value: o.id_contrato,
                  label: o.nombre,
                });
              }
            });
            setContratoSelec(temp_contratos_prin);
            setContratoOtros(temp_contratos);
            setnombreElementoOtros(ubicacion_Proceso.nombre_proveedor);
            return {
              value: ubicacion_elementoPpal.idProveedor,
              label: ubicacion_elementoPpal.nombre_proveedor,
            };
          }
        }

        function convierteProceso(proceso) {
          if (proceso && proceso.idproceso) {
            return {
              value: proceso.idproceso,
              label: proceso.nombre_proceso,
            };
          } else {
            return null;
          }
        }

        function convierteAristas(aristasDelRiesgo) {
          const listaDeAristas = new Array(listaAristas.length).fill(false);
          let aristas = aristasDelRiesgo.split(",");
          if (aristas) {
            aristas.map((e) => {
              if (e === "RO") {
                listaDeAristas[0] = true;
                setIsCheckedRO(true);
              } else if (e === "SOX") {
                listaDeAristas[1] = true;
                setIsCheckedSOX(true);
              } else if (e === "LAFT") {
                listaDeAristas[2] = true;
              } else if (e === "PDP") {
                listaDeAristas[3] = true;
              } else if (e === "SAC") {
                listaDeAristas[4] = true;
              } else if (e === "Corrupción interna") {
                listaDeAristas[5] = true;
              } else if (e === "Corrupción externa") {
                listaDeAristas[6] = true;
              } else if (e === "Reputacional") {
                listaDeAristas[7] = true;
              } else if (e === "Legal") {
                listaDeAristas[8] = true;
              } else if (e === "ESG") {
                listaDeAristas[9] = true;
              }
            });
            return listaDeAristas;
          }
        }

        function convierteCatROCorp(idCategoria, categoriasCorp) {
          return categoriasCorp.filter((e) => e.value === idCategoria);
        }

        function convierteCatROLocal(categoriasRO_Local) {
          return categoriasRO_Local.map((elemento) => {
            if (elemento.value === detalleRO.idcatro_local) {
              return {
                value: elemento.value,
                label: elemento.label,
              };
            }
          });
        }

        function convierteSubCatROLocal(categoriasRO_Local) {
          return categoriasRO_Local.map((elemento) => {
            if (elemento.value === detalleRO.idsubcatro_local) {
              return {
                value: elemento.value,
                label: elemento.label,
              };
            }
          });
        }

        function calculoRC(riesgoContingencia) {
          if (riesgoContingencia === 1) {
            return {
              value: 1,
              label: "Si",
            };
          } else if (riesgoContingencia === 0) {
            return {
              value: 0,
              label: "No",
            };
          }
        }

        function convierteEstado(estadoRiesgo) {
          if (estadoRiesgo === 1) {
            return {
              value: true,
              label: "Activo",
            };
          } else if (estadoRiesgo === 0) {
            return {
              value: false,
              label: "Inactivo",
            };
          }
        }
        const getValidador = async (tipo_elemento, elemento) => {
          let dataPeticion = { [tipo_elemento]: elemento };
          let correoValidador = "";
          dataPeticion = JSON.stringify(dataPeticion);

          try {
            const response = await axios.post(
              process.env.REACT_APP_API_URL + "/validador",
              dataPeticion,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + serviceAAD.getToken(),
                },
              }
            );

            if (response.status >= 200 && response.status < 300) {
              if (response.data.validador !== null) {
                setValidador(response.data.validador);
                correoValidador = response.data.validador;
                return response.data.correo;
              } else {
                setValidador("No tiene un validador asignado");
                return "No tiene un validador asignado";
              }
            } else if (response.status >= 500) {
              setValidador("No tiene un validador asignado");
              return "No tiene un validador asignado";
            }

            return correoValidador;
          } catch (error) {
            console.error("No tiene un validador asignado", error);
          }
        };

        getValidador(
          riesgo.tipo_elemento_evaluado,
          riesgo.id_elemento_ppal_evaluado
        );

        let correoVal = await getValidador(
          riesgo.tipo_elemento_evaluado,
          riesgo.id_elemento_ppal_evaluado
        );

        setEstadoRiesgo(convierteEstado(riesgo.estado));
        setCompania(convierteCompania(riesgo.compania, companias));
        setIdCompania(riesgo.idcompania);
        setObj_compania(convierteCompaniafilter(riesgo.compania, companias)[0]);
        setIdRiesgo(riesgo.idriesgo);
        setEfectividadCtrl(riesgo.efectividad_control);
        setNombre_riesgo(riesgo.nombre_riesgo);
        setDescripcion(riesgo.descripcion_general);
        setTipoElemento(
          convierteTipoElemento(
            riesgo.tipo_elemento_evaluado,
            elementosNegPpal
          )[0]
        );
        if (riesgo.tipo_elemento_evaluado === "Otras iniciativas") {
          setElementoEv(riesgo.descripcion_otras_iniciativas);
        } else {
          setElementoEv(
            convierteElementoPpal(ubicacion_elementoPpal.tipo_objeto)
          );
        }
        if (ubicacion_Proceso) {
          setProceso(convierteProceso(ubicacion_Proceso));
        }
        let productosRiesgo = [];
        riesgo.productos.map((prod) => {
          productosRiesgo.push({
            value: prod.idproducto,
            label: prod.nombre_prod,
          });
        });
        if (productosRiesgo) {
          setProducto(productosRiesgo);
        }
        let canalesRiesgo = [];
        riesgo.canales.map((canal) => {
          canalesRiesgo.push({
            value: canal.idcanal,
            label: canal.nombre_canal,
          });
        });
        if (canalesRiesgo) {
          setCanal(canalesRiesgo);
        }
        if (resumenRiesgo) {
          setResumenValoracion(resumenRiesgo);
        }
        if (ubicacion_Proceso) {
          setProveedor({
            value: ubicacion_Proceso.idProveedor,
            label: ubicacion_Proceso.nombre_proveedor,
          });
          if (ubicacion_Proceso.idProveedor) {
            setShowContratos(true);
          }
        }

        setAristas(riesgo.arista_del_riesgo);

        setCheckedState(convierteAristas(riesgo.arista_del_riesgo));
        setCat_RO_localFiltered(categorias_ROFIltradas);

        if (detalleRO) {
          //setLoadingData(true);
          setModelosDetalleRO(detalleRO.modelos);
          setRiesgoRo(
            convierteCatROCorp(detalleRO.idcatro_corporativa, catRiesgo_Corp)[0]
          );
          getSubCatRiesgo(detalleRO.idcatro_corporativa);
          setSubRiesgoRo(
            convierteCatROCorp(
              detalleRO.idsubcatro_corporativa,
              subCatRiesgo_Corp
            )[0]
          );
          setRiesgoLocal(convierteCatROLocal(categorias_ROFIltradas));
          setSubRiesgoLocal(convierteSubCatROLocal(subCategorias_ROFIltradas));
          setRiesgoCont(calculoRC(detalleRO.riesgo_contingencia));
          setDescComplementaria(detalleRO.descripcion_complementaria);
          setMalversacion({
            value: detalleRO.malversacion,
            label: detalleRO.malversacion,
          });
          //setLoadingData(false);
        }

        if (rx_riesgo_efectos) {
          completarTabla(rx_riesgo_efectos);
        }
        // if (existeDetalleRO === false) {
        //   setLoadingData(false);
        // }
        if (!actualizar) {
          setActualizar([true]);
        }
        return null;
      } catch (error) {
        console.error(error);
      }
      setLoadingDataCausas(false);
    };

    cargaRiesgo();

    
  }, [actualizar]);
  const FiltrarAristas = (aristasSelected) => {
    if (aristasSelected.some((obj) => obj.label === "RO")) {
      setIsCheckedRO(true);
    } else if (aristasSelected.some((obj) => obj.label === "SOX")) {
      setIsCheckedSOX(true);
    } else {
      setIsCheckedRO(false);
      setIsCheckedSOX(false);
    }
  };

  const headCells_AsociaActivas = [
    {
      id: "ID_Causa_N2",
      num: "0",
      align: "left",
      disablePadding: false,
      label: "ID Causa N2",
    },
    {
      id: "causa_N1",
      num: "1",
      align: "center",
      col: 3,
      disablePadding: false,
      label: "Causa N1",
    },
    {
      id: "nombre_Causa",
      num: "2",
      align: "center",
      disablePadding: true,
      label: "Nombre Estandar Causa",
    },
    {
      id: "descripcion_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Descripción específica causa",
    },
    {
      id: "participacion_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Participación en el riesgo",
    },
    {
      id: "participacion_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Participación en el riesgo",
    },
    {
      id: "estado_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Estado",
    },
  ];

  function EnhancedTableHead(props) {
    const { classes } = props;
    return (
      <TableHead>
        <TableRow>
          <TableCell style={{ backgroundColor: "#2c2a29", color: "#ffffff" }} />
          {headCells_AsociaActivas.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.disablePadding ? "none" : "default"}
              style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
              colSpan={headCell.col ? headCell.col : 1}
            >
              <label className="label" style={{ marginRight: "20%" }}>
                {headCell.label}
              </label>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  function Item(props) {
    const { sx, ...other } = props;
    return (
      <Box
        sx={{
          textAlign: "center",
          m: 2,
          ...sx,
        }}
        {...other}
      />
    );
  }

  Item.propTypes = {
    sx: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  };
  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  const filtraCategoria_XPais = (categorias, compania) => {
    let categoriasFiltradas = [];
    if (compania.pais === "Colombia") {
      categorias.map((categoria) => {
        if (categoria.atributo === "Local - COL") {
          categoriasFiltradas.push(categoria);
        }
        return null;
      });
    } else if (compania.pais === "Panamá") {
      categorias.map((categoria) => {
        if (categoria.atributo === "Local -PAN") {
          categoriasFiltradas.push(categoria);
        }
        return null;
      });
    } else if (compania.pais === "Guatemala") {
      categorias.map((categoria) => {
        if (categoria.atributo === "Local - GTM") {
          categoriasFiltradas.push(categoria);
        }
        return null;
      });
    } else if (compania.pais === "General") {
      categorias.map((categoria) => {
        categoriasFiltradas.push(categoria);
        return null;
      });
    }
    return categoriasFiltradas;
  };

  //* Filtra segun la compañia seleccionada  y renderiza nuevamente la lista de Componentes Ppales///////////////////

  const FiltrarMaestros = (compania) => {
    if (compania !== null) {
      setCompania({ value: compania.value, label: compania.label });
      setIdCompania(compania.value);
      setObj_compania({ value: compania.value, label: compania.label });
      setTipoElemento(null);
      setCanal(null);
      setProceso(null);
      setProducto(null);
      setRiesgoRo(null);
      setSubRiesgoRo(null);
      setRiesgoLocal(null);
      setSubRiesgoLocal(null);
      setElementoEv(null);

      //* Filtra maestros según la compañía seleccionada ////////
      let procesosFiltrados = [];
      let canalesFiltrados = [];
      let productosFiltrados = [];
      listaProceso.map((dato) => {
        if (dato.idcompania === compania.value) {
          procesosFiltrados.push(dato);
        }
        return null;
      });
      listaCanal.map((dato) => {
        if (dato.idcompania === compania.value) {
          canalesFiltrados.push(dato);
        }
        return null;
      });
      listaProducto.map((dato) => {
        if (dato.idcompania === compania.value) {
          productosFiltrados.push(dato);
        }
        return null;
      });
      setListaCanalFiltered(canalesFiltrados);
      setListaProcesoFiltered(procesosFiltrados);
      setListaProductoFiltered(productosFiltrados);
      setCat_RO_localFiltered(
        filtraCategoria_XPais(catRiesgos_local, compania)
      );
      setSubCat_RO_localFiltered(
        filtraCategoria_XPais(subCatRiesgos_localR, compania)
      );
    }
  };

  const getSubRiesgoLocal = (catNivel1) => {
    setSubCatRiesgos_LocalR(null);
    if (catNivel1) {
      let categoriasNivel3 = subCatRiesgos_localR.filter(
        (e) => e.categoria_riesgos_n1 === catNivel1
      );
      //* Filtra categorias de RO según territorio ///////////////

      setSubCat_RO_localFiltered(categoriasNivel3);
    }
  };

  //* Carga la lista de elementos correspondientes según la selección de Elemento de NEgocio PPal

  const setElementos = (event) => {
    setTipoElemento(event);
    if (event !== null) {
      if (event.label === "Proceso") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProceso_filtered);
        setElementoEv(null);
      } else if (event.label === "Proveedor") {
        setTipoComponente("Input");
        setTipoElementoSelect(listaProveedor_filtered);
        setElementoEv(null);
      } else if (event.label === "Producto") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProducto_filtered);
        setElementoEv(null);
      } else if (event.label === "Canal") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaCanal_filtered);
        setElementoEv(null);
      } else if (event.label === "Proyecto") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProyecto_filtered);
        setElementoEv(null);
      } else if (event.label === "Otras iniciativas") {
        setTipoComponente("Input");
        setElementoEv(null);
      }
    }
  };

  async function ContratoProveedor(proveedor, elemento) {
    const response_proveedor = await axios.get(
      process.env.REACT_APP_API_URL + "/maestros_ro/proveedor/" + proveedor + "/",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      }
    );
    if (response_proveedor.data.Contratos) {
      let contratosP = [];

      response_proveedor.data.Contratos.map((contr) => {
        contratosP.push({
          value: contr.Id_contrato,
          label: contr.Nombre,
          principal: true,
        });
      });
      if (elemento === "Principal") {
        contratosP.map((o) => {
          o.principal = 1;
        });
        setListaContratosPrin(contratosP);
      } else if (elemento === "Otros") {
        contratosP.map((o) => {
          o.principal = 0;
        });
        setListaContratos(contratosP);
      }
    }
  }

  async function getValidador(elemento) {
    const tipoElemento_peticion = tipoElemento
      ? Object.values(tipoElemento)[1]
      : null;
    let dataPeticion = { [tipoElemento_peticion]: elemento };
    dataPeticion = JSON.stringify(dataPeticion);

    const response = await axios
      .post(process.env.REACT_APP_API_URL + "/validador", dataPeticion, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      })
      .then(function (response) {
        if (response.status >= 200 && response.status < 300) {
          if (response.data.validador !== null) {
            setValidador(response.data.validador);
          } else {
            setValidador("No tiene un validador asignado");
          }
        } else if (response.status >= 500) {
          return "No tiene un validador asignado";
        }
      });
  }
  //* Controla los checkboxes, recibe su valor y lo guarda en un string ///////////////////////

  const handleOnChangeDetalleSOX = (position) => {
    let tempDetalleSOX = listaDetalleSox;
    tempDetalleSOX[position].state = !listaDetalleSox[position].state;

    console.log(tempDetalleSOX);

    setListaDetalleSox(tempDetalleSOX);
  };

  const handleOnChangePosition = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const arrayAristas = updatedCheckedState.reduce(
      (arista, currentState, index) => {
        if (currentState === true) {
          arista.push(listaAristas[index].value);
          return arista;
        }
        return arista;
      },
      []
    );

    setIsCheckedRO(
      arrayAristas.some(function (element) {
        return element == "RO";
      })
    );

    setIsCheckedSOX(
      arrayAristas.some(function (element) {
        return element === "SOX";
      })
    );

    var stringAristas = arrayAristas.join(",");
    setAristas(stringAristas);
  };

  //* Filtra segun la categoria Nivel 1 y las subcategorías de riesgo correspondientes*/

  const getSubCatRiesgo = (catNivel1) => {
    setSubRiesgoRo(null);

    if (catNivel1) {
      let categoriasNivel3 = subCatRiesgo.filter(
        (e) => e.categoria_riesgos_n1 === catNivel1
      );
      setsubCatRiesgoFiltered(categoriasNivel3);
    }

    if (catNivel1 == 53 || catNivel1 == 26) {
      setMalverObligatorio(true);
    }
  };

  const FiltrarProveedor = (e) => {
    let elemento = e.value;
    setShowProveedor(true);
  };

  const filtraEfectos = (listaGeneral, nuevaLista, tipoNuevaLista) => {
    //** Toma como propiedades 1. la lista general o consolidada de todos los efectos: Activos + Inactivos +Agregados + Buscados 2.La nueva lista de efectos que se agregará: efectos Activos, efectos Escaneados, efectos Buscados

    //* Devuelve el efecto de mayor prelación Activo||Inactivo > Sugerido > Buscado --- Es invocado mas adelante
    const comparaefectos = (efectoAntiguo, efectoNuevo) => {
      if (
        efectoAntiguo.estado_enVista === "Activo" ||
        efectoAntiguo.estado_enVista === "Inactivo"
      ) {
        return efectoAntiguo;
      } else if (
        efectoNuevo.estado_enVista === "Activo" ||
        efectoNuevo.estado_enVista === "Inactivo"
      ) {
        return efectoNuevo;
      } else if (efectoAntiguo.estado_enVista === "Agregado") {
        return efectoAntiguo;
      } else if (efectoNuevo.estado_enVista === "Agregado") {
        return efectoNuevo;
      } else if (efectoAntiguo.estado_enVista === "Buscado") {
        return efectoAntiguo;
      } else if (efectoNuevo.estado_enVista === "Buscado") {
        return efectoNuevo;
      }
    };

    let consolidadoEfectos;

    if (listaGeneral.length !== 0) {
      //* funcion principal: Compara la listaGeneral de efectos y la NuevaLista de efectos, obtiene los repetidos y prevalece el mas importante (ver función comparaefectos)...
      //* ... Luego obtiene los efectos que no se repiten de cada lista, y une todos los efectos en Consolidado Efectos
      //* ... consolidado efectos se mostrará en cada tabla respectivamente según su propiedad "estado_enVista"
      let arr = [];
      let res;
      nuevaLista.map((efectoNuevo) => {
        //* devuelve el indice del riesgo repetido, de lo contrario devuelve -1
        res = _.findIndex(
          listaGeneral,
          (e) => {
            return e.idefecto == efectoNuevo.idefecto;
          },
          0
        );

        //*
        if (res !== -1) {
          var efectoAntiguo = listaGeneral.filter(
            (e) => e.idefecto === efectoNuevo.idefecto
          )[0];
          let aux = comparaefectos(efectoAntiguo, efectoNuevo);
          arr.push(aux);
        }
      });

      //* Obtienen los efectos únicos de cada array de efectos
      let dif1 = _.differenceBy(nuevaLista, listaGeneral, "idefecto");
      let dif2 = _.differenceBy(listaGeneral, nuevaLista, "idefecto");

      let efectosUnicos = _.concat(dif1, dif2);
      consolidadoEfectos = _.concat(efectosUnicos, arr);

      consolidadoEfectos.sort(function (a, b) {
        if (a.idefecto > b.idefecto) {
          return 1;
        }
        if (a.idefecto < b.idefecto) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    } else if (listaGeneral.length === 0) {
      consolidadoEfectos = nuevaLista;
    }

    return consolidadoEfectos;
  };

  //** Cambia estado de Efectos */

  const completarTabla = (efectos, nuevoEstado, tipoEfecto) => {
    //* Agrega las propiedades de los efectos seleccionados y actualiza su estado segun nuevoEstado

    let nuevaLista = [];
    efectos.map((a) => {
      let efectoCompleto = listaGeneralEfectos.filter(
        (e) => e.idefecto === a
      )[0];

      efectoCompleto.estado_enVista = nuevoEstado;
      efectoCompleto.tipoEfecto = tipoEfecto;
      nuevaLista.push(efectoCompleto);
    });
    let efectos_filtrados = filtraEfectos(listaGeneralEfectos, nuevaLista);
    setListaGeneralEfectos(efectos_filtrados);
  };

  const checkValidez = () => {
    if (nombre_riesgo !== null && nombre_riesgo !== "") {
      if (tipoElemento !== null) {
        if (elemento !== null) {
          if (isCheckedRO) {
            if (riesgoRO !== null) {
              /*  if (subRiesgoRO !== null) { */
              if (riesgoCont !== null) {
                if (riesgoRO.value == 53 || riesgoRO.value == 26) {
                  if (
                    malversacion.value !== null ||
                    malversacion.value !== ""
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }
              } else {
                return false;
              }
              /*  } else {
                return false;
              } */
            } else {
              return false;
            }
          } else if (aristas !== null) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  //** Envía los datos al back */

  const perteneceDist = (data, unknown) => {
    let temp = false;
    data.map((dat) => {
      if (dat.idcontrol === unknown.idcontrol) {
        temp = true;
      }
      return null;
    });
    return temp;
  };

  const sendData = (event) => {
    event.preventDefault();
    if (checkValidez() === false) {
      setEstadoPost(7);
      setTimeout(() => {
        setEstadoPost(0);
      }, 4000);
    } else if (checkValidez() === true) {
      let productos = [];
      let canales = [];
      let procesoData;

      if (producto !== null) {
        producto.map((e) => {
          productos.push(Object.values(e)[0]);
        });
      }
      if (canal !== null) {
        canal.map((e) => {
          canales.push(Object.values(e)[0]);
        });
      }
      if (proceso) {
        procesoData = Object.values(proceso)[0];
      } else {
        procesoData = null;
      }

      function convierteEstadoRiesgo(estadoRiesgo) {
        if (estadoRiesgo.value === true) {
          return 1;
        } else {
          return 0;
        }
      }
      let elemento_ppal_evaluado;
      if (Object.values(tipoElemento)[1] === "Otras iniciativas") {
        elemento_ppal_evaluado = elemento ? elemento : null;
      } else if (Object.values(tipoElemento)[1] === "Proveedor") {
        elemento_ppal_evaluado =
          typeof elemento === "object" ? Object.values(elemento)[0] : elemento;
      } else {
        elemento_ppal_evaluado = elemento ? Object.values(elemento)[0] : null;
      }

      let stringAristas = strAristas.map((obj) => obj.label).join(",");

      var datosRiesgo = {
        idriesgo: idRiesgo,
        idcompania: idcompania,
        nombre_riesgo: nombre_riesgo,
        descripcion_general: descripcion,
        arista_del_riesgo: strAristas ? stringAristas : null,
        tipo_de_evento: 1,
        estado: convierteEstadoRiesgo(estadoRiesgo),
        tipo_elemento_evaluado: Object.values(tipoElemento)[1],
        elemento_ppal_evaluado: elemento_ppal_evaluado,
        idproceso: proceso ? proceso.value : null,
        idcanal: canales,
        idproducto: productos,
        efectividad_control: efectividadCtrl,
        metodo_efectividad_ctrol: metEfectividadCtrl,
        justificacion_participacion_causa: justificacionCausas,
        idproveedor: Proveedor ? Proveedor.ID_SAP : null,
        Id_contrato: contratoOtros,
        Id_contrato_prin: contratoSelec,
      };
      JSON.stringify(datosRiesgo);
      //Guarda
      axios
        .put(process.env.REACT_APP_API_URL + "/riesgos/" + idRiesgo + "/", datosRiesgo, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(async function (response) {
          if (
            response.status >= 200 &&
            response.status < 300 &&
            isCheckedSOX === true
          ) {
            let tempAseveraciones = listaDetalleSox.filter((obj) => obj.state);
            let aseveracionesSOX = tempAseveraciones.map((obj) => obj.name);
            aseveracionesSOX = aseveracionesSOX.join(";");

            let data = {
              malversacion: fraudeMalv ? fraudeMalv.value : null,
              fraude_rep_financiero: fraudeRepFin ? fraudeRepFin.value : null,
              aseveraciones: aseveracionesSOX,
              idriesgo: response.data.idriesgo,
              id_subcategoria_riesgo: fraudeInt ? fraudeInt.value : null,
            };

            let requestDetSOX = await Queries(
              data,
              "/rx_detalle_sox/" + response.data.idriesgo + "/",
              "PUT"
            );

            console.log(requestDetSOX);
            if (requestDetSOX.status === 201) {
              setEstadoPost(2);
              setTimeout(() => {
                setEstadoPost(0);
              }, 4000);
            }
          }
          if (
            response.status >= 200 &&
            response.status < 300 &&
            isCheckedRO === true
          ) {
            let detalleRiesgo = {
              id_riesgo: response.data.idriesgo,
              idcatro_corporativa: riesgoRO ? Object.values(riesgoRO)[0] : null,
              idsubcatro_corporativa: subRiesgoRO
                ? Object.values(subRiesgoRO)[0]
                : null,
              idcatro_local: riesgoLocal ? riesgoLocal.value : null,
              riesgo_contingencia: riesgoCont.value,
              descripcion_complementaria: descripComplementaria,
              malversacion: malversacion.value,
              nivel_riesgo_inherente: nivelRiesgoInherente,
              exposicion_residual: exposicionResidual,
              nivel_riesgo_residual: nivelRiesgoResidual,
              modelos: modelosDetalleRO,
            };
            JSON.stringify(detalleRiesgo);
            axios
              .put(
                process.env.REACT_APP_API_URL + "/rx_detalle_ro/" + idRiesgo,
                detalleRiesgo,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + serviceAAD.getToken(),
                  },
                }
              )
              .then(function (respuesta) {
                // sendResumenValoracion(response.data.idriesgo, 1);
                // sendEfectos(idRiesgo);
                // sendCausas(idRiesgo);
                localStorage.setItem("idRiesgo", respuesta.data.idriesgo);

                setEstadoPost(2);

                setTimeout(() => {
                  history.push("/editarRiesgo");
                  setEstadoPost(0);
                }, 2000);
              })
              .catch((error) => {
                console.error(error);
              });
          } else if (response.status >= 200 && response.status < 300) {
            // sendResumenValoracion(response.data.idriesgo, 1);
            // sendEfectos(idRiesgo);
            // sendCausas(idRiesgo);
            localStorage.setItem("idRiesgo", response.data.idriesgo);
            setEstadoPost(2);
            setTimeout(() => {
              history.push("/editarRiesgo");
              setEstadoPost(0);
            }, 2000);
          } else if (response.status >= 500) {
            setEstadoPost(5);
            if (
              response.data.non_field_errors[0] ===
              "The fields idactivo must make a unique set."
            ) {
              setEstadoPost(6);
              setTimeout(() => {
                setEstadoPost(0);
              }, 4000);
            }
          } else if (response.status >= 400 && response.status < 500) {
            setEstadoPost(4);
            setTimeout(() => {
              setEstadoPost(0);
            }, 4000);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      setValidated(true);
    }
  };
  const postData = async (data, url, fuente) => {
    try {
      const resp = await axios.post(process.env.REACT_APP_API_URL + "/" + url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      return resp;
    } catch (error) {
      console.error(error.response);
    }
  };

  const putData = async (data, url, fuente) => {
    try {
      axios
        .put(process.env.REACT_APP_API_URL + "/" + url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response_rx_efecto) {
          console.warn("Envío exitoso desde " + fuente);
        });
    } catch (error) {
      console.error(error.response);
    }
  };

  const editar = (event) => {
    localStorage.setItem("idRiesgo", idRiesgo);
  };

  return (
    <>
      <ModalProveedor
        showModalProveedor={showModalProveedor}
        setShowModalProveedor={setShowModalProveedor}
        setProveedor={setProveedor}
        ContratoProveedorPrin={ContratoProveedor}
        setListaContratosPrin={setListaContratosPrin}
        setListaContratos={setListaContratos}
        identificacionModal={"Riesgos"}
        setElementoEv={setElementoEv}
        tipoProveedor={tipoProveedor}
        setShowProveedor={setShowProveedor}
        setShowContratos={setShowContratos}
        setNombreElemento={setNombreElemento}
        setnombreElementoOtros={setnombreElementoOtros}
      ></ModalProveedor>
      <>
        <div name="infoGeneral" id="infoGeneral"></div>
        <Row>
          <Col>
            <div
              style={{ position: "fixed", zIndex: 10, minWidth: "80vw" }}
              className={classes.content}
            >
              <div className={classes.appBarSpacer}>
                <Navbar bg="dark" variant="dark" expand="xl">
                  <Container>
                    <Navbar id="justify-content-center">
                      <Nav className="ml-auto">
                        <Nav.Link href="#infoGeneral" className="link">
                          Información General
                        </Nav.Link>
                        <Nav.Link href="#detalleRO" className="link">
                          Detalle RO
                        </Nav.Link>
                        <Nav.Link>
                          <Link to="causaControles" className="link2">
                            Causas y controles
                          </Link>
                        </Nav.Link>
                        <Nav.Link>
                          <Link to="valoracionRiesgo" className="link2">
                            Valoración RO
                          </Link>
                        </Nav.Link>
                        <Nav.Link>
                          <Link to="valoracionSOX" className="link2">
                            Valoración SOX
                          </Link>
                        </Nav.Link>
                        <Nav.Link href="#resumenPorEfecto">
                          <Link to="riesgos">
                            <button
                              type="button"
                              className="btn botonNegativo2"
                            >
                              Cancelar
                            </button>
                          </Link>
                        </Nav.Link>
                        <Nav.Link href="#resumenPorEfecto">
                          {props.permisos.editar ? (
                            <button
                              type="button"
                              className="btn botonPositivo2"
                              id="send"
                              onClick={sendData}
                            >
                              Guardar
                            </button>
                          ) : null}
                        </Nav.Link>
                      </Nav>
                    </Navbar>
                  </Container>
                </Navbar>
              </div>
            </div>
          </Col>
        </Row>
        <Container className="mb-5 ">
          <Form
            id="formData"
            noValidate
            validated={validated}
            onSubmit={sendData}
            className="mb-5"
          >
            <ModalAlerta
              showAlerta={showAlerta}
              setShowAlerta={setShowAlerta}
              text={textAlerta}
            />
            <Row className="mt-5 mb-3">
              <Col md={12}>
                {" "}
                <AlertDismissibleExample
                  alerta={estadoPost}
                  className="mb-3 mt-5"
                />{" "}
              </Col>
            </Row>
            {/* ///////////////////////////// Acciones ////////////////////////////// */}
            <Row className="mb-3 mt-5">
              <Col md={12}>
                <h1 className="titulo">Riesgo # {idRiesgo} </h1>
              </Col>
            </Row>
            <Row className="mb-3 mt-3">
              <Col md={12}>
                <h1 className="subtitulo text-center">Información General</h1>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={0}></Col>
              <Col>
                <div className="form-text">* Campos obligatorios</div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={4}>
                <label className="form-label label">Estado*</label>
              </Col>
              <Col sm={4} xs={12}>
                {props.permisos.inactivar ? (
                  <>
                    <Switch
                      checked={estadoRiesgo ? estadoRiesgo.value : null}
                      onChange={(e) => {
                        let label =
                          e.target.checked === true ? "Activo" : "Inactivo";
                        setEstadoRiesgo({
                          value: e.target.checked,
                          label: label,
                        });
                      }}
                    ></Switch>
                    <label className="form-label text">
                      {estadoRiesgo ? estadoRiesgo.label : null}
                    </label>
                  </>
                ) : null}
              </Col>
            </Row>
            {/* ID evaluación */}
            <Row className="mb-3">
              <Col sm={4} xs={12} className="label">
                <label className="form-label">Compañía*</label>
              </Col>
              <Col sm={4} xs={12}>
                <Select
                  components={animatedComponents}
                  options={companias}
                  value={compania}
                  //hideSelectedOptions={true}
                  placeholder={"Seleccione la compañia"}
                  onChange={FiltrarMaestros}
                />
              </Col>
              <Col sm={2} xs={12} className="text-center">
                <label className="label ">Id Riesgo</label>
              </Col>
              <Col sm={2} xs={12}>
                <input
                  value={idRiesgo}
                  type="text"
                  disabled
                  className="form-control text-center texto"
                  id="IDevaluacion"
                ></input>
              </Col>
            </Row>
            {/* Nombre Evaluación */}
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Nombre de Riesgo*</label>
              </Col>
              <Col sm={8} xs={12}>
                <input
                  type="text"
                  className="form-control text-center texto"
                  placeholder="Nuevo"
                  required
                  value={nombre_riesgo}
                  id="NombreEval"
                  onChange={(e) => {
                    setNombre_riesgo(e.target.value);
                  }}
                ></input>
                <Form.Control.Feedback type="invalid">
                  Por favor introduzca un nombre.
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">
                  Descripción del riesgo
                </label>
              </Col>
              <Col sm={8} xs={12}>
                <textarea
                  value={descripcion}
                  className="form-control text-center"
                  placeholder="Descripción del Riesgo"
                  rows="3"
                  id="Descripcion"
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                  }}
                ></textarea>
              </Col>
            </Row>
            {/* Elemento principal */}
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">
                  Elemento de negocio principal​*
                </label>
              </Col>
              <Col sm={4} xs={12}>
                <Select
                  value={tipoElemento}
                  options={elementoNegPal}
                  components={animatedComponents}
                  placeholder={"Seleccione Tipo de Elemento"}
                  onChange={(e) => {
                    setElementos(e);
                    if (e.label === "Proveedor") {
                      setShowModalProveedor(true);
                      //FiltrarProveedor(e);
                      setContratoSelec([]);
                      //setListaContratosPrin([]);
                      setTipoComponente("Input");
                      setTipoProveedor("Principal");
                      setNombreElemento(null);
                      setShowProceso(false);
                    } else if (e.label === "Proceso") {
                      setShowProceso(true);
                      setShowProveedor(false);
                    } else {
                      setShowProveedor(false);
                      setShowProceso(false);
                    }
                  }}
                />
              </Col>
              <Col sm={4} xs={12}>
                {/* controla el comportamiento de Select o Input Elemento PPal/*/}
                {(() => {
                  if (tipoCompo === "Select") {
                    return (
                      <Select
                        key={listaElementos}
                        options={listaElementos}
                        value={elemento}
                        components={animatedComponents}
                        placeholder={"Seleccione Elemento"}
                        onChange={(e) => {
                          getValidador(e.value);
                          setElementoEv(e);
                          setCicloProceso(e.ciclo);
                        }}
                      />
                    );
                  } else if (tipoCompo === "Input") {
                    return (
                      <input
                        type="text"
                        disabled={
                          tipoElemento && tipoElemento.label !== "Proveedor"
                            ? false
                            : true
                        }
                        className="form-control text-left texto"
                        placeholder={
                          tipoElemento && tipoElemento.label !== "Proveedor"
                            ? "Escriba la iniciativa"
                            : "Proveedor"
                        }
                        defaultValue={nombreElemento}
                        onChange={(e) => {
                          setElementoEv(e.target.value);
                        }}
                      ></input>
                    );
                  }
                })()}
              </Col>
            </Row>
            {showProveedor ? (
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Contratos Asociados​*
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    value={contratoSelec}
                    options={listaContratosPrin}
                    components={animatedComponents}
                    isMulti
                    placeholder={"Seleccione el contrato"}
                    onChange={(e) => {
                      let contratos = [];
                      e.map((a) => contratos.push(a));
                      setContratoSelec(contratos);
                    }}
                  />
                </Col>
              </Row>
            ) : (
              <></>
            )}

            {showProceso ? (
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Ciclo</label>
                </Col>
                <Col sm={8} xs={12}>
                  <input
                    type="text"
                    disabled={true}
                    className="form-control text-left texto"
                    placeholder={"Ciclo"}
                    defaultValue={cicloProceso ? cicloProceso : null}
                  ></input>
                </Col>
              </Row>
            ) : (
              <></>
            )}
            {/*/////////////////////Otros Elementos*/}
            <Row className="mb-3">
              <Col md={12}>
                <hr />
                <label className="form-label label">
                  Otros elementos de negocio relacionados
                </label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Proceso</label>
              </Col>
              <Col sm={8} xs={12}>
                <Select
                  isClearable
                  components={animatedComponents}
                  options={listaProceso_filtered}
                  value={proceso}
                  placeholder={"Seleccione los procesos  asociados"}
                  onChange={(e) => {
                    setProceso(e);
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Producto</label>
              </Col>
              <Col sm={8} xs={12}>
                <Select
                  components={animatedComponents}
                  isMulti
                  options={listaProducto_filtered}
                  value={producto}
                  placeholder={"Seleccione el producto"}
                  onChange={(e) => {
                    var productos = [];
                    e.map((a) => productos.push(a));
                    setProducto(productos);
                  }}
                />
              </Col>
            </Row>
            <div name="detalleRO" id="detalleRO"></div>
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Canal</label>
              </Col>
              <Col sm={8} xs={12}>
                <Select
                  id={"Canal"}
                  components={animatedComponents}
                  isMulti
                  value={canal}
                  options={listaCanal_filtered}
                  placeholder={"Seleccione el canal"}
                  onChange={(e) => {
                    var canales = [];
                    e.map((a) => canales.push(a));
                    setCanal(canales);
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Proveedor​</label>
              </Col>
              <Col sm={2} xs={12} className="text-left">
                <button
                  type="button"
                  className="btn botonPositivo2"
                  onClick={() => {
                    setTipoProveedor("Otros");
                    setShowModalProveedor(true);
                    setContratoOtros(null);
                    setListaContratos([]);
                  }}
                >
                  Agregar
                </button>
              </Col>
              <Col sm={1} xs={12} className="text-left">
                <button
                  type="button"
                  className="btn botonNegativo2"
                  onClick={() => {
                    setContratoOtros([]);
                    setnombreElementoOtros(null);
                    setProveedor(null);
                    setShowContratos(false);
                  }}
                >
                  Quitar
                </button>
              </Col>
              <Col>
                <input
                  type="text"
                  disabled
                  className="form-control text-left texto"
                  placeholder={"Proveedor"}
                  defaultValue={nombreElementoOtros}
                ></input>
              </Col>
            </Row>
            {!!showContratos ? (
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Contratos Asociados​
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    value={contratoOtros}
                    options={listaContratos}
                    components={animatedComponents}
                    isMulti
                    placeholder={"Seleccione el contrato"}
                    onChange={(e) => {
                      let contrato = [];
                      e.map((a) => contrato.push(a));
                      setContratoOtros(contrato);
                    }}
                  />
                </Col>
              </Row>
            ) : (
              <></>
            )}
            {/* ///////////////////////////////////////////  Usuarios //////////////////////////////////////// */}
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Validador</label>
              </Col>
              <Col sm={8} xs={12}>
                <input
                  type="text"
                  className="form-control text-left texto"
                  placeholder="Validador automático "
                  required
                  disabled
                  id="validador"
                ></input>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Aristas del riesgo​</label>
              </Col>
              <Col sm={8}>
                <Controller
                  control={control}
                  name="aristas"
                  rules={{ required: "Te faltó completar este campo" }}
                  render={({ field }) => (
                    <Select
                      options={listaAristas}
                      isMulti
                      components={animatedComponents}
                      value={field.value}
                      id="aristas"
                      onChange={(e) => {
                        FiltrarAristas(e);
                        const fiteredProgramas = new Set();
                        const newArray = e.filter((element) => {
                          const isDuplicate = fiteredProgramas.has(
                            element.label
                          );

                          fiteredProgramas.add(element.label);

                          if (!isDuplicate) {
                            return true;
                          } else {
                            return false;
                          }
                        });

                        console.log("newArray", newArray);
                        setStrAristas(newArray);
                        if (newArray.some((obj) => obj.label === "RO")) {
                          setIsCheckedRO(true);
                        } else if (
                          newArray.some((obj) => obj.label === "SOX")
                        ) {
                          setIsCheckedSOX(true);
                        } else {
                          setIsCheckedRO(false);
                          setIsCheckedSOX(false);
                        }

                        field.onChange(newArray);
                      }}
                    />
                  )}
                />
              </Col>
            </Row>

            {/* Riesgo operacional

        <RiesgoOperacional />*/}
            {(() => {
              if (isCheckedRO === true) {
                return (
                  <Box>
                    <hr />
                    <Row className="mb-3 mt-4">
                      <Col md={12}>
                        <h1 className="subtitulo text-center">Detalle RO</h1>
                      </Col>
                    </Row>
                    <Row className="mb-3 mt-4">
                      <Col sm={4} xs={12}>
                        <label className="form-label label">
                          Categoria del Riesgo Corporativo*
                        </label>
                      </Col>
                      <Col sm={8} xs={12}>
                        <Select
                          components={animatedComponents}
                          options={catRiesgos}
                          required={true}
                          value={riesgoRO}
                          placeholder={"Categrorias"}
                          onChange={(e) => {
                            setRiesgoRo(e);
                            getSubCatRiesgo(e.value);
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3 mt-4">
                      <Col sm={4} xs={12}>
                        <label className="form-label label">
                          Subcategoria del Riesgo Corporativo*
                        </label>
                      </Col>
                      <Col sm={8} xs={12}>
                        <Select
                          components={animatedComponents}
                          options={subCatRiesgo_filtered}
                          required={true}
                          value={subRiesgoRO}
                          placeholder={"Subcategrorias"}
                          onChange={(e) => setSubRiesgoRo(e)}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3 mt-4">
                      <Col sm={4} xs={12}>
                        <label className="form-label label">
                          Categoria del riesgo RO Local
                        </label>
                      </Col>
                      <Col sm={8} xs={12}>
                        <Select
                          isClearable
                          components={animatedComponents}
                          options={catRiesgosRO_filtered}
                          required={true}
                          value={riesgoLocal}
                          placeholder={"Categrorias RO local"}
                          onChange={(e) => {
                            setRiesgoLocal(e);
                            getSubRiesgoLocal(e.value);
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={4} xs={12}>
                        <label className="form-label label">
                          Subcategoria del riesgo RO Local
                        </label>
                      </Col>
                      <Col sm={8} xs={12}>
                        <Select
                          isClearable
                          components={animatedComponents}
                          options={subCatRiesgosRO_filtered}
                          required={true}
                          value={subRiesgoLocal}
                          placeholder={"Subcategrorias RO local"}
                          onChange={(e) => setSubRiesgoLocal(e)}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={4} xs={12}>
                        <label className="form-label label">
                          Riesgo de la contingencia*
                        </label>
                      </Col>
                      <Col sm={4} xs={12}>
                        <Select
                          isClearable
                          components={animatedComponents}
                          options={[
                            { value: 0, label: "No" },
                            { value: 1, label: "Si" },
                          ]}
                          required={true}
                          value={riesgoCont}
                          placeholder={""}
                          onChange={(e) => {
                            setRiesgoCont(e);
                          }}
                        />
                      </Col>
                      <Col sm={2} xs={12}>
                        <label className="form-label label">
                          Malversación*
                        </label>
                      </Col>
                      <Col sm={2} xs={12}>
                        <Select
                          isClearable
                          components={animatedComponents}
                          options={[
                            { value: "No", label: "No" },
                            { value: "Si", label: "Si" },
                          ]}
                          value={malversacion}
                          onChange={(e) => {
                            setMalversacion(e);
                          }}
                          required={malverObligatorio}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col sm={4} xs={12}>
                        <label className="form-label label">
                          Descripción complementaria del evento
                        </label>
                      </Col>
                      <Col sm={8} xs={12}>
                        <textarea
                          className="form-control text-center"
                          placeholder="Descripción complementaria del evento"
                          rows="3"
                          id="Descripcion"
                          defaultValue={descripComplementaria}
                          onChange={(e) => {
                            setDescComplementaria(e.target.value);
                          }}
                        ></textarea>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col sm={4} xs={12}>
                        <label className="form-label label">Modelo(s)</label>
                      </Col>
                      <Col sm={8} xs={12}>
                        <textarea
                          className="form-control text-center"
                          placeholder='Digite el(los) ID de los modelos. Separados por  ","  (coma)'
                          rows="2"
                          id="Modelo"
                          defaultValue={modelosDetalleRO}
                          onChange={(e) => {
                            setModelosDetalleRO(e.target.value);
                          }}
                        ></textarea>
                      </Col>
                    </Row>
                  </Box>
                );
              } else if (isCheckedRO === false) {
                return null;
              }
            })()}
            <hr />
            {isCheckedSOX ? (
              <>
                <Row className="mb-3 mt-4">
                  <Col md={12}>
                    <h1 className="subtitulo text-center">Detalle SOX</h1>
                  </Col>
                </Row>

                {listaDetalleSox.map(({ name, value }, index) => {
                  return (
                    <Row className="mb-3 mt-3">
                      <Col sm={3}>
                        <div>
                          <input
                            type="checkbox"
                            id={`custom-checkbox-sox-${index}`}
                            name={name}
                            value={value}
                            defaultChecked={listaDetalleSox[index].state}
                            onChange={() => handleOnChangeDetalleSOX(index)}
                          />
                          <label
                            className="form-label texto ml-2"
                            htmlFor={`custom-checkbox-sox-${index}`}
                          >
                            {name}
                          </label>
                        </div>
                      </Col>{" "}
                    </Row>
                  );
                })}

                <Row className="mb-3 mt-4">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">
                      Categoría de riesgo de fraude en el reporte financiero
                    </label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <Select
                      components={animatedComponents}
                      options={listaCatSOX}
                      required={true}
                      value={fraudeInt}
                      placeholder={"Categrorias"}
                      onChange={(e) => {
                        setFraudeInt(e);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mb-3 mt-4">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">
                      Fraude Malversación
                    </label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <Select
                      components={animatedComponents}
                      options={[
                        { label: "SI", value: "SI" },
                        { label: "NO", value: "NO" },
                      ]}
                      required={true}
                      value={fraudeMalv}
                      placeholder={"Fraude Malversación"}
                      onChange={(e) => {
                        setFraudeMalv(e);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mb-3 mt-4">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">
                      Fraude Reporte Financiero
                    </label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <Select
                      components={animatedComponents}
                      options={[
                        { label: "SI", value: "SI" },
                        { label: "NO", value: "NO" },
                      ]}
                      required={true}
                      value={fraudeRepFin}
                      placeholder={"Fraude Reporte Financiero"}
                      onChange={(e) => {
                        setFraudeRepFin(e);
                      }}
                    />
                  </Col>
                </Row>
                <hr />
              </>
            ) : null}
          </Form>
        </Container>
      </>
      {/* )} */}
    </>
  );
}
