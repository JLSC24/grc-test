import React, { useState, useEffect, useCallback, useMemo } from "react";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import { Row, Col, Form, Alert, Container, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";
import makeAnimated from "react-select/animated";
import ModalControlComp from "./ModalControlComp";
import PropTypes, { number } from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import SaveIcon from "@mui/icons-material/Save";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormControlLabel from "@mui/material/FormControlLabel";
import { visuallyHidden } from "@mui/utils";
import CancelIcon from "@mui/icons-material/Cancel";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { format, set } from "date-fns";
import axios from "axios";
import Loader from "react-loader-spinner";
import AADService from "../auth/authFunctions";
import ModalProveedor from "../Maestros/Proveedores/ModalProveedor";
import Queries from "../Components/QueriesAxios";
import ModalSelectTableCustom from "../Components/ModalSelectTableCustom";
const _ = require("lodash");

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

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100vw",
    overflowX: "scroll",
  },
  container: {
    maxHeight: "57vh",
    minHeight: "50vh",
    maxWidth: "200vh",
    minWidth: "300vh",
    overflowX: "scroll",
  },
  containerModal: {
    maxHeight: "50vh",
    //minHeight: "50vh",
  },
  paper: {
    backgroundColor: "white",
    width: "100%",
    //margintom: theme.spacing(2),
  },
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
  sticky: {
    position: "sticky",
    left: 0,
    background: "white",
    boxShadow: "5px 2px 5px grey",
  },
}));

const animatedComponents = makeAnimated();

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
//   {
//     name: "SAC",
//     value: "SAC",
//   },
//   {
//     name: "Malversación",
//     value: "Malversación",
//   },
//   {
//     name: "Anti Fraude",
//     value: "Anti Fraude",
//   },
// ];

const year = new Date();
const month = new Date();
const day = new Date();
const today =
  String(year.getFullYear()) +
  "-" +
  String(("0" + (month.getMonth() + 1)).slice(-2)) +
  "-" +
  String(("0" + day.getDate()).slice(-2));

