import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert, Container, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import Select from "react-select";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import { visuallyHidden } from "@mui/utils";
import CancelIcon from "@mui/icons-material/Cancel";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Loader from "react-loader-spinner";
import axios from "axios";
import { Treebeard } from "react-treebeard";

import Queries from "../Components/QueriesAxios";

import AADService from "../auth/authFunctions";
import { UsuarioContext } from "../Context/UsuarioContext";
import { FormSearchListSiNo } from "../form-components/FormSearchListSiNo";
import ModalProveedor from "../Maestros/Proveedores/ModalProveedor";
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
  },
}))(TableRow);

const useStyles = makeStyles({
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
});

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
  const classes = useStyles();
  const serviceAAD = new AADService();
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const { dataUsuario } = React.useContext(UsuarioContext);
  const [decisiones, setDecisiones] = React.useState([]);
  const [buscando, setBuscando] = React.useState(null);
  const [listaAristas, setListaAristas] = React.useState([]);
  const [showModalProveedor, setShowModalProveedor] = React.useState(false);
  const [tipoProveedor, setTipoProveedor] = useState([]);
  const [strAristas, setStrAristas] = useState([]);
  const [nombreElementoOtros, setNombreElementoOtros] = React.useState(null);
  const [nombreElemento, setNombreElemento] = React.useState(null);
  const [procesoObligatorio, setProcesoObligatorio] = useState(false);
  //* Reciben los datos para llenar cada uno de los Select

  const [showContrato, setShowContrato] = useState(false);
  const [contrato, setContrato] = useState([]);
  const [dataRevision, setDataRevision] = useState([]);
  const [dataRevisionBool, setDataRevisionBool] = useState(true);
  const [Proveedor, setProveedor] = useState([]);
  const [companias, setCompanias] = useState([]);
  const [listaProceso, setListaProceso] = useState([]);
  const [listaProducto, setListaProducto] = useState([]);
  const [listaCanal, setListaCanal] = useState([]);
  const [lista_periodicidad, setLista_Periodicidad] = useState([]);
  const [listaAutomatizacion, setListaAutomatizacion] = useState([]);
  const [listaNaturaleza, setListaNaturaleza] = useState([]);
  const [listaVariableMitigada, setLista_VariableMitigada] = useState([]);
  const [listaTipoControl_N1, setListaTipoControlRO_N1] = useState(null);
  const [listaTipoControl_N2, setListaTipoControlRO_N2] = useState(null);
  const [listaActividadControl, setListaActividadControl] = useState(null);
  const [listaControl_estandarizado, setListaControl_estandarizado] =
    useState(null);
  const [listaContratos, setListaContratos] = useState([]);
  const [showContratos, setShowContratos] = useState(false);
  const [contratoSelec, setContratoSelec] = useState([]);
  const [contratoOtros, setContratoOtros] = useState([]);
  const [listaProveedor_filtered, setListaProveedorFiltered] = useState([]);

  //* Reciben los datos filtrados
  const [listaProceso_filtered, setListaProcesoFiltered] = useState([]);
  const [listaProducto_filtered, setListaProductoFiltered] = useState([]);
  const [listaCanal_filtered, setListaCanalFiltered] = useState([]);

  //* Reciben los datos ingresados/elegidos por el usuario
  const [compania, setCompania] = useState(null);
  const [nombre_ctrl, setNombre_ctrl] = useState(null);
  const [id_ctrl_proceso, setId_ctrl_proceso] = useState(null);
  const [responsable, setResponsable] = useState(null);
  const [proceso, setProceso] = useState(null);
  const [canal, setCanal] = useState(null);
  const [producto, setProducto] = useState(null);
  const [lugarEjecucion, setLugarEjecucion] = useState(null);
  const [aristas, setAristas] = useState(null);
  const [descripcion, setDescripcion] = useState(null);
  const [automatizacion, setAutomatizacion] = useState(null);
  const [naturaleza, setNaturaleza] = useState(null);
  const [poblacion, setPoblacion] = useState(null);
  const [muestra, setMuestra] = useState(null);
  const [periodicidad, setPeriodicidad] = useState(null);
  const [evidencia, setEvidencia] = useState(null);
  const [ruta_evidecia, setRuta_evidencia] = useState(null);
  const [variable_mitigada, setVariableMitigada] = useState(null);
  const [testing, setTesting] = useState(null);

  //* llena las variables relacionadas con DEtalle Ro
  const [tipoControl_N1, setTipoControlRO_N1] = useState(null);
  const [actividadControl, setActividadControl] = useState(null);
  const [ctrlEstandarizado, setCtrlEstandarizado] = useState(null);

  //* contrala el comportamanieto de los componentes
  const [loadingData, setLoadingData] = React.useState(false);
  const history = useHistory();
  const [modalShow, setModalShow] = React.useState(false);
  const [showAlerta, setShowAlerta] = useState(false);
  const [textAlerta, setTextAlerta] = useState(false);

  //* variable
  const [listaGeneralControles, setListaGeneralControles] = useState([]);

  //* Variables para tabla de Riesgos Activos
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("idcontrol");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //* Controla comportamiento de la vista
  const [tipoCompo, setTipoComponente] = useState("Select");
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
  const correoAnalistaLog = serviceAAD.getUser().userName;
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);

  // ¿Donde se ejecuta el control?
  const [listaLugaresControl, setListaLugaresControl] = useState([
    { value: "Sedes administrativas", label: "Sedes administrativas" },
    { value: "Sucursal", label: "Sucursal" },
  ]);

  const [showAreas, setShowAreas] = useState(false);
  const [requiredAreas, setRequiredAreas] = useState(false);
  const [ListaAreasOrganizacionales, setListaAreasOrganizacionales] =
    useState(null);
  const [AreasOrganizacionales, setAreasOrganizacionales] = useState(null);

  const [datProcComp, setDatProcComp] = useState(null);
  const [cursor, setCursor] = useState(false);
  const [objetivo, setObjetivo] = useState(null);
  const [listaProveedores, setListaProveedores] = useState([]);

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

  const [consultasBool, setConsultasBool] = useState(false);

  // const actividadTipoControlRO = () => {
  //   switch (tipoDeControl) {
  //     case "Control de  procesos":
  //       return { listaActividadProcesosTipoControlRO };
  //     case "Control de tecnología":
  //       return { listaActividadTecnologiaTipoControlRO };
  //     case "Controles de infraestructura o físicos":
  //       return { listaActividadFisicosTipoControlRO };
  //     case "Controles de personas":
  //       return { listaActividadPersonasTipoControlRO };
  //     default:
  //       return { listaActividadProcesosTipoControlRO };
  //   }
  // };

  useEffect(() => {
    setLoadingData(true);

    const getData = async (url) => {
      return await axios.get(process.env.REACT_APP_API_URL + "/" + url, {
        headers: {
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
    };
    const getProveedor = async () => {
      let listaProveedor;
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
    async function getCompania() {
      try {
        const response = await getData("maestros_ro/compania/");
        let companias = response.data.map(
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
    async function getProceso() {
      try {
        const response = await getData("ultimonivel/Proceso");
        let datos = response.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaProceso(datos);
      } catch (error) {
        console.error(error);
      }
    }
    async function getProductos() {
      try {
        const response = await getData("ultimonivel/Producto");
        let datos = response.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaProducto(datos);
      } catch (error) {
        console.error(error);
      }
    }
    async function getCanal() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Canal",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let datos = response.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaCanal(datos);
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
    const analistasRO = async () => {
      let requestUsr;
      let requestUsr2;

      async function getAristas() {
        let requestAristas = await Queries(
          null,
          "/maestros_ro/aristas/",
          "GET"
        );
        requestAristas = requestAristas.map(({ nombre }) => ({
          value: nombre,
          label: nombre,
        }));
        console.log({ requestAristas });
        setListaAristas(requestAristas);
      }
      getAristas();

      // let select1 = document.getElementById('control_RO');
      // let select2 = document.getElementById('proceso');
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
    const getAristas = async () => {
      let requestAristas = await Queries(null, "/maestros_ro/aristas/", "GET");
      requestAristas = requestAristas.map(({ nombre }) => ({
        label: nombre,
        value: nombre,
      }));
      setDataAristas(requestAristas);
    };

    if (!consultasBool) {
      getAristas();
      getProveedor();
      getCanal();
      analistasRO();
      getCompania();
      getProceso();
      getProductos();
      getCanal();
      getControles();
      getElementosListas();
      getElementosTipoControl();
      getElementos_controlEstandarizado();
      getAreas();
      setConsultasBool(true);
    }

    setLoadingData(false);

    if (paSelected) {
      let tempDataRevision = dataRevision;
      if (paSelected && paSelected[0] && !paSelected[0].idplanaccion) {
        tempDataRevision[indexPA]["id_plan_accion"] = paSelected.join(",");
      } else {
      }
      setDataRevision(tempDataRevision);
    }
  }, [listaDetalleSox, dataRevisionBool, paSelected]);

  const FiltrarAristas = (aristasSelected) => {
    if (aristasSelected.some((obj) => obj.label === "RO")) {
      setCheckedRO(true);
    } else if(aristasSelected.some((obj) => obj.label === "SOX")) {
      setCheckedSOX(true);
    }else{
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
      id: "nombre",
      numeric: true,
      disablePadding: false,
      label: "Nombre",
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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - listaGeneralControles.length)
      : 0;

  ///////// Componentes

  //* Filtra segun la compañia seleccionada  y renderiza nuevamente la lista de Componentes Ppales///////////////////

  const FiltrarMaestros = async (compania) => {
    setCompania(compania);
    if (compania !== null) {
      setCanal(null);
      setProceso(null);
      setProducto(null);

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
    }

    let temp = [];
    if (datProcComp !== null) {
      datProcComp.map((data) => {
        if (data.idcompania == compania) {
          temp.push(data);
        }
        return null;
      });
    }
  };

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
        case "Control de Proveedores":
          aux = listaTipoControl_N2.filter(
            (tipoControl_N2) =>
              tipoControl_N2.parametro === "Control_de_proveedores"
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

  const handleOnChangePosition = (position, value) => {
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

    let boolAristas = arrayAristas.some((a) => a === "Malversación");

    setRequiredAreas(boolAristas);

    if (boolAristas == true) {
      setShowAreas(true);
    }

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
  };

  const handleOnChangeDetalleSOX = (position) => {
    let tempDetalleSOX = listaDetalleSox;
    tempDetalleSOX[position].state = !listaDetalleSox[position].state;

    setListaDetalleSox(tempDetalleSOX);
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
                        //if (ruta_evidecia !== null) {
                          if (variable_mitigada !== null) {
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
    setHabilitarBoton(false);
    async function limpiar(state) {
      setTimeout(() => {
        // if (state === 2) {
        //   history.push("/EditarAreaOrganizacional");
        // }
        setHabilitarBoton(true);
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }
    //if (checkValidez() === false) {
    //  setEstadoPost(7);
    //} else if (checkValidez() === true) {
    if (true) {
      let canales = [];
      let productos = [];
      if (producto) {
        producto.map((e) => {
          productos.push(Object.values(e)[0]);
        });
      }
      if (canal) {
        canal.map((e) => {
          canales.push(Object.values(e)[0]);
        });
      }
      //--------------------------------------------------------------------------------------------> Conversión de la S.V.lugarEjecucon de Obj a str.
      if (lugarEjecucion) {
        var lugarEjecucionStringArray = lugarEjecucion.map(
          (lugar) => lugar.value
        );
        var lugarEjecucionTextConcat = lugarEjecucionStringArray.join(";");
      }

      let stringAristas = strAristas.map((obj) => obj.label).join(",");
      console.log({ stringAristas });
      //-------------------------------------------------------------------------------------------------------------------------------->
      var datosControl = {
        nombre: nombre_ctrl,
        idcompania: compania ? Object.values(compania)[0] : null,
        id_control_en_proceso: id_ctrl_proceso,
        descripcion: descripcion,
        objetivo_control: objetivo,
        poblacion: poblacion ? parseInt(poblacion) : null,
        estado: 1,
        idproceso: proceso ? Object.values(proceso)[0] : null,
        idcanal: canales,
        idproducto: productos,
        testing_auditoria: testing,
        responsable_ejecucion: responsable,
        automatizacion: automatizacion ? automatizacion.label : null,
        naturaleza: naturaleza ? naturaleza.label : null,
        muestra: muestra ? parseInt(muestra) : null,
        periodicidad: periodicidad ? periodicidad.label : null,
        evidencia: evidencia,
        ruta_de_la_evidencia: ruta_evidecia,
        control_ejecutado_en: lugarEjecucionTextConcat
          ? lugarEjecucionTextConcat
          : null,
        usuario_creador: correoAnalistaLog,
        usuario_modificador: null,
        fecha_creacion: today,
        fecha_modificacion: null,
        variable_mitigada: variable_mitigada ? variable_mitigada.label : null,
        tipo_riesgo_mitigado: strAristas ? stringAristas : null,
        control_compensatorio: 1,
        control_estandarizado: ctrlEstandarizado
          ? ctrlEstandarizado.label
          : null,
        id_ubicacion: null,
        tipo_control_ro_n1: tipoControl_N1 ? tipoControl_N1.label : null,
        tipo_control_ro_n2: actividadControl ? actividadControl.label : null,
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
      console.log("datos control", datosControl);

      axios
        .post(process.env.REACT_APP_API_URL + "/controles", datosControl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })

        .then(async function (response) {
          if (response.status >= 200 && response.status < 300) {
            var existeControl_Compensatorio = _.some(listaGeneralControles, [
              "estado_enVista",
              "Activo",
            ]);
            if (checkedSOX) {
              let data = {
                idcontrol: response.data.idcontrol,
                cuenta_contable: cuentaContable,
                tipologia_de_control: tipologia ? tipologia.value : null,
                id_euc: EUC,
                observacion: observacion,
                existencia: listaDetalleSox[0].state ? 1 : 0,
                integridad: listaDetalleSox[1].state ? 1 : 0,
                exactitud: listaDetalleSox[2].state ? 1 : 0,
                valuación: listaDetalleSox[3].state ? 1 : 0,
                derechos_y_oblig: listaDetalleSox[4].state ? 1 : 0,
                presentación_y_rev: listaDetalleSox[5].state ? 1 : 0,
              };

              let requestDetSOX = await Queries(
                data,
                "/detalle_sox_control/",
                "POST"
              );

              if (requestDetSOX.status === 201) {
                localStorage.setItem("idControl", response.data.idcontrol);
                setEstadoPost(2);
                setTimeout(() => {
                  setEstadoPost(0);
                }, 4000);
              }
            }
            if (
              checkedCtrlCompensado === true &&
              existeControl_Compensatorio === true
            ) {
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
                  .post(
                    process.env.REACT_APP_API_URL + "/controles_compensatorios/",
                    control_compensado,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + serviceAAD.getToken(),
                      },
                    }
                  )
                  .then(function (response_rx_eval) {
                    if (
                      response_rx_eval.status >= 200 &&
                      response_rx_eval.status < 300
                    ) {
                      localStorage.setItem(
                        "idControl",
                        response.data.idcontrol
                      );
                      setTimeout(() => {}, 2000);
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
                      setEstadoPost(4);
                    }
                  })
                  .catch((errors) => {
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
            setEstadoPost(4);
          }
        });
      setHabilitarBoton(true);
      setValidated(true);
    }
    limpiar();
  };

  const completarTabla = (control, estado) => {
    //* Agrega las propiedades de los controls seleccionados y actualiza su estado en vista a "Agregado"
    let nuevaLista = [];
    let controlCompleto = listaGeneralControles.filter(
      (e) => e.idcontrol === control
    )[0];

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

    let controles_filtrados = filtraControles(
      listaGeneralControles,
      nuevaLista
    );

    setListaGeneralControles(controles_filtrados);
    setModalShow(false);
  };

  // const cambiarComp = async () => {
  //   let comp = document.getElementById("Compania").value;
  //   let temp = [];
  //   let tempC = [];
  //   if (datProcComp !== null) {
  //     datProcComp.map((data) => {
  //       if (data.idcompania == comp) {
  //         temp.push(data);
  //       }
  //       return null;
  //     });
  //   }
  //   if (datAreaO) {
  //     datAreaO.map((dat) => {
  //       if (dat.idcompania == comp) {
  //         tempC.push(dat);
  //       }
  //     });
  //   }
  //   await setDatAreaOT(tempC);
  //   crearData(temp);
  // };

  function FiltrarAreas(e) {
    var lugares = [];
    e.map((a) => lugares.push(a));
    setLugarEjecucion(lugares);

    let boolLugares = e.some(
      (lugar) => lugar.value === "Sedes administrativas"
    );
    setShowAreas(boolLugares);
  }

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    try {
      var search = decisiones.filter((item) => {
        if (
          String(item.iddecision)
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.nombre_riesgo
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.nombreresponsable
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          return item;
        }
      });
      await setBuscando(e.target.value);
      await setDataBusqueda(search);
    } catch (error) {
      console.error("No se encuentra la decisión");
    }
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
        id: rowsRevisionTemp.length + 1,
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
      <ModalSelectTableCustom
        showMod={showPAs}
        setShowMod={setShowPAs}
        data={paSelected}
        setData={setPaSelected}
        dataTable={dataTablePAs}
        multi={true}
      />
      <ModalProveedor
        showModalProveedor={showModalProveedor}
        setShowModalProveedor={setShowModalProveedor}
        Proveedor={Proveedor}
        setProveedor={setProveedor}
        setShowContratos={setShowContratos}
        setListaContratos={setListaContratos}
        setNombreElementoOtros={setNombreElementoOtros}
      ></ModalProveedor>

      {loadingData ? (
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
            {/* ///////////////////////////// Acciones ////////////////////////////// */}
            <Row className="mb-3">
              <Col md={12}>
                <h1 className="titulo">Crear Control</h1>
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
              {habilitarBoton ? (
                <Col sm={3} xs={3}>
                  {props.permisos.crear ? (
                    <button
                      type="button"
                      className="btn botonPositivo"
                      id="send"
                      onClick={() => {
                        sendData();
                        /*  setTimeout(() => {
                  history.push("/editarControl");
                }, 2000); */
                      }}
                    >
                      Guardar
                    </button>
                  ) : null}
                </Col>
              ) : (
                <Col className="col-auto" sm={3} xs={3}>
                  <Loader
                    type="Oval"
                    color="#FFBF00"
                    height={30}
                    width={30}
                    style={{
                      textAlign: "center",
                      position: "static",
                    }}
                  />
                </Col>
              )}
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={0}></Col>
              <Col>
                <div className="form-text">* Campos obligatorios</div>
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
                  placeholder={"Seleccione la compañia"}
                  id="Compania"
                  required={true}
                  onChange={FiltrarMaestros}
                />
              </Col>
              <Col sm={2} xs={12} className="text-center">
                <label className="label ">Id Control</label>
              </Col>
              <Col sm={2} xs={12}>
                <input
                  type="text"
                  disabled
                  className="form-control text-center texto"
                  placeholder="ID Automático"
                  id="IDevaluacion"
                ></input>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12} className="label">
                <label className="form-label">ID Control en proceso</label>
              </Col>
              <Col sm={4} xs={12}>
                <input
                  type="text"
                  className="form-control text-left texto input"
                  placeholder="Nuevo"
                  required
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
                  placeholder="Nuevo"
                  required
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
                <label className="form-label label">Descripción*</label>
              </Col>
              <Col sm={8} xs={12}>
                <textarea
                  className="form-control text-left"
                  placeholder="Descripción del control"
                  rows="3"
                  id="Descripcion"
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                  }}
                ></textarea>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12} className="label">
                <label className="form-label">Objetivo del control*</label>
              </Col>
              <Col sm={8} xs={12}>
                <textarea
                  className="form-control text-left"
                  placeholder="Objetivo del control"
                  rows="3"
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

            {procesoObligatorio == "Control de proceso" ? (
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Proceso</label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    components={animatedComponents}
                    options={listaProceso_filtered}
                    value={proceso}
                    placeholder={"Procesos"}
                    id="proceso"
                    required
                    onChange={async (e) => {
                      if (procesoObligatorio === true) {
                      }

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
            ) : (
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Proceso</label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    components={animatedComponents}
                    options={listaProceso_filtered}
                    value={proceso}
                    placeholder={"Procesos"}
                    id="proceso"
                    onChange={async (e) => {
                      if (procesoObligatorio === true) {
                      }

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
            )}
            {/*  <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Provedores</label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              components={animatedComponents}
              options={null}
              value={null}
              placeholder={"provedores"}
              onChange={() => {
              
              }}
            />
          </Col>
        </Row> */}
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
                  options={listaProducto_filtered}
                  value={producto}
                  placeholder={"Productos"}
                  onChange={(e) => {
                    var productos = [];
                    e.map((a) => productos.push(a));
                    setProducto(productos);
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
                <label className="form-label label">Proveedor</label>
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
                    setNombreElementoOtros(null);
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
                  placeholder="Ejecutante"
                  required
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
                  required
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
                  required
                  id="NombreEval"
                  onChange={(e) => {
                    setRuta_evidencia(e.target.value);
                  }}
                ></input>
              </Col>
            </Row>
            <hr />

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
                    placeholder={"Lugar donde se ejecuta el control"}
                    onChange={(e) => setAreasOrganizacionales(e)}
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

            <hr />
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Riesgos que mitiga*</label>
              </Col>
            </Row>
            {/* /////////////////////////////////////// Checkbox list ///////////////////////////////////////// */}
            <Row className="mb-3 mt-3">
              <Col sm={4}>Aristas</Col>
              <Col sm={8}>
                <Select
                  options={listaAristas}
                  isMulti
                  name="aristas"
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
                    }else if(newArray.some((obj) => obj.label === "SOX")){
                      setCheckedSOX(true);
                    } 
                    else {
                      setCheckedRO(false);
                    }

                    // field.onChange(newArray);
                  }}
                />
              </Col>
              {/* {listaAristas.map(({ name, value }, index) => {
                return (
                  <Col sm={2}>
                    <div>
                      <input
                        type="checkbox"
                        id={`custom-checkbox-${index}`}
                        name={name}
                        value={value}
                        checked={checkedState[index]}
                        onChange={(e) => {
                          handleOnChangePosition(index, value);
                        }}
                      />
                      <label
                        className="form-label texto ml-2"
                        htmlFor={`custom-checkbox-${index}`}
                      >
                        {name}
                      </label>
                    </div>
                  </Col>
                );
              })} */}
            </Row>
            <Row className="mb-3 mt-3"></Row>

            <Row className="mb-3">
              <Col sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(event) => {
                        setCheckedCtrlCompensado(event.target.checked);
                      }}
                      name="gilad"
                    />
                  }
                  label="Controles compensatorios"
                />
              </Col>
            </Row>
          </Container>

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
                          required
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
                          required
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
                          value={variable_mitigada}
                          components={animatedComponents}
                          options={listaVariableMitigada}
                          placeholder={"Frecuencia"}
                          onChange={(e) => {
                            setVariableMitigada(e);
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
                    <Row className="mb-3">
                      <Col sm={4} xs={12}>
                        <label className="form-label label">
                          Cobertura Operativa :
                        </label>
                      </Col>
                      <Col sm={3} xs={12}>
                        <input
                          type="text"
                          className="form-control text-left texto"
                          placeholder=""
                          required
                          disabled
                          id="analista"
                        ></input>
                      </Col>

                      <Col sm={2} xs={12}>
                        <label className="form-label label">
                          Prevalorización :
                        </label>
                      </Col>
                      <Col sm={3} xs={12}>
                        <input
                          type="text"
                          className="form-control text-left texto"
                          placeholder=""
                          required
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
                          id="control_RO"
                          onChange={(e) => {
                            setProcesoObligatorio(e.target.value);
                            setTipoControlRO_N1(e);
                            setElementosTipoControl(e);
                          }}
                        />
                      </Col>
                      <Col sm={4} xs={12}>
                        <Select
                          value={actividadControl}
                          options={listaActividadControl}
                          components={animatedComponents}
                          placeholder={"Actividad"}
                          onChange={(e) => {
                            setActividadControl(e);
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={12} sm={12} md={4}>
                        <label className="form-label label">
                          Control estandarizado
                        </label>
                      </Col>
                      <Col xs={12} sm={12} md={8}>
                        <Select
                          value={ctrlEstandarizado}
                          options={listaControl_estandarizado}
                          components={animatedComponents}
                          placeholder={"Control estandarizado"}
                          onChange={(e) => {
                            setCtrlEstandarizado(e);
                          }}
                        />
                      </Col>
                    </Row>
                  </Container>
                </>
              );
            } else if (checkedRO === false) {
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
                        <label className="form-label subtitulo">
                          Detalle SOX
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={4} xs={12}>
                        <label className="form-label label">
                          Cuenta Contable
                        </label>
                      </Col>
                      <Col sm={8} xs={12}>
                        <input
                          type="text"
                          className="form-control text-left texto"
                          placeholder="Cuenta contable"
                          id="CuentaContable"
                          onChange={(e) => setCuentaContable(e.target.value)}
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
            } else if (checkedRO === false) {
              return null;
            }
          })()}

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
                          Agregar control compensado
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
                                    <TableCell align="center">
                                      {row.nombre ? row.nombre : null}
                                    </TableCell>

                                    <TableCell align="center">
                                      <input
                                        type="text"
                                        className="form-control text-left texto"
                                        id={"motivoCompensa" + row.idcontrol}
                                        disabled={
                                          row.estado_enVista === "Activo"
                                        }
                                      ></input>
                                    </TableCell>
                                    <TableCell align="center">
                                      <input
                                        type="date"
                                        id={"fechaInicio" + row.idcontrol}
                                        placeholder="dd/mm/yyyy"
                                        disabled={
                                          row.estado_enVista === "Activo"
                                        }
                                        className="form-control text-left texto"
                                      ></input>
                                    </TableCell>
                                    <TableCell align="center">
                                      <input
                                        type="date"
                                        id={"fechaFin" + row.idcontrol}
                                        className="form-control text-left texto"
                                        placeholder="dd/mm/yyyy"
                                        disabled={
                                          row.estado_enVista === "Activo"
                                        }
                                      ></input>
                                    </TableCell>
                                    <TableCell align="center"></TableCell>
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
                        count={
                          muestraControlesXTabla(
                            listaGeneralControles,
                            "Tabla_Activos"
                          ).length
                        }
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
            } else if (checkedRO === false) {
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
                onClick={(e) => {
                  let tempRev = dataRevision;
                  tempRev = tempRev.filter((obj) => obj.id !== selected[0]);
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
                    <StyledTableCell align="left">
                      Unidad de riesgo
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Usuario Creador
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Idoneitdad del ejecutante
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Idoneidad de la evidenia
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Resultado del control
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      observaciones
                    </StyledTableCell>
                    <StyledTableCell align="left">Fecha</StyledTableCell>
                    <StyledTableCell align="left">
                      Riesgos gestionados
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Id plan de acción
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Plan de acción
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataRevision
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      return (
                        <StyledTableRow
                          key={row.id}
                          hover
                          onClick={(event) => handleClick(event, row.id)}
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
                              onChange={(e) => {
                                row["fecha"] = e.target.value;
                              }}
                            ></input>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Select
                              options={dataAristas}
                              placeholder={"riesgos gestionados"}
                              onChange={(e) => {
                                let temp = e
                                  .map(({ value }) => value)
                                  .join(";");
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
      )}
    </>
  );
}