export default function CrearControl(props) {
  const serviceAAD = new AADService();
  //* Reciben los datos para llenar cada uno de los Select

  const [companias, setCompanias] = useState([]);
  const [listaProceso, setListaProceso] = useState([]);
  const [listaContratos, setListaContratos] = useState([]);
  const [contrato, setContrato] = useState([]);
  const [Proveedor, setProveedor] = useState([]);
  const [controlesAristas, setControlesAristas] = useState();
  const [contratoSelec, setContratoSelec] = useState([]);
  const [contratoOtros, setContratoOtros] = useState([]);
  const [listaContratosPrin, setListaContratosPrin] = useState([]);
  const [listaProveedor_filtered, setListaProveedorFiltered] = useState([]);
  //const [listaProveedor, setListaProveedor] = useState(["sin informacion"]);
  const [listaProducto, setListaProducto] = useState([]);
  const [listaCanal, setListaCanal] = useState([]);
  const [lista_periodicidad, setLista_Periodicidad] = useState([]);
  const [listaAutomatizacion, setListaAutomatizacion] = useState([]);
  const [listaNaturaleza, setListaNaturaleza] = useState([]);
  const [listaVariableMitigada, setLista_VariableMitigada] = useState([]);
  const [listaTipoControl_N1, setListaTipoControlRO_N1] = useState(null);
  const [listaTipoControl_N2, setListaTipoControlRO_N2] = useState(null);
  const [listaActividadControl, setListaActividadControl] = useState(null);
  const [listaProveedores, setListaProveedores] = useState([]);
  const [showProveedor, setShowProveedor] = useState(false);
  const [showContratos, setShowContratos] = useState(false);
  const [listaControl_estandarizado, setListaControl_estandarizado] =
    useState(null);

  //* Reciben los datos filtrados

  const [listaProceso_filtered, setListaProcesoFiltered] = useState([]);
  const [listaProducto_filtered, setListaProductoFiltered] = useState([]);
  const [listaCanal_filtered, setListaCanalFiltered] = useState([]);

  const [showModalProveedor, setShowModalProveedor] = React.useState(false);
  const [tipoProveedor, setTipoProveedor] = useState([]);
  const [nombreElementoOtros, setnombreElementoOtros] = React.useState(null);

  //* Reciben los datos ingresados/elegidos por el usuario
  const [id_ubicacion, setId_ubicacion] = useState(null);
  const [id_ctrl_proceso, setId_ctrl_proceso] = useState(null);
  const [idControl, setIdControl] = useState(null);
  const [compania, setCompania] = useState(null);
  const [nombre_ctrl, setNombre_ctrl] = useState(null);
  const [descripcion, setDescripcion] = useState(null);
  const [responsable, setResponsable] = useState(null);
  const [proceso, setProceso] = useState(null);
  const [canal, setCanal] = useState(null);
  const [producto, setProducto] = useState(null);
  const [lugarEjecucion, setLugarEjecucion] = useState(null);
  const [aristas, setAristas] = useState(null);
  const [listaAristas, setListaAristas] = React.useState([]);
  const [strAristas, setStrAristas] = useState([]);
  const [automatizacion, setAutomatizacion] = useState(null);
  const [naturaleza, setNaturaleza] = useState(null);
  const [poblacion, setPoblacion] = useState(null);
  const [muestra, setMuestra] = useState(null);
  const [periodicidad, setPeriodicidad] = useState(null);
  const [evidencia, setEvidencia] = useState(null);
  const [ruta_evidencia, setRuta_evidencia] = useState(null);
  const [frecuencia, setFrecuencia] = useState(null);
  const [testing, setTesting] = useState(null);
  const [cobertura, setCobertura] = useState(null);
  const [prevalorizacion, setPrevalorizacion] = useState(null);
  const [loadingDataCausas, setLoadingDataCausas] = React.useState(true);
  //* llena las variables relacionadas con DEtalle Ro
  const [tipoControl_N1, setTipoControlRO_N1] = useState(null);
  const [actividadControl, setActividadControl] = useState(null);
  const [ctrl_estandarizado, setCtrlEstandarizado] = useState(null);

  //* contrala el comportamanieto de los componentes

  const history = useHistory();
  const [modalShow, setModalShow] = React.useState(false);
  const [showAlerta, setShowAlerta] = useState(false);
  const [textAlerta, setTextAlerta] = useState(false);
  const [listaGeneralControles, setListaGeneralControles] = useState([]);

  //* Variables para tabla de Riesgos Activos

  const [dataScanRiesgos, setDataScanRiesgos] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("idcontrol");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Checkboxes ¿Donde se ejecuta el control?
  const [checkedSucursales, setCheckedSucursales] = useState(false);
  const [checkedSedesAdmin, setCheckedSedesAdmin] = useState(false);

  //* Controla comportamiento de la vista
  const [checkedRO, setCheckedRO] = useState(false);
  const [checkedSOX, setCheckedSOX] = useState(false);
  const [checkedCtrlCompensado, setCheckedCtrlCompensado] = useState(false);
  const [checkedState, setCheckedState] = useState(
    new Array(listaAristas.length).fill(false)
  );
  const [checkedLAFT, setCheckedLAFT] = useState(false);
  const [validated, setValidated] = useState(false);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [rx_riesgos_eval, setRxRiesgosEval] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [loadingData, setLoadingData] = React.useState(true);
  const correoAnalistaLog = serviceAAD.getUser().userName;
  const classes = useStyles();

  // ¿Donde se ejecuta el control?
  const [listaLugaresControl, setListaLugaresControl] = useState([
    { value: "Sedes administrativas", label: "Sedes administrativas" },
    { value: "Sucursal", label: "Sucursal" },
  ]);
  const [ListaAreasOrganizacionales, setListaAreasOrganizacionales] =
    useState(null);
  const [showAreas, setShowAreas] = useState(false);
  const [requiredAreas, setRequiredAreas] = useState(false);

  const [AreasOrganizacionales, setAreasOrganizacionales] = useState(null);

  const [estadoControl, setEstadoControl] = useState(null);
  const [objetivo, setObjetivo] = useState(null);

  const [datAnalistas, setDatAnalistas] = useState(null);
  const [analistaSOX, setAnalistaSOX] = useState(null);
  const [cuentaContable, setCuentaContable] = useState(null);
  const [tipologia, setTipologia] = useState(null);
  const [EUC, setEUC] = useState(null);
  const [observacion, setObservacion] = useState(null);
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
  const [paSelected, setPaSelected] = useState(null);
  const [paSelected2, setPaSelected2] = useState(null);
  const [indexPA, setIndexPA] = useState(null);
  const [showPAs, setShowPAs] = useState(false);
  const [dataTablePAs, setDataTablePAs] = useState(null);

  const [dataAristas, setDataAristas] = useState([]);
  const [dataRevision, setDataRevision] = useState([]);
  const [dataRevisionAll, setDataRevisionAll] = useState([]);
  const [dataRevisionBool, setDataRevisionBool] = useState(true);

  const [consultasBool, setConsultasBool] = useState(false);
  //* Filtra segun la compañia seleccionada  y renderiza nuevamente la lista de Componentes Ppales///////////////////

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

  const FiltrarMaestros =
    ((compania) => {
      setCompania(compania);

      if (compania !== null) {
        setCanal(null);
        setProceso(null);
        setProducto(null);

        //* Filtra maestros según la compañía seleccionada ////////

        let procesosFiltrados = [];
        let canalesFiltrados = [];
        let productosFiltrados = [];
        let listaProceso = [];
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
      }
    },
    []);

  useEffect(() => {
    let listaProveedor;
    var compania;
    let companias;
    let ubicacion_Proceso;
    let control;
    let productos;
    let canales;
    let controles_compensatorios;
    let listaContratos;
    let listaProcesos;
    let canalesRiesgo;
    let listaCanales;
    let listaProductos;
    async function getAreas() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/area_o/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let areas = response.data.map(
          ({
            idarea_organizacional: value,
            nombre: label,
            nivel,
            area_n1,
            area_n2,
            area_n3,
            area_n4,
            area_n5,
          }) => ({
            value,
            label,
            nivel,
            area_n1,
            area_n2,
            area_n3,
            area_n4,
            area_n5,
          })
        );
        setListaAreasOrganizacionales(areas);
      } catch (error) {
        console.error(error);
      }
    }
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
    const getData = async (url) => {
      return await axios.get(process.env.REACT_APP_API_URL + "/" + url, {
        headers: {
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
    };
    async function getCompania() {
      try {
        const response = await getData("maestros_ro/compania/");
        companias = response.data.map(
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
    }
    async function getProcesos() {
      try {
        const response = await getData("ultimonivel/Proceso");
        listaProcesos = await response.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaProceso(listaProcesos);
      } catch (error) {
        console.error(error);
      }
    }
    async function getProductos() {
      try {
        const response = await getData("ultimonivel/Producto");
        listaProductos = response.data.map(
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
    }
    async function getCanales() {
      try {
        const response = await getData("ultimonivel/Canal");
        listaCanales = response.data.map(
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
    }
    async function getControles() {
      try {
        const response = await getData("controles");

        let controles = response.data;
        controles.map((control) => (control.estado_enVista = "Buscado"));

        setListaGeneralControles(controles);
      } catch (error) {
        console.error(error);
      }
    }
    const getControl = async () => {
      try {
        const response_ctrl = await axios.get(
          process.env.REACT_APP_API_URL + "/controles/" +
            +localStorage.getItem("idControl") +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        control = response_ctrl.data;
        let arrayAristas = control.tipo_riesgo_mitigado.split(",");
        console.log("arrayAristasjaja", arrayAristas);

        let aristasEdit = [];

        arrayAristas.forEach((string) => {
          aristasEdit.push({ value: string, label: string });
        });
        console.log("aristas Edit", aristasEdit);
        // if (aristasEdit.some((obj) => obj.label === "RO")) {
        //   setCheckedRO(true);
        // }else if(aristasEdit.some((obj) => obj.label === "RO")){
        //   setCheckedSOX(true);
        // }
        // else {
        //   setCheckedRO(false);
        //   setCheckedSOX(false);
        // }

        setValue("aristas", aristasEdit);
        // -------------------------fin manejo aristas

        //console.table(control);
        console.log("control", control);
      } catch (error) {
        console.error(error);
      }
    };
    const getUbicacion_procesoControl = async () => {
      if (control.id_ubicacion !== null) {
        try {
          const response_UElementoPpal = await axios.get(
            process.env.REACT_APP_API_URL + "/ubicacion/" + control.id_ubicacion,
            {
              headers: {
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          );

          ubicacion_Proceso = await response_UElementoPpal.data;
        } catch (error) {
          console.error(error);
        }
      }
    };
    const productosControl = async () => {
      try {
        const responseProductos = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_control_producto/" +
            control.idcontrol +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let auxProductos = responseProductos.data.map((e) => e.idproducto);

        productos = auxProductos.map(({ idprod: value, nombre: label }) => ({
          value,
          label,
        }));
      } catch (error) {
        console.error(error);
      }
    };
    const canalesControl = async () => {
      try {
        const responseCanales = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_control_canal/" + control.idcontrol + "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let auxCanales = responseCanales.data.map((e) => e.idcanal);
        canales = auxCanales.map(({ idcanal: value, nombre: label }) => ({
          value,
          label,
        }));
      } catch (error) {
        console.error(error);
      }
    };
    const getElementosListas = async () => {
      try {
        const response_elemNegPpal = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/controles/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let elementosListas = await response_elemNegPpal.data.map(
          ({
            valor: label,
            idm_parametrosgenerales: value,
            grupo,
            parametro,
          }) => ({
            label,
            value,
            grupo,
            parametro,
          })
        );

        setListaAutomatizacion(
          elementosListas.filter(
            (elemento) => elemento.parametro === "Automatizacion"
          )
        );
        setListaNaturaleza(
          elementosListas.filter(
            (elemento) => elemento.parametro === "Naturaleza"
          )
        );
        setLista_VariableMitigada(
          elementosListas.filter(
            (elemento) => elemento.parametro === "Variable_mitigada"
          )
        );

        setLista_Periodicidad(
          elementosListas.filter(
            (elemento) => elemento.parametro === "Periodicidad"
          )
        );
      } catch (error) {
        console.error(error);
      }
    };
    const getElementosTipoControl = async () => {
      try {
        const response_elemNegPpal = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Tipo_de_control_RO/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let elementosTipoControl = await response_elemNegPpal.data.map(
          ({
            idm_parametrosgenerales: value,
            grupo,
            parametro,
            valor: label,
          }) => ({
            value,
            grupo,
            parametro,
            label,
          })
        );

        setListaTipoControlRO_N1(
          elementosTipoControl.filter(
            (elemento) => elemento.parametro === "Nivel1"
          )
        );

        setListaTipoControlRO_N2(
          elementosTipoControl.filter(
            (elemento) => elemento.parametro !== "Nivel1"
          )
        );
      } catch (error) {
        console.error(error);
      }
    };
    const getElementos_controlEstandarizado = async () => {
      try {
        const response_elemNegPpal = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/control_estandarizado/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let controles_estandarizados = await response_elemNegPpal.data.map(
          ({
            idm_parametrosgenerales: value,
            grupo,
            parametro,
            valor: label,
          }) => ({
            value,
            grupo,
            parametro,
            label,
          })
        );

        controles_estandarizados = controles_estandarizados.filter(
          (control) => control.parametro !== "Nivel1"
        );
        setListaControl_estandarizado(controles_estandarizados);
      } catch (error) {
        console.error(error);
      }
    };
    const getControles_Compensados = async () => {
      const verificaControles_Compensados = (aristasDelRiesgo) => {
        if (aristasDelRiesgo) {
          let aristas = aristasDelRiesgo.split(";");
          let isCtrl_Compensatorio;
          aristas.map((e) => {
            if (e === "Ctrl compensatorio") {
              isCtrl_Compensatorio = true;
            }
          });

          return isCtrl_Compensatorio;
        }
      };

      let existeCtrl_Comp = verificaControles_Compensados(
        control.tipo_riesgo_mitigado
      );
      try {
        if (existeCtrl_Comp === true) {
          const response = await axios.get(
            process.env.REACT_APP_API_URL + "/controles_compensatorios/" +
              control.idcontrol +
              "/",
            {
              headers: {
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          );

          controles_compensatorios = response.data;

          //* Asinga el "Asigna el estado en vista de los controles compesatorios"
          controles_compensatorios.map((e) => {
            if (e.estado === 1) {
              e.estado_enVista = "Activo";
              e.idcontrol = e.id_control_compensado;
              /* controlesActivos.push(e); */
            } else if (e.estado === 0) {
              e.estado_enVista = "Inactivo";
              e.idcontrol = e.id_control_compensado;
              /* controlesInactivos.push(e); */
            }
          });

          setListaGeneralControles(controles_compensatorios); //* Lista General de Controles
        }
      } catch (error) {
        console.error(error.data);
      }
    };
    const analistasRO = async () => {
      let requestUsr;
      let requestUsr2;

      try {
        requestUsr = await Queries(null, "/usuariosrol/0/4/", "GET");
      } catch (error) {}
      try {
        requestUsr2 = await Queries(null, "/usuariosrol/0/11/", "GET");
      } catch (error) {}

      if (requestUsr2) {
        requestUsr = requestUsr.concat(requestUsr2);
      }

      requestUsr = requestUsr.map(({ idposicion, nombre }) => ({
        label: nombre,
        value: idposicion,
      }));
      setDatAnalistas(
        requestUsr.sort(function (a, b) {
          if (a.nombre > b.nombre) {
            return 1;
          }
          if (a.nombre < b.nombre) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
      );
    };
    const getDetalleSox = async () => {
      try {
        let responseDetalleSOX = await Queries(
          null,
          "/detalle_sox_control/" + localStorage.getItem("idControl") + "/",
          "GET"
        );

        setCuentaContable(responseDetalleSOX.cuenta_contable);
        setTipologia({
          label: responseDetalleSOX.tipologia_de_control,
          value: responseDetalleSOX.tipologia_de_control,
        });
        setEUC(responseDetalleSOX.id_euc);
        setObservacion(responseDetalleSOX.observacion);
        let tempListaDetalles = listaDetalleSox;
        tempListaDetalles[0].state = responseDetalleSOX.existencia
          ? true
          : false;
        tempListaDetalles[1].state = responseDetalleSOX.integridad
          ? true
          : false;
        tempListaDetalles[2].state = responseDetalleSOX.exactitud
          ? true
          : false;
        tempListaDetalles[3].state = responseDetalleSOX.valuación
          ? true
          : false;
        tempListaDetalles[4].state = responseDetalleSOX.derechos_y_oblig
          ? true
          : false;
        tempListaDetalles[5].state = responseDetalleSOX.presentación_y_rev
          ? true
          : false;
      } catch (error) {}
    };
    const getSegundaLinea = async () => {
      try {
        let responseSegundaLinea = await Queries(
          null,
          "/rev_segunda_linea_control/" +
            localStorage.getItem("idControl") +
            "/",
          "GET"
        );

        console.log({ responseSegundaLinea });

        responseSegundaLinea.map((datSeg) => {
          let tempRG = datSeg.riesgos_gestionados.split(";");
          let tempList = tempRG.map((rg) => ({ label: rg, value: rg }));

          console.log(tempList);
          datSeg["user"] = datSeg.usuario_creador.split("@")[0];
          datSeg["riesgosGestionadosList"] = tempList;
          datSeg["unidad"] = {
            nombre: datSeg.nombre_unidad_riesgo,
            id: datSeg.id_unidad_riesgo,
          };
        });

        setDataRevision(responseSegundaLinea);
        setDataRevisionAll(responseSegundaLinea);
      } catch (error) {}
    };
    const cargaControl = async () => {
      await getCompania();
      await getProcesos();
      await getProductos();
      await getCanales();
      await getControles();
      await getControl();
      await getControles_Compensados();
      await getUbicacion_procesoControl();
      await productosControl();
      await canalesControl();
      await getElementosListas();
      await getElementosTipoControl();
      await getElementos_controlEstandarizado();

      try {
        /* const compEvalEditar = companias.filter(checkCompania);
        const valueCompania = compEvalEditar[0].value; */

        // let procesosFiltrados = [];
        // let canalesFiltrados = [];
        // let productosFiltrados = [];

        // listaProcesos.map((dato) => {
        //   if (dato.idcompania === valueCompania) {
        //     procesosFiltrados.push(dato);
        //   }
        //   return null;
        // });

        // listaCanales.map((dato) => {
        //   if (dato.idcompania === valueCompania) {
        //     canalesFiltrados.push(dato);
        //   }
        //   return null;
        // });

        // listaProductos.map((dato) => {
        //   if (dato.idcompania === valueCompania) {
        //     productosFiltrados.push(dato);
        //   }
        //   return null;
        // });

        // setListaCanalFiltered(canalesFiltrados);
        // setListaProcesoFiltered(procesosFiltrados);
        // setListaProductoFiltered(productosFiltrados);

        function convierteCompania(companiacontrol, listadoCompanias) {
          return listadoCompanias.filter((e) => e.label === companiacontrol);
        }

        function convierteProceso(proceso) {
          return {
            value: proceso.idproceso,
            label: proceso.nombre_proceso,
          };
        }

        function convierteElemento_Select(elemento) {
          {
            let temp_contratos = [];
            control.contratos.map((o) => {
              temp_contratos.push({
                value: o.id_contrato,
                label: o.nombre,
              });
            });
            if (temp_contratos.length > 0) {
              setShowContratos(true);
            }
            setContratoOtros(temp_contratos);
            return {
              value: elemento,
              label: elemento,
            };
          }
        }

        function conviertePeriodicidad(elemento) {
          return {
            label: elemento,
            value: elemento,
            parametro: elemento,
          };
        }
        function convierteEstado(estado) {
          if (estado === 1) {
            return {
              value: true,
              label: "Activo",
            };
          } else if (estado === 0) {
            return {
              value: false,
              label: "Inactivo",
            };
          } else if (estado == null) {
            return {
              value: true,
              label: "Activo",
            };
          }
        }

        //* Divide los riesgos en Activos e inactivos

        const getIdsRiesgos = (riesgosXEval) => {
          let idsRiesgos = [];
          riesgosXEval.map((e) => {
            idsRiesgos.push(e.idriesgo);
          });
          return idsRiesgos;
        };

        function convierteAristas(aristasDelRiesgo) {
          const listaDeAristas = new Array(listaAristas.length).fill(false);
          let aristas = aristasDelRiesgo.split(";");
          if (aristas) {
            aristas.map((e) => {
              if (e === "RO") {
                listaDeAristas[0] = true;
                setCheckedRO(true);
              } else if (e === "SOX") {
                listaDeAristas[1] = true;
                setCheckedSOX(true);
              } else if (e === "LAFT") {
                setCheckedLAFT(true);
                listaDeAristas[2] = true;
              } else if (e === "PDP") {
                listaDeAristas[3] = true;
              } else if (e === "Corrupción interna") {
                listaDeAristas[4] = true;
              } else if (e === "Corrupción externa") {
                listaDeAristas[5] = true;
              } else if (e === "Reputacional") {
                listaDeAristas[6] = true;
              } else if (e === "Legal") {
                listaDeAristas[7] = true;
              } else if (e === "ESG") {
                listaDeAristas[8] = true;
              } else if (e === "SAC") {
                listaDeAristas[9] = true;
              } else if (e === "Malversación") {
                listaDeAristas[10] = true;
              } else if (e === "Ctrl compensa") {
                listaDeAristas[11] = true;
                setCheckedCtrlCompensado(true);
              }
            });

            return listaDeAristas;
          }
        }

        const verificaDetalleRO = (aristasDelRiesgo) => {
          if (aristasDelRiesgo) {
            let aristas = aristasDelRiesgo.split(";");
            let isDetalleRO;
            aristas.map((e) => {
              if (e === "RO") {
                isDetalleRO = true;
              }
            });

            return isDetalleRO;
          }
        };

        let existeDetalleRO = verificaDetalleRO(control.tipo_riesgo_mitigado);

        //* Asignar llena los campos con los valores cargados del control

        setCompania(convierteCompania(control.compania, companias)[0]);

        setEstadoControl(convierteEstado(control.estado));
        setIdControl(control.idcontrol);
        setId_ubicacion(control.id_ubicacion);
        setId_ctrl_proceso(control.id_control_en_proceso);
        setNombre_ctrl(control.nombre);
        setDescripcion(control.descripcion);
        setObjetivo(control.objetivo_control);
        setResponsable(control.responsable_ejecucion);

        if (ubicacion_Proceso) {
          setProceso(convierteProceso(ubicacion_Proceso));
        }
        if (productos) {
          setProducto(productos);
        }
        if (canales) {
          setCanal(canales);
        }
        if (control.testing_auditoria) {
          setTesting(control.testing_auditoria);
        }
        if (ubicacion_Proceso) {
          setnombreElementoOtros(ubicacion_Proceso.nombre_proveedor);
          setProveedor({
            value: ubicacion_Proceso.idProveedor,
            label: ubicacion_Proceso.nombre_proveedor,
          });
          if (ubicacion_Proceso.idProveedor) {
            setShowContratos(true);
          }
        }

        setAutomatizacion(convierteElemento_Select(control.automatizacion));
        setNaturaleza(convierteElemento_Select(control.naturaleza));
        setPoblacion(control.poblacion);
        setMuestra(control.muestra);
        setPeriodicidad(conviertePeriodicidad(control.periodicidad));
        setEvidencia(control.evidencia);
        setRuta_evidencia(control.ruta_de_la_evidencia);
        setFrecuencia(convierteElemento_Select(control.variable_mitigada));
        setAristas(control.tipo_riesgo_mitigado);
        setCheckedState(convierteAristas(control.tipo_riesgo_mitigado));
        setAreasOrganizacionales({
          value: control.idareaocurrencia,
          label: control.areaocurrencia,
        });

        setCobertura(control.cubrimiento);
        setPrevalorizacion(control.prevaloracion);

        setTipoControlRO_N1(
          convierteElemento_Select(control.tipo_control_ro_n1)
        );
        setActividadControl(
          convierteElemento_Select(control.tipo_control_ro_n2)
        );

        setCtrlEstandarizado(
          convierteElemento_Select(control.control_estandarizado)
        );

        function convierteLugarEjecucion(lugarEjecucion) {
          let temp = lugarEjecucion.split(";");

          if (temp.some((x) => x === "Sedes administrativas")) {
            setShowAreas(true);
          }

          let temp2 = [];

          temp = temp.map((x) => temp2.concat({ value: x, label: x })[0]);

          setLugarEjecucion(temp);
        }

        convierteLugarEjecucion(control.control_ejecutado_en);

        if (control.control_compensatorio == 1) {
          setCheckedCtrlCompensado(true);
        } else {
          setCheckedCtrlCompensado(false);
        }

        if (existeDetalleRO) {
        }

        //*Asigna variables relacionadas con los controles compensados

        /* setConsolidadoControles(riesgosActivos); */ //* Controles activos
        /* setSelected(getIdsControles(riesgosActivos));   */ //* Riesgos activos aparecen seleccionados/
        /*  setDataRiesgos_Eval(getIdsRiesgos(riesgosActivos));  */ //* esta variable se utiliza para almacenar el estado inicial de los riesgos activos/
        setLoadingData(false);
      } catch (error) {
        console.error(error);
      }
      return null;
    };
    // const getAristas = async () => {
    //   let requestAristas = await Queries(null, "/maestros_ro/aristas/", "GET");
    //   requestAristas = requestAristas.map(({ nombre }) => ({
    //     label: nombre,
    //     value: nombre,
    //   }));
    //   setDataAristas(requestAristas);
    // };
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
    if (!consultasBool) {
      getAristas();
      getAreas();
      getProveedor();
      analistasRO();
      getDetalleSox();
      cargaControl();
      getSegundaLinea();
    }
    if (paSelected) {
      let tempDataRevision = dataRevision;
      if (paSelected && paSelected[0] && !paSelected[0].idplanaccion) {
        tempDataRevision[indexPA]["id_plan_accion"] = paSelected.join(",");
      } else {
      }
      setDataRevision(tempDataRevision);
    }

    setLoadingData(false);
  }, [listaDetalleSox, dataRevisionBool, paSelected]);

  const FiltrarAristas = (aristasSelected) => {
    if (aristasSelected.some((obj) => obj.label === "RO")) {
      setCheckedRO(true);
    } else if (aristasSelected.some((obj) => obj.label === "SOX")) {
      setCheckedSOX(true);
    } else {
      setCheckedRO(false);
      setCheckedSOX(false);
    }
  };

  //*Funciones para tabla de controles activos  */

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

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: "id",
      numeric: false,
      disablePadding: false,
      label: "Id Control",
    },
    {
      id: "motivo_compensacion",
      numeric: true,
      disablePadding: false,
      label: "Motivo de Compensación",
    },
    {
      id: "fecha_inicio_compensacion",
      numeric: true,
      disablePadding: false,
      label: "Fecha inicio compensación",
    },
    {
      id: "fecha_limite_compensacion",
      numeric: true,
      disablePadding: false,
      label: "Fecha final compensación",
    },
    {
      id: "usuario_creador",
      numeric: true,
      disablePadding: false,
      label: "Usuario Creador",
    },
    {
      id: "EEV",
      numeric: true,
      disablePadding: false,
      label: "Estado",
    },
    {
      id: "Acciones",
      numeric: true,
      disablePadding: false,
      label: "Acciones",
    },
  ];

  function EnhancedTableHead(props) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;

    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}>
          {/* <TableCell
            padding="checkbox"
            align="center"
            style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
          ></TableCell> */}
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={"center"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                className="text"
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <></>
        )}

        {/* {numSelected > 0 ? (
          <Button
            className="botonIngreso"
            onClick={() => {
              asociarRiesgos();
            }}
          >
            Asociar​
          </Button>
        ) : (
          <></>
        )} */}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  async function ContratoProveedor(proveedor, elemento) {
    const response_proveedor = await axios.get(
      process.env.REACT_APP_API_URL + "/maestros_ro/proveedor/" + proveedor.value + "/",
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
        contratosP.push({ value: contr.Id_contrato, label: contr.Nombre });
      });
      if (elemento === "prin") {
        setListaContratosPrin(contratosP);
      } else if (elemento === "otro") {
        setListaContratos(contratosP);
      }
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /* Funciones para paginación */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  /* Fin de funciones para paginación */

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleOnChangeDetalleSOX = (position) => {
    let tempDetalleSOX = listaDetalleSox;
    tempDetalleSOX[position].state = !listaDetalleSox[position].state;

    setListaDetalleSox(tempDetalleSOX);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - listaGeneralControles.length)
      : 0;

  //* Carga la lista de elementos correspondientes según la selección de Tipo de Control_RO

  const setElementosTipoControl = (event) => {
    setListaActividadControl(event);
    let aux;
    if (event !== null) {
      switch (event.label) {
        case "Control de Procesos":
          aux = listaTipoControl_N2.filter(
            (tipoControl_N2) =>
              tipoControl_N2.parametro === "Control_de_Procesos"
          );
          setListaActividadControl(aux);
          setActividadControl(null);
          break;
        case "Control de Proveedor":
          aux = listaTipoControl_N2.filter(
            (tipoControl_N2) =>
              tipoControl_N2.parametro === "Control_de_Proveedor"
          );
          setListaActividadControl(aux);
          setActividadControl(null);
          break;
        case "Control de tecnología":
          aux = listaTipoControl_N2.filter(
            (tipoControl_N2) =>
              tipoControl_N2.parametro === "Control_de tecnología"
          );
          setListaActividadControl(aux);
          setActividadControl(null);
          break;
        case "Controles de Infraestructura o físicos":
          aux = listaTipoControl_N2.filter(
            (tipoControl_N2) =>
              tipoControl_N2.parametro ===
              "Controles_de_Infraestructura_o_físicos"
          );
          setListaActividadControl(aux);
          setActividadControl(null);
          break;
        case "Controles de personas":
          aux = listaTipoControl_N2.filter(
            (tipoControl_N2) =>
              tipoControl_N2.parametro === "Controles_de_personas"
          );
          setListaActividadControl(aux);
          setActividadControl(null);
          break;
        case "Controles de modelos":
          aux = listaTipoControl_N2.filter(
            (tipoControl_N2) =>
              tipoControl_N2.parametro === "Controles_de_modelos"
          );
          setListaActividadControl(aux);
          setActividadControl(null);
          break;
        default:
          break;
      }
    }
  };

  const filtraControles = (listaGeneral, nuevaLista, tipoNuevaLista) => {
    //** Toma como propiedades 1. la lista general o consolidada de todos los riesgos: Activos + Inactivos + Sugeridos + Buscados 2.La nueva lista de Riesgos que se agregará: Riesgos Activos, Riesgos Escaneados, Riesgos Buscados

    //* Devuelve el riesgo de mayor prelación Activo||Inactivo > Sugerido > Buscado --- Es invocado mas adelante
    const comparaControles = (controlAntiguo, controlNuevo) => {
      if (
        controlAntiguo.estado_enVista === "Activo" ||
        controlAntiguo.estado_enVista === "Inactivo"
      ) {
        return controlAntiguo;
      } else if (
        controlNuevo.estado_enVista === "Activo" ||
        controlNuevo.estado_enVista === "Inactivo"
      ) {
        return controlNuevo;
      } else if (controlAntiguo.estado_enVista === "Agregado") {
        return controlAntiguo;
      } else if (controlNuevo.estado_enVista === "Agregado") {
        return controlNuevo;
      } else if (controlAntiguo.estado_enVista === "Buscado") {
        return controlAntiguo;
      } else if (controlNuevo.estado_enVista === "Buscado") {
        return controlNuevo;
      }
    };

    let consolidadoControles;
    if (nuevaLista.length !== 0) {
      if (listaGeneral.length !== 0) {
        //* funcion principal: Compara la listaGeneral de Controles y la NuevaLista de Controles, obtiene los repetidos y prevalece el mas importante (ver función comparaControles)...
        //* ... Luego obtiene los Controles que no se repiten de cada lista, y une todos los Controles en Consolidado Riesgo
        //* ... consolidado Controles se mostrará en cada tabla respectivamente según su propiedad "estado_enVista"
        let arr = [];
        let res;

        nuevaLista.map((controlNuevo) => {
          //* devuelve el indice del riesgo repetido, de lo contrario devuelve -1
          res = _.findIndex(
            listaGeneral,
            (e) => {
              return e.idcontrol === controlNuevo.idcontrol;
            },
            0
          );

          //*
          if (res !== -1) {
            var controlAntiguo = listaGeneral.filter(
              (e) => e.idcontrol === controlNuevo.idcontrol
            )[0];
            let aux = comparaControles(controlAntiguo, controlNuevo);
            arr.push(aux);
          }
        });

        //* Obtienen los Controles únicos de cada array de Controles
        let dif1 = _.differenceBy(nuevaLista, listaGeneral, "idcontrol");
        let dif2 = _.differenceBy(listaGeneral, nuevaLista, "idcontrol");

        let riesgosUnicos = _.concat(dif1, dif2);
        consolidadoControles = _.concat(riesgosUnicos, arr);

        consolidadoControles.sort(function (a, b) {
          if (a.idcontrol > b.idcontrol) {
            return 1;
          }
          if (a.idcontrol < b.idcontrol) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      } else if (listaGeneral.length === 0) {
        consolidadoControles = nuevaLista;
      }
    }
    return consolidadoControles;
  };

  const muestraControlesXTabla = (consolidadoControles, tabla) => {
    let controlesXmostrar = [];
    consolidadoControles.map((control) => {
      if (
        (control.estado_enVista === "Activo" ||
          control.estado_enVista === "Agregado") &&
        tabla === "Tabla_Activos"
      ) {
        controlesXmostrar.push(control);
      } else if (
        control.estado_enVista === "Inactivos" &&
        tabla === "Inactivos"
      ) {
        controlesXmostrar.push(control);
      } else if (
        control.estado_enVista === "Buscado" &&
        tabla === "Busqueda_controles"
      ) {
        controlesXmostrar.push(control);
      }
    });
    return controlesXmostrar;
  };

  //** Busca controles que no se encuentren en en la lista ppal */

  const buscarControles = (event) => {
    async function getControles() {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + "/controles", {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        });
        let controles = response.data;

        controles.map((control) => (control.estado_enVista = "Buscado"));

        let controles_filtrados = filtraControles(
          listaGeneralControles,
          controles
        );

        setListaGeneralControles(controles_filtrados);
      } catch (error) {
        console.error(error);
      }
    }
    getControles();
  };

  //* Controla los checkboxes, recibe su valor y lo guarda en un string ///////////////////////

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
    //--------------------------------Manejo de las Aristas (MULTISELECT)------------------------

    setCheckedRO(
      arrayAristas.some(function (element) {
        return element == "RO";
      })
    );

    setCheckedSOX(
      arrayAristas.some(function (element) {
        return element == "SOX";
      })
    );

    setCheckedLAFT(
      arrayAristas.some(function (element) {
        return element == "LAFT";
      })
    );

    var stringAristas = arrayAristas.join(";");
    setAristas(stringAristas);

    let boolAristas = arrayAristas.some((a) => a === "Malversación");

    setRequiredAreas(boolAristas);

    if (boolAristas == true) {
      setShowAreas(true);
    }
  };

  //**Actualiza los valores de los controles compensatorios v.g: Motivo compensación, fecha inicio ... */
  const actualizaControl = (idControl, campo, valor) => {
    let listaUpdated = listaGeneralControles.map((obj) => {
      if (obj.idcontrol === idControl) {
        return { ...obj, campo: valor };
      }
    });
    setListaGeneralControles((oldState) => ({ ...oldState }));
  };

  //** Verifica de los campos obligatorios sean llenados antes de guardar */

  const checkValidez = () => {
    if (nombre_ctrl !== null && nombre_ctrl !== "") {
      if (descripcion !== null) {
        if (responsable !== null) {
          if (lugarEjecucion !== null) {
            if (automatizacion !== null) {
              if (naturaleza !== null) {
                if (poblacion !== null) {
                  if (muestra !== null) {
                    if (true) {
                      //if (evidencia !== null) {
                        //if (ruta_evidencia !== null) {
                          if (frecuencia !== null) {
                            if (aristas !== null) {
                              if (requiredAreas == false) {
                                return true;
                              } else {
                                if (AreasOrganizacionales !== null) {
                                  return true;
                                } else {
                                  return false;
                                }
                              }
                            } else {
                              return false;
                            }
                          } else {
                            return false;
                          }
                        //} else {
                        //  return false;
                        //}
                      //} else {
                      //  return false;
                      //}
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
    } else {
      return false;
    }
  };

  //** Envía los datos de toda la evalauciona al back */

  const sendData = async () => {
    if (checkValidez() === false) {
      setEstadoPost(7);
    } else if (checkValidez() === true) {
      let canales = [];
      let productos = [];
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
      //-----------------------------------------------------> Conversión de la S.V.estadoControl de bool a nmbr.
      function convierteEstado(estado) {
        if (estado.value === true) {
          return 1;
        } else {
          return 0;
        }
      } //-------------------------------------------------------------------------------------------------------------------------------->
      //-------------------------------------------------------> Conversión de la S.V.lugarEjecucon de Obj a str.
      var lugarEjecucionStringArray = lugarEjecucion.map(
        (lugar) => lugar.value
      ); //* Genera una lista de texto de los Obj.value  => ['Arroz','Papa','Yuca']
      var lugarEjecucionTextConcat = lugarEjecucionStringArray.join(";"); // * Unifica los items de lista como un solo "string" separados por ; => "Arroz;Papa;Yuca"
      //-------------------------------------------------------------------------------------------------------------------------------->

      let stringAristas = strAristas.map((obj) => obj.label).join(",");

      var datosControl = {
        nombre: nombre_ctrl,
        idcompania: compania ? Object.values(compania)[0] : null,
        id_control_en_proceso: id_ctrl_proceso,
        descripcion: descripcion,
        idcanal: canales,
        idproducto: productos,
        objetivo_control: objetivo,
        responsable_ejecucion: responsable,
        control_ejecutado_en: lugarEjecucionTextConcat,
        estado: convierteEstado(estadoControl),
        automatizacion: automatizacion
          ? Object.values(automatizacion)[0]
          : null,
        naturaleza: naturaleza ? Object.values(naturaleza)[0] : null,
        muestra: muestra ? parseInt(muestra) : null,
        cubrimiento: null,
        prevaloracion: null,
        periodicidad: periodicidad ? Object.values(periodicidad)[0] : null,
        evidencia: evidencia,
        ruta_de_la_evidencia: ruta_evidencia,
        usuario_modificador: correoAnalistaLog,
        fecha_modificacion: today,
        variable_mitigada: frecuencia ? Object.values(frecuencia)[0] : null,
        tipo_riesgo_mitigado: strAristas ? stringAristas : null,
        control_compensatorio: 1,
        controles_estandarizado: null,
        poblacion: poblacion ? parseInt(poblacion) : null,
        id_ubicacion: id_ubicacion,
        control_compensatorio: checkedCtrlCompensado ? 1 : 0,
        areaocurrencia: AreasOrganizacionales
          ? AreasOrganizacionales.label
          : null,
        idareaocurrencia: AreasOrganizacionales
          ? AreasOrganizacionales.value
          : null,
        idproveedor: Proveedor ? Proveedor.ID_SAP : null,
        Id_contrato: contratoOtros,
        analista_sox: analistaSOX ? analistaSOX.value : null,
        malversacion: document.getElementById("malversacion").label,
      };

      JSON.stringify(datosControl);

      //Guarda

      axios
        .put(
          process.env.REACT_APP_API_URL + "/controles/" + idControl + "/",
          datosControl,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        )
        .then(async function (response) {
          if (response.status >= 200 && response.status < 300) {
            if (listaGeneralControles !== []) {
              var ctrlCompensatorio = [];
              listaGeneralControles.map((e) => {
                if (e.estado_enVista === "Activo") {
                  ctrlCompensatorio.push({
                    motivo_compensacion: document.getElementById(
                      "motivoCompensa" + e.idcontrol
                    ).value,
                    hasta_cuando_compensa: document.getElementById(
                      "fechaFin" + e.idcontrol
                    ).value,
                    usuario_creador: correoAnalistaLog,
                    estado: 1,
                    motivo_inactivacion: null,
                    fecha_inactivacion: null,
                    usuario_inactivacion: null,
                    id_control_principal: response.data.idcontrol,
                    id_control_compensado: parseInt(
                      document.getElementById("idControlComp" + e.idcontrol)
                        .value
                    ),
                  });
                }
              });

              ctrlCompensatorio.map((control_comp) => {
                let control_compensado = JSON.stringify(control_comp);
                axios
                  .put(
                    process.env.REACT_APP_API_URL + "/controles_compensatorios/",
                    control_compensado,
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )
                  .then(function (response_rx_eval) {
                    if (
                      response_rx_eval.status >= 200 &&
                      response_rx_eval.status < 300
                    ) {
                      localStorage.setItem("idControl", response.data.id);
                      /*  setTimeout(() => {
                        history.push("/editarControl");
                      }, 2000); */
                      setEstadoPost(2);
                    } else if (
                      response_rx_eval.status >= 300 &&
                      response_rx_eval.status < 400
                    ) {
                      setEstadoPost(4);
                    } else if (
                      response_rx_eval.status >= 400 &&
                      response_rx_eval.status < 512
                    ) {
                      setEstadoPost(5);
                    }
                  })
                  .catch((errors) => {
                    // react on errors.
                    console.error(errors);
                  });
              });
            }
            if (dataRevision) {
              const dataRevisionS2 = dataRevision.map(
                ({
                  unidad,
                  idoneidad_ejecutante,
                  idoneidad_evidencia,
                  resultado_control,
                  observaciones,
                  fecha,
                  riesgos_gestionados,
                  id_plan_accion,
                  plan_accion,
                }) => ({
                  idcontrol: response.data.idcontrol,
                  id_unidad_riesgo: unidad.id,
                  idoneidad_ejecutante,
                  idoneidad_evidencia,
                  resultado_control,
                  observaciones,
                  fecha,
                  riesgos_gestionados,
                  id_plan_accion,
                  plan_accion,
                })
              );

              //TODO:Poner alerta

              try {
                const requestRevision = await Queries(
                  dataRevisionS2,
                  "/rev_segunda_linea_control/" + response.data.idcontrol + "/",
                  "PUT"
                );
                console.log(requestRevision);
                setEstadoPost(2);
              } catch (error) {
                setEstadoPost(4);
              }
            }
            localStorage.setItem("idControl", response.data.idcontrol);
            setTimeout(() => {
              history.push("/editarControl");
            }, 2000);
            setEstadoPost(2);
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
          } else if (
            response.status.status >= 400 &&
            response.status.status < 512
          ) {
            setEstadoPost(5);
          }
        });
      setValidated(true);
    }
  };

  const completarTabla = (control, estado) => {
    //* Agrega las propiedades de los controls seleccionados y actualiza su estado en vista a "Agregado"
    let nuevaLista = [];

    let controlCompleto = listaGeneralControles.filter(
      (e) => e.idcontrol === control
    )[0];

    let controles_filtrados = filtraControles(
      listaGeneralControles,
      nuevaLista
    );

    if (estado === "Agregado") {
      controlCompleto.estado_enVista = "Activo";
      controlCompleto.motivoCompensa = document.getElementById(
        "motivoCompensa" + control
      ).value;
      controlCompleto.fechaInicio = document.getElementById(
        "fechaInicio" + control
      ).value;
      controlCompleto.fechaFin = document.getElementById(
        "fechaFin" + control
      ).value;
    }
    if (estado === "Activo") {
      controlCompleto.estado_enVista = "Agregado";
      controlCompleto.motivoCompensa = null;
      controlCompleto.fechaInicio = null;
      controlCompleto.fechaFin = null;
    }

    nuevaLista.push(controlCompleto);

    setListaGeneralControles(controles_filtrados);

    setModalShow(false);
  };

  const FiltrarProveedor = (e) => {
    let elemento = e.value;
    setShowProveedor(true);
    /*if(tipoElemento.value == 332 && e.idcompania == 1){
      
      setShowContrato(true);
      
    }
    else{ 
      setShowContrato(false);

    }*/
  };

  function FiltrarAreas(e) {
    var lugares = [];
    e.map((a) => lugares.push(a));
    setLugarEjecucion(lugares);

    let boolLugares = e.some(
      (lugar) => lugar.value === "Sedes administrativas"
    );
    setShowAreas(boolLugares);
  }

  const addRowRevision = async (e) => {
    try {
      const usr = serviceAAD.getUser().userName.split("@")[0];

      let requestUnidad = await Queries(
        "null",
        "/rxunidad_analista/" + "39283" + "/",
        "GET"
      );
      let rowsRevisionTemp = dataRevision;
      rowsRevisionTemp.push({
        idrev_segunda_linea_control: rowsRevisionTemp.length + 1,
        user: usr,
        unidad: {
          id: requestUnidad[0].idunidad_riesgo.idunidad_riesgo,
          nombre: requestUnidad[0].idunidad_riesgo.nombre,
        },
      });

      setDataRevision(rowsRevisionTemp);
      setDataRevisionBool(!dataRevisionBool);
    } catch (error) {
      console.error(error);
    }
  };

  const openPAModal = async (data, index) => {
    let requestPA = await Queries(null, "/planesdeAccion/", "GET");
    let tempJsonOpciones = {
      dataTable: requestPA,
      nameCol: [
        "ID Plan Acción",
        "Nombre",
        "Descripción",
        "Responsable",
        "Analista",
        "Estado",
      ],
      nameRow: [
        "idplanaccion",
        "nombre",
        "descripcionpa",
        "responsablepa",
        "analistariesgos",
        "estadopa",
      ],
      nameId: "idplanaccion",
      busqueda: true,
      nameBusqueda: [
        "idplanaccion",
        "nombre",
        "descripcionpa",
        "responsablepa",
        "analistariesgos",
        "estadopa",
      ],
    };

    setDataTablePAs(tempJsonOpciones);
    if (data.id_plan_accion) {
      let tempSelected = data.id_plan_accion.split(",");
      tempSelected = tempSelected.map((pa) => ({ idplanaccion: parseInt(pa) }));
      setPaSelected(tempSelected);
    } else {
      setPaSelected(null);
    }

    setIndexPA(index);
    setShowPAs(true);
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
        tipoProveedor={tipoProveedor}
        setShowProveedor={setShowProveedor}
        setShowContratos={setShowContratos}
        setnombreElementoOtros={setnombreElementoOtros}
      ></ModalProveedor>
      <AlertDismissibleExample alerta={estadoPost} />
      <ModalControlComp
        modalShow={modalShow}
        setModalShow={setModalShow}
        listaGeneralControles={listaGeneralControles}
        setListaGeneralControles={setListaGeneralControles}
        selected={selected}
        setSelected={setSelected}
      />
      <Container>
        <Row className="mb-3">
          <Col md={12}>
            <h1 className="titulo">Ver / Editar Control</h1>
          </Col>
        </Row>
        <Row className="mb-5 mt-5 ">
          <Col sm={6} xs={1}></Col>
          <Col sm={3} xs={3}>
            <Link to="controles">
              <button type="button" className="btn botonNegativo">
                Cancelar
              </button>
            </Link>
          </Col>
          <Col sm={3} xs={3}>
            {props.permisos.crear ? (
              <button
                type="button"
                className="btn botonPositivo"
                id="send"
                onClick={() => {
                  sendData();
                }}
              >
                Guardar
              </button>
            ) : null}
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
            <label className="forn-label label">Estado</label>
          </Col>

          <Col sm={2} xs={12}>
            {props.permisos.inactivar ? (
              <>
                <Switch
                  checked={estadoControl ? estadoControl.value : null}
                  onChange={(e) => {
                    let label =
                      e.target.checked === true ? "Activo" : "Inactivo";
                    setEstadoControl({
                      value: e.target.checked,
                      label: label,
                    });
                  }}
                ></Switch>
                {/* <label className="form-label text">
                  {estadoControl ? estadoControl.label : null}
                </label> */}
              </>
            ) : null}
          </Col>

          <Col sm={2} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nuevo Estado del evento"
              disabled
              value={estadoControl ? estadoControl.label : null}
            />
          </Col>

          <Col sm={2} xs={12} className="text-center">
            <label className="label ">Id Control</label>
          </Col>
          <Col sm={1} xs={12}>
            <input
              type="text"
              disabled
              value={idControl}
              className="form-control text-center texto"
              placeholder="ID Automático"
              id="IDevaluacion"
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12} className="label">
            <label className="form-label">Compañía*</label>
          </Col>
          <Col sm={4} xs={12}>
            <Select
              components={animatedComponents}
              options={companias}
              value={compania}
              placeholder={"Seleccione la compañia"}
              onChange={(e) => {
                setCompania(e);
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12} className="label">
            <label className="form-label">ID Control en proceso*</label>
          </Col>
          <Col sm={4} xs={12}>
            <input
              type="text"
              className="form-control text-left texto input"
              placeholder="Nuevo"
              required
              value={id_ctrl_proceso}
              id="IDControlPrcoeso"
              onChange={(e) => {
                setId_ctrl_proceso(e.target.value);
              }}
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre Control*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-left texto input"
              placeholder="Nombre"
              required
              value={nombre_ctrl}
              id="NombreEval"
              onChange={(e) => {
                setNombre_ctrl(e.target.value);
              }}
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Descripción del control</label>
          </Col>
          <Col sm={8} xs={12}>
            <textarea
              className="form-control text-left"
              placeholder="Descripción del control"
              rows="3"
              value={descripcion}
              id="Descripcion"
              onChange={(e) => {
                setDescripcion(e.target.value);
              }}
            ></textarea>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Objetivo del control</label>
          </Col>
          <Col sm={8} xs={12}>
            <textarea
              className="form-control text-left"
              placeholder="Objetivo del control"
              rows="3"
              value={objetivo}
              id="Descripcion"
              onChange={(e) => {
                setObjetivo(e.target.value);
              }}
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <hr />
            <label className="form-label subtitulo">Ubicación</label>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Proceso</label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              components={animatedComponents}
              options={listaProceso}
              value={proceso}
              placeholder={"Proceso"}
              onChange={async (e) => {
                let querieUsrProc = await Queries(
                  { Proceso: e.value },
                  "/analista_sox/",
                  "POST"
                );
                setAnalistaSOX({
                  label: querieUsrProc.data.analista_sox,
                  value: querieUsrProc.data.posicion,
                });
                setProceso(e);
              }}
            />
          </Col>
        </Row>

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
              options={listaCanal}
              placeholder={"Canales"}
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
            <label className="form-label label">Producto</label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              components={animatedComponents}
              isMulti
              options={listaProducto}
              value={producto}
              placeholder={"Productos"}
              onChange={(e) => {
                setProducto(e);
              }}
            />
          </Col>
        </Row>
        {/*  <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Proyecto</label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              components={animatedComponents}
              options={null}
              value={null}
              placeholder={"proyecto"}
              onChange={() => {
         
              }}
            />
          </Col>
        </Row> */}

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

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Analista SOX</label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              components={animatedComponents}
              options={datAnalistas}
              value={analistaSOX}
              placeholder={"Analista SOX"}
              onChange={(e) => {}}
            />
          </Col>
        </Row>

        {!!showContratos ? (
          <Row className="mb-3">
            <Col sm={4} xs={12}>
              <label className="form-label label">Contratos Asociados​</label>
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
        <Row className="mb-3">
          <Col md={12}>
            <hr />
            <label className="form-label subtitulo">
              Caracterización control
            </label>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Ejecutante*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-left texto"
              placeholder="Responsable"
              required
              value={responsable}
              id="NombreEval"
              onChange={(e) => {
                setResponsable(e.target.value);
              }}
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4}>
            <label className="form-label label">Testing auditoría</label>
          </Col>
          <Col sm={8}>
            <input
              type="number"
              min="0"
              max="100"
              className="form-control text-left texto"
              placeholder="Testing"
              required
              value={testing}
              onChange={(e) => {
                setTesting(e.target.value);
              }}
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4}>
            <label className="form-label label">Automatización*</label>
          </Col>
          <Col sm={8}>
            <Select
              components={animatedComponents}
              options={listaAutomatizacion}
              value={automatizacion}
              placeholder={"Automatización"}
              onChange={(e) => {
                setAutomatizacion(e);
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4}>
            <label className="form-label label">Naturaleza*</label>
          </Col>
          <Col sm={8}>
            <Select
              components={animatedComponents}
              options={listaNaturaleza}
              value={naturaleza}
              placeholder={"Naturaleza"}
              onChange={(e) => {
                setNaturaleza(e);
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4}>
            <label className="form-label label">Periodicidad*</label>
          </Col>
          <Col sm={8}>
            <Select
              components={animatedComponents}
              options={lista_periodicidad}
              value={periodicidad}
              placeholder={"Periodicidad"}
              onChange={(e) => {
                setPeriodicidad(e);
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Evidencia</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-left texto"
              placeholder="Evidencia"
              value={evidencia}
              id="NombreEval"
              onChange={(e) => {
                setEvidencia(e.target.value);
              }}
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Ruta evidencia</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-left texto"
              placeholder="Ruta evidencia"
              value={ruta_evidencia}
              id="NombreEval"
              onChange={(e) => {
                setRuta_evidencia(e.target.value);
              }}
            ></input>
          </Col>
        </Row>

        {!!showAreas ? (
          <Row className="mb-3">
            <Col sm={4} xs={12}>
              <label className="form-label label">
                Áreas organizacionales :
              </label>
            </Col>
            <Col sm={8} xs={12}>
              <Select
                required={requiredAreas}
                components={animatedComponents}
                value={AreasOrganizacionales}
                options={ListaAreasOrganizacionales}
                placeholder={"Áreas organizacionales"}
                onChange={(e) => {
                  setAreasOrganizacionales(e);
                }}
              />
            </Col>
          </Row>
        ) : (
          <></>
        )}

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Malversación</label>
          </Col>
          <Col sm={4} xs={12}>
            <Select
              components={animatedComponents}
              options={[
                { value: "Si", label: "Si" },
                { value: "No", label: "No" },
              ]}
              placeholder="Malversación"
              id="malversacion"
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Riesgos que mitiga</label>
          </Col>
        </Row>
        {/* /////////////////////////////////////// Checkbox list ///////////////////////////////////////// */}

        <Row className="mb-3 mt-3">
          <Col sm={4}>Aristas</Col>
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
                      const isDuplicate = fiteredProgramas.has(element.label);

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
                      setCheckedRO(true);
                    } else if (newArray.some((obj) => obj.label === "SOX")) {
                      setCheckedSOX(true);
                    } else {
                      setCheckedRO(false);
                      setCheckedSOX(false);
                    }

                    field.onChange(newArray);
                  }}
                />
              )}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(event) => {
                    setCheckedCtrlCompensado(event.target.checked);
                  }}
                  name="gilad"
                  checked={checkedCtrlCompensado}
                />
              }
              label="Controles compensatorios"
            />
          </Col>
        </Row>
      </Container>

      {(() => {
        if (checkedCtrlCompensado === true) {
          return (
            <>
              <Container>
                <hr />
                {/* Control compensado Activo */}
                <Row className="mb-1 justify-content-end">
                  <Col sm={2} xs={6} className="text-right">
                    <Button
                      className="botonPositivo2"
                      onClick={() => {
                        setModalShow(true);
                        buscarControles();
                      }}
                    >
                      Agregar control compensado​
                    </Button>
                  </Col>
                </Row>
                <br />
                <Paper className={classes.root}>
                  {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                  <TableContainer
                    component={Paper}
                    className={classes.container}
                  >
                    <Table
                      className={"text"}
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <EnhancedTableHead
                        numSelected={selected.length}
                        /* order={order}
                        orderBy={orderBy} */
                        onRequestSort={handleRequestSort}
                        rowCount={listaGeneralControles.length}
                      />
                      {/* Fin de encabezado */}
                      {/* Inicio de cuerpo de la tabla */}
                      <TableBody>
                        {stableSort(
                          muestraControlesXTabla(
                            listaGeneralControles,
                            "Tabla_Activos"
                          ),
                          getComparator(order, orderBy)
                        )
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            /* const isItemSelected = isSelected(row.idcontrol); */
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                              <TableRow
                                hover
                                onClick={(event) =>
                                  handleClick(event, row.idcontrol)
                                }
                                role="checkbox"
                                /*  aria-checked={isItemSelected} */
                                tabIndex={-1}
                                key={row.idcontrol}
                                /* selected={isItemSelected} */
                              >
                                {/*  <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={isItemSelected}
                                    inputProps={{ "aria-labelledby": labelId }}
                                  />
                                </TableCell> */}
                                <TableCell
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                  align="center"
                                >
                                  {row.idcontrol}
                                  <input
                                    type="hidden"
                                    value={row.idcontrol}
                                    id={"idControlComp" + row.idcontrol}
                                  ></input>
                                </TableCell>
                                {/*   <TableCell align="center">
                                  {row.nombre ? row.nombre : null}
                                </TableCell> */}

                                <TableCell align="center">
                                  <input
                                    type="text"
                                    className="form-control text-left texto"
                                    id={"motivoCompensa" + row.idcontrol}
                                    disabled={row.estado_enVista === "Activo"}
                                    /* value={row.motivo_compensacion} */
                                    onChange={(e) => {
                                      actualizaControl(
                                        row.idControl,
                                        "motivo_compensación",
                                        e
                                      );
                                    }}
                                  ></input>
                                </TableCell>
                                <TableCell align="center">
                                  <input
                                    type="date"
                                    id={"fechaInicio" + row.idcontrol}
                                    placeholder="dd/mm/yyyy"
                                    disabled={row.estado_enVista === "Activo"}
                                    className="form-control text-left texto"
                                  ></input>
                                </TableCell>
                                <TableCell align="center">
                                  <input
                                    type="date"
                                    id={"fechaFin" + row.idcontrol}
                                    className="form-control text-left texto"
                                    placeholder="dd/mm/yyyy"
                                    disabled={row.estado_enVista === "Activo"}
                                  ></input>
                                </TableCell>
                                <TableCell align="center">
                                  {row.usuario_creador
                                    ? row.usuario_creador
                                    : null}
                                </TableCell>
                                <TableCell align="center">
                                  {row.estado_enVista}
                                </TableCell>
                                <TableCell>
                                  <Row className="justify-content-center">
                                    {(() => {
                                      if (row.estado_enVista === "Activo") {
                                        return (
                                          <Button
                                            variant="text"
                                            title="Editar"
                                            onClick={() => {
                                              completarTabla(
                                                row.idcontrol,
                                                "Activo"
                                              );
                                            }}
                                          >
                                            <EditIcon color="action" />
                                          </Button>
                                        );
                                      } else if (
                                        row.estado_enVista === "Agregado"
                                      ) {
                                        return (
                                          <>
                                            <Button
                                              variant="text"
                                              title="Asociar"
                                              onClick={() => {
                                                completarTabla(
                                                  row.idcontrol,
                                                  "Agregado"
                                                );
                                              }}
                                            >
                                              <SaveIcon color="info" />
                                            </Button>
                                            {/* <Button
                                              variant="text"
                                              title="Cancelar"
                                              onClick={() => {
                                                completarTabla(
                                                  row.idcontrol,
                                                  "Activo"
                                                );
                                              }}
                                            >
                                              <CancelIcon color="action" />
                                            </Button> */}
                                          </>
                                        );
                                      }
                                    })()}
                                  </Row>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow
                            style={{
                              height: (dense ? 33 : 53) * emptyRows,
                            }}
                          >
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                      {/* Fin de cuerpo de la tabla */}
                    </Table>
                  </TableContainer>
                  {/* Inicio de paginación */}
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={listaGeneralControles.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                  {/* Fin de paginación */}
                </Paper>
                <p></p>
              </Container>
            </>
          );
        } else {
          return null;
        }
      })()}

      {(() => {
        if (checkedRO === true) {
          return (
            <>
              <Container>
                <hr />
                <Row className="mb-3 mt-4">
                  <Col md={12}>
                    <h1 className="subtitulo text-center">Detalle RO</h1>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4}>
                    <label className="form-label label">Población*</label>
                  </Col>
                  <Col sm={8}>
                    <input
                      type="number"
                      className="form-control text-left texto"
                      placeholder="Poblacion"
                      value={poblacion}
                      required={checkedRO}
                      id="Poblacion"
                      onChange={(e) => {
                        setPoblacion(e.target.value);
                      }}
                    ></input>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4}>
                    <label className="form-label label">Muestra*</label>
                  </Col>
                  <Col sm={8}>
                    <input
                      type="number"
                      className="form-control text-left texto"
                      placeholder="Muestra"
                      required={checkedRO}
                      value={muestra}
                      id="Muestra"
                      onChange={(e) => {
                        setMuestra(e.target.value);
                      }}
                    ></input>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">
                      Variable mitigada*
                    </label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <Select
                      components={animatedComponents}
                      options={listaVariableMitigada}
                      placeholder={"Frecuencia"}
                      value={frecuencia}
                      required={checkedRO}
                      onChange={(e) => {
                        setFrecuencia(e);
                      }}
                    />
                  </Col>
                </Row>

                <Row className="mb-3 mt-3">
                  <Col>
                    <label className="form-label label">
                      ¿Donde se ejecuta el control?*
                    </label>
                  </Col>

                  <Col sm={8} xs={12}>
                    <Select
                      id={"Canal"}
                      components={animatedComponents}
                      isMulti
                      value={lugarEjecucion}
                      options={listaLugaresControl}
                      placeholder={"Lugar donde se ejecuta el control"}
                      onChange={FiltrarAreas}
                    />
                  </Col>
                </Row>

                <Row className="mb-3 mt-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">
                      Cobertura Operativa
                    </label>
                  </Col>
                  <Col sm={3} xs={12}>
                    <input
                      type="text"
                      className="form-control text-left texto"
                      placeholder=""
                      value={cobertura}
                      disabled
                      id="analista"
                    ></input>
                  </Col>

                  <Col sm={2} xs={12}>
                    <label className="form-label label">Prevalorización</label>
                  </Col>
                  <Col sm={3} xs={12}>
                    <input
                      type="text"
                      className="form-control text-left texto"
                      placeholder=""
                      value={prevalorizacion}
                      disabled
                      id="analista"
                    ></input>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">
                      Tipo de Control RO*
                    </label>
                  </Col>
                  <Col sm={4} xs={12}>
                    <Select
                      value={tipoControl_N1}
                      options={listaTipoControl_N1}
                      components={animatedComponents}
                      placeholder={"Tipo"}
                      onChange={(e) => {
                        setTipoControlRO_N1(e);
                      }}
                    />
                  </Col>
                  <Col sm={4} xs={12}>
                    <Select
                      value={actividadControl}
                      options={listaTipoControl_N2}
                      components={animatedComponents}
                      placeholder={"Actividad"}
                      onChange={(e) => {
                        setActividadControl(e);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4}>
                    <label className="form-label label">
                      Control estandarizado
                    </label>
                  </Col>
                  <Col sm={8}>
                    <Select
                      components={animatedComponents}
                      options={listaControl_estandarizado}
                      value={ctrl_estandarizado}
                      placeholder={"Control Estandarizado"}
                      onChange={(e) => {
                        setCtrlEstandarizado(e);
                      }}
                    />
                  </Col>
                </Row>
              </Container>
            </>
          );
        } else {
          return null;
        }
      })()}
      {(() => {
        if (checkedSOX === true) {
          return (
            <>
              <hr />
              <Container>
                <Row className="mb-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label subtitulo">Detalle SOX</label>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">Cuenta Contable</label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <input
                      type="text"
                      className="form-control text-left texto"
                      placeholder="Cuenta contable"
                      id="CuentaContable"
                      onChange={(e) => setCuentaContable(e.target.value)}
                      defaultValue={cuentaContable}
                    ></input>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">
                      Tipología de control
                    </label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <Select
                      value={tipologia}
                      options={[
                        { label: "Conciliación", value: "Conciliación" },
                        { label: "Verificación", value: "Verificación" },
                        {
                          label: "Autorización/Aprobación",
                          value: "Autorización/Aprobación",
                        },
                        { label: "MRC Tipo 1", value: "MRC Tipo 1" },
                        { label: "MRC Tipo 2", value: "MRC Tipo 2" },
                        { label: "MRC Tipo 3", value: "MRC Tipo 3" },
                        {
                          label: "Control sobre datos maestros",
                          value: "Control sobre datos maestros",
                        },
                      ]}
                      placeholder={"Tipología"}
                      onChange={(e) => setTipologia(e)}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">ID EUC</label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <input
                      type="text"
                      className="form-control text-left texto"
                      placeholder="Id EUC"
                      id="EUC"
                      onChange={(e) => setEUC(e.target.value)}
                      defaultValue={EUC}
                    ></input>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">Observación</label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <textarea
                      className="form-control text-left"
                      placeholder="Observación"
                      rows="3"
                      id="observacion"
                      onChange={(e) => setObservacion(e.target.value)}
                      defaultValue={observacion}
                    ></textarea>
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
              </Container>
            </>
          );
        } else {
          return null;
        }
      })()}
      {!!checkedLAFT ? (
        <>
          <Container>
            <hr />

            <Row className="mb-3 mt-4">
              <Col md={12}>
                <h1 className="subtitulo text-center">Detalle LAFT</h1>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Categoría*</label>
              </Col>
              <Col sm={8} xs={12}>
                <Select
                  //value={tipoControl_N1}
                  //options={listaTipoControl_N1}
                  //onChange={(e) => {      }}
                  components={animatedComponents}
                  placeholder={"Categoría"}
                />
              </Col>
            </Row>
            <Row className="mb-3 mt-4">
              <Col sm={4} xs={12}>
                <label className="form-label label">Subcategoría*</label>
              </Col>

              <Col sm={8} xs={12}>
                <Select
                  //value={tipoControl_N1}
                  //options={listaTipoControl_N1}
                  //onChange={(e) => {      }}
                  components={animatedComponents}
                  placeholder={"Subcategoría"}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">
                  ¿El control aplica para varias compañías?
                </label>
              </Col>
              <Col sm={2} xs={12}>
                <Select
                  //value={}
                  options={[
                    { value: 0, label: "Si" },
                    { value: 1, label: "No" },
                  ]}
                  //onChange={(e) => {}
                  components={animatedComponents}
                  placeholder={"Si/No"}
                />
              </Col>
              <Col sm={2} xs={12}>
                <label className="form-label label">
                  Compañías en las que aplica​
                </label>
              </Col>

              <Col sm={4} xs={12}>
                <Select
                  //value={}
                  options={companias}
                  //onChange={(e) => {}
                  components={animatedComponents}
                  placeholder={"Compañias"}
                />
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <></>
      )}

      <Row className="mb-5 mt-5">
        <br></br>
      </Row>
      <Row className="mb-3 mt-4">
        <Col md={12}>
          <h1 className="subtitulo text-center">
            Revisión y reto de segunda línea
          </h1>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={3} xs={3}>
          <button
            type="button"
            className="btn botonPositivo2"
            onClick={async (e) => {
              addRowRevision(e);
            }}
          >
            Agregar
          </button>
        </Col>
        <Col sm={3} xs={3}>
          <button
            type="button"
            className="btn botonNegativo2"
            onClick={() => {
              let tempRev = dataRevision;
              tempRev = tempRev.filter(
                (obj) => obj.idrev_segunda_linea_control !== selected[0]
              );
              setDataRevision(tempRev);
            }}
          >
            Eliminar
          </button>
        </Col>
        <Col sm={6} xs={1}></Col>
      </Row>

      <Paper className={classes.root}>
        <TableContainer component={Paper} className={classes.container}>
          <Table className={"text"} stickyHeader aria-label="sticky table">
            {/* Inicio de encabezado */}
            <TableHead className="titulo">
              <TableRow className="tr">
                <StyledTableCell padding="checkbox"></StyledTableCell>
                <StyledTableCell align="left">Unidad de riesgo</StyledTableCell>
                <StyledTableCell align="left">Usuario Creador</StyledTableCell>
                <StyledTableCell align="left">
                  Idoneitdad del ejecutante
                </StyledTableCell>
                <StyledTableCell align="left">
                  Idoneidad de la evidenia
                </StyledTableCell>
                <StyledTableCell align="left">
                  Resultado del control
                </StyledTableCell>
                <StyledTableCell align="left">observaciones</StyledTableCell>
                <StyledTableCell align="left">Fecha</StyledTableCell>
                <StyledTableCell align="left">
                  Riesgos gestionados
                </StyledTableCell>
                <StyledTableCell align="left">
                  Id plan de acción
                </StyledTableCell>
                <StyledTableCell align="left">Plan de acción</StyledTableCell>
              </TableRow>
            </TableHead>
            {/* Fin de encabezado */}
            {/* Inicio de cuerpo de la tabla */}
            <TableBody>
              {dataRevision
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(
                    row.idrev_segunda_linea_control
                  );
                  return (
                    <StyledTableRow
                      key={row.idrev_segunda_linea_control}
                      hover
                      onClick={(event) =>
                        handleClick(event, row.idrev_segunda_linea_control)
                      }
                      selected={isItemSelected}
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <StyledTableCell component="th" scope="row">
                        <Checkbox checked={isItemSelected} />
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        {row.unidad && row.unidad.nombre
                          ? row.unidad.nombre
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.user !== null ? row.user : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Select
                          options={[
                            { label: "Adecuado", value: "Adecuado" },
                            { label: "Por Mejorar", value: "Por Mejorar" },
                          ]}
                          value={
                            row.idoneidad_ejecutante
                              ? {
                                  label: row.idoneidad_ejecutante,
                                  name: row.idoneidad_ejecutante,
                                }
                              : null
                          }
                          placeholder={"idoneitdad ejecutante"}
                          onChange={(e) => {
                            row["idoneidad_ejecutante"] = e.value;
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Select
                          options={[
                            { label: "Adecuado", value: "Adecuado" },
                            { label: "Por Mejorar", value: "Por Mejorar" },
                          ]}
                          value={
                            row.idoneidad_evidencia
                              ? {
                                  label: row.idoneidad_evidencia,
                                  name: row.idoneidad_evidencia,
                                }
                              : null
                          }
                          placeholder={"idoneitdad evidenia"}
                          onChange={(e) => {
                            row["idoneidad_evidencia"] = e.value;
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Select
                          options={[
                            {
                              label: "Implementado",
                              value: "Implementado",
                            },
                            {
                              label: "Por implementar",
                              value: "Por implementar",
                            },
                            { label: "Por Mejorar", value: "Por Mejorar" },
                          ]}
                          value={
                            row.resultado_control
                              ? {
                                  label: row.resultado_control,
                                  name: row.resultado_control,
                                }
                              : null
                          }
                          placeholder={"resultado control"}
                          onChange={(e) => {
                            row["resultado_control"] = e.value;
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <textarea
                          className="form-control text-left"
                          placeholder="Observaciones"
                          rows="3"
                          id="Observaciones"
                          defaultValue={
                            row.observaciones ? row.observaciones : null
                          }
                          onChange={(e) => {
                            row["observaciones"] = e.target.value;
                          }}
                        ></textarea>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <input
                          type="date"
                          id={"fechaInicio"}
                          placeholder="dd/mm/yyyy"
                          className="form-control text-left texto"
                          defaultValue={row.fecha ? row.fecha : null}
                          onChange={(e) => {
                            row["fecha"] = e.target.value;
                          }}
                        ></input>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Select
                          options={dataAristas}
                          value={row.riesgosGestionadosList}
                          placeholder={"riesgos gestionados"}
                          onChange={(e) => {
                            row["riesgosGestionadosList"] = e;
                            let temp = e.map(({ value }) => value).join(";");
                            row["riesgos_gestionados"] = temp;
                          }}
                          isMulti={true}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <label>
                          {row.id_plan_accion ? row.id_plan_accion : null}
                        </label>
                        <Button
                          variant="text"
                          title="Agregar"
                          onClick={async () => {
                            await openPAModal(row, index);
                          }}
                        >
                          <AddBoxIcon color="info" />
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <textarea
                          className="form-control text-left"
                          placeholder="Descripción del plan de acción"
                          rows="3"
                          id="plan_accion"
                          defaultValue={
                            row.plan_accion ? row.plan_accion : null
                          }
                          onChange={(e) => {
                            row["plan_accion"] = e.target.value;
                          }}
                        ></textarea>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
            {/* Fin de cuerpo de la tabla */}
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
